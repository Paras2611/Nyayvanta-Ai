import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.conversation import Case
from backend.app.schemas.document import SavedItemCreate, SavedItemResponse
from backend.app.routers.auth import get_current_user

router = APIRouter(prefix="", tags=["Saved Research"])

# In-memory storage for saved research bookmarks with pre-seeded demo entries
SAVED_ITEMS = [
    {
        "id": "saved-1",
        "userId": "default",
        "title": "Transfer of Property Act - Section 108(B)(q)",
        "itemType": "Section",
        "referenceId": "sec-tpa-108",
        "description": "Lessor obligation to refund security deposit after vacation.",
        "dateSaved": "Today, 10:30 AM",
        "dataPayload": {"act": "Transfer of Property Act, 1882", "section": "108(B)(q)"}
    },
    {
        "id": "saved-2",
        "userId": "default",
        "title": "Kailash Nath Associates v. DDA",
        "itemType": "Case",
        "referenceId": "case-kailash-nath",
        "description": "Supreme Court holding that forfeiture without actual proof of damage is invalid.",
        "dateSaved": "Yesterday",
        "dataPayload": {"citation": "(2015) 4 SCC 136", "court": "Supreme Court of India"}
    },
    {
        "id": "saved-3",
        "userId": "default",
        "title": "Consumer Protection Act - Section 2(7) & 2(11)",
        "itemType": "Answer",
        "referenceId": "ans-cpa",
        "description": "Definition of consumer and service deficiency rights.",
        "dateSaved": "3 days ago",
        "dataPayload": {"domain": "consumer"}
    }
]

@router.get("/saved")
def get_saved_items(tab: Optional[str] = None, current_user: User = Depends(get_current_user)):
    items = SAVED_ITEMS
    if tab and tab.lower() != "all":
        items = [i for i in items if i["itemType"].lower() == tab.lower()]
    return items

@router.post("/saved")
def save_item(item_in: SavedItemCreate, current_user: User = Depends(get_current_user)):
    new_item = {
        "id": f"saved-{uuid.uuid4().hex[:6]}",
        "userId": current_user.id,
        "title": item_in.title,
        "itemType": item_in.itemType,
        "referenceId": item_in.referenceId,
        "description": item_in.description,
        "dateSaved": "Just now",
        "dataPayload": item_in.dataPayload or {}
    }
    SAVED_ITEMS.insert(0, new_item)
    return new_item

@router.delete("/saved/{item_id}")
def delete_saved_item(item_id: str, current_user: User = Depends(get_current_user)):
    global SAVED_ITEMS
    SAVED_ITEMS = [i for i in SAVED_ITEMS if i["id"] != item_id]
    return {"status": "deleted", "id": item_id}
