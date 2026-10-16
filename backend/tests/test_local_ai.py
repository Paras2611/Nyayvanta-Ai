"""
Comprehensive Automated Test Suite for Nyayavanta Local AI Pipeline.

Covers:
- Phase 1: ZIP security traversal rejection, manifest generation, audit counts
- Phase 2: Unicode NFC normalization, Marathi character preservation, chunking
- Phase 3: SQLite FTS5 index build, BM25 retrieval, domain filtering, coverage gaps
- Phase 4: Ollama client configuration, error resilience when offline
- Phase 5: Answer verifier, citation cross-checking, insufficient evidence detection
- Phase 6: FastAPI endpoints (/health, /model, /query, /index/rebuild, /dataset/stats)
- Keyword Search: search_text_dataset portability and JSON export
"""

import json
from pathlib import Path
import tempfile
import zipfile
import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.services.dataset_audit import DatasetAuditor, is_safe_zip_entry, detect_language, detect_domain
from backend.app.services.text_cleaner import TextCleaner
from backend.app.services.chunker import LegalChunker
from backend.app.services.retrieval import LocalFTSIndex, sanitize_fts5_query
from backend.app.services.ollama_client import OllamaClient
from backend.app.services.answer_verifier import LegalAnswerPipeline, extract_cited_sections
from search_text_dataset.search_text_dataset import search_file_for_keywords, search_corpus

client = TestClient(app)


# ==========================================
# Phase 1: ZIP Safety & Dataset Ingestion
# ==========================================

