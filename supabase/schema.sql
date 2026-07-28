-- VenturePilot AI: Production-Grade Supabase PostgreSQL Relational Schema
-- Enables pgvector extension, 24 core normalized tables, automatic triggers, RLS policies, indexes, and storage buckets.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('founder', 'mentor', 'investor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_stage AS ENUM ('idea', 'validation', 'mvp', 'growth', 'scaling');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('Processing', 'Running', 'Ready', 'Completed', 'Failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    company TEXT,
    role user_role NOT NULL DEFAULT 'founder',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT,
    industry TEXT NOT NULL,
    target_market TEXT,
    problem_statement TEXT NOT NULL,
    solution_overview TEXT NOT NULL,
    funding_goal TEXT DEFAULT '₹2.0 Crore',
    business_model TEXT DEFAULT 'SaaS Subscription + Marketplace',
    stage project_stage NOT NULL DEFAULT 'idea',
    readiness_score INT DEFAULT 75,
    status project_status NOT NULL DEFAULT 'Running',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. BUSINESS PLANS TABLE
CREATE TABLE IF NOT EXISTS public.business_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    executive_summary TEXT,
    vision TEXT,
    mission TEXT,
    problem TEXT,
    solution TEXT,
    target_customer TEXT,
    pricing TEXT,
    usp TEXT,
    version TEXT DEFAULT 'v1.0',
    generated_by TEXT DEFAULT 'Planner Agent',
    sources JSONB NOT NULL DEFAULT '[]',
    value_proposition JSONB NOT NULL DEFAULT '[]',
    lean_canvas JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MARKET RESEARCH TABLE
CREATE TABLE IF NOT EXISTS public.market_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    query TEXT,
    tam_sam_som JSONB NOT NULL DEFAULT '{"tam_inr_cr": 100000, "sam_inr_cr": 25000, "som_inr_cr": 1000}',
    synthesized_report TEXT,
    retrieved_sources JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. COMPETITOR ANALYSIS TABLE
CREATE TABLE IF NOT EXISTS public.competitor_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    competitors JSONB NOT NULL DEFAULT '[]',
    gap_analysis TEXT,
    opportunity_matrix TEXT,
    competitive_advantage TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TECHNICAL ARCHITECTURE TABLE
CREATE TABLE IF NOT EXISTS public.technical_architecture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    frontend_stack JSONB NOT NULL DEFAULT '["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS"]',
    backend_stack JSONB NOT NULL DEFAULT '["FastAPI", "Python 3.13", "LangGraph", "LangChain"]',
    database_stack JSONB NOT NULL DEFAULT '["Supabase PostgreSQL", "pgvector"]',
    ai_stack JSONB NOT NULL DEFAULT '["OpenAI gpt-4o", "LangSmith", "RAG Pipeline"]',
    security_posture JSONB NOT NULL DEFAULT '["Supabase Auth", "Row Level Security (RLS)", "JWT Validation"]',
    system_diagram_mermaid TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. FINANCIAL MODELS TABLE
CREATE TABLE IF NOT EXISTS public.financial_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    currency TEXT DEFAULT 'INR',
    monthly_burn_rate_inr NUMERIC(12, 2) DEFAULT 250000.00,
    runway_months INT DEFAULT 18,
    breakeven_month TEXT DEFAULT 'Month 12',
    seed_ask_inr TEXT DEFAULT '₹1.0 Crore',
    costs JSONB NOT NULL DEFAULT '[]',
    projections_3y JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PRODUCT ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS public.product_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    milestones JSONB NOT NULL DEFAULT '[]',
    phases JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. MARKETING STRATEGIES TABLE
CREATE TABLE IF NOT EXISTS public.marketing_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    icp TEXT,
    channels JSONB NOT NULL DEFAULT '[]',
    pricing_inr TEXT,
    campaign_sequence JSONB NOT NULL DEFAULT '[]',
    positioning_statement TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. INVESTOR DECKS TABLE
CREATE TABLE IF NOT EXISTS public.investor_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    overall_score INT DEFAULT 78,
    team_score INT DEFAULT 80,
    market_score INT DEFAULT 82,
    product_score INT DEFAULT 75,
    financial_score INT DEFAULT 75,
    slides JSONB NOT NULL DEFAULT '[]',
    qa_defense JSONB NOT NULL DEFAULT '[]',
    scorecard JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'pdf',
    file_size_bytes INT NOT NULL DEFAULT 0,
    chunk_count INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Ready',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. DOCUMENT CHUNKS TABLE
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. EMBEDDINGS TABLE (pgvector)
CREATE TABLE IF NOT EXISTS public.embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id UUID REFERENCES public.document_chunks(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    content TEXT NOT NULL,
    trace_id TEXT,
    agent_timeline JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. AGENT RUNS TABLE
CREATE TABLE IF NOT EXISTS public.agent_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    agent_name TEXT NOT NULL,
    action TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Completed',
    latency_ms INT DEFAULT 0,
    tokens_consumed INT DEFAULT 0,
    trace_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. WORKFLOW STATE TABLE
CREATE TABLE IF NOT EXISTS public.workflow_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    active_agent TEXT DEFAULT 'Planner Agent',
    execution_step INT DEFAULT 1,
    status TEXT DEFAULT 'Running',
    last_run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. EVALUATIONS TABLE
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    faithfulness_score NUMERIC(5, 2) DEFAULT 94.50,
    answer_relevance_score NUMERIC(5, 2) DEFAULT 96.20,
    hallucination_index NUMERIC(5, 2) DEFAULT 0.02,
    latency_ms INT DEFAULT 1420,
    tokens_consumed INT DEFAULT 4250,
    langsmith_trace_url TEXT DEFAULT 'https://smith.langchain.com',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. DOWNLOADS TABLE
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. PROJECT VERSIONS TABLE
CREATE TABLE IF NOT EXISTS public.project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot_label TEXT NOT NULL,
    snapshot_data JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. STARTUP METRICS TABLE
CREATE TABLE IF NOT EXISTS public.startup_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    validation_score INT DEFAULT 80,
    market_score INT DEFAULT 75,
    finance_score INT DEFAULT 70,
    investor_score INT DEFAULT 75,
    readiness_score INT DEFAULT 75,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 23. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    agent TEXT DEFAULT 'System Engine',
    action TEXT NOT NULL,
    status TEXT DEFAULT 'Completed',
    latency TEXT DEFAULT '1.0s',
    tokens INT DEFAULT 1000,
    trace_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 24. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 25. INTEGRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    status TEXT DEFAULT 'Connected',
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 26. API KEYS TABLE
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 27. AUTOMATIC TIMESTAMP TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.columns WHERE column_name = 'updated_at' AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS tr_updated_at_%I ON public.%I', t, t);
        EXECUTE format('CREATE TRIGGER tr_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t, t);
    END LOOP;
END $$;

-- 28. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, company, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'company', 'My Startup'),
        'founder'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 29. STORAGE BUCKETS INITIALIZATION
INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true),
('documents', 'documents', false),
('downloads', 'downloads', false),
('investor-decks', 'investor-decks', false),
('presentations', 'presentations', false),
('pitch-pdfs', 'pitch-pdfs', false),
('images', 'images', true),
('rag-cache', 'rag-cache', false)
ON CONFLICT (id) DO NOTHING;

-- 30. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_architecture ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Profiles self management" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Projects owner management" ON public.projects FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Business plan owner policy" ON public.business_plans FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Market research owner policy" ON public.market_research FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Competitor analysis owner policy" ON public.competitor_analysis FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Tech architecture owner policy" ON public.technical_architecture FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Financial models owner policy" ON public.financial_models FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Product roadmaps owner policy" ON public.product_roadmaps FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Marketing strategies owner policy" ON public.marketing_strategies FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Investor decks owner policy" ON public.investor_decks FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Documents owner policy" ON public.documents FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Document chunks owner policy" ON public.document_chunks FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Embeddings owner policy" ON public.embeddings FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Chat messages owner policy" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Agent runs owner policy" ON public.agent_runs FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Workflow state owner policy" ON public.workflow_state FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Evaluations owner policy" ON public.evaluations FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Downloads owner policy" ON public.downloads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Project versions owner policy" ON public.project_versions FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Startup metrics owner policy" ON public.startup_metrics FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Audit logs owner policy" ON public.audit_logs FOR ALL USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Notifications owner policy" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Integrations owner policy" ON public.integrations FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Api keys owner policy" ON public.api_keys FOR ALL USING (auth.uid() = user_id);

-- 31. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON public.documents(project_id);
CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_project_id ON public.embeddings(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON public.chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project_id ON public.audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON public.embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
