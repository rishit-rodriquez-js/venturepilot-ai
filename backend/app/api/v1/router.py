from fastapi import APIRouter
from app.api.v1.endpoints import auth, projects, ai_cofounder, audit, governance, evaluation

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth & User Management"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects Management"])
api_router.include_router(ai_cofounder.router, prefix="/ai-cofounder", tags=["AI Co-Founder Engine"])
api_router.include_router(audit.router, prefix="/audit", tags=["Enterprise Audit Logs"])
api_router.include_router(governance.router, prefix="/governance", tags=["Governance & Versioning"])
api_router.include_router(evaluation.router, prefix="/evaluation", tags=["LangSmith AI Evaluation"])
