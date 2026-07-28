-- VenturePilot AI: Enterprise AI Startup Operating System Schema
-- Supabase PostgreSQL with pgvector & Row Level Security (RLS)

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('founder', 'mentor', 'investor', 'admin');
CREATE TYPE project_stage AS ENUM ('idea', 'validation', 'mvp', 'growth', 'scaling');
CREATE TYPE audit_action AS ENUM ('LOGIN', 'LOGOUT', 'REGISTER', 'PROJECT_CREATE', 'PROJECT_UPDATE', 'PROJECT_DELETE', 'AI_WORKFLOW_RUN', 'VERSION_ROLLBACK');

-- 1. Profiles Table (extends Supabase auth.users)
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

-- 2. User Roles Table (RBAC Mapping)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'founder',
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 3. User Sessions Audit Table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT,
    industry TEXT NOT NULL,
    target_market TEXT,
    problem_statement TEXT NOT NULL,
    solution_overview TEXT NOT NULL,
    stage project_stage NOT NULL DEFAULT 'idea',
    readiness_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Lean Canvases Table
CREATE TABLE IF NOT EXISTS public.lean_canvases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    problem JSONB NOT NULL DEFAULT '[]',
    solution JSONB NOT NULL DEFAULT '[]',
    key_metrics JSONB NOT NULL DEFAULT '[]',
    value_proposition JSONB NOT NULL DEFAULT '[]',
    unfair_advantage JSONB NOT NULL DEFAULT '[]',
    channels JSONB NOT NULL DEFAULT '[]',
    customer_segments JSONB NOT NULL DEFAULT '[]',
    cost_structure JSONB NOT NULL DEFAULT '[]',
    revenue_streams JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 6. Market Intelligence Table
CREATE TABLE IF NOT EXISTS public.market_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    tam_billions NUMERIC(10, 2),
    sam_billions NUMERIC(10, 2),
    som_millions NUMERIC(10, 2),
    competitors JSONB NOT NULL DEFAULT '[]',
    industry_trends JSONB NOT NULL DEFAULT '[]',
    swot_analysis JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 7. Technical Architectures Table
CREATE TABLE IF NOT EXISTS public.technical_architectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    frontend_stack JSONB NOT NULL DEFAULT '[]',
    backend_stack JSONB NOT NULL DEFAULT '[]',
    database_stack JSONB NOT NULL DEFAULT '[]',
    ai_stack JSONB NOT NULL DEFAULT '[]',
    infrastructure_stack JSONB NOT NULL DEFAULT '[]',
    system_diagram_mermaid TEXT,
    security_posture JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 8. Financial Forecasts Table
CREATE TABLE IF NOT EXISTS public.financial_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    mrr_target_y1 NUMERIC(12, 2) DEFAULT 10000.00,
    arr_target_y3 NUMERIC(12, 2) DEFAULT 1000000.00,
    cac_usd NUMERIC(10, 2) DEFAULT 150.00,
    ltv_usd NUMERIC(10, 2) DEFAULT 1800.00,
    monthly_burn_rate NUMERIC(12, 2) DEFAULT 25000.00,
    runway_months INT DEFAULT 18,
    financial_model JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 9. GTM & Investor Readiness Table
CREATE TABLE IF NOT EXISTS public.investor_readiness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    overall_score INT DEFAULT 75,
    team_score INT DEFAULT 80,
    market_score INT DEFAULT 85,
    product_score INT DEFAULT 70,
    financial_score INT DEFAULT 65,
    go_to_market_strategy JSONB NOT NULL DEFAULT '[]',
    pitch_deck_slides JSONB NOT NULL DEFAULT '[]',
    investor_qa_pairs JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 10. Governance & Project Version Snapshots Table
CREATE TABLE IF NOT EXISTS public.project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot_label TEXT NOT NULL,
    snapshot_data JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Enterprise Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    action audit_action NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    ip_address TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Project Embeddings Table (pgvector)
CREATE TABLE IF NOT EXISTS public.project_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES (Row Level Security)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lean_canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_architectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_embeddings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read & update their own profile; admins can read all
CREATE POLICY "Profiles self policy" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Projects: owners can CRUD their projects; admins full access
CREATE POLICY "Projects owner policy" ON public.projects
    FOR ALL USING (auth.uid() = owner_id);

-- Child tables: accessible if user owns parent project
CREATE POLICY "Lean canvases owner policy" ON public.lean_canvases
    FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = lean_canvases.project_id AND projects.owner_id = auth.uid()));

CREATE POLICY "Market intelligence owner policy" ON public.market_intelligence
    FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = market_intelligence.project_id AND projects.owner_id = auth.uid()));

CREATE POLICY "Technical architecture owner policy" ON public.technical_architectures
    FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = technical_architectures.project_id AND projects.owner_id = auth.uid()));

CREATE POLICY "Financial forecasts owner policy" ON public.financial_forecasts
    FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = financial_forecasts.project_id AND projects.owner_id = auth.uid()));

CREATE POLICY "Investor readiness owner policy" ON public.investor_readiness
    FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = investor_readiness.project_id AND projects.owner_id = auth.uid()));

CREATE POLICY "Audit logs user policy" ON public.audit_logs
    FOR ALL USING (user_id = auth.uid());
