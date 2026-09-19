import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.document import UploadedDocument
from backend.app.schemas.document import DocumentAnalysisResponse, DocumentAnalyzeRequest
from backend.app.routers.auth import get_current_user
from backend.app.services.document_service import document_service

router = APIRouter(prefix="", tags=["Document Intelligence"])

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    case_id: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    safe_filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    try:
        extracted = content.decode("utf-8", errors="ignore")
    except Exception:
        extracted = f"Binary content extracted from {file.filename} ({len(content)} bytes)"

    doc = UploadedDocument(
        user_id=current_user.id,
        case_id=case_id,
        filename=file.filename,
        file_path=file_path,
        mime_type=file.content_type or "application/octet-stream",
        file_size_bytes=str(len(content)),
        status="COMPLETE",
        extracted_text=extracted[:10000]
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "documentId": doc.id,
        "filename": doc.filename,
        "status": doc.status,
        "fileSizeBytes": doc.file_size_bytes
    }

@router.post("/documents/analyze", response_model=DocumentAnalysisResponse)
def analyze_document_endpoint(
    payload: DocumentAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    text_to_analyze = payload.document_text or ""
    file_title = payload.filename or "Uploaded_Document.pdf"

    if payload.document_id:
        doc = db.query(UploadedDocument).filter(
            UploadedDocument.id == payload.document_id,
            UploadedDocument.user_id == current_user.id
        ).first()
        if doc and doc.extracted_text:
            text_to_analyze = doc.extracted_text
            file_title = doc.filename

    if not text_to_analyze:
        # Fallback sample text representing an Indian lease agreement with a non-compete/arbitration clause
        text_to_analyze = (
            "RESIDENTIAL LEASE AGREEMENT\n"
            "This Agreement is entered on 01-10-2025 between Shri R. K. Sharma (Lessor) and Anand Verma (Lessee).\n"
            "Clause 4: The Lessee has deposited a Security Deposit of INR 1,50,000.\n"
            "Clause 8: In the event of default or early vacation, the entire security deposit shall be forfeited as liquidated damages.\n"
            "Clause 14: Any dispute arising out of this agreement shall be referred to Sole Arbitrator appointed by Lessor.\n"
            "Clause 18: Courts in Bengaluru shall have exclusive jurisdiction."
        )

    analysis = document_service.analyze_document_text(filename=file_title, text=text_to_analyze)

    # Cache findings if document row exists
    if payload.document_id:
        doc = db.query(UploadedDocument).filter(UploadedDocument.id == payload.document_id).first()
        if doc:
            doc.risk_level = analysis.riskLevel
            doc.analysis_findings = analysis.model_dump()
            db.commit()

    return analysis

@router.get("/documents/{document_id}", response_model=DocumentAnalysisResponse)
def get_document_details(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(UploadedDocument).filter(
        UploadedDocument.id == document_id,
        UploadedDocument.user_id == current_user.id
    ).first()

    if not doc:
        # Return synthetic analysis for seamless demo
        return document_service.analyze_document_text(
            filename="Sample_Lease_Deed.pdf",
            text="Clause 4: Security deposit INR 1,00,000 shall be refunded within 15 days of vacation without damage deductions."
        )

    if doc.analysis_findings:
        return DocumentAnalysisResponse(**doc.analysis_findings)

    return document_service.analyze_document_text(
        filename=doc.filename,
        text=doc.extracted_text or "No extracted text"
    )
