import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger("project_service")

TABLE_ALLOWED_COLUMNS = {
    "projects": {"id", "owner_id", "user_id", "name", "tagline", "industry", "problem_statement", "solution_overview", "stage", "readiness_score", "status", "created_at"},
    "business_plans": {"id", "project_id", "executive_summary", "vision", "mission", "problem", "solution", "target_customer", "pricing", "usp", "version", "generated_by", "sources", "created_at"},
    "market_research": {"id", "project_id", "query", "tam_sam_som", "retrieved_sources", "synthesized_report", "created_at"},
    "competitor_analysis": {"id", "project_id", "competitors", "gap_analysis", "competitive_advantage", "created_at"},
    "technical_architecture": {"id", "project_id", "stack", "system_topology", "created_at"},
    "financial_models": {"id", "project_id", "monthly_burn_rate_inr", "runway_months", "breakeven_month", "seed_ask_inr", "cac_inr", "ltv_inr", "costs", "projections_3y", "created_at"},
    "product_roadmaps": {"id", "project_id", "phases", "created_at"},
    "marketing_strategies": {"id", "project_id", "positioning_statement", "icp", "channels", "content_strategy", "created_at"},
    "investor_decks": {"id", "project_id", "overall_score", "team_score", "market_score", "product_score", "financial_score", "slides", "created_at"},
    "evaluations": {"id", "project_id", "faithfulness_score", "answer_relevance_score", "hallucination_index", "overall_score", "tokens_consumed", "trace_id", "langsmith_trace_url", "created_at"},
    "audit_logs": {"id", "project_id", "timestamp", "agent", "action", "status", "latency", "tokens", "trace_id", "created_at"}
}

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

    def _filter_payload_for_table(self, table_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Validates and filters payload keys against the Supabase table column schema."""
        allowed = TABLE_ALLOWED_COLUMNS.get(table_name)
        if not allowed:
            return payload

        filtered = {}
        removed_keys = []
        for k, v in payload.items():
            if k in allowed:
                filtered[k] = v
            else:
                removed_keys.append(k)

        if removed_keys:
            logger.info(f"[Schema Filter] Removed non-schema keys for table '{table_name}': {removed_keys}")
        return filtered

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
                filtered_proj = self._filter_payload_for_table("projects", proj_row)
                self.supabase.table("projects").upsert(filtered_proj).execute()
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
                    "name": f"Venture {project_id[:8]}",
                    "industry": "Technology",
                    "problem_statement": "Strategic execution friction",
                    "solution_overview": "Autonomous Multi-Agent AI System",
                    "stage": "validation",
                    "readiness_score": 85,
                    "status": "Running",
                    "created_at": datetime.now().isoformat()
                }
                try:
                    filtered_proj = self._filter_payload_for_table("projects", proj_data)
                    self.supabase.table("projects").upsert(filtered_proj).execute()
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

            ms_data = ms_res.data if ms_res and ms_res.data else {}
            if ms_data and "positioning_statement" in ms_data:
                ms_data["positioning"] = ms_data["positioning_statement"]

            return {
                "project": proj_data,
                "business_plan": bp_res.data if bp_res and bp_res.data else {},
                "market_research": mr_res.data if mr_res and mr_res.data else {},
                "competitor_analysis": ca_res.data if ca_res and ca_res.data else {},
                "technical_architecture": ta_res.data if ta_res and ta_res.data else {},
                "financials": fm_res.data if fm_res and fm_res.data else {},
                "financial_models": fm_res.data if fm_res and fm_res.data else {},
                "product_roadmap": pr_res.data if pr_res and pr_res.data else {},
                "product_roadmaps": pr_res.data if pr_res and pr_res.data else {},
                "marketing_strategy": ms_data,
                "marketing_strategies": ms_data,
                "investor_deck": id_res.data if id_res and id_res.data else {},
                "investor_decks": id_res.data if id_res and id_res.data else {},
                "documents": docs_res.data if docs_res and docs_res.data else [],
                "evaluations": ev_res.data if ev_res and ev_res.data else {},
                "audit_trail": audit_res.data if audit_res and audit_res.data else [],
                "audit_logs": audit_res.data if audit_res and audit_res.data else []
            }
        except Exception as e:
            logger.error(f"[Supabase get_project_by_id Exception] {e}")
            return self._empty_project_state(project_id, user_id)

    def save_project_state(self, project_id: str, state: Dict[str, Any]) -> None:
        """UPSERTs workspace modules into Supabase DB tables with schema column validation and key mappings."""
        if not self.supabase:
            return

        try:
            if "project" in state and isinstance(state["project"], dict) and state["project"]:
                payload = self._filter_payload_for_table("projects", state["project"])
                self.supabase.table("projects").upsert(payload).execute()

            if "business_plan" in state and isinstance(state["business_plan"], dict) and state["business_plan"]:
                bp = {**state["business_plan"], "project_id": project_id}
                payload = self._filter_payload_for_table("business_plans", bp)
                self.supabase.table("business_plans").upsert(payload).execute()

            if "market_research" in state and isinstance(state["market_research"], dict) and state["market_research"]:
                mr = {**state["market_research"], "project_id": project_id}
                payload = self._filter_payload_for_table("market_research", mr)
                self.supabase.table("market_research").upsert(payload).execute()

            if "competitor_analysis" in state and isinstance(state["competitor_analysis"], dict) and state["competitor_analysis"]:
                ca = {**state["competitor_analysis"], "project_id": project_id}
                payload = self._filter_payload_for_table("competitor_analysis", ca)
                self.supabase.table("competitor_analysis").upsert(payload).execute()

            if "technical_architecture" in state and isinstance(state["technical_architecture"], dict) and state["technical_architecture"]:
                ta = {**state["technical_architecture"], "project_id": project_id}
                payload = self._filter_payload_for_table("technical_architecture", ta)
                self.supabase.table("technical_architecture").upsert(payload).execute()

            if "financials" in state and isinstance(state["financials"], dict) and state["financials"]:
                fm = {**state["financials"], "project_id": project_id}
                payload = self._filter_payload_for_table("financial_models", fm)
                self.supabase.table("financial_models").upsert(payload).execute()

            if "product_roadmap" in state and isinstance(state["product_roadmap"], dict) and state["product_roadmap"]:
                pr = {**state["product_roadmap"], "project_id": project_id}
                payload = self._filter_payload_for_table("product_roadmaps", pr)
                self.supabase.table("product_roadmaps").upsert(payload).execute()

            if "marketing_strategy" in state and isinstance(state["marketing_strategy"], dict) and state["marketing_strategy"]:
                ms = {**state["marketing_strategy"], "project_id": project_id}
                # Align positioning -> positioning_statement to match Supabase database column schema
                if "positioning" in ms and "positioning_statement" not in ms:
                    ms["positioning_statement"] = ms.pop("positioning")
                payload = self._filter_payload_for_table("marketing_strategies", ms)
                self.supabase.table("marketing_strategies").upsert(payload).execute()

            if "investor_deck" in state and isinstance(state["investor_deck"], dict) and state["investor_deck"]:
                id_data = {**state["investor_deck"], "project_id": project_id}
                payload = self._filter_payload_for_table("investor_decks", id_data)
                self.supabase.table("investor_decks").upsert(payload).execute()

            if "evaluation" in state and isinstance(state["evaluation"], dict) and state["evaluation"]:
                ev = {**state["evaluation"], "project_id": project_id}
                payload = self._filter_payload_for_table("evaluations", ev)
                self.supabase.table("evaluations").upsert(payload).execute()

            if "audit_trail" in state and isinstance(state["audit_trail"], list) and state["audit_trail"]:
                latest_log = state["audit_trail"][0]
                if isinstance(latest_log, dict):
                    log_entry = {**latest_log, "project_id": project_id}
                    payload = self._filter_payload_for_table("audit_logs", log_entry)
                    self.supabase.table("audit_logs").upsert(payload).execute()

            logger.info(f"[Supabase save_project_state] Successfully validated and UPSERTed project modules for: {project_id}")
        except Exception as e:
            logger.error(f"[Supabase save_project_state Exception] {e}")

    def _empty_project_state(self, project_id: str, user_id: str) -> Dict[str, Any]:
        return {
            "project": {
                "id": project_id,
                "owner_id": user_id,
                "user_id": user_id,
                "name": f"Venture {project_id[:8]}",
                "industry": "Technology",
                "problem_statement": "Strategic execution friction",
                "solution_overview": "Autonomous Multi-Agent AI System",
                "stage": "validation",
                "readiness_score": 80,
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
