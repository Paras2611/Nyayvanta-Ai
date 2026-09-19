from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.legal_data import LegalDocument, LegalSection

router = APIRouter(prefix="", tags=["Laws & Acts"])

@router.get("/laws")
def list_laws(db: Session = Depends(get_db)):
    docs = db.query(LegalDocument).all()
    return [
        {
            "id": d.id,
            "actName": d.act_name,
            "year": d.year,
            "jurisdiction": d.jurisdiction,
            "domainId": d.domain_id,
            "authoritativeBody": d.authoritative_body,
            "sourceUrl": d.source_url,
            "sectionsCount": len(d.sections)
        }
        for d in docs
    ]

@router.get("/laws/{law_id}")
def get_law_detail(law_id: str, db: Session = Depends(get_db)):
    doc = db.query(LegalDocument).filter(LegalDocument.id == law_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Legal document not found")

    return {
        "id": doc.id,
        "actName": doc.act_name,
        "year": doc.year,
        "jurisdiction": doc.jurisdiction,
        "domainId": doc.domain_id,
        "authoritativeBody": doc.authoritative_body,
        "sourceUrl": doc.source_url,
        "sections": [
            {
                "id": s.id,
                "sectionNumber": s.section_number,
                "title": s.title,
                "verbatimText": s.verbatim_text,
                "plainExplanation": s.plain_explanation,
                "domain": s.legal_domain
            }
            for s in doc.sections
        ]
    }
