"use client";

import React, { useState } from 'react';
import { Target, Shield, Globe, Building2, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AIMetadataBadge, EmptyState } from './WorkspaceUIUtils';

interface CompProps {
  data?: any;
  projectId?: string;
  onRefetch?: () => void;
}

export const CompetitorAnalysisTab: React.FC<CompProps> = ({ data, projectId, onRefetch }) => {
  console.log("[Pipeline Audit - Stage 4 & 5: CompetitorAnalysisTab Rendered]", data);
  const comp = data || {};
  const [region, setRegion] = useState<'India' | 'Global'>('India');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!projectId) return;
    setIsRegenerating(true);
    try {
      await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: "Identify market competitors, gap analysis, and competitive moat"
      });
      if (onRefetch) onRefetch();
    } catch (err: any) {
      alert(`Competitor Execution Failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const competitors = comp.competitors || [];
  const isDataPresent = comp && (competitors.length > 0 || comp.gap_analysis || comp.competitive_advantage);

  if (!isDataPresent) {
    return (
      <EmptyState
        title="Competitor & Moat Analysis Has Not Been Generated Yet"
        description="Run the Competitive Intelligence Agent to analyze market incumbents, statutory gap analysis, and sustainable competitive advantages."
        actionText="Run Moat & Competitor Analysis (GPT-4o)"
        isLoading={isRegenerating}
        onAction={handleRegenerate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-50 text-[#5B5CEB] border border-indigo-200">
              <Target className="w-4 h-4" />
            </div>
            <span>Competitor & Strategic Moat Analysis</span>
          </h2>
          <p className="text-xs text-[#64748B]">Synthesized by Competitive Intelligence Agent with Supabase DB persistence.</p>
        </div>

        <div className="flex items-center gap-2">
          {projectId && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] text-xs font-bold hover:border-[#5B5CEB] shadow-2xs inline-flex items-center gap-1.5 disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#5B5CEB] ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Analysis'}</span>
            </button>
          )}

          {/* Region Selector */}
          <div className="flex items-center gap-1.5 bg-[#F7F8FC] p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setRegion('India')}
              className={`px-3 py-1 rounded-xl transition ${
                region === 'India' ? 'bg-[#5B5CEB] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              India (₹ Cr)
            </button>
            <button
              onClick={() => setRegion('Global')}
              className={`px-3 py-1 rounded-xl transition ${
                region === 'Global' ? 'bg-[#5B5CEB] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Global ($ USD)
            </button>
          </div>
        </div>
      </div>

      {/* AI Metadata Badge */}
      <AIMetadataBadge
        agent="Competitive Intelligence Agent"
        model="gpt-4o"
        tokens={comp._tokens || 350}
        latencyMs={comp._latency_ms}
        traceId={comp.trace_id}
        traceUrl={comp.langsmith_trace_url}
        confidence="95%"
      />

      {/* Competitors Matrix Table */}
      {competitors.length > 0 && (
        <div className="glass-exec-card p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center justify-between">
            <span>Competitive Landscape Comparison</span>
            <span className="text-[10px] text-[#64748B] font-mono">Currency: {region === 'India' ? 'INR (₹)' : 'USD ($)'}</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[#64748B] font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Competitor Name</th>
                  <th className="py-2.5 px-3">Funding / Scale</th>
                  <th className="py-2.5 px-3">Core Strength</th>
                  <th className="py-2.5 px-3">Key Weakness</th>
                  <th className="py-2.5 px-3">Defensible Moat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {competitors.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-[#0F172A]">{item.name}</td>
                    <td className="py-3 px-3 text-[#5B5CEB] font-bold">{item.funding}</td>
                    <td className="py-3 px-3 text-[#26C281]">{item.strength}</td>
                    <td className="py-3 px-3 text-rose-600">{item.weakness}</td>
                    <td className="py-3 px-3 font-bold text-[#8C52FF]">{item.moat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gap Analysis & Moat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-exec-card p-6 space-y-2">
          <h3 className="text-xs font-extrabold text-[#5B5CEB] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#5B5CEB]" />
            <span>Market Gap Analysis</span>
          </h3>
          <p className="text-xs text-[#0F172A] leading-relaxed font-medium">
            {comp.gap_analysis || "Waiting for AI generation..."}
          </p>
        </div>

        <div className="glass-exec-card p-6 space-y-2">
          <h3 className="text-xs font-extrabold text-[#26C281] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#26C281]" />
            <span>Competitive Advantage & Moat</span>
          </h3>
          <p className="text-xs text-[#0F172A] leading-relaxed font-medium">
            {comp.competitive_advantage || "Waiting for AI generation..."}
          </p>
        </div>
      </div>
    </div>
  );
};
