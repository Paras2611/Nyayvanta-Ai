"""
FastAPI Router for Nyayavanta Local AI Pipeline.

Endpoints:
- GET /api/local-ai/health
- GET /api/local-ai/model
- POST /api/local-ai/query
- POST /api/local-ai/index/rebuild
- GET /api/local-ai/dataset/stats
"""

import json
import logging
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, Query, status

from backend.app.core.config import settings
from backend.app.schemas.legal_ai import (
    LocalAIHealthResponse,
    LocalAIModelResponse,
    LocalAIQueryRequest,
    LocalAIQueryResponse,
    RebuildIndexResponse,
    DatasetStatsResponse
)
from backend.app.services.ollama_client import ollama_service
from backend.app.services.retrieval import retrieval_engine
from backend.app.services.answer_verifier import legal_qa_pipeline
from backend.app.services.dataset_audit import DatasetAuditor
from backend.app.services.chunker import LegalChunker

logger = logging.getLogger("nyayavanta.routes.local_ai")
router = APIRouter(prefix="/local-ai", tags=["Local Legal AI Pipeline"])


@router.get("/health", response_model=LocalAIHealthResponse)
def get_local_ai_health():
    """Diagnostic health check for Ollama and SQLite FTS retrieval index."""
    ollama_health = ollama_service.check_health()
    index_stats = retrieval_engine.get_index_stats()

    is_healthy = index_stats["total_chunks"] > 0
    return {
        "status": "operational" if is_healthy else "degraded",
        "service": "Nyayavanta Local AI Engine",
        "ollama_running": ollama_health["is_running"],
        "configured_model": ollama_health["configured_model"],
        "is_model_installed": ollama_health["is_model_installed"],
        "available_models": ollama_health["available_models"],
        "index_status": index_stats,
        "message": ollama_health["message"]
    }


@router.get("/model", response_model=LocalAIModelResponse)
def get_model_configuration():
    """Inspect current model configuration and resource bounds."""
    health = ollama_service.check_health()
    return {
        "configured_model": settings.OLLAMA_MODEL,
        "base_url": settings.OLLAMA_BASE_URL,
        "num_ctx": settings.OLLAMA_NUM_CTX,
        "num_predict": settings.OLLAMA_NUM_PREDICT,
        "temperature": settings.OLLAMA_TEMPERATURE,
        "keep_alive": settings.OLLAMA_KEEP_ALIVE,
        "is_installed": health.get("is_model_installed", False),
        "available_models": health.get("available_models", [])
    }


@router.post("/query", response_model=LocalAIQueryResponse)
def query_local_ai(req: LocalAIQueryRequest):
    """
    Evidence-grounded legal query answering.
    Retrieves local authoritative passages and synthesizes an answer with citation verification.
    """
    try:
        res = legal_qa_pipeline.answer_question(
            question=req.question,
            domain=req.domain,
            language=req.language or "en",
            top_k=req.top_k or 4
        )
        return {
            "answer": res["answer"],
            "status": res["status"],
            "domain": res["domain"],
            "sources": res["sources"],
            "model": res.get("inference_meta", {}).get("model", res.get("model", settings.OLLAMA_MODEL)),
            "verification": res.get("verification"),
            "disclaimer": res.get("disclaimer")
        }
    except Exception as ex:
        logger.error(f"Local AI query execution error: {ex}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Local AI pipeline error: {str(ex)}"
        )


@router.post("/index/rebuild", response_model=RebuildIndexResponse)
def rebuild_retrieval_index():
    """Rebuild SQLite FTS5 index from the processed chunks file."""
    try:
        count = retrieval_engine.build_index(force_rebuild=True)
        stats = retrieval_engine.get_index_stats()
        return {
            "status": "success",
            "indexed_chunks": count,
            "db_size_mb": stats["db_size_mb"],
            "message": f"Successfully re-indexed {count} legal chunks into SQLite FTS5."
        }
    except Exception as ex:
        logger.error(f"Error rebuilding index: {ex}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Index rebuild failed: {str(ex)}"
        )


@router.get("/dataset/stats", response_model=DatasetStatsResponse)
def get_dataset_statistics():
    """Return verified metrics on ingested legal corpus and domain coverage."""
    base_dir = Path(__file__).resolve().parent.parent.parent
    manifest_file = base_dir / "dataset" / "processed" / "dataset_manifest.json"

    if not manifest_file.exists():
        # Run audit on-the-fly if manifest does not exist
        auditor = DatasetAuditor()
        auditor.safe_extract_zip()
        audit_res = auditor.audit_corpus()
        summary = audit_res["summary"]
    else:
        manifest_data = json.loads(manifest_file.read_text(encoding="utf-8"))
        summary = manifest_data.get("summary", {})

    index_stats = retrieval_engine.get_index_stats()

    return {
        "total_files": summary.get("total_files", 0),
        "total_size_bytes": summary.get("total_size_bytes", 0),
        "total_characters": summary.get("total_characters", 0),
        "total_words": summary.get("total_words", 0),
        "domain_distribution": summary.get("domain_distribution", {}),
        "language_distribution": summary.get("language_distribution", {}),
        "warnings": summary.get("warnings", []),
        "indexed_chunks": index_stats.get("total_chunks", 0)
    }
