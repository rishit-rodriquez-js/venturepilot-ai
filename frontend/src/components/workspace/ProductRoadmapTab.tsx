"use client";

import React, { useState } from 'react';
import { Map, Calendar, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AIMetadataBadge, EmptyState } from './WorkspaceUIUtils';

interface RoadmapProps {
  data?: any;
  projectId?: string;
  onRefetch?: () => void;
}

export const ProductRoadmapTab: React.FC<RoadmapProps> = ({ data, projectId, onRefetch }) => {
  const rm = data || {};
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!projectId) return;
    setIsRegenerating(true);
    try {
      await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: "Synthesize 3 quarterly product roadmap release phases with deliverables"
      });
      if (onRefetch) onRefetch();
    } catch (err: any) {
      alert(`Roadmap Execution Failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const phases = rm.phases || [];
  const isDataPresent = rm && phases.length > 0;

  if (!isDataPresent) {
    return (
      <EmptyState
        title="Product Roadmap Has Not Been Generated Yet"
        description="Run the Chief Product Officer Agent to synthesize quarterly release phases, timeline milestones, and core engineering deliverables."
        actionText="Synthesize Product Roadmap (GPT-4o)"
        isLoading={isRegenerating}
        onAction={handleRegenerate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-50 text-[#FFB648] border border-amber-200">
              <Map className="w-4 h-4" />
            </div>
            <span>Autonomous Product Roadmap & Release Phases</span>
          </h2>
          <p className="text-xs text-[#64748B]">Synthesized by CPO Product Roadmap Agent with Supabase database persistence.</p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] text-xs font-bold hover:border-[#FFB648] shadow-2xs inline-flex items-center gap-1.5 disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#FFB648] ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Roadmap'}</span>
        </button>
      </div>

      {/* AI Metadata Badge */}
      <AIMetadataBadge
        agent="CPO Product Roadmap Agent"
        model="gpt-4o"
        tokens={rm._tokens || 300}
        latencyMs={rm._latency_ms}
        traceId={rm.trace_id}
        traceUrl={rm.langsmith_trace_url}
        confidence="94%"
      />

      {/* Roadmap Timeline Cards */}
      <div className="space-y-4">
        {phases.map((ph: any, idx: number) => (
          <div key={idx} className="glass-exec-card p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {ph.phase || `Phase ${idx + 1}`}
                </span>
                <span className="font-extrabold text-[#0F172A] text-sm">{ph.title}</span>
              </div>
              <span className="text-xs font-bold text-[#5B5CEB] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {ph.timeline}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Engineering Deliverables:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(ph.deliverables || []).map((d: string, dIdx: number) => (
                  <div key={dIdx} className="flex items-start gap-2 text-xs text-[#0F172A] font-medium p-2 rounded-xl bg-[#F7F8FC]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#26C281] shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
