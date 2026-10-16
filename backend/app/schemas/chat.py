from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ClarificationQuestion(BaseModel):
    id: str
    text: str
    type: str  # "yes_no", "single_choice", "multiple_choice", "text", "date", "number", "dropdown"
    options: Optional[List[str]] = None
    helpText: Optional[str] = None

class ClarificationPayload(BaseModel):
    type: str = "clarification"
    questions: List[ClarificationQuestion]

class ChatRequest(BaseModel):
    conversationId: Optional[str] = None
    query: str
    domainId: Optional[str] = None
    attachedDocIds: Optional[List[str]] = None
    clarificationAnswers: Optional[Dict[str, Any]] = None
    caseFacts: Optional[Dict[str, Any]] = None

class LegalSectionItem(BaseModel):
    id: str
    actName: str
    year: int
    sectionNumber: str
    title: str
    keyRuleVerbatim: str
    plainEnglishExplanation: str
    relevanceToCase: str
    statutoryReferenceUrl: Optional[str] = None

class CaseCitationItem(BaseModel):
    id: str
    caseName: str
    court: str
    citationStr: str
    judgmentDate: Optional[str] = None
    summary: str
    relevance: str
    sourceUrl: Optional[str] = None

class ClaimVerificationItem(BaseModel):
    id: str
    claimStatement: str
    evidenceSource: str
    sourceType: str  # "STATUTE", "USER_DOCUMENT", "USER_TIMELINE", "PRECEDENT_DOCTRINE"
    statutoryCitation: str
    verificationStatus: str  # "VERIFIED_STATUTORY", "ESTABLISHED_PRINCIPLE", "DOCUMENT_SUPPORTED", "REQUIRES_PRIMARY_VERIFICATION"
    uiBadge: str  # "VERIFIED", "PARTIALLY_VERIFIED", "UNVERIFIED", "CONFLICTING"
    statusJustification: str
    confidenceRating: float

class NextStepItem(BaseModel):
    stepNumber: int
    title: str
    category: str  # "PRE_LITIGATION", "EVIDENCE_GATHERING", "FILING_PROCEDURE", "LEGAL_AID"
    description: str
    actionableNotes: List[str]
    recommendedTimeline: str

class SourceItem(BaseModel):
    id: str
    title: str
    sourceType: str
    sectionOrCourt: str
    sourceUrl: Optional[str] = None
    verificationStatus: str

class ConfidenceInfo(BaseModel):
    score: float
    level: str  # "HIGH", "MEDIUM", "CONDITIONAL"
    caveat: str
    rationale: str

class EvidenceBackedResponse(BaseModel):
    conversationId: str
    messageId: str
    domainId: str
    isClarification: bool = False
    clarification: Optional[ClarificationPayload] = None
    
    # The 9 Standard Sections
    answer: str
    whyThisMayApply: str
    relevantLaw: List[LegalSectionItem]
    relevantCases: List[CaseCitationItem]
    possibleNextSteps: List[NextStepItem]
    importantLimitations: List[str]
    confidence: ConfidenceInfo
    verification: List[ClaimVerificationItem]
    sources: List[SourceItem]
    
    # Additional Case metadata
    caseSummary: Optional[str] = None
    suggestedDocuments: Optional[List[Dict[str, Any]]] = None
    proceedingChecklistTitle: Optional[str] = None
    disclaimer: str = (
        "Nyayavanta provides AI-generated legal information and research assistance based on available sources. "
        "It is not a substitute for advice from a qualified advocate or other legal professional. "
        "Users should verify important legal matters with authoritative sources and qualified professionals."
    )
