from fastapi import APIRouter, Depends
from app.core.security import get_current_user, UserContext

router = APIRouter()

@router.get("/{project_id}")
async def get_evaluation_metrics(project_id: str, current_user: UserContext = Depends(get_current_user)):
    return {
        "project_id": project_id,
        "faithfulness_score": 0.95,
        "answer_relevance_score": 0.97,
        "hallucination_index": 0.015,
        "latency_ms": 340,
        "tokens_consumed": 1420,
        "vector_search_precision": 0.92,
        "langsmith_project": "VenturePilot-AI",
        "langsmith_trace_url": "https://smith.langchain.com/public/traces/venturepilot-eval-trace"
    }
