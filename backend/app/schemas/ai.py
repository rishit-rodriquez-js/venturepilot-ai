from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class CoFounderPromptRequest(BaseModel):
    project_id: str
    prompt: str = Field(..., example="Analyze our pricing model and evaluate TAM/SAM/SOM for Enterprise SaaS.")

class LeanCanvasData(BaseModel):
    problem: List[str]
    solution: List[str]
    key_metrics: List[str]
    value_proposition: List[str]
    unfair_advantage: List[str]
    channels: List[str]
    customer_segments: List[str]
    cost_structure: List[str]
    revenue_streams: List[str]

class MarketIntelData(BaseModel):
    tam_billions: float
    sam_billions: float
    som_millions: float
    competitors: List[Dict[str, Any]]
    industry_trends: List[str]
    swot_analysis: Dict[str, List[str]]

class TechArchitectureData(BaseModel):
    frontend_stack: List[str]
    backend_stack: List[str]
    database_stack: List[str]
    ai_stack: List[str]
    infrastructure_stack: List[str]
    system_diagram_mermaid: str
    security_posture: List[str]

class FinancialForecastData(BaseModel):
    mrr_target_y1: float
    arr_target_y3: float
    cac_usd: float
    ltv_usd: float
    monthly_burn_rate: float
    runway_months: int
    financial_model: Dict[str, Any]

class InvestorReadinessData(BaseModel):
    overall_score: int
    team_score: int
    market_score: int
    product_score: int
    financial_score: int
    go_to_market_strategy: List[str]
    pitch_deck_slides: List[Dict[str, str]]
    investor_qa_pairs: List[Dict[str, str]]

class FullAIResponse(BaseModel):
    project_id: str
    cofounder_advice: str
    lean_canvas: LeanCanvasData
    market_intel: MarketIntelData
    tech_architecture: TechArchitectureData
    financials: FinancialForecastData
    investor_readiness: InvestorReadinessData
