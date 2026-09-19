from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.search import SearchRequest, SearchResponse, SearchResultItem
from backend.app.services.hybrid_search import hybrid_engine
from backend.app.models.legal_data import LegalDocument, LegalSection, Judgment

router = APIRouter(prefix="", tags=["Search Engine"])

@router.post("/search", response_model=SearchResponse)
def search_legal_corpus(payload: SearchRequest, db: Session = Depends(get_db)):
    results = hybrid_engine.search(
        db=db,
        query=payload.query,
        domain_id=payload.domain,
        top_k=20
    )

    items = []
    tab_filter = payload.tab.lower() if payload.tab else "all"

    for r in results:
        sec = r.get("section")
        doc = r.get("document")
        jg = r.get("judgment")

        if sec and doc:
            if tab_filter not in ["all", "sections", "acts"]:
                continue
            item = SearchResultItem(
                id=sec.id,
                title=f"{doc.act_name} ({doc.year}) - {sec.section_number}",
                type="Section",
                section=sec.section_number,
                court=doc.jurisdiction,
                date=str(doc.year),
                jurisdiction=doc.jurisdiction,
                explanation=sec.plain_explanation,
                relevance=r["score"],
                sourceUrl=doc.source_url,
                domain=sec.legal_domain
            )
            items.append(item)

        elif jg:
            if tab_filter not in ["all", "judgments"]:
                continue
            item = SearchResultItem(
                id=jg.id,
                title=f"{jg.case_name} ({jg.citation_str})",
                type="Judgment",
                court=jg.court,
                date=jg.judgment_date,
                jurisdiction=jg.court,
                explanation=jg.summary,
                relevance=r["score"],
                sourceUrl=jg.source_url,
                domain="Landmark Precedent"
            )
            items.append(item)

    # Simple pagination
    page = max(payload.page or 1, 1)
    page_size = max(payload.pageSize or 10, 1)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paged_items = items[start_idx:end_idx]

    return SearchResponse(
        query=payload.query,
        tab=payload.tab or "All",
        totalResults=len(items),
        page=page,
        pageSize=page_size,
        results=paged_items
    )
