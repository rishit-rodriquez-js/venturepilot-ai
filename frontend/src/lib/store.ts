import { create } from 'zustand';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'founder' | 'mentor' | 'investor' | 'admin';
  company?: string;
}

export interface Project {
  id: string;
  owner_id?: string;
  name: string;
  tagline?: string;
  industry: string;
  target_market?: string;
  problem_statement: string;
  solution_overview: string;
  stage: 'idea' | 'validation' | 'mvp' | 'growth' | 'scaling';
  readiness_score: number;
  status?: 'Running' | 'Completed' | 'Pending' | 'Queued';
  created_at: string;
  updated_at?: string;
}

export interface StartupState {
  project: Project;
  founder: UserProfile;
  overview: {
    health_scores: { validation: number; market: number; finance: number; investor: number };
    timeline: Array<{ stage: string; progress: number; status: string; owner: string; confidence: number; updated: string }>;
  };
  business_plan: {
    executive_summary: string;
    vision: string;
    mission: string;
    problem: string;
    solution: string;
    target_customer: string;
    pricing: string;
    usp: string;
    version: string;
    generated_by: string;
    sources: string[];
    lean_canvas?: {
      problem: string[];
      solution: string[];
      key_metrics: string[];
      channels: string[];
    };
  };
  market_research: {
    query: string;
    tam_sam_som: { tam_inr_cr: number; sam_inr_cr: number; som_inr_cr: number };
    retrieved_sources: Array<{ file_name: string; similarity_score: number; snippet: string }>;
    synthesized_report?: string;
  };
  competitor_analysis: {
    competitors: Array<{ name: string; funding: string; strength: string; weakness: string; moat: string }>;
    gap_analysis: string;
    opportunity_matrix: string;
    competitive_advantage: string;
  };
  technical_architecture: {
    frontend_stack: string[];
    backend_stack: string[];
    database_stack: string[];
    ai_stack: string[];
    security_posture: string[];
  };
  financials: {
    currency: string;
    monthly_burn_rate_inr: number;
    runway_months: number;
    breakeven_month: string;
    seed_ask_inr: string;
    costs: Array<{ item: string; amount_inr: number }>;
    projections_3y: Array<{ year: string; revenue_lakhs?: number; revenue_crores?: number; fpo_customers: number }>;
  };
  product_roadmap: {
    milestones: Array<{ timeline: string; milestone: string; priority: string }>;
  };
  marketing_strategy: {
    icp: string;
    channels: Array<{ name: string; strategy: string }>;
    pricing_inr: string;
  };
  investor_deck: {
    overall_score: number;
    team_score: number;
    market_score: number;
    product_score: number;
    financial_score: number;
    slides: Array<{ slide_number: number; title: string; content: string }>;
  };
  documents: Array<{ id?: string; file_name: string; chunk_count: number; created_at: string; status: string }>;
  evaluation: {
    faithfulness_score: number;
    answer_relevance_score: number;
    hallucination_index: number;
    latency_ms: number;
    tokens_consumed: number;
    langsmith_trace_url: string;
  };
  audit_trail: Array<{ timestamp: string; agent: string; action: string; status: string; latency: string; tokens: number; trace_id: string }>;
  version_history: Array<{ id: string; version_number: number; snapshot_label: string; created_at: string }>;
}

interface VentureStore {
  user: UserProfile | null;
  projects: Project[];
  activeProject: Project | null;
  startupState: StartupState;
  
  setUser: (user: UserProfile | null) => void;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  setStartupState: (state: StartupState) => void;
  clearStore: () => void;
  
  // Wizard Initializer
  initNewProjectState: (
    project: Project,
    problem: string,
    solution: string,
    industry: string,
    country: string,
    fundingGoal: string,
    businessModel: string
  ) => void;

  // Cascading Reactive State Mutators:
  executeCascadeWorkflow: (prompt: string) => void;
  uploadDocumentCascade: (fileName: string, chunkCount?: number) => void;
  deleteDocumentCascade: (fileName: string) => void;
  updatePricingCascade: (newPricing: string) => void;
  updateFinancialRevenueCascade: (year2RevenueCrores: number) => void;
  createVersionSnapshot: (label: string) => void;
}

