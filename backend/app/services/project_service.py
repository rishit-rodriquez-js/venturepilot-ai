from typing import Dict, Any, List, Optional
from datetime import datetime

class ProjectService:
    def __init__(self):
        # Store projects per user_id: Dict[user_id, List[ProjectState]]
        self.user_projects_db: Dict[str, List[Dict[str, Any]]] = {}

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
                "readiness_score": 75,
                "status": "Running",
                "created_at": datetime.now().isoformat()
            },
            "founder": {
                "id": user_id,
                "name": "Founder",
                "email": "you@example.com",
                "role": "Founder & CEO"
            },
            "overview": {
                "health_scores": {"validation": 80, "market": 75, "finance": 70, "investor": 75},
                "timeline": [
                    {"stage": "Idea Created", "progress": 100, "status": "Completed", "owner": "Founder", "confidence": 98, "updated": "Today"},
                    {"stage": "Validation", "progress": 75, "status": "Active", "owner": "AI Co-Founder", "confidence": 85, "updated": "Today"}
                ]
            },
            "business_plan": {
                "executive_summary": f"{name} is an enterprise venture in {industry} addressing '{problem}' using '{solution}'.",
                "vision": f"Transform {industry} with autonomous AI workflows.",
                "mission": "Deliver institution-grade investor readiness tools.",
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
                "tam_sam_som": {"tam_inr_cr": 100000, "sam_inr_cr": 25000, "som_inr_cr": 1000},
                "retrieved_sources": []
            },
            "financials": {
                "monthly_burn_rate_inr": 250000,
                "runway_months": 18,
                "breakeven_month": "Month 12",
                "seed_ask_inr": "₹1.0 Crore",
                "costs": [
                    {"item": "Incorporation & Compliance", "amount_inr": 20000},
                    {"item": "Cloud Compute & Supabase", "amount_inr": 30000},
                    {"item": "Engineering Salaries", "amount_inr": 200000}
                ]
            },
            "investor_deck": {
                "overall_score": 78,
                "team_score": 80,
                "market_score": 82,
                "product_score": 75,
                "financial_score": 75,
                "slides": [
                    {"slide_number": 1, "title": "1. Cover", "content": f"{name} — Enterprise AI Startup OS"},
                    {"slide_number": 2, "title": "2. Problem", "content": problem},
                    {"slide_number": 3, "title": "3. Solution", "content": solution},
                    {"slide_number": 4, "title": "4. Funding Ask", "content": "Seeking ₹1.0 Crore Seed Round."}
                ]
            },
            "documents": [],
            "audit_trail": [
                {"timestamp": datetime.now().strftime("%H:%M:%S"), "agent": "Planner Agent", "action": f"PROJECT_CREATED: {name}", "status": "Completed", "latency": "1.0s", "tokens": 1000, "trace_id": f"ls_{int(datetime.now().timestamp())}"}
            ]
        }

    def get_user_projects(self, user_id: str) -> List[Dict[str, Any]]:
        """Strict user data isolation: Return only projects belonging to user_id (empty list for new users)."""
        return self.user_projects_db.get(user_id, [])

    def create_user_project(self, user_id: str, name: str, industry: str, problem: str, solution: str, funding_goal: str = "₹2.0 Crore", business_model: str = "SaaS Subscription + Marketplace") -> Dict[str, Any]:
        p_id = f"proj-{int(datetime.now().timestamp())}"
        state = self.get_template_project(p_id, user_id, name, industry, problem, solution)

        state["financials"]["seed_ask_inr"] = funding_goal
        state["investor_deck"]["slides"] = [
            {"slide_number": 1, "title": "1. Cover", "content": f"{name} — {industry} Enterprise AI Operating System"},
            {"slide_number": 2, "title": "2. Problem", "content": problem},
            {"slide_number": 3, "title": "3. Solution", "content": solution},
            {"slide_number": 4, "title": "4. Market Size", "content": f"{industry} global addressable market opportunity."},
            {"slide_number": 5, "title": "5. Business Model", "content": business_model},
            {"slide_number": 6, "title": "6. Traction", "content": "Initial pilot agreements and customer interview validation."},
            {"slide_number": 7, "title": "7. Financials", "content": f"Targeting {funding_goal} funding with strong unit economics."},
            {"slide_number": 8, "title": "8. Competition & Moat", "content": "Proprietary AI workflow orchestration engine."},
            {"slide_number": 9, "title": "9. Product Roadmap", "content": "MVP launch and strategic pilot expansion."},
            {"slide_number": 10, "title": "10. Funding Ask", "content": f"Seeking {funding_goal} for product engineering and market expansion."}
        ]

        if user_id not in self.user_projects_db:
            self.user_projects_db[user_id] = []
        self.user_projects_db[user_id].insert(0, state)
        return state

    def get_project_by_id(self, project_id: str, user_id: str) -> Dict[str, Any]:
        user_projects = self.get_user_projects(user_id)
        for proj in user_projects:
            if proj["project"]["id"] == project_id:
                return proj
        # Fallback to template if requested directly by authorized user
        return self.get_template_project(project_id, user_id, "New Venture", "Enterprise SaaS", "Core friction", "AI Solution")

project_service = ProjectService()
