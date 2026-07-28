"use client";

import React from 'react';
import { MapPin, Calendar, CheckCircle2 } from 'lucide-react';

interface RoadmapProps {
  data?: any;
}

export const ProductRoadmapTab: React.FC<RoadmapProps> = ({ data }) => {
  const phases = data?.phases || [
    { phase: "Phase 1: Validation & Vector Core", timeline: "Q1 2026", deliverables: ["pgvector Embeddings Engine", "Lean Canvas Generator", "Basic RAG Retrieval"] },
    { phase: "Phase 2: Enterprise Security & Governance", timeline: "Q2 2026", deliverables: ["Supabase RLS Enforcer", "Audit Log Trail", "JSON / Markdown Downloads"] },
    { phase: "Phase 3: Institutional Scale & Multi-Tenant OS", timeline: "Q3-Q4 2026", deliverables: ["LangSmith Agent Tracing", "Investor Defense Simulator", "Automated Financial Scenario Modeling"] }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <span>Product Roadmap & Milestone Timeline</span>
        </h2>
        <p className="text-xs text-slate-400">Quarterly product milestones, feature priorities, and engineering release schedules.</p>
      </div>

      <div className="space-y-4">
        {phases.map((p: any, idx: number) => (
          <div key={idx} className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-300">{p.phase}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">{p.timeline}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {p.deliverables.map((d: string, dIdx: number) => (
                  <span key={dIdx} className="text-[11px] px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{d}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