const templateStartupState: StartupState = {
  project: {
    id: "template-1",
    name: "New Venture",
    tagline: "Autonomous AI Venture",
    industry: "Enterprise SaaS",
    target_market: "Enterprise & Global Markets",
    problem_statement: "Core market friction points",
    solution_overview: "Autonomous LangGraph AI Operating System",
    stage: "validation",
    readiness_score: 75,
    status: "Running",
    created_at: new Date().toISOString()
  },
  founder: {
    id: "00000000-0000-0000-0000-000000000001",
    email: "you@example.com",
    full_name: "John Doe",
    role: "founder",
    company: "Your Startup"
  },
  overview: {
    health_scores: { validation: 80, market: 75, finance: 70, investor: 75 },
    timeline: [
      { stage: "Idea Created", progress: 100, status: "Completed", owner: "Founder", confidence: 98, updated: "Today" },
      { stage: "Validation", progress: 60, status: "Active", owner: "AI Co-Founder", confidence: 85, updated: "Today" }
    ]
  },
  business_plan: {
    executive_summary: "Enterprise AI Startup OS empowering high-growth ventures with autonomous multi-agent planning.",
    vision: "Automate startup strategy, research, financial modeling, and pitch deck generation.",
    mission: "Deliver institution-grade investor readiness tools for global founders.",
    problem: "Founders spend months manually drafting business plans, financial models, and research reports.",
    solution: "Autonomous LangGraph AI agent pipeline executing market validation and pitch deck generation.",
    target_customer: "B2B Enterprises, Tech Startups, and High-Growth Founders.",
    pricing: "₹1,499/month per workspace",
    usp: "Real-time state synchronization across 13 workspace modules.",
    version: "v1.0",
    generated_by: "Planner Agent",
    sources: [],
    lean_canvas: {
      problem: ["Manual fundraising deck creation", "Lack of real-time financial modeling"],
      solution: ["Autonomous AI Startup OS", "Multi-agent LangGraph workflow engine"],
      key_metrics: ["Monthly Recurring Revenue", "Customer Acquisition Cost", "Runway Months"],
      channels: ["Direct B2B Outreach", "Self-Serve SaaS Platform"]
    }
  },
  market_research: {
    query: "Market analysis and size projection.",
    tam_sam_som: { tam_inr_cr: 100000, sam_inr_cr: 25000, som_inr_cr: 1000 },
    retrieved_sources: [],
    synthesized_report: "Target market exhibits strong 25% CAGR growth with institutional investment support."
  },
  competitor_analysis: {
    competitors: [
      { name: "Legacy Consultants", funding: "N/A", strength: "Personalized service", weakness: "Slow & expensive", moat: "Relationships" },
      { name: "Your Venture", funding: "Seed Ask", strength: "Autonomous LangGraph AI Swarm", weakness: "Early stage brand", moat: "Real-time AI Co-Founder" }
    ],
    gap_analysis: "Traditional advisory services are slow and expensive; AI alternatives lack single shared state.",
    opportunity_matrix: "High growth potential across Tier 1 & 2 technology hubs.",
    competitive_advantage: "Unified StartupState with real-time multi-agent execution."
  },
  technical_architecture: {
    frontend_stack: ["Next.js 15 App Router", "React 19", "TypeScript", "Tailwind CSS", "Zustand State"],
    backend_stack: ["FastAPI Python 3.12", "SQLAlchemy 2.0", "Uvicorn ASGI Engine", "LangGraph Workflow Agents"],
    database_stack: ["Supabase Managed PostgreSQL", "pgvector Vector Store", "Row Level Security (RLS)"],
    ai_stack: ["OpenAI GPT-4o API", "LangChain Orchestration", "LangSmith Tracing & Observability"],
    security_posture: ["JWT Bearer Authentication", "Role-Based Access Control (RBAC)", "Immutable Audit Trail Logging"]
  },
  financials: {
    currency: "INR (₹)",
    monthly_burn_rate_inr: 250000,
    runway_months: 18,
    breakeven_month: "Month 12",
    seed_ask_inr: "₹1.0 Crore",
    costs: [
      { item: "Company Incorporation & Legal", amount_inr: 20000 },
      { item: "Cloud Infrastructure & Supabase", amount_inr: 30000 },
      { item: "Product Engineering & AI Compute", amount_inr: 200000 }
    ],
    projections_3y: [
      { year: "Year 1", revenue_lakhs: 25.0, fpo_customers: 100 },
      { year: "Year 2", revenue_lakhs: 100.0, fpo_customers: 500 },
      { year: "Year 3", revenue_crores: 3.5, fpo_customers: 2000 }
    ]
  },
  product_roadmap: {
    milestones: [
      { timeline: "Month 1", milestone: "Customer Interviews & Problem Validation", priority: "High" },
      { timeline: "Month 2", milestone: "MVP Development & AI Engine Integration", priority: "High" },
      { timeline: "Month 4", milestone: "Beta Launch & Pilot Customer Onboarding", priority: "High" }
    ]
  },
  marketing_strategy: {
    icp: "High-growth tech startups and early-stage founders.",
    channels: [
      { name: "Content Marketing & SEO", strategy: "Educational guides on startup metrics & fundraising" },
      { name: "Direct Founder Outreach", strategy: "Personalized demos and ecosystem partnerships" }
    ],
    pricing_inr: "₹1,499/month per workspace"
  },
  investor_deck: {
    overall_score: 78,
    team_score: 80,
    market_score: 82,
    product_score: 75,
    financial_score: 75,
    slides: [
      { slide_number: 1, title: "1. Cover", content: "New Venture — Executive AI Startup OS" },
      { slide_number: 2, title: "2. Problem", content: "Founders spend months manually drafting business plans and financial projections." },
      { slide_number: 3, title: "3. Solution", content: "Autonomous AI Co-Founder executing real-time strategic updates." },
      { slide_number: 4, title: "4. Market Size", content: "High-growth enterprise addressable market opportunity." },
      { slide_number: 5, title: "5. Business Model", content: "SaaS Subscription at ₹1,499/month per workspace." },
      { slide_number: 6, title: "6. Traction", content: "Beta access signups and pilot customer validation." },
      { slide_number: 7, title: "7. Financials", content: "₹25 Lakhs Year 1 ARR growing to ₹3.5 Crore in Year 3 with 18-month runway." },
      { slide_number: 8, title: "8. Competition & Moat", content: "Unified single shared state across all 13 workspace modules." },
      { slide_number: 9, title: "9. Product Roadmap", content: "Beta launch and pilot customer expansion." },
      { slide_number: 10, title: "10. Funding Ask", content: "Seeking ₹1.0 Crore Seed Round for product scaling." }
    ]
  },
  documents: [],
  evaluation: {
    faithfulness_score: 0.95,
    answer_relevance_score: 0.97,
    hallucination_index: 0.01,
    latency_ms: 320,
    tokens_consumed: 1200,
    langsmith_trace_url: "https://smith.langchain.com/public/traces/venture-trace"
  },
  audit_trail: [
    { timestamp: new Date().toLocaleTimeString(), agent: "Planner Agent", action: "PROJECT_CREATED", status: "Completed", latency: "1.0s", tokens: 1000, trace_id: `ls_${Date.now().toString().slice(-6)}` }
  ],
  version_history: [
    { id: "v1", version_number: 1, snapshot_label: "Initial Baseline", created_at: new Date().toLocaleDateString() }
  ]
};

