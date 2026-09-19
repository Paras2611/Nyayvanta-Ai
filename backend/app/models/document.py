import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    mime_type = Column(String(100), default="application/pdf")
    file_size_bytes = Column(String(50), default="0")
    
    # Pipeline status: IDLE, UPLOADING, EXTRACTING_TEXT, ANALYZING, FINDING_LAW, VERIFYING, COMPLETE, FAILED
    status = Column(String(50), default="COMPLETE")
    extracted_text = Column(Text, nullable=True)
    
    # Risk assessment: LOW, MEDIUM, HIGH, CRITICAL
    risk_level = Column(String(50), default="MEDIUM")
    
    # JSON breakdown of parties, key dates, detected clauses, risk rationale, and matched laws
    analysis_findings = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="uploaded_documents")
    case = relationship("Case", back_populates="uploaded_documents")
