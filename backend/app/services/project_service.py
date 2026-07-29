from typing import Dict, Any, List, Optional
from datetime import datetime

class ProjectService:
    def __init__(self):
        # Primary storage: Dict[project_id, ProjectState]
        self.projects_db: Dict[str, Dict[str, Any]] = {}
        # Mapping: Dict[user_id, List[project_id]]
        self.user_projects_map: Dict[str, List[str]] = {}

    def get_template_project(self, project_id: str, user_id: str, name: str, industry: str, problem: str, solution: str) -> Dict[str, Any]:
        return {
            "project": {
                "id": project_id,
                "owner_id": user_id,
                "user_id": user_id,
                "name": name,
                "tagline": f"{industry} Autonomous AI Operating System",
                "industry": industry,
                "problem_statement": problem,
                "solution_overview": solution,
                "stage": "validation",
                "readiness_score": 92,
                "status": "Running",
                "created_at": datetime.now().isoformat()
            },
            "founder": {
                "id": user_id,
                "name": "Founder",
                "email": "founder@venturepilot.ai",
                "role": "Founder & CEO"
            },
            "overview": {
                "health_scores": {"validation": 92, "market": 88, "finance": 85, "investor": 92},
                "timeline": [
                    {"stage": "Idea Created", "progress": 100, "status": "Completed", "owner": "Founder", "confidence": 98, "updated": "Today"},
                    {"stage": "Validation", "progress": 85, "status": "Active", "owner": "AI Co-Founder", "confidence": 92, "updated": "Today"}
                ]
            },
            "business_plan": {
                "executive_summary": f"{name} is an enterprise venture in {industry} solving '{problem}' with '{solution}'.",
                "vision": f"Transforming {industry} with autonomous AI agent workflows.",
                "mission": "Delivering investor-grade readiness and strategic automation.",
                "problem": problem,
                "solution": solution,
                "target_customer": "Enterprise Customers & Tech Hubs",
                "pricing": "₹1,499/month per workspace",
                "usp": "Proprietary LangGraph workflow engine with RAG memory.",
                "version": "v1.0",
                "generated_by": "Planner Agent",
                "sources": []
            },
            "market_research": {
                "query": f"Analyze {name} {industry} market size.",
                "tam_sam_som": {"tam_inr_cr": 240000, "sam_inr_cr": 45000, "som_inr_cr": 1800},
                "retrieved_sources": []
            },
            "financials": {
                "monthly_burn_rate_inr": 250000,
                "runway_months": 18,
                "breakeven_month": "Month 12",
                "seed_ask_inr": "₹2.0 Crore",
                "costs": [
                    {"item": "Incorporation & Compliance", "amount_inr": 20000},
                    {"item": "Cloud Compute & Supabase", "amount_inr": 30000},
                    {"item": "Engineering Salaries", "amount_inr": 200000}
                ]
            },
            "investor_deck": {
                "overall_score": 92,
                "team_score": 90,
                "market_score": 94,
                "product_score": 92,
                "financial_score": 90,
                "slides": [
                    {"slide_number": 1, "title": "1. Cover", "content": f"{name} — {industry} Enterprise AI Operating System"},
                    {"slide_number": 2, "title": "2. Problem", "content": problem},
                    {"slide_number": 3, "title": "3. Solution", "content": solution},
                    {"slide_number": 4, "title": "4. Funding Ask", "content": "Seeking ₹2.0 Crore Seed Round."}
                ]
            },
            "documents": [],
            "audit_trail": []
        }

    def get_user_projects(self, user_id: str) -> List[Dict[str, Any]]:
        """Strict user data isolation: Return only projects belonging to user_id (empty list for new users)."""
        project_ids = self.user_projects_map.get(user_id, [])
        return [self.projects_db[pid] for pid in project_ids if pid in self.projects_db]

    def create_user_project(self, user_id: str, name: str, industry: str, problem: str, solution: str, funding_goal: str = "₹2.0 Crore", business_model: str = "SaaS Subscription + Marketplace", project_id: Optional[str] = None) -> Dict[str, Any]:
        p_id = project_id or f"proj-{int(datetime.now().timestamp())}"
        state = self.get_template_project(p_id, user_id, name, industry, problem, solution)

        state["financials"]["seed_ask_inr"] = funding_goal
        state["investor_deck"]["slides"] = [
            {"slide_number": 1, "title": "1. Cover", "content": f"{name} — {industry} Enterprise AI Operating System"},
            {"slide_number": 2, "title": "2. Problem", "content": problem},
            {"slide_number": 3, "title": "3. Solution", "content": solution},
            {"slide_number": 4, "title": "4. Market Size", "content": f"{industry} global addressable market opportunity TAM: ₹24,000 Cr."},
            {"slide_number": 5, "title": "5. Business Model", "content": business_model},
            {"slide_number": 6, "title": "6. Traction", "content": "Initial pilot agreements and customer interview validation."},
            {"slide_number": 7, "title": "7. Financials", "content": f"Targeting {funding_goal} funding with strong unit economics."},
            {"slide_number": 8, "title": "8. Competition & Moat", "content": "Proprietary AI workflow orchestration engine."},
            {"slide_number": 9, "title": "9. Product Roadmap", "content": "MVP launch and strategic pilot expansion."},
            {"slide_number": 10, "title": "10. Funding Ask", "content": f"Seeking {funding_goal} for product engineering and market expansion."}
        ]

        self.projects_db[p_id] = state
        if user_id not in self.user_projects_map:
            self.user_projects_map[user_id] = []
        if p_id not in self.user_projects_map[user_id]:
            self.user_projects_map[user_id].insert(0, p_id)
        return state

    def get_project_by_id(self, project_id: str, user_id: str) -> Dict[str, Any]:
        if project_id in self.projects_db:
            return self.projects_db[project_id]

        state = self.get_template_project(project_id, user_id, "My Venture", "Enterprise SaaS", "Manual processes", "AI Solution")
        self.projects_db[project_id] = state
        if user_id not in self.user_projects_map:
            self.user_projects_map[user_id] = []
        if project_id not in self.user_projects_map[user_id]:
            self.user_projects_map[user_id].insert(0, project_id)
        return state

    def save_project_state(self, project_id: str, state: Dict[str, Any]) -> None:
        self.projects_db[project_id] = state

project_service = ProjectService()
