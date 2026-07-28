from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, UserContext
from app.schemas.ai import CoFounderPromptRequest
from app.services.ai_engine import ai_engine
from app.api.v1.endpoints.projects import in_memory_projects

router = APIRouter()

@router.post("/execute")
async def execute_ai_cofounder_agent(payload: CoFounderPromptRequest, current_user: UserContext = Depends(get_current_user)):
    project = in_memory_projects.get(payload.project_id)
    if not project:
        # Fallback project metadata if ID doesn't exist
        project = {
            "name": "VenturePilot Project",
            "industry": "Enterprise AI / B2B SaaS",
            "problem_statement": "Automating startup operational friction and investor readiness.",
            "solution_overview": "Autonomous AI Co-Founder system."
        }

    result = await ai_engine.execute_cofounder_workflow(
        name=project.get("name", "VenturePilot Project"),
        industry=project.get("industry", "Enterprise AI"),
        problem=project.get("problem_statement", "Startup execution friction"),
        solution=project.get("solution_overview", "AI Co-Founder OS"),
        user_prompt=payload.prompt
    )

    # Automatically sync updated investor readiness score
    if payload.project_id in in_memory_projects:
        new_score = result.get("investor_readiness", {}).get("overall_score", 88)
        in_memory_projects[payload.project_id]["readiness_score"] = new_score

    return result
