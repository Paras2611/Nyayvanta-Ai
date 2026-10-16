"""
Pydantic Schemas for Nyayavanta Local AI Pipeline.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class LocalAIQueryRequest(BaseModel):
    question: str = Field(..., description="Legal question or dispute description")
    domain: Optional[str] = Field("rental", description="Legal domain: rental, consumer, employment, contract")
    language: Optional[str] = Field("en", description="Query language: en, mr")
    top_k: Optional[int] = Field(4, ge=1, le=10, description="Number of evidence chunks to retrieve")


class SourceReference(BaseModel):
    document_id: str
    chunk_id: str
    title: str
    source_file: Optional[str] = None
    domain: Optional[str] = None
    section_number: Optional[str] = None
    page_number: Optional[int] = None
    source_url: Optional[str] = None
    relevance_score: Optional[float] = None


class VerificationDetails(BaseModel):
    status: str
    is_fully_grounded: Optional[bool] = None
    cited_sections: Optional[List[str]] = None
    verified_sections: Optional[List[str]] = None
    unverified_sections: Optional[List[str]] = None
    has_insufficient_evidence_flag: Optional[bool] = None
    note: Optional[str] = None


class DocumentItemSchema(BaseModel):
    name: str
    category: str
    is_mandatory: bool
    purpose: str
    legal_risk_if_missing: str
    dataset_citation: str
    verified_source_url: Optional[str] = None
    verified_authority_name: Optional[str] = None
    web_corroboration_score: Optional[float] = None
    verification_badge: Optional[str] = None
    scraped_timestamp: Optional[str] = None
    scraped_snippet: Optional[str] = None


class SuggestDocumentsRequest(BaseModel):
    domain: Optional[str] = Field("consumer", description="Legal domain: consumer, rental, employment, contract")
    proceeding_type: Optional[str] = Field(None, description="Optional proceeding type")
    case_facts: Optional[str] = Field(None, description="Dispute context or query facts")
    enable_web_rerank: Optional[bool] = Field(True, description="Scrape web and rerank with official sources")


class SuggestDocumentsResponse(BaseModel):
    status: str
    proceeding_type: str
    proceeding_title: str
    governing_law: str
    dataset_source: str
    verified_primary_url: Optional[str] = None
    official_authority: Optional[str] = None
    web_corroboration_rate: Optional[str] = None
    total_documents: int
    mandatory_count: int
    supporting_count: int
    documents: List[DocumentItemSchema]
    mandatory_documents: List[DocumentItemSchema]
    supporting_documents: List[DocumentItemSchema]
    corroborating_chunks: Optional[List[Dict[str, Any]]] = None
    disclaimer: str


class LocalAIQueryResponse(BaseModel):
    answer: str
    status: str
    domain: Optional[str] = None
    sources: List[SourceReference]
    model: str
    verification: Optional[VerificationDetails] = None
    suggested_documents: Optional[List[DocumentItemSchema]] = None
    proceeding_checklist_title: Optional[str] = None
    disclaimer: Optional[str] = None


class LocalAIHealthResponse(BaseModel):
    status: str
    service: str
    ollama_running: bool
    configured_model: str
    is_model_installed: bool
    available_models: List[str]
    index_status: Dict[str, Any]
    message: str


class LocalAIModelResponse(BaseModel):
    configured_model: str
    base_url: str
    num_ctx: int
    num_predict: int
    temperature: float
    keep_alive: str
    is_installed: bool
    available_models: List[str]


class RebuildIndexResponse(BaseModel):
    status: str
    indexed_chunks: int
    db_size_mb: float
    message: str


class DatasetStatsResponse(BaseModel):
    total_files: int
    total_size_bytes: int
    total_characters: int
    total_words: int
    domain_distribution: Dict[str, int]
    language_distribution: Dict[str, int]
    warnings: List[str]
    indexed_chunks: int
