"use client";

import React, { useState } from 'react';
import { Cpu, ShieldCheck, Database, Server, Code, Layers, Zap, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AIMetadataBadge, EmptyState } from './workspace/WorkspaceUIUtils';

interface TechArchProps {
  data?: any;
  projectId?: string;
  onRefetch?: () => void;
}

export const TechnicalArchitectureView: React.FC<TechArchProps> = ({ data, projectId, onRefetch }) => {
  const ta = data || {};
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!projectId) return;
    setIsGenerating(true);
    try {
      await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: "Synthesize System Architecture and Technical Topology"
      });
      if (onRefetch) onRefetch();
    } catch (err: any) {
      alert(`Backend Execution Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const stack = ta.stack || {};
  const topology = ta.system_topology;
  const isDataPresent = ta && (topology || stack.frontend || stack.backend);

  if (!isDataPresent) {
    return (
      <EmptyState
        title="Technical Architecture Has Not Been Generated Yet"
        description="Run the Enterprise Solution Architect Agent to synthesize technical topology, API stack, vector database isolation, and security infrastructure."
        actionText="Synthesize System Architecture (GPT-4o)"
        isLoading={isGenerating}
        onAction={handleRegenerate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-50 text-[#5B5CEB] border border-indigo-200">
              <Cpu className="w-4 h-4" />
            </div>
            <span>Enterprise Technical Architecture Topology</span>
          </h2>
          <p className="text-xs text-[#64748B]">Synthesized by Solution Architect Agent with Supabase database persistence.</p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] text-xs font-bold hover:border-[#5B5CEB] shadow-2xs inline-flex items-center gap-1.5 disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#5B5CEB] ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Regenerating...' : 'Regenerate Architecture'}</span>
        </button>
      </div>

      {/* AI Metadata Badge */}
      <AIMetadataBadge
        agent="Solution Architect Agent"
        model="gpt-4o"
        tokens={ta._tokens || 300}
        latencyMs={ta._latency_ms}
        traceId={ta.trace_id}
        traceUrl={ta.langsmith_trace_url}
        confidence="96%"
      />

      {/* Stack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-exec-card p-5 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-[#64748B]">Frontend Tier</div>
          <div className="text-sm font-extrabold text-[#5B5CEB]">{stack.frontend || "Next.js 15 / React 19"}</div>
        </div>

        <div className="glass-exec-card p-5 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-[#64748B]">Backend Orchestrator</div>
          <div className="text-sm font-extrabold text-[#8C52FF]">{stack.backend || "FastAPI / Python 3.13"}</div>
        </div>

        <div className="glass-exec-card p-5 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-[#64748B]">AI Agent Swarm</div>
          <div className="text-sm font-extrabold text-[#00C6AE]">{stack.ai_orchestrator || "LangGraph / GPT-4o"}</div>
        </div>

        <div className="glass-exec-card p-5 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-[#64748B]">Vector Database</div>
          <div className="text-sm font-extrabold text-[#26C281]">{stack.vector_database || "Supabase pgvector"}</div>
        </div>
      </div>

      {/* Topology Overview Card */}
      {topology && (
        <div className="glass-exec-card p-6 space-y-3">
          <h3 className="text-xs font-extrabold text-[#5B5CEB] uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-[#5B5CEB]" />
            <span>System Topology & Security Architecture</span>
          </h3>
          <p className="text-xs text-[#0F172A] leading-relaxed font-medium whitespace-pre-wrap">
            {topology}
          </p>
        </div>
      )}
    </div>
  );
};
