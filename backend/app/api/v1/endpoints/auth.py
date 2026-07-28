from fastapi import APIRouter, Depends
from app.core.security import get_current_user, UserContext
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

class ProfileResponse(BaseModel):
    id: str
    email: str
    role: str
    full_name: str
    company: Optional[str] = "VenturePilot Inc."
    status: str = "active"

@router.get("/me", response_model=ProfileResponse)
async def get_me(current_user: UserContext = Depends(get_current_user)):
    return ProfileResponse(
        id=current_user.user_id,
        email=current_user.email,
        role=current_user.role,
        full_name=current_user.email.split("@")[0].capitalize() or "Founder",
        company="VenturePilot Enterprise",
        status="active"
    )

@router.post("/audit-event")
async def record_audit_event(action: str, details: dict, current_user: UserContext = Depends(get_current_user)):
    return {
        "status": "success",
        "user_id": current_user.user_id,
        "action": action,
        "timestamp": datetime.utcnow().isoformat()
    }
