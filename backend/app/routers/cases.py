from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.legal_data import Judgment

router = APIRouter(prefix="", tags=["Landmark Cases"])

@router.get("/cases")
def list_cases(court: str = None, db: Session = Depends(get_db)):
    query = db.query(Judgment)
    if court:
        query = query.filter(Judgment.court.ilike(f"%{court}%"))
    cases = query.all()

    return [
        {
            "id": c.id,
            "caseName": c.case_name,
            "court": c.court,
            "citationStr": c.citation_str,
            "judgmentDate": c.judgment_date,
            "summary": c.summary,
            "outcome": c.outcome,
            "sourceUrl": c.source_url
        }
        for c in cases
    ]

@router.get("/cases/{case_id}")
def get_case_detail(case_id: str, db: Session = Depends(get_db)):
    c = db.query(Judgment).filter(Judgment.id == case_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")

    return {
        "id": c.id,
        "caseName": c.case_name,
        "court": c.court,
        "citationStr": c.citation_str,
        "judgmentDate": c.judgment_date,
        "bench": c.bench,
        "petitioner": c.petitioner,
        "respondent": c.respondent,
        "summary": c.summary,
        "courtReasoning": c.court_reasoning,
        "outcome": c.outcome,
        "citedCases": c.cited_cases or [],
        "citingCases": c.citing_cases or [],
        "timelineMilestones": c.timeline_milestones or [
            {"step": "Filing", "date": "Initiation", "desc": "Petition filed in competent registry"},
            {"step": "Hearing", "date": "Arguments", "desc": "Oral arguments and record inspection"},
            {"step": "Interim Order", "date": "Interlocutory", "desc": "Interim protections granted"},
            {"step": "Judgment", "date": c.judgment_date, "desc": "Final judgment pronounced"},
            {"step": "Final Outcome", "date": c.judgment_date, "desc": c.outcome}
        ],
        "sourceUrl": c.source_url
    }
