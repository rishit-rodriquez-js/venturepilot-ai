import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger("project_service")

class ProjectService:
    def __init__(self):
        supabase_url = settings.SUPABASE_URL
        supabase_key = settings.SUPABASE_ANON_KEY
        if supabase_url and supabase_key:
            try:
                self.supabase: Optional[Client] = create_client(supabase_url, supabase_key)
                logger.info(f"[Supabase Client Initialized] URL: {supabase_url}")
            except Exception as e:
                self.supabase = None
                logger.error(f"[Supabase Init Exception] {e}")
        else:
            self.supabase = None
            logger.warning("[Supabase Client] Credentials missing in configuration!")

    def get_user_projects(self, user_id: str) -> List[Dict[str, Any]]:
        """Strict user data isolation: Return only projects from Supabase database belonging to user_id."""
        if not self.supabase:
            return []
        try:
            res = self.supabase.table("projects").select("*").eq("owner_id", user_id).execute()
            projects = res.data or []
            return [{"project": p} for p in projects]
        except Exception as e:
            logger.error(f"[Supabase get_user_projects Exception] {e}")
            return []

    def create_user_project(self, user_id: str, name: str, industry: str, problem: str, solution: str, funding_goal: str = "₹2.0 Crore", business_model: str = "SaaS Subscription + Marketplace", project_id: Optional[str] = None) -> Dict[str, Any]:
        """Creates a new project row in Supabase database table."""
        p_id = project_id or f"proj-{int(datetime.now().timestamp())}"
        
        proj_row = {
            "id": p_id,
            "owner_id": user_id,
            "user_id": user_id,
            "name": name,
            "tagline": f"{industry} Autonomous AI Operating System",
            "industry": industry,
            "problem_statement": problem,
            "solution_overview": solution,
            "stage": "validation",
            "readiness_score": 85,
            "status": "Running",
            "created_at": datetime.now().isoformat()
        }

        if self.supabase:
            try:
                self.supabase.table("projects").upsert(proj_row).execute()
                logger.info(f"[Supabase UPSERT projects] Created project row: {p_id}")
            except Exception as e:
                logger.error(f"[Supabase create_user_project Exception] {e}")

        return self.get_project_by_id(p_id, user_id)

    def get_project_by_id(self, project_id: str, user_id: str) -> Dict[str, Any]:
        """Reads project row and all module tables directly from Supabase DB."""
        if not self.supabase:
            return self._empty_project_state(project_id, user_id)

        try:
            proj_res = self.supabase.table("projects").select("*").eq("id", project_id).maybe_single().execute()
            proj_data = proj_res.data if proj_res else None

            if not proj_data:
                proj_data = {
                    "id": project_id,
                    "owner_id": user_id,
                    "user_id": user_id,
                    "name": "My Venture",
                    "industry": "Enterprise SaaS",
                    "problem_statement": "Operational friction",
                    "solution_overview": "Autonomous AI Swarm",
                    "stage": "validation",
                    "readiness_score": 85,
                    "status": "Running",
                    "created_at": datetime.now().isoformat()
                }
                try:
                    self.supabase.table("projects").upsert(proj_data).execute()
                except Exception as e:
                    logger.error(f"[Supabase Project Initial Insert Exception] {e}")

            bp_res = self.supabase.table("business_plans").select("*").eq("project_id", project_id).maybe_single().execute()
            mr_res = self.supabase.table("market_research").select("*").eq("project_id", project_id).maybe_single().execute()
            ca_res = self.supabase.table("competitor_analysis").select("*").eq("project_id", project_id).maybe_single().execute()
            ta_res = self.supabase.table("technical_architecture").select("*").eq("project_id", project_id).maybe_single().execute()
            fm_res = self.supabase.table("financial_models").select("*").eq("project_id", project_id).maybe_single().execute()
            pr_res = self.supabase.table("product_roadmaps").select("*").eq("project_id", project_id).maybe_single().execute()
            ms_res = self.supabase.table("marketing_strategies").select("*").eq("project_id", project_id).maybe_single().execute()
            id_res = self.supabase.table("investor_decks").select("*").eq("project_id", project_id).maybe_single().execute()
            docs_res = self.supabase.table("documents").select("*").eq("project_id", project_id).execute()
            ev_res = self.supabase.table("evaluations").select("*").eq("project_id", project_id).maybe_single().execute()
            audit_res = self.supabase.table("audit_logs").select("*").eq("project_id", project_id).order("created_at", desc=True).execute()

            return {
                "project": proj_data,
                "business_plan": bp_res.data if bp_res and bp_res.data else {},
                "market_research": mr_res.data if mr_res and mr_res.data else {},
                "competitor_analysis": ca_res.data if ca_res and ca_res.data else {},
                "technical_architecture": ta_res.data if ta_res and ta_res.data else {},
                "financials": fm_res.data if fm_res and fm_res.data else {},
                "product_roadmap": pr_res.data if pr_res and pr_res.data else {},
                "marketing_strategy": ms_res.data if ms_res and ms_res.data else {},
                "investor_deck": id_res.data if id_res and id_res.data else {},
                "documents": docs_res.data if docs_res and docs_res.data else [],
                "evaluation": ev_res.data if ev_res and ev_res.data else {},
                "audit_trail": audit_res.data if audit_res and audit_res.data else []
            }
        except Exception as e:
            logger.error(f"[Supabase get_project_by_id Exception] {e}")
            return self._empty_project_state(project_id, user_id)

    def save_project_state(self, project_id: str, state: Dict[str, Any]) -> None:
        """UPSERTs workspace modules into Supabase DB tables."""
        if not self.supabase:
            return

        try:
            if "project" in state and isinstance(state["project"], dict) and state["project"]:
                self.supabase.table("projects").upsert(state["project"]).execute()

            if "business_plan" in state and isinstance(state["business_plan"], dict) and state["business_plan"]:
                bp = {**state["business_plan"], "project_id": project_id}
                self.supabase.table("business_plans").upsert(bp).execute()

            if "market_research" in state and isinstance(state["market_research"], dict) and state["market_research"]:
                mr = {**state["market_research"], "project_id": project_id}
                self.supabase.table("market_research").upsert(mr).execute()

            if "competitor_analysis" in state and isinstance(state["competitor_analysis"], dict) and state["competitor_analysis"]:
                ca = {**state["competitor_analysis"], "project_id": project_id}
                self.supabase.table("competitor_analysis").upsert(ca).execute()

            if "technical_architecture" in state and isinstance(state["technical_architecture"], dict) and state["technical_architecture"]:
                ta = {**state["technical_architecture"], "project_id": project_id}
                self.supabase.table("technical_architecture").upsert(ta).execute()

            if "financials" in state and isinstance(state["financials"], dict) and state["financials"]:
                fm = {**state["financials"], "project_id": project_id}
                self.supabase.table("financial_models").upsert(fm).execute()

            if "product_roadmap" in state and isinstance(state["product_roadmap"], dict) and state["product_roadmap"]:
                pr = {**state["product_roadmap"], "project_id": project_id}
                self.supabase.table("product_roadmaps").upsert(pr).execute()

            if "marketing_strategy" in state and isinstance(state["marketing_strategy"], dict) and state["marketing_strategy"]:
                ms = {**state["marketing_strategy"], "project_id": project_id}
                self.supabase.table("marketing_strategies").upsert(ms).execute()

            if "investor_deck" in state and isinstance(state["investor_deck"], dict) and state["investor_deck"]:
                id_data = {**state["investor_deck"], "project_id": project_id}
                self.supabase.table("investor_decks").upsert(id_data).execute()

            if "evaluation" in state and isinstance(state["evaluation"], dict) and state["evaluation"]:
                ev = {**state["evaluation"], "project_id": project_id}
                self.supabase.table("evaluations").upsert(ev).execute()

            if "audit_trail" in state and isinstance(state["audit_trail"], list) and state["audit_trail"]:
                latest_log = state["audit_trail"][0]
                if isinstance(latest_log, dict):
                    log_entry = {**latest_log, "project_id": project_id}
                    self.supabase.table("audit_logs").upsert(log_entry).execute()

            logger.info(f"[Supabase save_project_state] UPSERTed project modules for: {project_id}")
        except Exception as e:
            logger.error(f"[Supabase save_project_state Exception] {e}")

    def _empty_project_state(self, project_id: str, user_id: str) -> Dict[str, Any]:
        return {
            "project": {
                "id": project_id,
                "owner_id": user_id,
                "user_id": user_id,
                "name": "My Venture",
                "industry": "Enterprise SaaS",
                "problem_statement": "Operational friction",
                "solution_overview": "Autonomous AI Swarm",
                "stage": "validation",
                "readiness_score": 85,
                "status": "Running",
                "created_at": datetime.now().isoformat()
            },
            "business_plan": {},
            "market_research": {},
            "competitor_analysis": {},
            "technical_architecture": {},
            "financials": {},
            "product_roadmap": {},
            "marketing_strategy": {},
            "investor_deck": {},
            "documents": [],
            "evaluation": {},
            "audit_trail": []
        }

project_service = ProjectService()
