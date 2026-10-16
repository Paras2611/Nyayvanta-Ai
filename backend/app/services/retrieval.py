"""
Lightweight SQLite FTS5 / BM25 Legal Retrieval Engine for Nyayavanta AI.

Provides fast, zero-RAM, zero-dependency full-text search with native BM25 ranking,
Unicode61 tokenizer supporting English and Marathi Devanagari, domain filtering,
and coverage-gap detection.
"""

import json
import logging
from pathlib import Path
import re
import sqlite3
import sys
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger("nyayavanta.retrieval")

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent.parent / "dataset" / "processed" / "nyayavanta_fts.db"
DEFAULT_CHUNKS_PATH = Path(__file__).resolve().parent.parent.parent / "dataset" / "chunks" / "legal_chunks.jsonl"


def sanitize_fts5_query(query: str) -> str:
    """
    Sanitize raw search query for SQLite FTS5 syntax.
    Removes special characters that break FTS5 parser while preserving
    valid alphanumeric and Devanagari characters.
    """
    # Remove chars with special syntax in FTS5: " * : ^ { } ( ) [ ] ! ? , ~
    cleaned = re.sub(r'["\*\:\^\{\}\(\)\[\]\!\?\,\~]', " ", query)
    tokens = [t.strip() for t in cleaned.split() if len(t.strip()) > 1]
    
    if not tokens:
        return ""

    # Join tokens with OR or NEAR for flexible recall
    escaped_tokens = []
    for t in tokens:
        # Quote individual tokens to handle hyphens or numbers safely
        escaped_tokens.append(f'"{t}"')
    
    # Use OR to maximize recall, BM25 handles ranking
    return " OR ".join(escaped_tokens)


