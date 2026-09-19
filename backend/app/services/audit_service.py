import logging
import time
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models.audit import AuditEvent

logger = logging.getLogger("nyayavanta.audit")

class AuditTrailLogger:
    """Records transparent audit trail of legal research operations and verification events."""

    def log_event(
        self,
        db: Session,
        session_id: str,
        action_type: str,
        user_id: Optional[str] = None,
        query_text: Optional[str] = None,
        domain_id: Optional[str] = None,
        retrieved_sources_count: int = 0,
        model_used: str = "Nyayavanta-RAG-v1",
        verification_summary: Optional[Dict[str, Any]] = None,
        execution_time_ms: int = 0
    ) -> AuditEvent:
        event = AuditEvent(
            user_id=user_id,
            session_id=session_id,
            action_type=action_type,
            query_text=query_text,
            domain_id=domain_id,
            retrieved_sources_count=retrieved_sources_count,
            model_used=model_used,
            verification_summary=verification_summary,
            execution_time_ms=execution_time_ms
        )
        try:
            db.add(event)
            db.commit()
            logger.info(f"Audit event recorded: [{action_type}] domain={domain_id} retrieved={retrieved_sources_count} in {execution_time_ms}ms")
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to record audit event: {e}")
        return event

audit_logger = AuditTrailLogger()
