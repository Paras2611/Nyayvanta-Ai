import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=False)
    action_type = Column(String(100), nullable=False)  # USER_QUERY, RETRIEVAL, CLAIM_VERIFICATION, DOCUMENT_UPLOAD, CITATION_INSPECTION
    query_text = Column(Text, nullable=True)
    domain_id = Column(String(50), nullable=True)
    retrieved_sources_count = Column(Integer, default=0)
    model_used = Column(String(100), default="Nyayavanta-RAG-v1")
    verification_summary = Column(JSON, nullable=True)
    execution_time_ms = Column(Integer, default=0)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="audit_events")