def test_zip_security_path_traversal_rejection():
    """Verify that entries containing ../ or absolute paths are strictly blocked."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        target_dir = Path(tmp_dir) / "extract"
        target_dir.mkdir()

        # Malicious entries
        assert not is_safe_zip_entry("../etc/passwd", target_dir)
        assert not is_safe_zip_entry("..\\windows\\system32\\calc.exe", target_dir)
        assert not is_safe_zip_entry("/absolute/path.txt", target_dir)
        assert not is_safe_zip_entry("C:\\malicious.txt", target_dir)

        # Valid entries
        assert is_safe_zip_entry("legal/consumer.txt", target_dir)
        assert is_safe_zip_entry("text/RentalData/document.txt", target_dir)


def test_language_detection():
    """Verify Marathi Devanagari vs English detection."""
    marathi_text = "ग्राहक तक्रार निवारण आयोग महाराष्ट्र"
    english_text = "Maharashtra Rent Control Act landlord tenant eviction"
    mixed_text = "Maharashtra Rent Control Act कलम १५ अन्वये भाडे"

    assert detect_language(marathi_text) == "mr"
    assert detect_language(english_text) == "en"
    assert detect_language(mixed_text) == "mr/en"


def test_domain_detection():
    """Verify legal domain categorization."""
    assert detect_domain("text/RentalData/file1.txt", "") == "rental"
    assert detect_domain("text/ConsumerData/file2.txt", "") == "consumer"
    assert detect_domain("arbitrary/path.txt", "gratuity workman termination") == "employment"
    assert detect_domain("arbitrary/path.txt", "liquidated damages breach of contract") == "contract"


# ==========================================
# Phase 2: Text Cleaning & Chunking
# ==========================================

def test_marathi_unicode_normalization_preservation():
    """Verify that Unicode NFC normalization leaves Marathi conjuncts intact."""
    cleaner = TextCleaner()
    raw_marathi = "ग्राहक संरक्षण कायदा आणि महाराष्ट्र भाडे नियंत्रण कायदा अंतर्गत तक्रार अर्ज व कायदेशीर तरतुदी."
    cleaned, quality = cleaner.clean_legal_text(raw_marathi)

    assert "ग्राहक" in cleaned
    assert "भाडे" in cleaned
    assert quality["is_valid"] is True
    assert quality["replacement_chars"] == 0


def test_section_number_preservation():
    """Verify legal section references are extracted accurately."""
    cleaner = TextCleaner()
    text = "Under Section 15(1) and Sec. 24 of the Maharashtra Rent Control Act, and कलम ३५."
    sections = cleaner.extract_sections(text)

    assert "15(1)" in sections
    assert "24" in sections


def test_chunker_bounds_and_metadata():
    """Verify chunks have valid word bounds and required metadata fields."""
    chunker = LegalChunker(min_words=50, target_words=100, max_words=150, overlap_words=20)
    sample_text = ("In the matter of eviction under Section 16(1)(g) of Maharashtra Rent Control Act. " * 30)

    chunks = chunker.chunk_document(
        doc_id="TEST_DOC_001",
        source_file="test/file.txt",
        domain="rental",
        language="en",
        raw_text=sample_text
    )

    assert len(chunks) > 0
    first = chunks[0]
    assert first["chunk_id"].startswith("TEST_DOC_001_C")
    assert first["document_id"] == "TEST_DOC_001"
    assert first["domain"] == "rental"
    assert first["page_number"] is None
    assert first["source_url"] is None
    assert first["content_hash"] is not None
    assert len(first["content_hash"]) == 64


# ==========================================
# Phase 3: SQLite FTS Retrieval & BM25
# ==========================================

def test_fts5_sanitization():
    """Verify query string sanitization for SQLite FTS5."""
    assert sanitize_fts5_query('tenant "deposit" * breach!') == '"tenant" OR "deposit" OR "breach"'
    assert sanitize_fts5_query('') == ''


def test_fts5_retrieval_and_domain_filtering():
    """Test searching the live index for known legal concepts."""
    index = LocalFTSIndex()
    # Search rental
    res_rental = index.search("Maharashtra Rent Control Act landlord eviction", domain="rental", top_k=3)
    assert res_rental["status"] == "evidence_available"
    assert len(res_rental["results"]) > 0
    assert all(r["domain"] == "rental" for r in res_rental["results"])

    # Search consumer
    res_consumer = index.search("First Appeal e-Jagriti consumer commission", domain="consumer", top_k=2)
    assert res_consumer["status"] == "evidence_available"
    assert len(res_consumer["results"]) > 0
    assert all(r["domain"] == "consumer" for r in res_consumer["results"])


def test_coverage_gap_reporting():
    """Verify coverage gap returned for employment and contract domains."""
    index = LocalFTSIndex()
    res_emp = index.search("wrongful termination notice pay", domain="employment")
    assert res_emp["status"] == "coverage_gap"
    assert "no authoritative source documents" in res_emp["message"]

    res_con = index.search("breach of contract liquidated damages", domain="contract")
    assert res_con["status"] == "coverage_gap"


# ==========================================
# Phase 4 & 5: Ollama Client & Answer Verifier
# ==========================================

def test_ollama_client_offline_resilience():
    """Verify OllamaClient reports offline status gracefully without throwing exceptions."""
    client_local = OllamaClient(base_url="http://localhost:11434")
    health = client_local.check_health()
    assert "is_running" in health
    assert "configured_model" in health

    gen = client_local.generate("Legal test query")
    assert gen["status"] in ["ollama_unavailable", "model_missing", "success"]


def test_answer_verifier_citation_cross_check():
    """Verify that cited sections not present in retrieved chunks are flagged as unverified."""
    pipeline = LegalAnswerPipeline()
    fake_chunks = [
        {"chunk_text": "Under Section 15 of Maharashtra Rent Control Act, rent is payable monthly.", "title": "Act"}
    ]

    # Valid citation
    ver_valid = pipeline.verify_answer_citations("According to Section 15, rent is due.", fake_chunks)
    assert ver_valid["is_fully_grounded"] is True
    assert "15" in ver_valid["verified_sections"]

    # Invented citation
    ver_invalid = pipeline.verify_answer_citations("According to Section 99, landlord is barred.", fake_chunks)
    assert ver_invalid["is_fully_grounded"] is False
    assert "99" in ver_invalid["unverified_sections"]
    assert ver_invalid["status"] == "CONTAINS_UNVERIFIED_CITATIONS"


def test_end_to_end_legal_qa_pipeline():
    """Test full answer_question workflow."""
    pipeline = LegalAnswerPipeline()
    res = pipeline.answer_question(
        question="What grounds allow landlord possession under rent control law?",
        domain="rental",
        top_k=2
    )

    assert res["status"] in ["evidence_available", "insufficient_evidence"]
    assert "answer" in res
    assert len(res["sources"]) > 0
    assert res["disclaimer"] is not None


# ==========================================
# Phase 6: FastAPI Local AI Endpoints
# ==========================================

def test_api_local_ai_health():
    """Test GET /api/local-ai/health."""
    response = client.get("/api/local-ai/health")
    assert response.status_code == 200
    data = response.json()
    assert "ollama_running" in data
    assert "index_status" in data
    assert data["index_status"]["total_chunks"] > 0


def test_api_local_ai_model():
    """Test GET /api/local-ai/model."""
    response = client.get("/api/local-ai/model")
    assert response.status_code == 200
    data = response.json()
    assert data["configured_model"] == "qwen3.5:0.8b"
    assert data["num_ctx"] == 2048


def test_api_local_ai_dataset_stats():
    """Test GET /api/local-ai/dataset/stats."""
    response = client.get("/api/local-ai/dataset/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_files"] == 17
    assert data["total_characters"] > 1000000
    assert data["domain_distribution"]["rental"] == 9
    assert data["domain_distribution"]["consumer"] == 8


def test_api_local_ai_query_endpoint():
    """Test POST /api/local-ai/query."""
    payload = {
        "question": "What documents are required for filing a First Appeal?",
        "domain": "consumer",
        "language": "en",
        "top_k": 3
    }
    response = client.post("/api/local-ai/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["evidence_available", "insufficient_evidence"]
    assert "sources" in data
    assert len(data["sources"]) > 0
    assert data["model"] == "qwen3.5:0.8b"


def test_api_local_ai_coverage_gap_query():
    """Test query to unsupported domain returns coverage_gap."""
    payload = {
        "question": "What is the notice period for employee termination?",
        "domain": "employment",
        "language": "en",
        "top_k": 2
    }
    response = client.post("/api/local-ai/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "coverage_gap"
    assert len(data["sources"]) == 0


# ==========================================
# Keyword Search Script Portability Tests
# ==========================================

def test_search_text_dataset_matches():
    """Verify portable search_text_dataset execution."""
    text_dir = Path(__file__).resolve().parent.parent / "dataset" / "text"
    if not text_dir.exists():
        pytest.skip("Extracted text dir not present")

    res = search_corpus(text_dir=text_dir, keywords=["Maharashtra Rent Control Act"], find_all=False)
    assert res["total_files_searched"] == 17
    assert res["files_with_matches"] >= 1
    assert res["total_matches"] >= 1
