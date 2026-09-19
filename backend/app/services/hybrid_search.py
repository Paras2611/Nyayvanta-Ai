import re
import math
from typing import List, Dict, Any, Tuple
from collections import Counter
from sqlalchemy.orm import Session
from backend.app.models.legal_data import LegalChunk, LegalSection, LegalDocument, Judgment

class BM25Retriever:
    """In-memory BM25 implementation for exact statutory legal retrieval."""
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.doc_lengths: Dict[str, int] = {}
        self.avg_doc_len: float = 0.0
        self.doc_freqs: Dict[str, int] = {}
        self.total_docs: int = 0
        self.docs: Dict[str, Dict[str, Any]] = {}

    def _tokenize(self, text: str) -> List[str]:
        # Preserve section patterns like 2(7), 108(B)(q), 73, 74
        clean = re.sub(r"[^\w\s\(\)]", " ", text.lower())
        tokens = [t.strip() for t in clean.split() if len(t.strip()) > 1]
        return tokens

    def index_documents(self, documents: List[Dict[str, Any]]):
        self.docs = {d["id"]: d for d in documents}
        self.total_docs = len(documents)
        total_len = 0
        self.doc_freqs.clear()

        for d in documents:
            tokens = self._tokenize(d["content"])
            d_len = len(tokens)
            self.doc_lengths[d["id"]] = d_len
            total_len += d_len

            unique_tokens = set(tokens)
            for token in unique_tokens:
                self.doc_freqs[token] = self.doc_freqs.get(token, 0) + 1

        self.avg_doc_len = total_len / max(self.total_docs, 1)

    def search(self, query: str, top_k: int = 10) -> List[Tuple[str, float]]:
        query_tokens = self._tokenize(query)
        scores: Dict[str, float] = {}

        for doc_id, doc in self.docs.items():
            doc_tokens = self._tokenize(doc["content"])
            doc_len = self.doc_lengths.get(doc_id, 1)
            token_counts = Counter(doc_tokens)
            score = 0.0

            for q_token in query_tokens:
                if q_token in token_counts:
                    tf = token_counts[q_token]
                    df = self.doc_freqs.get(q_token, 0)
                    idf = math.log(1 + (self.total_docs - df + 0.5) / (df + 0.5))
                    
                    # Exact section boost
                    boost = 2.5 if q_token.startswith("sec") or "(" in q_token else 1.0

                    numerator = tf * (self.k1 + 1)
                    denominator = tf + self.k1 * (1 - self.b + self.b * (doc_len / max(self.avg_doc_len, 1)))
                    score += boost * (idf * (numerator / denominator))

            if score > 0:
                scores[doc_id] = score

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return ranked[:top_k]

class DenseSemanticRetriever:
    """Semantic vector / cosine similarity matcher for Indian legal concepts."""
    def __init__(self):
        self.docs: Dict[str, Dict[str, Any]] = {}

    def _get_embedding(self, text: str) -> Counter:
        # Bag-of-words sub-word vector representation
        words = re.findall(r"\w+", text.lower())
        return Counter(words)

    def _cosine_similarity(self, vec1: Counter, vec2: Counter) -> float:
        intersection = set(vec1.keys()) & set(vec2.keys())
        numerator = sum(vec1[x] * vec2[x] for x in intersection)
        sum1 = sum(val**2 for val in vec1.values())
        sum2 = sum(val**2 for val in vec2.values())
        denominator = math.sqrt(sum1) * math.sqrt(sum2)
        if not denominator:
            return 0.0
        return float(numerator) / denominator

    def index_documents(self, documents: List[Dict[str, Any]]):
        self.docs = {d["id"]: d for d in documents}

    def search(self, query: str, top_k: int = 10) -> List[Tuple[str, float]]:
        q_vec = self._get_embedding(query)
        scores: Dict[str, float] = {}

        for doc_id, doc in self.docs.items():
            d_vec = self._get_embedding(doc["content"])
            sim = self._cosine_similarity(q_vec, d_vec)
            if sim > 0:
                scores[doc_id] = sim

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return ranked[:top_k]

class HybridLegalSearchEngine:
    """Combines BM25 lexical retriever with dense semantic search and Reciprocal Rank Fusion."""
    def __init__(self):
        self.bm25 = BM25Retriever()
        self.dense = DenseSemanticRetriever()
        self._is_indexed = False

    def sync_from_db(self, db: Session):
        chunks = db.query(LegalChunk).all()
        doc_list = []
        for c in chunks:
            doc_list.append({
                "id": c.id,
                "content": c.content,
                "metadata": c.metadata_json or {},
                "section_id": c.section_id,
                "judgment_id": c.judgment_id,
                "document_id": c.document_id
            })

        self.bm25.index_documents(doc_list)
        self.dense.index_documents(doc_list)
        self._is_indexed = True

    def search(self, db: Session, query: str, domain_id: str = None, top_k: int = 6) -> List[Dict[str, Any]]:
        if not self._is_indexed:
            self.sync_from_db(db)

        bm25_results = self.bm25.search(query, top_k=top_k * 2)
        dense_results = self.dense.search(query, top_k=top_k * 2)

        # Reciprocal Rank Fusion (RRF) with k=60
        rrf_scores: Dict[str, float] = {}
        for rank, (doc_id, _) in enumerate(bm25_results):
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (60.0 + rank + 1))

        for rank, (doc_id, _) in enumerate(dense_results):
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (60.0 + rank + 1))

        ranked_ids = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)

        final_results = []
        for doc_id, score in ranked_ids:
            chunk = db.query(LegalChunk).filter(LegalChunk.id == doc_id).first()
            if not chunk:
                continue

            # Optional domain filtering if specified
            if domain_id and chunk.metadata_json:
                chunk_domain = chunk.metadata_json.get("domain_id")
                if chunk_domain and chunk_domain != domain_id:
                    continue

            section = db.query(LegalSection).filter(LegalSection.id == chunk.section_id).first() if chunk.section_id else None
            doc = db.query(LegalDocument).filter(LegalDocument.id == chunk.document_id).first() if chunk.document_id else None
            judgment = db.query(Judgment).filter(Judgment.id == chunk.judgment_id).first() if chunk.judgment_id else None

            final_results.append({
                "chunk_id": chunk.id,
                "score": round(score * 100, 2),
                "content": chunk.content,
                "metadata": chunk.metadata_json,
                "section": section,
                "document": doc,
                "judgment": judgment
            })

            if len(final_results) >= top_k:
                break

        return final_results

hybrid_engine = HybridLegalSearchEngine()
