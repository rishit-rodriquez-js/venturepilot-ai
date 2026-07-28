"use client";

import React from 'react';
import { Cpu, ShieldCheck, Database, Server, Code, Terminal } from 'lucide-react';

interface TechArchProps {
  data?: any;
}

export const TechnicalArchitectureView: React.FC<TechArchProps> = ({ data }) => {
  const stack = {
    frontend: data?.frontend_stack || ["Next.js 15 App Router", "React 19", "TypeScript", "Tailwind CSS", "Zustand State", "Framer Motion"],
    backend: data?.backend_stack || ["FastAPI Python 3.12", "SQLAlchemy 2.0", "Uvicorn ASGI Engine", "LangGraph Workflow Agents"],
    database: data?.database_stack || ["Supabase Managed PostgreSQL", "pgvector Vector Store", "Row Level Security (RLS)"],
    ai: data?.ai_stack || ["OpenAI GPT-4o API", "LangChain Orchestration", "LangSmith Tracing & Observability"],
    security: data?.security_posture || ["JWT Bearer Authentication", "Role-Based Access Control (RBAC)", "Immutable Audit Trail Logging", "AES-256 Data Encryption"]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Technical Architecture Blueprint</span>
        </h2>
        <p className="text-xs text-slate-400">Enterprise technology stack, system boundary diagram, and security posture.</p>
      </div>

      {/* Grid of Stack Layers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
            <Code className="w-4 h-4" />
            <span>Frontend Tier</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {stack.frontend.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
            <Server className="w-4 h-4" />
            <span>Backend Engine</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {stack.backend.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">
            <Database className="w-4 h-4" />
            <span>Database & Vectors</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {stack.database.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Security Posture</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {stack.security.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mermaid Architecture Code Block */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>System Architecture Topology (Mermaid Diagram)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">system_architecture.mmd</span>
        </div>
        <pre className="text-xs font-mono text-cyan-300 overflow-x-auto p-3 bg-slate-900/80 rounded-lg border border-slate-800">
{`graph TD
  Client[Next.js 15 Client - React 19] -->|REST / JSON + Supabase JWT| API[FastAPI Enterprise Router]
  API --> Security[Supabase Auth & RBAC Middleware]
  API --> LangGraph[LangGraph Multi-Agent Engine]
  LangGraph --> OpenAI[OpenAI GPT-4o API]
  LangGraph --> LangSmith[LangSmith Tracing & Evaluation]
  API --> Postgres[(Supabase PostgreSQL + pgvector)]
  Postgres --> RLS[Row Level Security Enforcement]`}
        </pre>
      </div>
    </div>
  );
};
