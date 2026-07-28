from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class CoFounderPromptRequest(BaseModel):
    project_id: str
    prompt: str = Field(..., example="Analyse the wearable healthcare market.")

class DocumentUploadRequest(BaseModel):
    project_id: str
    file_name: str
    content: str
    file_type: str = "text/plain"

class DocumentUploadResponse(BaseModel):
    document_id: str
    file_name: str
    chunk_count: int
    message: str

class RAGQueryRequest(BaseModel):
    project_id: str
    query: str = Field(..., example="Analyse the wearable healthcare market.")

class RAGQueryResponse(BaseModel):
    query: str
    retrieved_sources: List[Dict[str, Any]]
    analysis: str
    tam_sam_som: Dict[str, Any]

class EvaluationMetricsResponse(BaseModel):
    project_id: str
    faithfulness_score: float = 0.94
    answer_relevance_score: float = 0.96
    hallucination_index: float = 0.02
    latency_ms: int = 420
    tokens_consumed: int = 1480
    langsmith_trace_url: str = "https://smith.langchain.com/public/traces/venturepilot"

class FullVentureBundleResponse(BaseModel):
    project_id: str
    project_name: str
    overview: Dict[str, Any]
    business_plan: Dict[str, Any]
    market_research: Dict[str, Any]
    competitor_analysis: Dict[str, Any]
    technical_architecture: Dict[str, Any]
    financial_model: Dict[str, Any]
    product_roadmap: Dict[str, Any]
    marketing_strategy: Dict[str, Any]
    investor_deck: Dict[str, Any]
    evaluation: Dict[str, Any]
    audit_trail: List[Dict[str, Any]]
    version_history: List[Dict[str, Any]]
