from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from datetime import datetime
from app.core.security import get_current_user, UserContext

router = APIRouter()

version_snapshots: List[Dict[str, Any]] = [
    {
        "id": "ver-101",
        "version_number": 1,
        "snapshot_label": "Initial Concept & Problem Hypothesis",
        "created_by": "founder@venturepilot.ai",
        "timestamp": datetime.utcnow().isoformat()
    },
    {
        "id": "ver-102",
        "version_number": 2,
        "snapshot_label": "Validated Lean Canvas & Technical Architecture v1",
        "created_by": "founder@venturepilot.ai",
        "timestamp": datetime.utcnow().isoformat()
    }
]

@router.get("/versions/{project_id}", response_model=List[Dict[str, Any]])
async def get_project_versions(project_id: str, current_user: UserContext = Depends(get_current_user)):
    return version_snapshots

@router.post("/versions/{project_id}/snapshot")
async def create_version_snapshot(project_id: str, label: str, current_user: UserContext = Depends(get_current_user)):
    next_ver = len(version_snapshots) + 1
    snapshot = {
        "id": f"ver-{100 + next_ver}",
        "version_number": next_ver,
        "snapshot_label": label or f"Governance Snapshot v{next_ver}",
        "created_by": current_user.email,
        "timestamp": datetime.utcnow().isoformat()
    }
    version_snapshots.append(snapshot)
    return snapshot
