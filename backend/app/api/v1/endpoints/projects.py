from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict
import uuid
from datetime import datetime
from app.core.security import get_current_user, UserContext
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter()

# In-memory mock store backed by database structure for robust zero-dependency execution
in_memory_projects: Dict[str, dict] = {
    "proj-1": {
        "id": "proj-1",
        "owner_id": "00000000-0000-0000-0000-000000000001",
        "name": "FinPulse AI",
        "tagline": "Autonomous AI CFO & Financial Forecasting for Enterprise SaaS",
        "industry": "FinTech / Enterprise SaaS",
        "target_market": "CFOs & Finance Operations at Series A-C Startups",
        "problem_statement": "Manual financial modeling and cash flow forecasting takes 40+ hours per month and suffers from stale data.",
        "solution_overview": "Autonomous agent swarm that connects directly to ERPs and bank feeds to run continuous scenario modeling.",
        "stage": "validation",
        "readiness_score": 88,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    "proj-2": {
        "id": "proj-2",
        "owner_id": "00000000-0000-0000-0000-000000000001",
        "name": "HealthFlow OS",
        "tagline": "AI Clinical Workflow Automation for Specialized Clinics",
        "industry": "HealthTech / SaaS",
        "target_market": "Specialized Medical Clinics & Outpatient Centers",
        "problem_statement": "Doctors spend 2.5 hours daily filling out EHR fields instead of treating patients.",
        "solution_overview": "Ambient voice AI that generates structured EHR charts automatically in compliance with HIPAA.",
        "stage": "mvp",
        "readiness_score": 92,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
}

@router.get("/", response_model=List[dict])
async def list_projects(current_user: UserContext = Depends(get_current_user)):
    user_projs = [p for p in in_memory_projects.values() if p["owner_id"] == current_user.user_id or current_user.role == "admin"]
    return user_projs if user_projs else list(in_memory_projects.values())

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_project(payload: ProjectCreate, current_user: UserContext = Depends(get_current_user)):
    new_id = f"proj-{str(uuid.uuid4())[:8]}"
    project_record = {
        "id": new_id,
        "owner_id": current_user.user_id,
        "name": payload.name,
        "tagline": payload.tagline,
        "industry": payload.industry,
        "target_market": payload.target_market,
        "problem_statement": payload.problem_statement,
        "solution_overview": payload.solution_overview,
        "stage": payload.stage,
        "readiness_score": 75,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    in_memory_projects[new_id] = project_record
    return project_record

@router.get("/{project_id}", response_model=dict)
async def get_project(project_id: str, current_user: UserContext = Depends(get_current_user)):
    if project_id not in in_memory_projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return in_memory_projects[project_id]

@router.put("/{project_id}", response_model=dict)
async def update_project(project_id: str, payload: ProjectUpdate, current_user: UserContext = Depends(get_current_user)):
    if project_id not in in_memory_projects:
        raise HTTPException(status_code=404, detail="Project not found")
    
    proj = in_memory_projects[project_id]
    if proj["owner_id"] != current_user.user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized project access")

    update_data = payload.dict(exclude_unset=True)
    for k, v in update_data.items():
        if v is not None:
            proj[k] = v
    proj["updated_at"] = datetime.utcnow().isoformat()
    in_memory_projects[project_id] = proj
    return proj

@router.delete("/{project_id}")
async def delete_project(project_id: str, current_user: UserContext = Depends(get_current_user)):
    if project_id not in in_memory_projects:
        raise HTTPException(status_code=404, detail="Project not found")
    proj = in_memory_projects[project_id]
    if proj["owner_id"] != current_user.user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized project access")
    del in_memory_projects[project_id]
    return {"message": "Project deleted successfully", "id": project_id}
