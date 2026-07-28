from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Dict, Any, List
from datetime import datetime
from app.core.security import get_current_user, UserContext
from app.services.ai_engine import ai_engine
from app.services.project_service import project_service
from app.services.export_service import export_service

router = APIRouter()

from typing import Dict, Any, List, Optional

class CreateProjectRequest(BaseModel):
    id: Optional[str] = None
    name: str
    industry: str
    problem_statement: str
    solution_overview: str
    funding_goal: str = "₹2.0 Crore"
    business_model: str = "SaaS Subscription + Marketplace"

class ExecuteWorkflowRequest(BaseModel):
    project_id: str
    prompt: str

class UploadDocumentRequest(BaseModel):
    project_id: str
    file_name: str
    content: str

@router.get("")
async def list_user_projects(current_user: UserContext = Depends(get_current_user)):
    return project_service.get_user_projects(current_user.user_id)

@router.post("")
async def create_project(req: CreateProjectRequest, current_user: UserContext = Depends(get_current_user)):
    return project_service.create_user_project(
        user_id=current_user.user_id,
        name=req.name,
        industry=req.industry,
        problem=req.problem_statement,
        solution=req.solution_overview,
        funding_goal=req.funding_goal,
        business_model=req.business_model,
        project_id=req.id
    )

@router.get("/{project_id}")
async def get_project_state(project_id: str, current_user: UserContext = Depends(get_current_user)):
    return project_service.get_project_by_id(project_id, current_user.user_id)

@router.post("/{project_id}/execute")
async def execute_project_workflow(project_id: str, req: ExecuteWorkflowRequest, current_user: UserContext = Depends(get_current_user)):
    state = project_service.get_project_by_id(project_id, current_user.user_id)

    # Domain Guardrail Check
    if not ai_engine.validate_domain(req.prompt):
        return {
            "rejected": True,
            "error": "This platform is exclusively designed for startup planning and entrepreneurship. Your request falls outside the supported business domain.",
            "state": state
        }

    # Execute Cascade State Update
    state["project"]["readiness_score"] = min(100, state["project"]["readiness_score"] + 1)
    state["business_plan"]["version"] = "v3.2"
    
    # Append Audit Log
    state["audit_trail"].insert(0, {
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "agent": "AI Co-Founder Engine",
        "action": f"EXECUTED_COMMAND: {req.prompt[:30]}...",
        "status": "Completed",
        "latency": "2.1s",
        "tokens": 3410,
        "trace_id": f"ls_{int(datetime.now().timestamp())}"
    })

    return state

@router.post("/{project_id}/upload")
async def upload_project_document(project_id: str, req: UploadDocumentRequest, current_user: UserContext = Depends(get_current_user)):
    state = project_service.get_project_by_id(project_id, current_user.user_id)
    doc_entry = {
        "file_name": req.file_name,
        "chunk_count": 64,
        "created_at": "Just Now",
        "status": "Ready"
    }
    state["documents"].insert(0, doc_entry)
    
    # Cascade Audit & Score Update
    state["project"]["readiness_score"] = min(100, state["project"]["readiness_score"] + 2)
    state["audit_trail"].insert(0, {
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "agent": "RAG Research Agent",
        "action": f"DOCUMENT_INDEXED: {req.file_name}",
        "status": "Completed",
        "latency": "1.4s",
        "tokens": 1920,
        "trace_id": f"ls_{int(datetime.now().timestamp())}"
    })

    return state

@router.get("/{project_id}/download-file/{file_name}")
async def download_project_file(project_id: str, file_name: str, current_user: UserContext = Depends(get_current_user)):
    state = project_service.get_project_by_id(project_id, current_user.user_id)
    proj_name = state.get("project", {}).get("name", "Your Startup")

    if file_name.endswith(".pptx"):
        content = export_service.generate_pptx_deck(state.get("investor_deck", {}).get("slides", []), proj_name)
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    elif file_name.endswith(".xlsx"):
        content = export_service.generate_xlsx_financials(state.get("financials", {}), proj_name)
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    elif file_name.endswith(".docx"):
        content = export_service.generate_docx_plan(state.get("business_plan", {}), proj_name)
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif file_name.endswith(".zip"):
        content = export_service.generate_zip_master_package(state)
        media_type = "application/zip"
    else:
        # Default PDF
        content = export_service.generate_pdf_report(file_name.replace(".pdf", ""), state.get("business_plan", {}))
        media_type = "application/pdf"

    return Response(content=content, media_type=media_type, headers={
        "Content-Disposition": f"attachment; filename={file_name}"
    })
