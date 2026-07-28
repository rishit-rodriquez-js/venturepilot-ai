from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.core.security import get_current_user, UserContext

router = APIRouter()

audit_memory_logs: List[Dict[str, Any]] = [
    {
        "id": "log-101",
        "timestamp": "10:15:20",
        "user": "you@example.com",
        "project": "Selected Startup",
        "agent": "Research Agent (RAG)",
        "action": "DOCUMENT_UPLOADED",
        "status": "Completed",
        "latency": "1.8s",
        "tokens": 2450,
        "version": "v3.0",
        "trace_id": "ls_87hf921a"
    },
    {
        "id": "log-102",
        "timestamp": "10:18:45",
        "user": "you@example.com",
        "project": "Selected Startup",
        "agent": "Market Intelligence Agent",
        "action": "RAG_EXECUTED",
        "status": "Completed",
        "latency": "2.1s",
        "tokens": 4187,
        "version": "v3.0",
        "trace_id": "ls_94kc110b"
    },
    {
        "id": "log-103",
        "timestamp": "10:25:12",
        "user": "you@example.com",
        "project": "Selected Startup",
        "agent": "Pitch Deck Agent",
        "action": "INVESTOR_DECK_GENERATED",
        "status": "Completed",
        "latency": "3.4s",
        "tokens": 5820,
        "version": "v3.0",
        "trace_id": "ls_10zp449c"
    },
    {
        "id": "log-104",
        "timestamp": "10:30:05",
        "user": "you@example.com",
        "project": "Selected Startup",
        "agent": "Financial Analyst Agent",
        "action": "FOUNDER_EDITED_PRICING",
        "status": "Completed",
        "latency": "0.4s",
        "tokens": 850,
        "version": "v3.1",
        "trace_id": "ls_77aa901x"
    },
    {
        "id": "log-105",
        "timestamp": "10:45:00",
        "user": "you@example.com",
        "project": "Selected Startup",
        "agent": "Governance Agent",
        "action": "VERSION_SNAPSHOT_CREATED",
        "status": "Completed",
        "latency": "0.2s",
        "tokens": 320,
        "version": "v3.1",
        "trace_id": "ls_55mm309e"
    }
]

@router.get("/", response_model=List[Dict[str, Any]])
async def get_audit_logs(current_user: UserContext = Depends(get_current_user)):
    return audit_memory_logs
