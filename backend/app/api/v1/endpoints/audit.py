from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.core.security import get_current_user, UserContext

router = APIRouter()

audit_memory_logs: List[Dict[str, Any]] = [
    {
        "id": "log-001",
        "action": "PROJECT_CREATE",
        "details": {"project_name": "FinPulse AI", "industry": "FinTech / Enterprise SaaS"},
        "user_email": "founder@venturepilot.ai",
        "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat()
    },
    {
        "id": "log-002",
        "action": "AI_WORKFLOW_RUN",
        "details": {"agent": "Validation & Lean Canvas Agent", "status": "COMPLETED"},
        "user_email": "founder@venturepilot.ai",
        "timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat()
    },
    {
        "id": "log-003",
        "action": "AI_WORKFLOW_RUN",
        "details": {"agent": "Technical Architecture & Financial Forecasting Agent", "status": "COMPLETED"},
        "user_email": "founder@venturepilot.ai",
        "timestamp": (datetime.utcnow() - timedelta(minutes=20)).isoformat()
    }
]

@router.get("/", response_model=List[Dict[str, Any]])
async def get_audit_logs(current_user: UserContext = Depends(get_current_user)):
    return audit_memory_logs
