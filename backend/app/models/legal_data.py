import uuid
from sqlalchemy import Column, String, Text, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    act_name = Column(String(255), index=True, nullable=False)
    year = Column(Integer, nullable=False)
    jurisdiction = Column(String(100), default="India (Central)")
    domain_id = Column(String(50), index=True, nullable=False)  # consumer, tenancy, employment, contract
    authoritative_body = Column(String(255), default="Parliament of India")
    source_url = Column(String(500), nullable=True)

    sections = relationship("LegalSection", back_populates="document", cascade="all, delete-orphan")
    chunks = relationship("LegalChunk", back_populates="document", cascade="all, delete-orphan")

class LegalSection(Base):
    __tablename__ = "legal_sections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("legal_documents.id", ondelete="CASCADE"), nullable=False, index=True)
    section_number = Column(String(50), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    verbatim_text = Column(Text, nullable=False)
    plain_explanation = Column(Text, nullable=False)
    legal_domain = Column(String(50), index=True, nullable=False)

    document = relationship("LegalDocument", back_populates="sections")
    chunks = relationship("LegalChunk", back_populates="section")

class Judgment(Base):
    __tablename__ = "judgments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    case_name = Column(String(255), index=True, nullable=False)
    court = Column(String(100), index=True, nullable=False)  # Supreme Court of India, High Court of Delhi, etc.
    citation_str = Column(String(100), index=True, nullable=False)
    judgment_date = Column(String(50), nullable=True)
    bench = Column(String(255), nullable=True)
    petitioner = Column(String(255), nullable=True)
    respondent = Column(String(255), nullable=True)
    summary = Column(Text, nullable=False)
    court_reasoning = Column(Text, nullable=False)
    outcome = Column(String(255), nullable=False)
    cited_cases = Column(JSON, nullable=True)
    citing_cases = Column(JSON, nullable=True)
    timeline_milestones = Column(JSON, nullable=True)
    source_url = Column(String(500), nullable=True)

    chunks = relationship("LegalChunk", back_populates="judgment")

class LegalChunk(Base):
    __tablename__ = "legal_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("legal_documents.id", ondelete="CASCADE"), nullable=True)
    section_id = Column(String(36), ForeignKey("legal_sections.id", ondelete="CASCADE"), nullable=True)
    judgment_id = Column(String(36), ForeignKey("judgments.id", ondelete="CASCADE"), nullable=True)
    chunk_index = Column(Integer, default=0)
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    embedding_vector = Column(JSON, nullable=True)  # JSON array of floats for portable storage

    document = relationship("LegalDocument", back_populates="chunks")
    section = relationship("LegalSection", back_populates="chunks")
    judgment = relationship("Judgment", back_populates="chunks")
