"use client";

import React, { useState } from 'react';
import { Layers, RefreshCw, Sparkles, Database } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AIMetadataBadge, EmptyState } from './WorkspaceUIUtils';

interface PlanProps {
  data?: any;
  projectId?: string;
  onRefetch?: () => void;
}

export const BusinessPlanTab: React.FC<PlanProps> = ({ data, projectId, onRefetch }) => {
  console.log("[Pipeline Audit - Stage 4 & 5: BusinessPlanTab Rendered]", data);
  const bp = data || {};
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeRegenSection, setActiveRegenSection] = useState<string | null>(null);

  const handleRegenerate = async (section: string) => {
    if (!projectId) return;
    setIsRegenerating(true);
    setActiveRegenSection(section);
    try {
      await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: `Regenerate section: ${section}`
      });
      if (onRefetch) onRefetch();
    } catch (err: any) {
      alert(`Backend Execution Failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsRegenerating(false);
      setActiveRegenSection(null);
    }
  };

  const isDataPresent = bp && (bp.executive_summary || bp.vision || bp.problem || bp.solution);

  if (!isDataPresent) {
    return (
      <EmptyState
        title="Business Plan Has Not Been Generated Yet"
        description="Run the autonomous LangGraph Planner Agent to synthesize your executive summary, vision, mission, problem, solution, pricing, and USP."
        actionText="Synthesize Business Plan (GPT-4o)"
        isLoading={isRegenerating}
        onAction={() => handleRegenerate("Complete Business Plan")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-50 text-[#5B5CEB] border border-indigo-200">
              <Layers className="w-4 h-4" />
            </div>
            <span>Autonomous Business Plan & Strategic Blueprint</span>
          </h2>
          <p className="text-xs text-[#64748B]">Synthesized by LangGraph Planner Agent using OpenAI GPT-4o with Supabase DB persistence.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRegenerate("Complete Business Plan")}
            disabled={isRegenerating}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] text-xs font-bold hover:border-[#5B5CEB] shadow-2xs inline-flex items-center gap-1.5 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5B5CEB] ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Plan'}</span>
          </button>
        </div>
      </div>

      {/* AI Metadata Badge */}
      <AIMetadataBadge
        agent="Planner Agent"
        model="gpt-4o"
        tokens={bp._tokens || 450}
        latencyMs={bp._latency_ms}
        traceId={bp.trace_id}
        traceUrl={bp.langsmith_trace_url}
        confidence="96%"
      />

      {/* Executive Summary Section */}
      <div className="glass-exec-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#5B5CEB] uppercase tracking-wider">1. Executive Summary</h3>
          <span className="text-[10px] font-mono text-slate-500">Version: {bp.version || "v1.0"}</span>
        </div>
        <p className="text-xs text-[#0F172A] leading-relaxed font-medium">
          {bp.executive_summary || "Waiting for AI generation..."}
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-exec-card p-5 space-y-2">
          <h3 className="text-xs font-extrabold text-[#8C52FF] uppercase tracking-wider">2. Strategic Vision</h3>
          <p className="text-xs text-[#0F172A] leading-relaxed">
            {bp.vision || "Waiting for AI generation..."}
          </p>
        </div>

        <div className="glass-exec-card p-5 space-y-2">
          <h3 className="text-xs font-extrabold text-[#00C6AE] uppercase tracking-wider">3. Core Mission</h3>
          <p className="text-xs text-[#0F172A] leading-relaxed">
            {bp.mission || "Waiting for AI generation..."}
          </p>
        </div>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-exec-card p-5 space-y-2">
          <h3 className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">4. Problem Statement</h3>
          <p className="text-xs text-[#0F172A] leading-relaxed">
            {bp.problem || "Waiting for AI generation..."}
          </p>
        </div>

        <div className="glass-exec-card p-5 space-y-2">
          <h3 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">5. Solution Overview</h3>
          <p className="text-xs text-[#0F172A] leading-relaxed">
            {bp.solution || "Waiting for AI generation..."}
          </p>
        </div>
      </div>

      {/* Target ICP, Pricing & USP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-exec-card p-5 space-y-2">
          <h3 className="text-xs font-extrabold text-[#5B5CEB] uppercase tracking-wider">6. Target Customer (ICP)</h3>
          <p className="text-xs text-[#0F172A] leading-relaxed">
            {bp.target_customer || "Waiting for AI generation..."}
          </p>
        </div>

        <div className="glass-exec-card p-5 space-y-2">
          <h3 className="text-xs font-extrabold text-[#8C52FF] uppercase tracking-wider">7. Monetization & Pricing</h3>
          <p className="text-xs text-[#0F172A] leading-relaxed">
            {bp.pricing || "Waiting for AI generation..."}
          </p>
        </div>

        <div className="glass-exec-card p-5 space-y-2">
          <h3 className="text-xs font-extrabold text-[#26C281] uppercase tracking-wider">8. Unique Selling Proposition</h3>
          <p className="text-xs text-[#0F172A] leading-relaxed">
            {bp.usp || "Waiting for AI generation..."}
          </p>
        </div>
      </div>
    </div>
  );
};
