import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.database import engine, SessionLocal, Base
import backend.app.models  # ensure models are registered
from backend.app.services.seed_data import seed_legal_knowledge
from backend.app.services.hybrid_search import hybrid_engine

from backend.app.routers import (
    auth, chat, search, laws, cases, documents, saved, audit
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nyayavanta")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed authoritative Indian legal corpus
    logger.info("Initializing Nyayavanta Database and Knowledge Corpus...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_legal_knowledge(db)
        hybrid_engine.sync_from_db(db)
        logger.info("Nyayavanta Knowledge Base and Hybrid Retriever ready.")
    finally:
        db.close()
    yield
    logger.info("Shutting down Nyayavanta API.")

app = FastAPI(
    title="Nyayavanta AI Legal Intelligence API",
    description="Evidence-backed Indian legal research and information assistant API",
    version="1.0.0",
    lifespan=lifespan
)

# Setup CORS for Vite dev server & production client
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)
app.include_router(laws.router, prefix=settings.API_V1_STR)
app.include_router(cases.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(saved.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Nyayavanta AI Legal Intelligence Platform",
        "core_principle": "Don't make AI look magical. Make its evidence visible.",
        "version": "1.0.0-v1",
        "supported_domains": ["consumer", "tenancy", "employment", "contract"]
    }
