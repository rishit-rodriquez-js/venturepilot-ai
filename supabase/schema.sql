-- VenturePilot AI: Enterprise AI Startup Operating System Schema
-- Supabase PostgreSQL with pgvector & Row Level Security (RLS)

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('founder', 'mentor', 'investor', 'admin');
CREATE TYPE project_stage AS ENUM ('idea', 'validation', 'mvp', 'growth', 'scaling');
CREATE TYPE audit_action AS ENUM ('LOGIN', 'LOGOUT', 'REGISTER', 'PROJECT_CREATE', 'PROJECT_UPDATE', 'PROJECT_DELETE', 'AI_WORKFLOW_RUN', 'DOCUMENT_UPLOAD', 'RAG_SEARCH', 'VERSION_ROLLBACK');

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

-- 5. Uploaded Research Documents Table
CREATE TABLE IF NOT EXISTS public.project_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size_bytes INT NOT NULL,
    chunk_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Project Embeddings Table (pgvector)
CREATE TABLE IF NOT EXISTS public.project_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.project_documents(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RPC Stored Procedure for Cosine Similarity Search
CREATE OR REPLACE FUNCTION match_project_embeddings (
    query_embedding vector(1536),
    match_threshold float,
    match_count int,
    p_id uuid
)
RETURNS TABLE (
    id uuid,
    content_chunk text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        project_embeddings.id,
        project_embeddings.content_chunk,
        project_embeddings.metadata,
        1 - (project_embeddings.embedding <=> query_embedding) AS similarity
    FROM project_embeddings
    WHERE project_embeddings.project_id = p_id
      AND 1 - (project_embeddings.embedding <=> query_embedding) > match_threshold
    ORDER BY project_embeddings.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 8. Business Plans Table
CREATE TABLE IF NOT EXISTS public.business_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    executive_summary TEXT,
    value_proposition JSONB NOT NULL DEFAULT '[]',
    lean_canvas JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 9. Market Research & RAG Reports Table
CREATE TABLE IF NOT EXISTS public.market_researches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    tam_sam_som JSONB NOT NULL DEFAULT '{}',
    synthesized_report TEXT,
    retrieved_sources JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 10. Technical Architectures Table
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

-- 11. Financial Models Table
CREATE TABLE IF NOT EXISTS public.financial_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    mrr_target_y1 NUMERIC(12, 2) DEFAULT 10000.00,
    arr_target_y3 NUMERIC(12, 2) DEFAULT 1000000.00,
    cac_usd NUMERIC(10, 2) DEFAULT 150.00,
    ltv_usd NUMERIC(10, 2) DEFAULT 1800.00,
    monthly_burn_rate NUMERIC(12, 2) DEFAULT 25000.00,
    runway_months INT DEFAULT 18,
    projections_3y JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 12. Product Roadmaps Table
CREATE TABLE IF NOT EXISTS public.product_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    phases JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 13. Marketing Strategies Table
CREATE TABLE IF NOT EXISTS public.marketing_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    channels JSONB NOT NULL DEFAULT '[]',
    campaign_sequence JSONB NOT NULL DEFAULT '[]',
    positioning_statement TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 14. Investor Decks Table
CREATE TABLE IF NOT EXISTS public.investor_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    slides JSONB NOT NULL DEFAULT '[]',
    qa_defense JSONB NOT NULL DEFAULT '[]',
    scorecard JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- 15. Governance Snapshots Table
CREATE TABLE IF NOT EXISTS public.project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot_label TEXT NOT NULL,
    snapshot_data JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    action audit_action NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_researches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_architectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles self policy" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Projects owner policy" ON public.projects FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Embeddings owner policy" ON public.project_embeddings FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_embeddings.project_id AND projects.owner_id = auth.uid()));