class LocalFTSIndex:
    """SQLite FTS5 Inverted Index with BM25 Scoring."""

    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = db_path or DEFAULT_DB_PATH
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        """Create tables if they do not exist."""
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS chunk_metadata (
                    chunk_id TEXT PRIMARY KEY,
                    document_id TEXT NOT NULL,
                    source_file TEXT NOT NULL,
                    domain TEXT NOT NULL,
                    language TEXT NOT NULL,
                    section_number TEXT,
                    jurisdiction TEXT,
                    word_count INTEGER,
                    character_count INTEGER,
                    content_hash TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # SQLite FTS5 Virtual Table using unicode61 tokenizer (supports Devanagari)
            conn.execute("""
                CREATE VIRTUAL TABLE IF NOT EXISTS fts_legal_chunks USING fts5(
                    chunk_id UNINDEXED,
                    domain UNINDEXED,
                    language UNINDEXED,
                    section_number,
                    source_file,
                    chunk_text,
                    tokenize = 'unicode61 remove_diacritics 2'
                );
            """)
            conn.commit()

    def build_index(self, chunks_file: Optional[Path] = None, force_rebuild: bool = False) -> int:
        """
        Populate FTS5 index and metadata table from chunks JSONL.
        Streaming read to ensure minimal RAM usage.
        """
        source_chunks = chunks_file or DEFAULT_CHUNKS_PATH
        if not source_chunks.exists():
            raise FileNotFoundError(f"Chunks file does not exist: {source_chunks}")

        with self._get_connection() as conn:
            # Check existing count
            cur = conn.cursor()
            cur.execute("SELECT count(*) FROM chunk_metadata")
            existing_count = cur.fetchone()[0]

            if existing_count > 0 and not force_rebuild:
                logger.info(f"FTS Index already contains {existing_count} chunks. Skipping rebuild.")
                return existing_count

            logger.info(f"Building FTS5 index from {source_chunks}...")
            conn.execute("DELETE FROM fts_legal_chunks")
            conn.execute("DELETE FROM chunk_metadata")

            meta_batch = []
            fts_batch = []
            batch_size = 100
            total_indexed = 0

            with source_chunks.open("r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    c = json.loads(line)

                    meta_batch.append((
                        c["chunk_id"],
                        c["document_id"],
                        c["source_file"],
                        c["domain"],
                        c["language"],
                        c.get("section_number"),
                        c.get("jurisdiction"),
                        c.get("word_count", 0),
                        c.get("character_count", 0),
                        c["content_hash"]
                    ))

                    fts_batch.append((
                        c["chunk_id"],
                        c["domain"],
                        c["language"],
                        c.get("section_number") or "",
                        c["source_file"],
                        c["chunk_text"]
                    ))

                    if len(meta_batch) >= batch_size:
                        conn.executemany("""
                            INSERT INTO chunk_metadata (
                                chunk_id, document_id, source_file, domain, language,
                                section_number, jurisdiction, word_count, character_count, content_hash
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, meta_batch)

                        conn.executemany("""
                            INSERT INTO fts_legal_chunks (
                                chunk_id, domain, language, section_number, source_file, chunk_text
                            ) VALUES (?, ?, ?, ?, ?, ?)
                        """, fts_batch)

                        total_indexed += len(meta_batch)
                        meta_batch.clear()
                        fts_batch.clear()

            # Flush remaining
            if meta_batch:
                conn.executemany("""
                    INSERT INTO chunk_metadata (
                        chunk_id, document_id, source_file, domain, language,
                        section_number, jurisdiction, word_count, character_count, content_hash
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, meta_batch)

                conn.executemany("""
                    INSERT INTO fts_legal_chunks (
                        chunk_id, domain, language, section_number, source_file, chunk_text
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """, fts_batch)
                total_indexed += len(meta_batch)

            conn.commit()
            logger.info(f"FTS5 Index built successfully. Total indexed chunks: {total_indexed}")
            return total_indexed

    def search(
        self,
        query: str,
        domain: Optional[str] = None,
        language: Optional[str] = None,
        top_k: int = 4,
        max_per_document: int = 2
    ) -> Dict[str, Any]:
        """
        Search legal chunks using BM25 ranking.
        Enforces domain filtering and coverage gap reporting.
        """
        clean_query = query.strip()
        if not clean_query:
            return {
                "status": "no_evidence",
                "message": "Empty query provided",
                "results": [],
                "domain": domain
            }

        # Check coverage gap for requested domain
        if domain in ["employment", "contract"]:
            return {
                "status": "coverage_gap",
                "message": (
                    f"Domain '{domain}' currently has no authoritative source documents in the local dataset. "
                    "Nyayavanta avoids generating synthetic or ungrounded legal information."
                ),
                "domain": domain,
                "results": []
            }

        fts_query = sanitize_fts5_query(clean_query)
        if not fts_query:
            return {
                "status": "no_evidence",
                "message": "Query contains no searchable terms",
                "results": [],
                "domain": domain
            }

        with self._get_connection() as conn:
            # Query with BM25 ranking (lower score = more relevant in SQLite BM25)
            # We negate bm25() to get positive scores for consistency
            sql = """
                SELECT 
                    f.chunk_id,
                    f.domain,
                    f.language,
                    f.section_number,
                    f.source_file,
                    f.chunk_text,
                    m.document_id,
                    m.jurisdiction,
                    m.word_count,
                    bm25(fts_legal_chunks) as raw_score
                FROM fts_legal_chunks f
                JOIN chunk_metadata m ON f.chunk_id = m.chunk_id
                WHERE fts_legal_chunks MATCH ?
            """
            params: List[Any] = [fts_query]

            if domain:
                sql += " AND f.domain = ?"
                params.append(domain)
            if language:
                sql += " AND f.language LIKE ?"
                params.append(f"%{language}%")

            sql += " ORDER BY raw_score ASC LIMIT ?"
            params.append(top_k * 3)  # Fetch extra to deduplicate per document

            cursor = conn.cursor()
            cursor.execute(sql, params)
            rows = cursor.fetchall()

            if not rows:
                return {
                    "status": "no_evidence",
                    "message": "No matching legal evidence found in local corpus for query.",
                    "results": [],
                    "query": query,
                    "domain": domain
                }

            # Filter and deduplicate per document
            doc_counts: Dict[str, int] = {}
            final_results: List[Dict[str, Any]] = []

            for row in rows:
                doc_id = row["document_id"]
                if doc_counts.get(doc_id, 0) >= max_per_document:
                    continue

                doc_counts[doc_id] = doc_counts.get(doc_id, 0) + 1
                
                # Convert SQLite BM25 score (negative is better in FTS5) to human positive relevance
                score = round(abs(float(row["raw_score"])), 3)

                final_results.append({
                    "chunk_id": row["chunk_id"],
                    "document_id": row["document_id"],
                    "source_file": row["source_file"],
                    "title": Path(row["source_file"]).name,
                    "domain": row["domain"],
                    "language": row["language"],
                    "section_number": row["section_number"] if row["section_number"] else None,
                    "page_number": None,
                    "source_url": None,
                    "jurisdiction": row["jurisdiction"],
                    "relevance_score": score,
                    "chunk_text": row["chunk_text"]
                })

                if len(final_results) >= top_k:
                    break

            return {
                "status": "evidence_available",
                "query": query,
                "domain": domain,
                "total_matched": len(final_results),
                "results": final_results
            }

    def get_index_stats(self) -> Dict[str, Any]:
        """Return diagnostic metrics of indexed documents and domains."""
        with self._get_connection() as conn:
            cur = conn.cursor()
            cur.execute("SELECT count(*) FROM chunk_metadata")
            total_chunks = cur.fetchone()[0]

            cur.execute("SELECT count(DISTINCT document_id) FROM chunk_metadata")
            total_docs = cur.fetchone()[0]

            cur.execute("SELECT domain, count(*) FROM chunk_metadata GROUP BY domain")
            domain_stats = dict(cur.fetchall())

            cur.execute("SELECT language, count(*) FROM chunk_metadata GROUP BY language")
            lang_stats = dict(cur.fetchall())

            db_size_bytes = self.db_path.stat().st_size if self.db_path.exists() else 0

            return {
                "total_chunks": total_chunks,
                "total_documents": total_docs,
                "domain_chunks": domain_stats,
                "language_chunks": lang_stats,
                "db_size_bytes": db_size_bytes,
                "db_size_mb": round(db_size_bytes / (1024 * 1024), 2)
            }


# Singleton instance
retrieval_engine = LocalFTSIndex()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    engine = LocalFTSIndex()
    count = engine.build_index(force_rebuild=True)
    print(f"Index built: {count} chunks.")
    stats = engine.get_index_stats()
    print("Index stats:", json.dumps(stats, indent=2))

    # Test search
    test_q = "Maharashtra Rent Control Act landlord eviction deposit"
    res = engine.search(test_q, domain="rental", top_k=3)
    print(f"\nSearch test: '{test_q}' -> {res['status']} ({len(res['results'])} chunks)")
    for r in res["results"]:
        print(f" - {r['chunk_id']} (score: {r['relevance_score']}): {r['title']} [Sec: {r['section_number']}]")
