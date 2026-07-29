"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

// Workspace Module Components
import { OverviewTab } from '@/components/workspace/OverviewTab';
import { BusinessPlanTab } from '@/components/workspace/BusinessPlanTab';
import { MarketResearchRAGTab } from '@/components/workspace/MarketResearchRAGTab';
import { CompetitorAnalysisTab } from '@/components/workspace/CompetitorAnalysisTab';
import { TechnicalArchitectureView } from '@/components/TechnicalArchitectureView';
import { FinancialModelTab } from '@/components/workspace/FinancialModelTab';
import { ProductRoadmapTab } from '@/components/workspace/ProductRoadmapTab';
import { MarketingStrategyTab } from '@/components/workspace/MarketingStrategyTab';
import { InvestorDeckTab } from '@/components/workspace/InvestorDeckTab';
import { DownloadsTab } from '@/components/workspace/DownloadsTab';
import { EvaluationTab } from '@/components/workspace/EvaluationTab';
import { AuditTrailTab } from '@/components/workspace/AuditTrailTab';
import { VersionHistoryTab } from '@/components/workspace/VersionHistoryTab';
import { AICopilotBar } from '@/components/workspace/AICopilotBar';
import { CommandPalette } from '@/components/CommandPalette';

import { useVentureStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/api';
import { Award, ShieldCheck, RefreshCw } from 'lucide-react';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { user, setUser, activeProject, setActiveProject } = useVentureStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Source of Truth: All workspace tables loaded directly from Supabase DB
  const [workspaceData, setWorkspaceData] = useState<{
    project: any;
    business_plan: any;
    market_research: any;
    competitor_analysis: any;
    technical_architecture: any;
    financial_models: any;
    product_roadmaps: any;
    marketing_strategies: any;
    investor_decks: any;
    documents: any[];
    evaluations: any;
    audit_logs: any[];
  }>({
    project: null,
    business_plan: null,
    market_research: null,
    competitor_analysis: null,
    technical_architecture: null,
    financial_models: null,
    product_roadmaps: null,
    marketing_strategies: null,
    investor_decks: null,
    documents: [],
    evaluations: null,
    audit_logs: []
  });

  const refetchWorkspaceData = async (incomingState?: any) => {
    if (!projectId) return;

    if (incomingState) {
      if (incomingState.project) {
        setActiveProject(incomingState.project);
      }
      setWorkspaceData((prev) => ({
        ...prev,
        project: incomingState.project || prev.project,
        business_plan: incomingState.business_plan || prev.business_plan,
        market_research: incomingState.market_research || prev.market_research,
        competitor_analysis: incomingState.competitor_analysis || prev.competitor_analysis,
        technical_architecture: incomingState.technical_architecture || prev.technical_architecture,
        financial_models: incomingState.financials || incomingState.financial_models || prev.financial_models,
        product_roadmaps: incomingState.product_roadmap || incomingState.product_roadmaps || prev.product_roadmaps,
        marketing_strategies: incomingState.marketing_strategy || incomingState.marketing_strategies || prev.marketing_strategies,
        investor_decks: incomingState.investor_deck || incomingState.investor_decks || prev.investor_decks,
        documents: incomingState.documents || prev.documents,
        evaluations: incomingState.evaluations || prev.evaluations,
        audit_logs: incomingState.audit_trail || incomingState.audit_logs || prev.audit_logs
      }));
      return;
    }

    try {
      const [
        { data: proj },
        { data: bp },
        { data: mr },
        { data: ca },
        { data: ta },
        { data: fm },
        { data: pr },
        { data: ms },
        { data: id },
        { data: docs },
        { data: ev },
        { data: audit }
      ] = await Promise.all([
        supabase.from('projects').select('*').eq('id', projectId).maybeSingle(),
        supabase.from('business_plans').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('market_research').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('competitor_analysis').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('technical_architecture').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('financial_models').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('product_roadmaps').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('marketing_strategies').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('investor_decks').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('documents').select('*').eq('project_id', projectId),
        supabase.from('evaluations').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('audit_logs').select('*').eq('project_id', projectId).order('timestamp', { ascending: false })
      ]);

      if (proj) {
        setActiveProject(proj);
      }

      setWorkspaceData((prev) => ({
        ...prev,
        project: proj || prev.project,
        business_plan: bp,
        market_research: mr,
        competitor_analysis: ca,
        technical_architecture: ta,
        financial_models: fm,
        product_roadmaps: pr,
        marketing_strategies: ms,
        investor_decks: id,
        documents: docs || [],
        evaluations: ev,
        audit_logs: audit || []
      }));
    } catch (e) {
      console.error("[Workspace Refetch Failed]", e);
    }
  };

  useEffect(() => {
    const validateAccessAndLoad = async () => {
      setCheckingAuth(true);
      console.log("[Workspace Page Loaded] Target Project ID:", projectId);
      try {
        const { data: authData, error: authErr } = await supabase.auth.getUser();
        if (authErr || !authData?.user) {
          console.error("[Workspace Auth Failed] User not logged in:", authErr);
          router.push('/login');
          return;
        }

        const authUser = authData.user;
        if (!user) {
          setUser({
            id: authUser.id,
            email: authUser.email || 'you@example.com',
            full_name: authUser.user_metadata?.full_name || 'Founder',
            role: 'founder',
            company: authUser.user_metadata?.company || 'My Venture'
          });
        }

        if (projectId) {
          const { data: dbProj, error: dbProjErr } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .maybeSingle();

          let fetchedProj = dbProj;

          if (dbProjErr || !dbProj) {
            try {
              const apiRes = await apiClient.get(`/projects/${projectId}`, {
                headers: { Authorization: `Bearer demo-jwt-${authUser.id}` }
              });
              if (apiRes.data) {
                fetchedProj = apiRes.data.project || apiRes.data;
              }
            } catch (e) {}
          }

          if (!fetchedProj) {
            alert(`Project '${projectId}' was not found in database.`);
            router.push('/dashboard');
            return;
          }

          if (fetchedProj.owner_id && fetchedProj.owner_id !== authUser.id) {
            alert("Unauthorized workspace access.");
            router.push('/dashboard');
            return;
          }

          setActiveProject(fetchedProj);

          const [
            { data: bp },
            { data: mr },
            { data: ca },
            { data: ta },
            { data: fm },
            { data: pr },
            { data: ms },
            { data: id },
            { data: docs },
            { data: ev },
            { data: audit }
          ] = await Promise.all([
            supabase.from('business_plans').select('*').eq('project_id', projectId).maybeSingle(),
            supabase.from('market_research').select('*').eq('project_id', projectId).maybeSingle(),
            supabase.from('competitor_analysis').select('*').eq('project_id', projectId).maybeSingle(),
            supabase.from('technical_architecture').select('*').eq('project_id', projectId).maybeSingle(),
            supabase.from('financial_models').select('*').eq('project_id', projectId).maybeSingle(),
            supabase.from('product_roadmaps').select('*').eq('project_id', projectId).maybeSingle(),
            supabase.from('marketing_strategies').select('*').eq('project_id', projectId).maybeSingle(),
            supabase.from('investor_decks').select('*').eq('project_id', projectId).maybeSingle(),
            supabase.from('documents').select('*').eq('project_id', projectId),
            supabase.from('evaluations').select('*').eq('project_id', projectId).maybeSingle(),
            supabase.from('audit_logs').select('*').eq('project_id', projectId).order('timestamp', { ascending: false })
          ]);

          setWorkspaceData({
            project: fetchedProj,
            business_plan: bp,
            market_research: mr,
            competitor_analysis: ca,
            technical_architecture: ta,
            financial_models: fm,
            product_roadmaps: pr,
            marketing_strategies: ms,
            investor_decks: id,
            documents: docs || [],
            evaluations: ev,
            audit_logs: audit || []
          });
        }
      } catch (err: any) {
        console.error("[Workspace Load Exception]", err);
        alert(`Failed to load workspace: ${err?.message || 'Unknown error'}`);
        router.push('/dashboard');
      } finally {
        setCheckingAuth(false);
      }
    };

    validateAccessAndLoad();
  }, [projectId, router, setUser, setActiveProject]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center bg-executive-mesh">
        <div className="p-8 rounded-[28px] bg-white border border-slate-200 shadow-xl space-y-4 text-center max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#5B5CEB] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#5B5CEB]/25">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <div className="text-base font-extrabold text-[#0F172A]">Authorizing Workspace Access...</div>
            <p className="text-xs text-[#64748B]">Verifying user ownership and RLS security policies.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentProj = workspaceData.project || activeProject;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#0F172A] flex flex-col bg-executive-mesh relative">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] pb-28">
          {/* Workspace Banner */}
          <div className="glass-exec-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#26C281] border border-emerald-200">
                  {currentProj?.industry || 'Venture Industry'}
                </span>
                <span className="text-[10px] text-[#64748B] font-mono">ID: {currentProj?.id}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0F172A]">{currentProj?.name || 'Venture Workspace'}</h1>
              <p className="text-xs text-[#64748B] mt-1">{currentProj?.tagline || currentProj?.solution_overview}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-[#5B5CEB] text-xs font-extrabold">
                <Award className="w-4 h-4 text-[#5B5CEB]" />
                <span>Investor Readiness: {workspaceData.investor_decks?.overall_score || currentProj?.readiness_score || 85}/100</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#26C281] text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#26C281]" />
                <span>Isolated Workspace</span>
              </div>
            </div>
          </div>

          {activeTab === 'overview' && <OverviewTab project={currentProj} aiData={workspaceData} />}
          {activeTab === 'business_plan' && <BusinessPlanTab data={workspaceData.business_plan} projectId={projectId} onRefetch={refetchWorkspaceData} />}
          {activeTab === 'market_research' && <MarketResearchRAGTab projectId={projectId} data={workspaceData.market_research} documents={workspaceData.documents} onRefetch={refetchWorkspaceData} />}
          {activeTab === 'competitor_analysis' && <CompetitorAnalysisTab data={workspaceData.competitor_analysis} />}
          {activeTab === 'technical_architecture' && <TechnicalArchitectureView data={workspaceData.technical_architecture} projectId={projectId} onRefetch={refetchWorkspaceData} />}
          {activeTab === 'financial_model' && <FinancialModelTab data={workspaceData.financial_models} projectId={projectId} onRefetch={refetchWorkspaceData} />}
          {activeTab === 'product_roadmap' && <ProductRoadmapTab data={workspaceData.product_roadmaps} projectId={projectId} onRefetch={refetchWorkspaceData} />}
          {activeTab === 'marketing_strategy' && <MarketingStrategyTab data={workspaceData.marketing_strategies} projectId={projectId} onRefetch={refetchWorkspaceData} />}
          {activeTab === 'investor_deck' && <InvestorDeckTab projectId={projectId} data={workspaceData.investor_decks} onRefetch={refetchWorkspaceData} />}
          {activeTab === 'downloads' && <DownloadsTab projectId={projectId} data={workspaceData} />}
          {activeTab === 'evaluation' && <EvaluationTab projectId={projectId} data={workspaceData.evaluations} />}
          {activeTab === 'audit_trail' && <AuditTrailTab logs={workspaceData.audit_logs} />}
          {activeTab === 'version_history' && <VersionHistoryTab projectId={projectId} />}
        </main>
      </div>

      {/* Action Command Palette */}
      <CommandPalette
        onNavigateTab={(tab) => setActiveTab(tab)}
        onExportPackage={() => setActiveTab('downloads')}
      />

      {/* Floating Enterprise AI Copilot Command Bar */}
      <AICopilotBar projectId={projectId} onRefetchWorkspaceData={refetchWorkspaceData} />
    </div>
  );
}
