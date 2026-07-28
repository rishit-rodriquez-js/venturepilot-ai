from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str = Field(..., example="FinPulse AI")
    tagline: Optional[str] = Field(None, example="Autonomous AI CFO for Enterprise SaaS")
    industry: str = Field(..., example="FinTech / Enterprise SaaS")
    target_market: Optional[str] = Field("B2B Enterprise", example="Enterprise SaaS CFOs")
    problem_statement: str = Field(..., example="Manual financial forecasting takes weeks and lacks real-time precision.")
    solution_overview: str = Field(..., example="Autonomous AI agent swarm conducting continuous cash flow optimization.")
    stage: str = Field("validation", example="validation")

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    industry: Optional[str] = None
    target_market: Optional[str] = None
    problem_statement: Optional[str] = None
    solution_overview: Optional[str] = None
    stage: Optional[str] = None
    readiness_score: Optional[int] = None

class ProjectResponse(BaseModel):
    id: str
    owner_id: str
    name: str
    tagline: Optional[str]
    industry: str
    target_market: Optional[str]
    problem_statement: str
    solution_overview: str
    stage: str
    readiness_score: int
    created_at: datetime
    updated_at: datetime
