import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    domain_id = Column(String(50), nullable=True)  # consumer, tenancy, employment, contract
    title = Column(String(255), default="New Legal Research")
    status = Column(String(50), default="active")  # active, archived
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")
    case = relationship("Case", back_populates="conversation", uselist=False, cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender = Column(String(20), nullable=False)  # "user", "ai", "system"
    content = Column(Text, nullable=False)
    structured_response = Column(JSON, nullable=True)  # Stored full JSON structure (9 sections)
    clarification_payload = Column(JSON, nullable=True)  # Optional structured questions
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    conversation = relationship("Conversation", back_populates="messages")
    citations = relationship("Citation", back_populates="message", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="message", cascade="all, delete-orphan")

class Case(Base):
    __tablename__ = "cases"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    conversation_id = Column(String(36), ForeignKey("conversations.id", ondelete="SET NULL"), nullable=True)
    domain_id = Column(String(50), nullable=False)  # consumer, tenancy, employment, contract
    title = Column(String(255), nullable=False)
    dispute_description = Column(Text, nullable=False)
    complainant_role = Column(String(100), nullable=True)
    opposite_party_name = Column(String(255), nullable=True)
    opposite_party_type = Column(String(100), nullable=True)
    disputed_amount_inr = Column(Float, nullable=True)
    incident_date = Column(String(50), nullable=True)
    state_jurisdiction = Column(String(100), nullable=True)
    jurisdiction_details = Column(JSON, nullable=True)
    analysis_cache = Column(JSON, nullable=True)
    status = Column(String(50), default="open")  # open, draft_notice_ready, resolved, archived
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="cases")
    conversation = relationship("Conversation", back_populates="case")
    uploaded_documents = relationship("UploadedDocument", back_populates="case")
