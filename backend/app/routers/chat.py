import time
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.conversation import Conversation, Message
from backend.app.schemas.chat import ChatRequest, EvidenceBackedResponse
from backend.app.routers.auth import get_current_user
from backend.app.services.rag_service import rag_service
from backend.app.services.audit_service import audit_logger

router = APIRouter(prefix="", tags=["Legal Chat & Research"])

@router.post("/chat", response_model=EvidenceBackedResponse)
def handle_chat_query(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    
    # Locate or create conversation
    conv = None
    if payload.conversationId:
        conv = db.query(Conversation).filter(
            Conversation.id == payload.conversationId,
            Conversation.user_id == current_user.id
        ).first()

    if not conv:
        conv = Conversation(
            user_id=current_user.id,
            domain_id=payload.domainId or "consumer",
            title=payload.query[:60] if payload.query else "New Legal Research"
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # Save user message
    user_msg = Message(
        conversation_id=conv.id,
        sender="user",
        content=payload.query
    )
    db.add(user_msg)
    db.commit()

    # Execute 11-step legal RAG pipeline
    result = rag_service.execute_legal_analysis(
        db=db,
        query=payload.query,
        domain_id=payload.domainId or conv.domain_id,
        conversation_id=conv.id,
        clarification_answers=payload.clarificationAnswers,
        case_facts=payload.caseFacts
    )

    # Save AI response message
    ai_msg = Message(
        conversation_id=conv.id,
        sender="ai",
        content=result.answer,
        structured_response=result.model_dump(),
        clarification_payload=result.clarification.model_dump() if result.clarification else None
    )
    db.add(ai_msg)
    db.commit()

    execution_ms = int((time.time() - start_time) * 1000)

    # Audit Trail Logging
    audit_logger.log_event(
        db=db,
        session_id=conv.id,
        action_type="LEGAL_QUERY_EXECUTION",
        user_id=current_user.id,
        query_text=payload.query,
        domain_id=result.domainId,
        retrieved_sources_count=len(result.sources),
        model_used="Nyayavanta-RAG-v1",
        verification_summary={
            "total_claims": len(result.verification),
            "verified": sum(1 for v in result.verification if v.uiBadge == "VERIFIED"),
            "confidence": result.confidence.score
        },
        execution_time_ms=execution_ms
    )

    return result

@router.get("/conversations")
def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    convs = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.updated_at.desc()).all()

    return [
        {
            "id": c.id,
            "title": c.title,
            "domainId": c.domain_id,
            "status": c.status,
            "createdAt": c.created_at.isoformat(),
            "updatedAt": c.updated_at.isoformat(),
            "messageCount": len(c.messages)
        }
        for c in convs
    ]

@router.get("/conversations/{conversation_id}")
def get_conversation_detail(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = []
    for m in conv.messages:
        messages.append({
            "id": m.id,
            "sender": m.sender,
            "content": m.content,
            "structuredResponse": m.structured_response,
            "clarificationPayload": m.clarification_payload,
            "createdAt": m.created_at.isoformat()
        })

    return {
        "id": conv.id,
        "title": conv.title,
        "domainId": conv.domain_id,
        "status": conv.status,
        "createdAt": conv.created_at.isoformat(),
        "messages": messages
    }

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db.delete(conv)
    db.commit()
    return {"status": "deleted", "id": conversation_id}
