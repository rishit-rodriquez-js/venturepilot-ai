from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, UserContext
from app.schemas.ai import CoFounderPromptRequest
from app.services.ai_engine import ai_engine
from app.services.project_service import project_service

router = APIRouter()

@router.post("/execute")
async def execute_ai_cofounder_agent(payload: CoFounderPromptRequest, current_user: UserContext = Depends(get_current_user)):
    state = project_service.get_project_by_id(payload.project_id, current_user.user_id)
    project = state.get("project", {})

    result = await ai_engine.execute_cofounder_workflow(
        name=project.get("name", "Your Startup"),
        industry=project.get("industry", "Enterprise SaaS"),
        problem=project.get("problem_statement", "Primary customer problem statement."),
        solution=project.get("solution_overview", "AI-powered platform solution."),
        user_prompt=payload.prompt
    )

    if result.get("rejected"):
        return result

    # Update state score
    state["project"]["readiness_score"] = min(100, state["project"].get("readiness_score", 89) + 1)
    return result
