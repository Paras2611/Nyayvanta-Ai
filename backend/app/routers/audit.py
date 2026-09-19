from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.audit import AuditEvent
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user

router = APIRouter(prefix="", tags=["Audit Trail"])

@router.get("/audit-events")
def list_audit_events(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    events = db.query(AuditEvent).order_by(AuditEvent.timestamp.desc()).limit(50).all()
    return [
        {
            "id": e.id,
            "sessionId": e.session_id,
            "actionType": e.action_type,
            "queryText": e.query_text,
            "domainId": e.domain_id,
            "retrievedSourcesCount": e.retrieved_sources_count,
            "modelUsed": e.model_used,
            "verificationSummary": e.verification_summary,
            "executionTimeMs": e.execution_time_ms,
            "timestamp": e.timestamp.isoformat()
        }
        for e in events
    ]
