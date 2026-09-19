from typing import List, Optional
from pydantic import BaseModel

class SearchRequest(BaseModel):
    query: str
    tab: Optional[str] = "All"  # "All", "Acts", "Sections", "Regulations", "Judgments"
    domain: Optional[str] = None
    court: Optional[str] = None
    jurisdiction: Optional[str] = None
    act: Optional[str] = None
    page: Optional[int] = 1
    pageSize: Optional[int] = 10

class SearchResultItem(BaseModel):
    id: str
    title: str
    type: str  # "Act", "Section", "Regulation", "Judgment"
    section: Optional[str] = None
    court: Optional[str] = None
    date: Optional[str] = None
    jurisdiction: Optional[str] = None
    explanation: str
    relevance: float
    sourceUrl: Optional[str] = None
    domain: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    tab: str
    totalResults: int
    page: int
    pageSize: int
    results: List[SearchResultItem]
