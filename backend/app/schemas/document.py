from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ClauseAnalysisItem(BaseModel):
    clauseTitle: str
    extractedSnippet: str
    legalImplication: str
    riskRating: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    relevantStatuteSnippet: Optional[str] = None
    sectionReference: Optional[str] = None

class DocumentAnalysisResponse(BaseModel):
    documentId: str
    filename: str
    status: str  # "Complete", "Processing", "Failed"
    documentType: str
    parties: List[str]
    dates: List[str]
    riskLevel: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    importantClauses: List[ClauseAnalysisItem]
    relevantLaws: List[str]
    potentialIssues: List[str]
    aiFindings: str
    recommendations: List[str]
    textExcerpt: Optional[str] = None

class DocumentAnalyzeRequest(BaseModel):
    document_id: Optional[str] = None
    document_text: Optional[str] = None
    filename: Optional[str] = None

class SavedItemCreate(BaseModel):
    title: str
    itemType: str  # "Answer", "Section", "Case", "Document", "Source"
    referenceId: Optional[str] = None
    description: Optional[str] = None
    dataPayload: Optional[Dict[str, Any]] = None

class SavedItemResponse(SavedItemCreate):
    id: str
    userId: str
    dateSaved: str
