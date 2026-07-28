"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { useVentureStore, Project } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/api';
import { Plus, Rocket, Award, ArrowRight, Play, Upload, FileText, BarChart2, ShieldCheck, Cpu, Database, Compass, Layers, DollarSign, Globe, CheckCircle2, RefreshCw, X } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { projects, setProjects, addProject, user, setUser, setActiveProject, initNewProjectState } = useVentureStore();
  const [authLoading, setAuthLoading] = useState(true);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Wizard Form Fields
  const [name, setName] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');

  // Step 2: Industry State
  const [industry, setIndustry] = useState('Enterprise SaaS');
  const [isCustomIndustry, setIsCustomIndustry] = useState(false);
  const [customIndustry, setCustomIndustry] = useState('');
  const [industrySearch, setIndustrySearch] = useState('');

  // Step 3: Country State
  const [country, setCountry] = useState('India (₹ INR - DPIIT Registered)');

  // Step 4: Funding State
  const [fundingAmount, setFundingAmount] = useState('₹2.0 Crore');
  const [isCustomFunding, setIsCustomFunding] = useState(false);
  const [customFundingAmount, setCustomFundingAmount] = useState('');
  const [fundingStage, setFundingStage] = useState('Seed');
  const [isCustomStage, setIsCustomStage] = useState(false);
  const [customStage, setCustomStage] = useState('');
  const [fundingPurposes, setFundingPurposes] = useState<string[]>(['Product Development', 'Hiring']);

  // Step 5: Business Model State
  const [businessModel, setBusinessModel] = useState('SaaS Subscription + Marketplace');

  const PREDEFINED_INDUSTRIES = [
    'AI & Machine Learning', 'SaaS', 'Fintech', 'Healthtech', 'Medtech', 'Biotech',
    'Agritech', 'Edtech', 'ClimateTech', 'Clean Energy', 'Cybersecurity', 'Robotics',
    'Manufacturing', 'IoT', 'Enterprise Software', 'E-commerce', 'Logistics', 'Supply Chain',
    'Mobility', 'Automotive', 'Aerospace', 'SpaceTech', 'Construction', 'Real Estate',
    'PropTech', 'HRTech', 'LegalTech', 'InsurTech', 'TravelTech', 'FoodTech',
    'Hospitality', 'Gaming', 'Creator Economy', 'Media', 'Entertainment', 'Blockchain / Web3', 'Consumer Apps'
  ];

  const PREDEFINED_FUNDING_AMOUNTS = [
    'Bootstrapped', '₹10 Lakhs', '₹25 Lakhs', '₹50 Lakhs',
    '₹1 Crore', '₹2.0 Crore', '₹5.0 Crore', '₹10 Crore', '₹25 Crore'
  ];

  const FUNDING_STAGES = [
    'Bootstrapped', 'Friends & Family', 'Grant', 'Incubator', 'Accelerator',
    'Angel Round', 'Pre-Seed', 'Seed', 'Bridge Round', 'Series A',
    'Series B', 'Series C+', 'Strategic Investment', 'Other'
  ];

  const FUNDING_PURPOSES = [
    'Product Development', 'Hiring', 'Marketing', 'Go-To-Market',
    'Manufacturing', 'Expansion', 'R&D', 'Working Capital', 'Infrastructure', 'International Expansion'
  ];

  useEffect(() => {
    const checkAuthAndLoadProjects = async () => {
      setAuthLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        
        // Strict protection: If no session, redirect to login
        if (!data.session?.user) {
          setUser(null);
          setProjects([]);
          setActiveProject(null);
          router.push('/login');
          return;
        }

        const authUser = data.session.user;
        console.log("[Authenticated User Retrieved]", authUser.id);

        const currentProfile = {
          id: authUser.id,
          email: authUser.email || 'you@example.com',
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Founder',
          role: 'founder' as const,
          company: authUser.user_metadata?.company || 'My Startup'
        };

        setUser(currentProfile);

        // 2. Dashboard Reload: Fetch user-isolated projects directly from Supabase Database
        console.log("[Dashboard Reload Started] Querying Supabase projects for owner_id:", authUser.id);
        try {
          const { data: dbProjects, error: dbFetchError } = await supabase
            .from('projects')
            .select('*')
            .eq('owner_id', authUser.id)
            .order('created_at', { ascending: false });

          if (dbFetchError) {
            console.error("[Dashboard Reload Error]", {
              table: 'projects',
              operation: 'SELECT',
              errorCode: dbFetchError.code,
              message: dbFetchError.message,
              details: dbFetchError.details
            });
          }

          console.log("[Projects Retrieved] Database returned project count:", dbProjects?.length || 0);
          
          let apiProjects: Project[] = [];
          try {
            const res = await apiClient.get('/projects', {
              headers: { Authorization: `Bearer demo-jwt-${authUser.id}` }
            });
            if (res.data && Array.isArray(res.data)) {
              apiProjects = res.data
                .map((p: any) => p.project || p)
                .filter((p: Project) => !p.owner_id || p.owner_id === authUser.id);
            }
          } catch (err) {}

          const combinedMap = new Map<string, Project>();
          if (dbProjects) {
            dbProjects.forEach((p: any) => combinedMap.set(p.id, p));
          }
          apiProjects.forEach((p: Project) => {
            if (!combinedMap.has(p.id)) combinedMap.set(p.id, p);
          });

          const finalProjects = Array.from(combinedMap.values());
          console.log("[Dashboard Updated] Dashboard state updated with database single source of truth:", finalProjects.length);
          setProjects(finalProjects);
        } catch (err) {
          console.error("[Dashboard Load Error] Exception caught:", err);
          setProjects([]);
        }
      } catch (err) {
        setUser(null);
        setProjects([]);
        router.push('/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthAndLoadProjects();
  }, [router, setUser, setProjects, setActiveProject]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Retrieve Authenticated User
    const { data: authData, error: authCheckErr } = await supabase.auth.getUser();
    if (authCheckErr || !authData?.user) {
      console.error("[Project Create Failed] Authenticated user not found:", authCheckErr);
      alert("Authentication required. Please log in.");
      router.push('/login');
      return;
    }
    const authUser = authData.user;
    console.log("[Authenticated User Retrieved]", authUser.id);

    setLoading(true);

    const projName = name.trim() || "My New Venture";
    const effectiveIndustry = isCustomIndustry ? (customIndustry.trim() || 'Custom Industry') : industry;
    const effectiveFundingAmt = isCustomFunding ? (customFundingAmount.trim() || '₹1.0 Crore') : fundingAmount;
    const effectiveFundingStage = isCustomStage ? (customStage.trim() || 'Seed') : fundingStage;
    const effectiveFundingGoal = `${effectiveFundingAmt} (${effectiveFundingStage})`;

    console.log("[Startup Wizard Completed] Inputs validated:", {
      userId: authUser.id,
      name: projName,
      industry: effectiveIndustry,
      fundingGoal: effectiveFundingGoal,
      problem,
      solution
    });

    // 2. Profile Verification
    console.log("[Profile Verification Started] Checking profile row for:", authUser.id);
    const { data: profData, error: profErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authUser.id)
      .single();

    if (profErr || !profData) {
      console.log("[Profile Verification] Profile missing. Creating profile automatically for user:", authUser.id);
      const { error: upsertErr } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          email: authUser.email || 'you@example.com',
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Founder',
          company: authUser.user_metadata?.company || 'My Startup',
          role: 'founder'
        });
      if (upsertErr) {
        console.error("[Profile Verification Error]", {
          table: 'profiles',
          operation: 'UPSERT',
          errorCode: upsertErr.code,
          message: upsertErr.message,
          details: upsertErr.details
        });
        alert(`Profile setup failed: ${upsertErr.message}`);
        setLoading(false);
        return;
      }
      console.log("[Profile Verified] Profile created successfully.");
    } else {
      console.log("[Profile Verified] Existing profile confirmed:", profData.id);
    }

    // 3. Create Project Record in Supabase
    console.log("[Project Insert Started] Owner ID:", authUser.id);
    const generatedUuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`;

    const { data: insertedDbProject, error: dbInsertError } = await supabase
      .from('projects')
      .insert({
        id: generatedUuid,
        owner_id: authUser.id,
        name: projName,
        tagline: `${effectiveIndustry} Venture Powered by Autonomous AI`,
        industry: effectiveIndustry,
        target_market: country.includes('India') ? 'Indian Market' : 'Global Market',
        problem_statement: problem || "Core industry friction points",
        solution_overview: solution || "Autonomous LangGraph AI solution",
        funding_goal: effectiveFundingGoal,
        business_model: businessModel,
        stage: 'idea',
        readiness_score: 75,
        status: 'Running'
      })
      .select()
      .single();

    if (dbInsertError) {
      console.error("[Project Insert Error]", {
        table: 'projects',
        operation: 'INSERT',
        errorCode: dbInsertError.code,
        message: dbInsertError.message,
        details: dbInsertError.details,
        hint: dbInsertError.hint
      });
      alert(`Database persistence failed on projects table: ${dbInsertError.message}`);
      setLoading(false);
      return; // Abort workflow immediately
    }

    const projectUuid = insertedDbProject.id;
    console.log("[Project Insert Success] Project ID:", projectUuid);

    // 4. Orchestrate Dependent Record Creation with Atomic Rollback
    try {
      console.log("[Business Plan Created] Inserting for project_id:", projectUuid);
      const { error: bpErr } = await supabase.from('business_plans').insert({ project_id: projectUuid, executive_summary: `${projName} in ${effectiveIndustry} solving ${problem}` });
      if (bpErr) throw { table: 'business_plans', error: bpErr };

      console.log("[Market Research Created] Inserting for project_id:", projectUuid);
      const { error: mrErr } = await supabase.from('market_research').insert({ project_id: projectUuid, query: `Market research for ${projName}` });
      if (mrErr) throw { table: 'market_research', error: mrErr };

      console.log("[Competitor Analysis Created] Inserting for project_id:", projectUuid);
      const { error: caErr } = await supabase.from('competitor_analysis').insert({ project_id: projectUuid, competitors: [] });
      if (caErr) throw { table: 'competitor_analysis', error: caErr };

      console.log("[Technical Architecture Created] Inserting for project_id:", projectUuid);
      const { error: taErr } = await supabase.from('technical_architecture').insert({ project_id: projectUuid });
      if (taErr) throw { table: 'technical_architecture', error: taErr };

      console.log("[Financial Model Created] Inserting for project_id:", projectUuid);
      const { error: fmErr } = await supabase.from('financial_models').insert({ project_id: projectUuid, seed_ask_inr: effectiveFundingGoal });
      if (fmErr) throw { table: 'financial_models', error: fmErr };

      console.log("[Product Roadmap Created] Inserting for project_id:", projectUuid);
      const { error: prErr } = await supabase.from('product_roadmaps').insert({ project_id: projectUuid });
      if (prErr) throw { table: 'product_roadmaps', error: prErr };

      console.log("[Marketing Strategy Created] Inserting for project_id:", projectUuid);
      const { error: msErr } = await supabase.from('marketing_strategies').insert({ project_id: projectUuid });
      if (msErr) throw { table: 'marketing_strategies', error: msErr };

      console.log("[Investor Deck Created] Inserting for project_id:", projectUuid);
      const { error: idErr } = await supabase.from('investor_decks').insert({ project_id: projectUuid });
      if (idErr) throw { table: 'investor_decks', error: idErr };

      console.log("[Workflow State Created] Inserting for project_id:", projectUuid);
      const { error: wsErr } = await supabase.from('workflow_state').insert({ project_id: projectUuid });
      if (wsErr) throw { table: 'workflow_state', error: wsErr };

      console.log("[Startup Metrics Created] Inserting for project_id:", projectUuid);
      const { error: smErr } = await supabase.from('startup_metrics').insert({ project_id: projectUuid });
      if (smErr) throw { table: 'startup_metrics', error: smErr };

      console.log("[Evaluation Created] Inserting for project_id:", projectUuid);
      const { error: evErr } = await supabase.from('evaluations').insert({ project_id: projectUuid });
      if (evErr) throw { table: 'evaluations', error: evErr };

      console.log("[Audit Log Created] Inserting for project_id:", projectUuid);
      await supabase.from('audit_logs').insert({ user_id: authUser.id, project_id: projectUuid, action: 'PROJECT_CREATE', details: { name: projName, industry: effectiveIndustry } });

      console.log("[Initial Version Created] Inserting for project_id:", projectUuid);
      await supabase.from('project_versions').insert({ project_id: projectUuid, version_number: 1, snapshot_label: 'v1.0 Initial Creation', snapshot_data: { name: projName, industry: effectiveIndustry } });

      console.log("[Welcome Notification Created] Inserting for user_id:", authUser.id);
      await supabase.from('notifications').insert({ user_id: authUser.id, project_id: projectUuid, title: 'Startup Created', message: `Welcome to ${projName}!` });

    } catch (depErr: any) {
      console.error("[Atomic Rollback Triggered] Dependent table insert failed:", {
        table: depErr?.table || 'unknown',
        errorCode: depErr?.error?.code,
        message: depErr?.error?.message,
        details: depErr?.error?.details
      });
      // Execute cleanup rollback to prevent orphaned project
      await supabase.from('projects').delete().eq('id', projectUuid);
      alert(`Failed to complete startup setup in table '${depErr?.table}': ${depErr?.error?.message || 'Database error'}`);
      setLoading(false);
      return;
    }

    // 5. Also notify backend API service
    try {
      await apiClient.post('/projects', {
        id: projectUuid,
        name: projName,
        industry: effectiveIndustry,
        problem_statement: problem || "Core industry friction points",
        solution_overview: solution || "Autonomous AI platform solution",
        funding_goal: effectiveFundingGoal,
        business_model: businessModel
      }, {
        headers: { Authorization: `Bearer demo-jwt-${authUser.id}` }
      });
    } catch (apiErr) {
      console.warn("[Backend API Notice]", apiErr);
    }

    // 6. Dashboard Reload & UI Update
    console.log("[Dashboard Reload Started] Refetching database project list...");
    const { data: refreshedDbProjects, error: refreshError } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', authUser.id)
      .order('created_at', { ascending: false });

    if (refreshError) {
      console.error("[Dashboard Reload Error]", refreshError);
    }

    console.log("[Projects Retrieved] Database count:", refreshedDbProjects?.length || 0);
    const finalProjectList = refreshedDbProjects && refreshedDbProjects.length > 0 ? refreshedDbProjects : [insertedDbProject];
    setProjects(finalProjectList);
    setActiveProject(insertedDbProject);
    console.log("[Dashboard Updated] Dashboard state updated successfully.");

    initNewProjectState(insertedDbProject, problem, solution, effectiveIndustry, country, effectiveFundingGoal, businessModel);

    setShowWizardModal(false);
    setWizardStep(1);
    setLoading(false);
    router.push(`/workspace/${projectUuid}`);
  };

  const handleResumeProject = async (proj: Project) => {
    console.log("[Resume Button Clicked] Project ID selected:", proj?.id);
    if (!proj || !proj.id) {
      console.error("[Resume Startup Error] Selected project is invalid:", proj);
      alert("Selected startup project was not found.");
      return;
    }

    try {
      console.log("[Active Project Loaded] Setting active project in Zustand store:", proj.name);
      setActiveProject(proj);

      // 1. Fetch complete project workspace artifacts from Supabase DB in parallel
      console.log("[Workspace Data Fetched] Querying Supabase artifacts for project_id:", proj.id);
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
        supabase.from('business_plans').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('market_research').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('competitor_analysis').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('technical_architecture').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('financial_models').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('product_roadmaps').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('marketing_strategies').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('investor_decks').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('documents').select('*').eq('project_id', proj.id),
        supabase.from('evaluations').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('audit_logs').select('*').eq('project_id', proj.id).order('timestamp', { ascending: false })
      ]);

      console.log("[Workspace Data Fetched] Successfully fetched artifact context for:", proj.id);

      // 2. Rehydrate Zustand state with fetched workspace artifacts
      const currentState = useVentureStore.getState().startupState;
      useVentureStore.getState().setStartupState({
        ...currentState,
        project: proj,
        business_plan: bp ? { ...currentState.business_plan, ...bp } : currentState.business_plan,
        market_research: mr ? { ...currentState.market_research, ...mr } : currentState.market_research,
        competitor_analysis: ca ? { ...currentState.competitor_analysis, ...ca } : currentState.competitor_analysis,
        technical_architecture: ta ? { ...currentState.technical_architecture, ...ta } : currentState.technical_architecture,
        financials: fm ? { ...currentState.financials, ...fm } : currentState.financials,
        product_roadmap: pr ? { ...currentState.product_roadmap, ...pr } : currentState.product_roadmap,
        marketing_strategy: ms ? { ...currentState.marketing_strategy, ...ms } : currentState.marketing_strategy,
        investor_deck: id ? { ...currentState.investor_deck, ...id } : currentState.investor_deck,
        documents: docs || currentState.documents,
        evaluation: ev ? { ...currentState.evaluation, ...ev } : currentState.evaluation,
        audit_trail: audit || currentState.audit_trail
      });

      console.log("[Navigation Completed] Navigating cleanly via router.push to /workspace/" + proj.id);
      router.push(`/workspace/${proj.id}`);
    } catch (err: any) {
      console.error("[Resume Startup Exception] Full stack trace:", err);
      alert(`Failed to load project workspace: ${err?.message || 'Unknown error'}`);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] text-[#0F172A] flex items-center justify-center bg-executive-mesh">
        <div className="p-8 rounded-[28px] bg-white border border-slate-200 shadow-xl space-y-4 text-center max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#5B5CEB] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#5B5CEB]/25">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <div className="text-base font-extrabold text-[#0F172A]">Hydrating Founder Session...</div>
            <p className="text-xs text-[#64748B]">Verifying user isolation and loading your project workspace.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#0F172A] flex flex-col bg-executive-mesh relative">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-[#5B5CEB] border border-slate-200 shadow-sm">
                  User Isolated Workspace
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">{user?.email}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Startup Projects Command Hub</h1>
              <p className="text-xs text-[#64748B] mt-1">Isolated multi-agent startup workspaces for {user?.full_name || 'Founder'}.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => { setShowWizardModal(true); setWizardStep(1); }}
                className="px-5 py-3 rounded-2xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-xl shadow-[#5B5CEB]/25 flex items-center gap-1.5 transition transform active:scale-[0.99]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Startup</span>
              </button>

              {projects.length > 0 && (
                <button
                  onClick={() => handleResumeProject(projects[0])}
                  className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-[#00C6AE] border border-slate-200 font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Active Venture</span>
                </button>
              )}
            </div>
          </div>

          {/* User Projects List (Per-User Isolation) */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5B5CEB]" />
              <span>Your Active Ventures ({projects.length})</span>
            </h2>

            {projects.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-[24px] border border-slate-200 space-y-4">
                <Rocket className="w-12 h-12 text-[#5B5CEB] mx-auto opacity-80" />
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[#0F172A]">No Startups Created Yet</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    Launch your first venture using our step-by-step Startup Wizard to generate complete business plans, financial models, and pitch decks.
                  </p>
                </div>
                <button
                  onClick={() => { setShowWizardModal(true); setWizardStep(1); }}
                  className="px-6 py-3 rounded-2xl bg-[#5B5CEB] text-white text-xs font-extrabold shadow-lg shadow-[#5B5CEB]/20 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Startup Wizard</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="glass-exec-card p-6 flex flex-col justify-between space-y-4 hover:border-[#5B5CEB]/40 transition">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#5B5CEB] border border-indigo-200">
                          {proj.industry}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#26C281] border border-emerald-200">
                          Score: {proj.readiness_score || 85}/100
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-[#0F172A]">{proj.name}</h3>
                      <p className="text-xs text-[#64748B] line-clamp-2">{proj.problem_statement}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B] font-medium">Stage: <strong className="text-[#0F172A] capitalize">{proj.stage}</strong></span>
                      <button
                        onClick={() => handleResumeProject(proj)}
                        className="px-4 py-2 rounded-xl bg-[#5B5CEB] text-white font-extrabold text-xs shadow-md shadow-[#5B5CEB]/20 flex items-center gap-1.5 hover:bg-[#4a4bd9] transition"
                      >
                        <span>Resume Startup</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* FULLSCREEN VIEWPORT CENTERED STARTUP GENERATION WIZARD MODAL */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 m-0 p-4 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white p-8 rounded-[28px] shadow-2xl border border-slate-200 space-y-6 my-auto m-0">
            
            {/* Wizard Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#5B5CEB] text-white flex items-center justify-center font-bold text-xs">
                  {wizardStep}/5
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">Startup Generation Wizard</h3>
                  <p className="text-[10px] text-[#64748B]">Create your new venture powered by autonomous AI agents.</p>
                </div>
              </div>
              <button onClick={() => setShowWizardModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#5B5CEB] h-full transition-all duration-300" style={{ width: `${(wizardStep / 5) * 100}%` }} />
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              {/* STEP 1: IDEA */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="font-extrabold text-sm text-[#0F172A]">Step 1: Idea & Core Friction</div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1">Startup Venture Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. NovaTech Labs"
                      className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1">Problem Statement</label>
                    <textarea
                      required
                      rows={2}
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Describe the primary problem your startup is solving."
                      className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1">Solution Overview</label>
                    <textarea
                      required
                      rows={2}
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="Briefly describe how your solution solves the problem."
                      className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: INDUSTRY */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <div className="font-extrabold text-sm text-[#0F172A]">Step 2: Industry Sector</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Select a sector or search and define your custom domain.</p>
                  </div>

                  {/* Searchable Autocomplete Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={industrySearch}
                      onChange={(e) => setIndustrySearch(e.target.value)}
                      placeholder="Search industries (e.g. Quantum Computing, ClimateTech, BioTech)..."
                      className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                    />
                  </div>

                  {/* Quick Select Grid */}
                  <div className="max-h-48 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PREDEFINED_INDUSTRIES
                      .filter((ind) => ind.toLowerCase().includes(industrySearch.toLowerCase()))
                      .map((ind) => (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => {
                            setIndustry(ind);
                            setIsCustomIndustry(false);
                          }}
                          className={`p-2.5 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between ${
                            !isCustomIndustry && industry === ind
                              ? 'bg-[#5B5CEB] text-white border-[#5B5CEB] shadow-md'
                              : 'bg-[#F7F8FC] text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{ind}</span>
                          {!isCustomIndustry && industry === ind && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      ))}

                    {/* Custom Industry Card */}
                    <button
                      type="button"
                      onClick={() => setIsCustomIndustry(true)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between col-span-2 sm:col-span-3 ${
                        isCustomIndustry
                          ? 'bg-[#5B5CEB] text-white border-[#5B5CEB] shadow-md'
                          : 'bg-indigo-50/70 text-[#5B5CEB] border-indigo-200 hover:border-indigo-300'
                      }`}
                    >
                      <span>+ Other / Custom Industry</span>
                      {isCustomIndustry && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  </div>

                  {/* Custom Industry Input Field */}
                  {isCustomIndustry && (
                    <div className="pt-2 animate-in fade-in space-y-1">
                      <label className="block text-xs font-bold text-[#64748B]">Industry Name (Required, max 50 chars)</label>
                      <input
                        type="text"
                        required
                        maxLength={50}
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        placeholder="e.g. FashionTech, MarineTech, SportsTech, Quantum Computing"
                        className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: COUNTRY & REGION */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="font-extrabold text-sm text-[#0F172A]">Step 3: Country & Ecosystem Context</div>
                  <div className="space-y-2">
                    {[
                      'India (₹ INR - DPIIT Registered)',
                      'United States ($ USD - Delaware C-Corp)',
                      'Singapore ($ SGD - MAS Framework)',
                      'United Kingdom (£ GBP - SEIS/EIS Scheme)'
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCountry(c)}
                        className={`w-full p-3 rounded-2xl text-left border text-xs font-bold transition flex items-center justify-between ${
                          country === c
                            ? 'bg-[#5B5CEB] text-white border-[#5B5CEB] shadow-md'
                            : 'bg-[#F7F8FC] text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span>{c}</span>
                        {country === c && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: FUNDING GOAL & STAGE */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <div className="font-extrabold text-sm text-[#0F172A]">Step 4: Funding Target & Stage</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Define target capital raise, stage, and capital deployment purposes.</p>
                  </div>

                  {/* Funding Amount Quick Select */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#64748B]">Target Capital Raise</label>
                    <div className="grid grid-cols-3 gap-2">
                      {PREDEFINED_FUNDING_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setFundingAmount(amt);
                            setIsCustomFunding(false);
                          }}
                          className={`p-2.5 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between ${
                            !isCustomFunding && fundingAmount === amt
                              ? 'bg-[#5B5CEB] text-white border-[#5B5CEB] shadow-md'
                              : 'bg-[#F7F8FC] text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{amt}</span>
                          {!isCustomFunding && fundingAmount === amt && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      ))}

                      {/* Custom Amount Card */}
                      <button
                        type="button"
                        onClick={() => setIsCustomFunding(true)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between col-span-3 ${
                          isCustomFunding
                            ? 'bg-[#5B5CEB] text-white border-[#5B5CEB] shadow-md'
                            : 'bg-indigo-50/70 text-[#5B5CEB] border-indigo-200 hover:border-indigo-300'
                        }`}
                      >
                        <span>+ Custom Amount</span>
                        {isCustomFunding && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    </div>

                    {isCustomFunding && (
                      <div className="pt-1 animate-in fade-in space-y-1">
                        <label className="block text-xs font-bold text-[#64748B]">Target Funding Amount</label>
                        <input
                          type="text"
                          required
                          value={customFundingAmount}
                          onChange={(e) => setCustomFundingAmount(e.target.value)}
                          placeholder="e.g. ₹3.5 Crore, ₹75 Lakhs, or $500,000"
                          className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Independent Funding Stage Selection */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-[#64748B]">Funding Stage</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto pr-1">
                      {FUNDING_STAGES.map((stg) => (
                        <button
                          key={stg}
                          type="button"
                          onClick={() => {
                            if (stg === 'Other') {
                              setIsCustomStage(true);
                            } else {
                              setFundingStage(stg);
                              setIsCustomStage(false);
                            }
                          }}
                          className={`p-2 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between ${
                            (stg === 'Other' ? isCustomStage : (!isCustomStage && fundingStage === stg))
                              ? 'bg-[#5B5CEB] text-white border-[#5B5CEB] shadow-md'
                              : 'bg-[#F7F8FC] text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{stg}</span>
                          {(stg === 'Other' ? isCustomStage : (!isCustomStage && fundingStage === stg)) && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      ))}
                    </div>

                    {isCustomStage && (
                      <div className="pt-1 animate-in fade-in">
                        <input
                          type="text"
                          required
                          value={customStage}
                          onChange={(e) => setCustomStage(e.target.value)}
                          placeholder="Specify custom stage (e.g. Growth Equity, Strategic Grant)"
                          className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Funding Purpose (Optional Multi-Select) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-[#64748B]">Capital Allocation & Purpose (Optional)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {FUNDING_PURPOSES.map((purp) => {
                        const active = fundingPurposes.includes(purp);
                        return (
                          <button
                            key={purp}
                            type="button"
                            onClick={() => {
                              setFundingPurposes((prev) =>
                                active ? prev.filter((p) => p !== purp) : [...prev, purp]
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                              active
                                ? 'bg-indigo-100 text-[#5B5CEB] border-indigo-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {active ? `✓ ${purp}` : `+ ${purp}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: BUSINESS MODEL & GENERATE */}
              {wizardStep === 5 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="font-extrabold text-sm text-[#0F172A]">Step 5: Business Model & Agent Dispatch</div>
                  <div className="space-y-2">
                    {[
                      'SaaS Subscription + Marketplace',
                      'B2B Enterprise Licensing',
                      'Transactional Fee / Take Rate',
                      'Hardware Edge + Software Bundle'
                    ].map((bm) => (
                      <button
                        key={bm}
                        type="button"
                        onClick={() => setBusinessModel(bm)}
                        className={`w-full p-3 rounded-2xl text-left border text-xs font-bold transition ${
                          businessModel === bm
                            ? 'bg-[#5B5CEB] text-white border-[#5B5CEB] shadow-md'
                            : 'bg-[#F7F8FC] text-slate-700 border-slate-200'
                        }`}
                      >
                        {bm}
                      </button>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-[#5B5CEB] space-y-1">
                    <div className="font-bold">Ready to Dispatch LangGraph Swarm</div>
                    <p className="text-[11px]">Will synthesize Business Plan, Financial Model, Pitch Deck, & Architecture Diagram for {user?.email}.</p>
                  </div>
                </div>
              )}

              {/* Wizard Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={wizardStep === 1}
                  onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 disabled:opacity-40"
                >
                  Back
                </button>

                {wizardStep < 5 ? (
                  <button
                    type="button"
                    disabled={
                      (wizardStep === 2 && isCustomIndustry && (!customIndustry.trim() || customIndustry.trim().length > 50)) ||
                      (wizardStep === 4 && isCustomFunding && !customFundingAmount.trim()) ||
                      (wizardStep === 4 && isCustomStage && !customStage.trim())
                    }
                    onClick={() => setWizardStep((prev) => Math.min(5, prev + 1))}
                    className="px-6 py-2.5 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white text-xs font-bold shadow-lg shadow-[#5B5CEB]/20 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-[#26C281] hover:bg-[#20ad73] text-white text-xs font-extrabold shadow-lg shadow-[#26C281]/20 flex items-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                    <span>{loading ? 'Orchestrating Agents...' : 'Generate & Open Workspace'}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
