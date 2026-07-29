from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class PlannerOutput(BaseModel):
    executive_summary: str = Field(..., description="Executive summary of the venture")
    vision: str = Field(..., description="Long term vision statement")
    mission: str = Field(..., description="Core mission statement")
    problem: str = Field(..., description="Problem being solved")
    solution: str = Field(..., description="Solution overview")
    target_customer: str = Field(..., description="Target ICP or market segment")
    pricing: str = Field(..., description="Monetization model or pricing strategy")
    usp: str = Field(..., description="Unique selling proposition")
    version: str = Field("v1.0", description="Document version")
    generated_by: str = Field("Planner Agent", description="Agent identifier")

class TamSamSom(BaseModel):
    tam_inr_cr: float = Field(..., description="Total Addressable Market in INR Crores")
    sam_inr_cr: float = Field(..., description="Serviceable Addressable Market in INR Crores")
    som_inr_cr: float = Field(..., description="Serviceable Obtainable Market in INR Crores")

class RetrievedSource(BaseModel):
    file_name: str
    similarity_score: float
    snippet: str

class ResearchOutput(BaseModel):
    query: str
    tam_sam_som: TamSamSom
    retrieved_sources: List[RetrievedSource] = []
    synthesized_report: str

class CostItem(BaseModel):
    item: str
    amount_inr: float

class Projection3Y(BaseModel):
    year: str
    revenue_lakhs: float
    revenue_crores: float
    fpo_customers: int

class FinanceOutput(BaseModel):
    monthly_burn_rate_inr: float
    runway_months: int
    breakeven_month: str
    seed_ask_inr: str
    cac_inr: float
    ltv_inr: float
    costs: List[CostItem] = []
    projections_3y: List[Projection3Y] = []

class ChannelItem(BaseModel):
    name: str
    category: str
    metrics: str

class MarketingOutput(BaseModel):
    positioning_statement: str
    icp: str
    channels: List[ChannelItem] = []
    content_strategy: str

class CompetitorItem(BaseModel):
    name: str
    funding: str
    strength: str
    weakness: str
    moat: str

class CompetitorOutput(BaseModel):
    competitors: List[CompetitorItem] = []
    gap_analysis: str
    competitive_advantage: str

class TechStack(BaseModel):
    frontend: str
    backend: str
    ai_orchestrator: str
    vector_database: str

class ArchitectureOutput(BaseModel):
    stack: TechStack
    system_topology: str

class RoadmapPhase(BaseModel):
    phase: str
    title: str
    status: str
    timeline: str
    deliverables: List[str] = []

class RoadmapOutput(BaseModel):
    phases: List[RoadmapPhase] = []

class PitchSlide(BaseModel):
    slide_number: int
    title: str
    content: str

class InvestorDeckOutput(BaseModel):
    overall_score: int
    team_score: int
    market_score: int
    product_score: int
    financial_score: int
    slides: List[PitchSlide] = []

class EvaluationOutput(BaseModel):
    faithfulness_score: float
    answer_relevance_score: float
    hallucination_index: float
    overall_score: int
    tokens_consumed: int
    trace_id: Optional[str] = None
    langsmith_trace_url: Optional[str] = None
