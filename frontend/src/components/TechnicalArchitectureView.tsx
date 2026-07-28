"use client";

import React, { useState } from 'react';
import { Cpu, ShieldCheck, Database, Server, Code, ArrowRight, Layers, Lock, Zap, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

interface TechArchProps {
  data?: any;
}

export const TechnicalArchitectureView: React.FC<TechArchProps> = ({ data }) => {
  const [selectedNode, setSelectedNode] = useState<string>('langgraph');

  const nodes = [
    {
      id: 'frontend',
      label: '1. Frontend Tier',
      sub: 'Next.js 15 + React 19',
      color: 'border-cyan-400 bg-cyan-50/50 text-cyan-700',
      badge: 'Client / CDN',
      details: 'Next.js 15 App Router with Server Side Rendering (@supabase/ssr), Zustand state synchronization, dynamic imports, and Framer Motion UI.'
    },
    {
      id: 'api',
      label: '2. API Gateway',
      sub: 'FastAPI Python 3.12',
      color: 'border-indigo-400 bg-indigo-50/50 text-indigo-700',
      badge: 'ASGI / CORS',
      details: 'High-performance FastAPI async router with JWT bearer security, dependency injection, endpoint isolation, and rate-limiting middleware.'
    },
    {
      id: 'langgraph',
      label: '3. Agent Swarm',
      sub: 'LangGraph Orchestrator',
      color: 'border-purple-400 bg-purple-50/50 text-purple-700',
      badge: 'Multi-Agent',
      details: 'Autonomous stateful graph orchestrator routing tasks across Planner, Research, Finance, Architecture, Marketing, and Investor agents.'
    },
    {
      id: 'openai',
      label: '4. AI Engine',
      sub: 'OpenAI GPT-4o API',
      color: 'border-emerald-400 bg-emerald-50/50 text-emerald-700',
      badge: 'LLM & Embeddings',
      details: 'GPT-4o model for complex reasoning & synthesis alongside text-embedding-3-small (1536 dimensions) for semantic document chunking.'
    },
    {
      id: 'supabase',
      label: '5. Vector DB',
      sub: 'Supabase pgvector',
      color: 'border-[#5B5CEB] bg-indigo-50/50 text-[#5B5CEB]',
      badge: 'PostgreSQL',
      details: 'Managed Supabase PostgreSQL database with pgvector extension, RPC cosine similarity match functions, and strict Row Level Security (RLS).'
    },
    {
      id: 'storage',
      label: '6. Storage Bucket',
      sub: 'Supabase Storage',
      color: 'border-amber-400 bg-amber-50/50 text-amber-700',
      badge: 'S3 Protocol',
      details: 'Encrypted object storage for uploaded PDFs, generated PPTX investor decks, XLSX financial models, and master ZIP bundles.'
    },
    {
      id: 'langsmith',
      label: '7. Observability',
      sub: 'LangSmith Tracing',
      color: 'border-rose-400 bg-rose-50/50 text-rose-700',
      badge: 'Real-time Trace',
      details: 'End-to-end LLM observability capturing execution latency, token counts, cost breakdown, hallucination index, and trace URLs.'
    }
  ];

  const activeNodeObj = nodes.find((n) => n.id === selectedNode) || nodes[2];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#5B5CEB]" />
          <span>Interactive System Architecture Topology</span>
        </h2>
        <p className="text-xs text-[#64748B]">Click any architectural node to expand data flow specs, security boundaries, and API schemas.</p>
      </div>

      {/* INTERACTIVE ARCHITECTURE NODE FLOW DIAGRAM */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#26C281]" />
            <span>End-to-End Execution Flow Pipeline</span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-50 text-[#26C281] font-bold border border-emerald-200">
            System Healthy
          </span>
        </div>

        {/* Node Flow Track */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 relative">
          {nodes.map((n, idx) => (
            <React.Fragment key={n.id}>
              <button
                onClick={() => setSelectedNode(n.id)}
                className={`p-3 rounded-2xl border text-left transition transform hover:scale-[1.02] flex flex-col justify-between space-y-2 ${
                  selectedNode === n.id ? `${n.color} shadow-lg ring-2 ring-[#5B5CEB]/30` : 'border-slate-200 bg-[#F7F8FC] text-slate-700'
                }`}
              >
                <div>
                  <div className="text-[9px] font-extrabold uppercase tracking-wider opacity-75">{n.badge}</div>
                  <div className="text-xs font-extrabold truncate mt-0.5">{n.label}</div>
                  <div className="text-[10px] opacity-80 truncate">{n.sub}</div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[9px] font-bold">
                  <span>Step 0{idx + 1}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Selected Node Details Box */}
        <div className="p-5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-sm text-[#0F172A]">
              <Zap className="w-4 h-4 text-[#5B5CEB]" />
              <span>{activeNodeObj.label} Specification</span>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white text-[#5B5CEB] border border-slate-200">
              {activeNodeObj.badge}
            </span>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed font-medium">
            {activeNodeObj.details}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-[#64748B]">Latency Budget</div>
              <div className="font-extrabold text-[#26C281]">&lt; 150ms</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-[#64748B]">Security Level</div>
              <div className="font-extrabold text-[#5B5CEB]">AES-256 / RLS</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-[#64748B]">State Sync</div>
              <div className="font-extrabold text-[#8C52FF]">Zustand + FastAPI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-exec-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5B5CEB] uppercase tracking-wider">
            <Code className="w-4 h-4" />
            <span>Frontend Tier</span>
          </div>
          <ul className="space-y-2 text-xs text-[#64748B]">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> Next.js 15 App Router</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> React 19</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> TypeScript 5.7</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> Tailwind CSS + Framer</li>
          </ul>
        </div>

        <div className="glass-exec-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00C6AE] uppercase tracking-wider">
            <Server className="w-4 h-4" />
            <span>Backend Services</span>
          </div>
          <ul className="space-y-2 text-xs text-[#64748B]">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> FastAPI Python 3.12</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> LangGraph Swarm</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> SQLAlchemy 2.0 ORM</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> Uvicorn ASGI Server</li>
          </ul>
        </div>

        <div className="glass-exec-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C52FF] uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Database & RAG</span>
          </div>
          <ul className="space-y-2 text-xs text-[#64748B]">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> Supabase PostgreSQL</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> pgvector Extension</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> text-embedding-3-small</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> Cosine RPC Match</li>
          </ul>
        </div>

        <div className="glass-exec-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#26C281] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Security Posture</span>
          </div>
          <ul className="space-y-2 text-xs text-[#64748B]">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> Row Level Security (RLS)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> JWT Bearer Auth</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> LangSmith Trace Log</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" /> DPIIT Regulatory Guard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
