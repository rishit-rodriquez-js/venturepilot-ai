"use client";

import React, { useState } from 'react';
import { MapPin, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface RoadmapProps {
  data?: any;
  projectId?: string;
  onRefetch?: () => void;
}

export const ProductRoadmapTab: React.FC<RoadmapProps> = ({ data, projectId, onRefetch }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const defaultPhases = [
    { phase: "Phase 1: Validation & Vector Core", timeline: "Q1 2026", deliverables: ["pgvector Embeddings Engine", "Lean Canvas Generator", "Basic RAG Retrieval"] },
    { phase: "Phase 2: Enterprise Security & Governance", timeline: "Q2 2026", deliverables: ["Supabase RLS Enforcer", "Audit Log Trail", "JSON / Markdown Downloads"] },
    { phase: "Phase 3: Institutional Scale & Multi-Tenant OS", timeline: "Q3-Q4 2026", deliverables: ["LangSmith Agent Tracing", "Investor Defense Simulator", "Automated Financial Scenario Modeling"] }
  ];

  const rawPhases = data?.phases;
  const phases = (rawPhases && Array.isArray(rawPhases) && rawPhases.length > 0) ? rawPhases : defaultPhases;

  const handleRegenerate = async () => {
    if (!projectId) return;
    setIsGenerating(true);
    try {
      await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: "Synthesize Product Roadmap and Feature Timeline"
      });
      if (onRefetch) onRefetch();
    } catch (err: any) {
      alert(`Backend Execution Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#5B5CEB]" />
            <span>Product Roadmap & Milestone Timeline</span>
          </h2>
          <p className="text-xs text-[#64748B]">Quarterly product milestones, feature priorities, and engineering release schedules.</p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Regenerate AI Roadmap</span>
        </button>
      </div>

      <div className="space-y-4">
        {phases.map((p: any, idx: number) => {
          const deliverablesList = Array.isArray(p.deliverables) ? p.deliverables : [p.deliverable || "Feature Delivery"];
          return (
            <div key={idx} className="glass-exec-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#5B5CEB]">{p.phase || p.title}</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[#5B5CEB] font-mono">
                    {p.timeline || p.status || 'Active'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {deliverablesList.map((d: string, dIdx: number) => (
                    <span key={dIdx} className="text-[11px] px-3 py-1 rounded-xl bg-[#F7F8FC] border border-slate-200 text-[#0F172A] flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" />
                      <span>{d}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