export const useVentureStore = create<VentureStore>((set) => ({
  user: null,
  projects: [],
  activeProject: null,
  startupState: templateStartupState,

  setUser: (user) => set({ user }),
  setProjects: (projects) => set({ projects }),
  setActiveProject: (activeProject) => set({ activeProject }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects], activeProject: project })),
  setStartupState: (startupState) => set({ startupState }),

  clearStore: () => set({
    user: null,
    projects: [],
    activeProject: null,
    startupState: templateStartupState
  }),

  initNewProjectState: (project, problem, solution, industry, country, fundingGoal, businessModel) => set((state) => {
    const isIndia = country.includes('India');
    const currency = isIndia ? 'INR (₹)' : 'USD ($)';
    
    const newState: StartupState = {
      ...templateStartupState,
      project: project,
      business_plan: {
        ...templateStartupState.business_plan,
        problem: problem || project.problem_statement,
        solution: solution || project.solution_overview,
        executive_summary: `${project.name} is an enterprise venture in ${industry} addressing '${problem}' using '${solution}'.`,
        pricing: isIndia ? "₹1,499/month per workspace" : "$199/month subscription"
      },
      financials: {
        ...templateStartupState.financials,
        currency: currency,
        seed_ask_inr: fundingGoal || (isIndia ? "₹1.0 Crore" : "$150,000")
      },
      investor_deck: {
        ...templateStartupState.investor_deck,
        slides: [
          { slide_number: 1, title: "1. Cover", content: `${project.name} — ${industry} Enterprise AI Operating System` },
          { slide_number: 2, title: "2. Problem", content: problem || project.problem_statement },
          { slide_number: 3, title: "3. Solution", content: solution || project.solution_overview },
          { slide_number: 4, title: "4. Market Size", content: `${industry} global addressable market opportunity.` },
          { slide_number: 5, title: "5. Business Model", content: businessModel || "SaaS Subscription + Marketplace." },
          { slide_number: 6, title: "6. Traction", content: "Initial pilot agreements and customer interview validation." },
          { slide_number: 7, title: "7. Financials", content: `Targeting ${fundingGoal || '₹1.0 Crore'} funding with strong unit economics.` },
          { slide_number: 8, title: "8. Competition & Moat", content: "Proprietary AI workflow orchestration engine." },
          { slide_number: 9, title: "9. Product Roadmap", content: "MVP launch and strategic pilot expansion." },
          { slide_number: 10, title: "10. Funding Ask", content: `Seeking ${fundingGoal || '₹1.0 Crore'} for product engineering and market expansion.` }
        ]
      },
      documents: [],
      audit_trail: [
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: "Planner Agent",
          action: `INITIALIZED_VENTURE: ${project.name} (${industry}, ${fundingGoal})`,
          status: "Completed",
          latency: "1.2s",
          tokens: 1500,
          trace_id: `ls_${Date.now().toString().slice(-6)}`
        }
      ]
    };

    return {
      activeProject: project,
      startupState: newState
    };
  }),

  executeCascadeWorkflow: (prompt: string) => set((state) => {
    const promptLower = prompt.toLowerCase();
    let updatedFinancials = { ...state.startupState.financials };
    let updatedDeck = { ...state.startupState.investor_deck };
    let updatedBP = { ...state.startupState.business_plan };

    if (promptLower.includes("year 2 revenue") || promptLower.includes("crore") || promptLower.includes("revenue")) {
      updatedFinancials.projections_3y = updatedFinancials.projections_3y.map((p) =>
        p.year === "Year 2" ? { ...p, revenue_crores: 5.0, revenue_lakhs: 500.0 } : p
      );
      updatedDeck.slides = updatedDeck.slides.map((s) =>
        s.title.includes("Financials")
          ? { ...s, content: "Year 2 Revenue scaled to ₹5.0 Crore with strong unit economics." }
          : s
      );
    }

    const newScore = Math.min(100, state.startupState.project.readiness_score + 1);
    const newTimestamp = new Date().toLocaleTimeString();
    const newAudit = {
      timestamp: newTimestamp,
      agent: "AI Co-Founder Engine",
      action: `EXECUTED_COMMAND: ${prompt.slice(0, 35)}...`,
      status: "Completed",
      latency: "1.5s",
      tokens: 2800,
      trace_id: `ls_${Date.now().toString().slice(-6)}`
    };

    return {
      startupState: {
        ...state.startupState,
        project: { ...state.startupState.project, readiness_score: newScore },
        business_plan: { ...updatedBP, version: `v1.${Date.now().toString().slice(-1)}` },
        financials: updatedFinancials,
        investor_deck: updatedDeck,
        audit_trail: [newAudit, ...state.startupState.audit_trail]
      }
    };
  }),

  uploadDocumentCascade: (fileName: string, chunkCount: number = 64) => set((state) => {
    const newDoc = { id: `doc-${Date.now()}`, file_name: fileName, chunk_count: chunkCount, created_at: "Just Now", status: "Ready" };
    const newScore = Math.min(100, state.startupState.project.readiness_score + 2);
    const newTimestamp = new Date().toLocaleTimeString();
    const newAudit = {
      timestamp: newTimestamp,
      agent: "RAG Research Agent",
      action: `DOCUMENT_INDEXED: ${fileName}`,
      status: "Completed",
      latency: "1.4s",
      tokens: 1850,
      trace_id: `ls_${Date.now().toString().slice(-6)}`
    };

    const newRetrieved = [
      { file_name: fileName, similarity_score: 0.96, snippet: `Indexed chunks from ${fileName} into pgvector vector store.` },
      ...state.startupState.market_research.retrieved_sources
    ];

    return {
      startupState: {
        ...state.startupState,
        project: { ...state.startupState.project, readiness_score: newScore },
        documents: [newDoc, ...state.startupState.documents],
        market_research: {
          ...state.startupState.market_research,
          retrieved_sources: newRetrieved
        },
        audit_trail: [newAudit, ...state.startupState.audit_trail]
      }
    };
  }),

  deleteDocumentCascade: (fileName: string) => set((state) => {
    const filteredDocs = state.startupState.documents.filter((d) => d.file_name !== fileName);
    const filteredSources = state.startupState.market_research.retrieved_sources.filter((s) => s.file_name !== fileName);
    const newAudit = {
      timestamp: new Date().toLocaleTimeString(),
      agent: "RAG Research Agent",
      action: `DOCUMENT_DELETED: ${fileName}`,
      status: "Completed",
      latency: "0.4s",
      tokens: 420,
      trace_id: `ls_${Date.now().toString().slice(-6)}`
    };

    return {
      startupState: {
        ...state.startupState,
        documents: filteredDocs,
        market_research: {
          ...state.startupState.market_research,
          retrieved_sources: filteredSources
        },
        audit_trail: [newAudit, ...state.startupState.audit_trail]
      }
    };
  }),

  updatePricingCascade: (newPricing: string) => set((state) => {
    const newTimestamp = new Date().toLocaleTimeString();
    const newAudit = {
      timestamp: newTimestamp,
      agent: "Financial Agent",
      action: `UPDATED_PRICING: ${newPricing}`,
      status: "Completed",
      latency: "0.5s",
      tokens: 850,
      trace_id: `ls_${Date.now().toString().slice(-6)}`
    };

    return {
      startupState: {
        ...state.startupState,
        business_plan: { ...state.startupState.business_plan, pricing: newPricing },
        marketing_strategy: { ...state.startupState.marketing_strategy, pricing_inr: newPricing },
        audit_trail: [newAudit, ...state.startupState.audit_trail]
      }
    };
  }),

  updateFinancialRevenueCascade: (year2RevenueCrores: number) => set((state) => {
    const updatedProjections = state.startupState.financials.projections_3y.map((p) =>
      p.year === "Year 2" ? { ...p, revenue_crores: year2RevenueCrores, revenue_lakhs: year2RevenueCrores * 100 } : p
    );

    const updatedSlides = state.startupState.investor_deck.slides.map((s) =>
      s.title.includes("Financials")
        ? { ...s, content: `Year 2 Revenue scaled to ₹${year2RevenueCrores} Crore with 18-month runway.` }
        : s
    );

    const newAudit = {
      timestamp: new Date().toLocaleTimeString(),
      agent: "Finance Agent",
      action: `UPDATED_REVENUE_TARGET: Year 2 -> ₹${year2RevenueCrores} Cr`,
      status: "Completed",
      latency: "0.8s",
      tokens: 1420,
      trace_id: `ls_${Date.now().toString().slice(-6)}`
    };

    return {
      startupState: {
        ...state.startupState,
        financials: { ...state.startupState.financials, projections_3y: updatedProjections },
        investor_deck: { ...state.startupState.investor_deck, slides: updatedSlides },
        audit_trail: [newAudit, ...state.startupState.audit_trail]
      }
    };
  }),

  createVersionSnapshot: (label: string) => set((state) => {
    const newVerNum = state.startupState.version_history.length + 1;
    const newVer = {
      id: `v${newVerNum}`,
      version_number: newVerNum,
      snapshot_label: label || `Snapshot #${newVerNum}`,
      created_at: new Date().toLocaleString()
    };
    const newAudit = {
      timestamp: new Date().toLocaleTimeString(),
      agent: "Governance Agent",
      action: `VERSION_SNAPSHOT_CREATED: ${newVer.snapshot_label}`,
      status: "Completed",
      latency: "0.6s",
      tokens: 940,
      trace_id: `ls_${Date.now().toString().slice(-6)}`
    };

    return {
      startupState: {
        ...state.startupState,
        version_history: [newVer, ...state.startupState.version_history],
        audit_trail: [newAudit, ...state.startupState.audit_trail]
      }
    };
  })
}));
