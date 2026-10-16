"""
Semantic-Aware Legal Text Chunker for Nyayavanta AI.

Divides legal documents into 400-600 token chunks with 50-80 token overlap,
honoring natural boundaries (sections, clauses, paragraphs) and generating
immutable provenance metadata and content hashes.
"""

import hashlib
import json
import logging
from pathlib import Path
import re
import sys
from typing import Any, Dict, Generator, List, Optional

# Allow running directly as script or via package
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))
try:
    from backend.app.services.text_cleaner import TextCleaner
except ImportError:
    from app.services.text_cleaner import TextCleaner

logger = logging.getLogger("nyayavanta.chunker")

# Approximate word/token bounds (1 token ~= 0.75 words, so 450 tokens ~= 340 words)
MIN_CHUNK_WORDS = 250
TARGET_CHUNK_WORDS = 400
MAX_CHUNK_WORDS = 550
OVERLAP_WORDS = 60


def compute_content_hash(text: str) -> str:
    """Deterministic sha256 hash of normalized chunk text."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


class LegalChunker:
    """Splits legal text documents into semantically coherent, bounded chunks."""

    def __init__(
        self,
        min_words: int = MIN_CHUNK_WORDS,
        target_words: int = TARGET_CHUNK_WORDS,
        max_words: int = MAX_CHUNK_WORDS,
        overlap_words: int = OVERLAP_WORDS
    ):
        self.min_words = min_words
        self.target_words = target_words
        self.max_words = max_words
        self.overlap_words = overlap_words
        self.cleaner = TextCleaner()

    def split_paragraphs(self, text: str) -> List[str]:
        """Split text into natural paragraph units."""
        # Double newlines or major section headers
        raw_paras = re.split(r"\n\s*\n+", text)
        paras = []
        for p in raw_paras:
            clean_p = p.strip()
            if clean_p:
                paras.append(clean_p)
        return paras

    def chunk_document(
        self,
        doc_id: str,
        source_file: str,
        domain: str,
        language: str,
        raw_text: str,
        jurisdiction: Optional[str] = "Maharashtra / India"
    ) -> List[Dict[str, Any]]:
        """
        Produce structured chunks from a single document.
        Does not invent missing page numbers or URLs.
        """
        cleaned_text, quality = self.cleaner.clean_legal_text(raw_text)
        if not cleaned_text or not quality["is_valid"]:
            return []

        paragraphs = self.split_paragraphs(cleaned_text)
        chunks: List[Dict[str, Any]] = []

        current_para_acc: List[str] = []
        current_word_count = 0
        chunk_idx = 1

        for para in paragraphs:
            para_words = len(para.split())

            # If a single paragraph is enormous, subdivide it by sentences
            if para_words > self.max_words:
                sentences = re.split(r"(?<=[.!?\u0964])\s+", para)  # \u0964 is Devanagari Danda (।)
                for sent in sentences:
                    sent_words = len(sent.split())
                    if current_word_count + sent_words > self.target_words and current_word_count >= self.min_words:
                        chunk_text = " ".join(current_para_acc)
                        chunks.append(self._build_chunk(
                            doc_id, chunk_idx, source_file, domain, language, chunk_text, jurisdiction
                        ))
                        chunk_idx += 1
                        # Retain overlap words
                        overlap = " ".join(current_para_acc).split()[-self.overlap_words:]
                        current_para_acc = [" ".join(overlap)] if overlap else []
                        current_word_count = len(overlap)

                    current_para_acc.append(sent)
                    current_word_count += sent_words
                continue

            # Standard paragraph accumulation
            if current_word_count + para_words > self.target_words and current_word_count >= self.min_words:
                chunk_text = "\n\n".join(current_para_acc)
                chunks.append(self._build_chunk(
                    doc_id, chunk_idx, source_file, domain, language, chunk_text, jurisdiction
                ))
                chunk_idx += 1
                # Overlap: keep last paragraph or slice words
                last_block = current_para_acc[-1] if current_para_acc else ""
                last_words = last_block.split()
                overlap_text = " ".join(last_words[-self.overlap_words:]) if len(last_words) > self.overlap_words else last_block
                current_para_acc = [overlap_text] if overlap_text else []
                current_word_count = len(overlap_text.split())

            current_para_acc.append(para)
            current_word_count += para_words

        # Final residual chunk
        if current_para_acc:
            chunk_text = "\n\n".join(current_para_acc).strip()
            if len(chunk_text.split()) >= 30:  # avoid trivial trailing snippets
                chunks.append(self._build_chunk(
                    doc_id, chunk_idx, source_file, domain, language, chunk_text, jurisdiction
                ))

        return chunks

    def _build_chunk(
        self,
        doc_id: str,
        chunk_idx: int,
        source_file: str,
        domain: str,
        language: str,
        chunk_text: str,
        jurisdiction: Optional[str]
    ) -> Dict[str, Any]:
        """Construct a verified chunk object with metadata."""
        content_hash = compute_content_hash(chunk_text)
        sections = self.cleaner.extract_sections(chunk_text)
        primary_section = sections[0] if sections else None

        return {
            "chunk_id": f"{doc_id}_C{chunk_idx:03d}",
            "document_id": doc_id,
            "source_file": source_file,
            "domain": domain,
            "language": language,
            "page_number": None,  # Explicitly None when mapping from PDF is unavailable
            "section_number": primary_section,
            "all_sections_mentioned": sections,
            "source_url": None,   # Explicitly None
            "jurisdiction": jurisdiction,
            "word_count": len(chunk_text.split()),
            "character_count": len(chunk_text),
            "chunk_text": chunk_text,
            "content_hash": content_hash
        }

    def process_corpus_incrementally(
        self,
        manifest_path: Path,
        text_dir: Path,
        output_chunks_path: Path
    ) -> int:
        """
        Reads manifest, chunks files one by one to avoid high memory usage,
        and streams output to a JSONL file.
        """
        if not manifest_path.exists():
            raise FileNotFoundError(f"Manifest not found: {manifest_path}")

        output_chunks_path.parent.mkdir(parents=True, exist_ok=True)
        manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
        documents = manifest_data.get("documents", [])

        total_chunks = 0
        seen_chunk_hashes = set()

        with output_chunks_path.open("w", encoding="utf-8") as out_f:
            for doc in documents:
                rel_path = doc["relative_path"]
                doc_path = text_dir / rel_path
                if not doc_path.exists():
                    logger.warning(f"File not found on disk: {doc_path}")
                    continue

                raw_text = doc_path.read_text(encoding="utf-8", errors="replace")
                chunks = self.chunk_document(
                    doc_id=doc["file_id"],
                    source_file=rel_path,
                    domain=doc["domain"],
                    language=doc["language"],
                    raw_text=raw_text,
                    jurisdiction=doc.get("jurisdiction")
                )

                for chunk in chunks:
                    # Duplicate chunk suppression
                    if chunk["content_hash"] in seen_chunk_hashes:
                        continue
                    seen_chunk_hashes.add(chunk["content_hash"])
                    out_f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
                    total_chunks += 1

        logger.info(f"Chunking complete. Created {total_chunks} deduplicated chunks at {output_chunks_path}")
        return total_chunks


def run_chunker_pipeline() -> int:
    """Helper entry point for CLI or automated build."""
    base_dir = Path(__file__).resolve().parent.parent.parent
    manifest_path = base_dir / "dataset" / "processed" / "dataset_manifest.json"
    text_dir = base_dir / "dataset" / "text"
    output_chunks = base_dir / "dataset" / "chunks" / "legal_chunks.jsonl"

    chunker = LegalChunker()
    return chunker.process_corpus_incrementally(manifest_path, text_dir, output_chunks)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    count = run_chunker_pipeline()
    print(f"Total chunks generated: {count}")
