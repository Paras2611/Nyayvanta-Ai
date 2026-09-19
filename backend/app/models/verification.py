import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    message_id = Column(String(36), ForeignKey("messages.id", ondelete="CASCADE"), nullable=False, index=True)
    claim_text = Column(Text, nullable=False)
    category = Column(String(50), default="STATUTORY")  # STATUTORY, FACTUAL, PROCEDURAL
    importance_score = Column(Integer, default=80)  # 0 to 100

    message = relationship("Message", back_populates="claims")
    verification = relationship("Verification", back_populates="claim", uselist=False, cascade="all, delete-orphan")

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    claim_id = Column(String(36), ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, unique=True)
    # Internal status: SUPPORTED, CONTRADICTED, NOT_ENOUGH_EVIDENCE
    status = Column(String(50), nullable=False)
    # UI status: VERIFIED, PARTIALLY_VERIFIED, UNVERIFIED, CONFLICTING
    ui_badge = Column(String(50), nullable=False)
    matched_passage = Column(Text, nullable=True)
    source_citation = Column(String(255), nullable=True)
    confidence_score = Column(Float, default=85.0)
    status_justification = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    claim = relationship("Claim", back_populates="verification")

class Citation(Base):
    __tablename__ = "citations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    message_id = Column(String(36), ForeignKey("messages.id", ondelete="CASCADE"), nullable=False, index=True)
    source_type = Column(String(50), nullable=False)  # STATUTE, JUDGMENT, REGULATION, USER_DOCUMENT
    act_name = Column(String(255), nullable=True)
    section_number = Column(String(50), nullable=True)
    court_or_authority = Column(String(255), nullable=True)
    excerpt = Column(Text, nullable=False)
    source_url = Column(String(500), nullable=True)
    relevance_score = Column(Float, default=90.0)

    message = relationship("Message", back_populates="citations")
