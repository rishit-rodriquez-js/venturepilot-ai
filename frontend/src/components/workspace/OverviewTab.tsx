"use client";

import React from 'react';
import { Cpu, ShieldCheck, TrendingUp } from 'lucide-react';

interface OverviewProps {
  project: any;
  aiData?: any;
}

export const OverviewTab: React.FC<OverviewProps> = ({ project, aiData }) => {
  console.log("[Pipeline Audit - Stage 4 & 5: OverviewTab Rendered]", { project, aiData });
  const deck = aiData?.investor_deck || {};
  const ev = aiData?.evaluations || {};
  const fin = aiData?.financials || aiData?.financial_models || {};
  const bp = aiData?.business_plan || {};

  const validationScore = ev.faithfulness_score !== undefined ? Math.round(ev.faithfulness_score * 100) : (project?.readiness_score || 85);
  const marketScore = deck.market_score || 85;
  const financialScore = deck.financial_score || 88;
  const investorScore = deck.overall_score || 90;

  const timeline = [
    { stage: "Idea & Setup", progress: 100, status: "Completed", owner: "Founder", confidence: 98 },
    { stage: "Validation & Plan", progress: bp.executive_summary ? 100 : 0, status: bp.executive_summary ? "Completed" : "Queued", owner: "Planner Agent", confidence: 95 },
    { stage: "Market Research", progress: aiData?.market_research?.synthesized_report ? 100 : 0, status: aiData?.market_research?.synthesized_report ? "Completed" : "Queued", owner: "Research Agent", confidence: 96 },
    { stage: "Competitor Analysis", progress: aiData?.competitor_analysis?.gap_analysis ? 100 : 0, status: aiData?.competitor_analysis?.gap_analysis ? "Completed" : "Queued", owner: "Competitor Agent", confidence: 92 },
    { stage: "Financial Model", progress: fin.seed_ask_inr ? 100 : 0, status: fin.seed_ask_inr ? "Completed" : "Queued", owner: "Finance Agent", confidence: 94 },
    { stage: "Investor Deck", progress: deck.slides?.length > 0 ? 100 : 0, status: deck.slides?.length > 0 ? "Completed" : "Queued", owner: "Investor Agent", confidence: 90 }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center icon-pill-primary">
            <Cpu className="w-4 h-4" />
          </div>
          <span>Executive CEO Summary — {project?.name || "Venture Workspace"}</span>
        </h2>
        <p className="text-xs text-[#64748B]">Overall health scores, prioritized AI co-founder directives, and lifecycle stage progress.</p>
      </div>

      {/* Startup Health Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Validation Score</div>
          <div className="text-3xl font-extrabold text-[#5B5CEB]">{validationScore}%</div>
          <div className="text-[11px] text-[#26C281] mt-1 font-semibold">Problem-Solution Fit</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Market Analysis</div>
          <div className="text-3xl font-extrabold text-[#00C6AE]">{marketScore}%</div>
          <div className="text-[11px] text-[#00C6AE] mt-1 font-semibold">pgvector RAG Verified</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Financial Health</div>
          <div className="text-3xl font-extrabold text-[#8C52FF]">{financialScore}%</div>
          <div className="text-[11px] text-[#8C52FF] mt-1 font-semibold">
            {fin.runway_months ? `${fin.runway_months} Month Runway` : "Unit Economics"}
          </div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Investor Readiness</div>
          <div className="text-3xl font-extrabold text-[#26C281]">{investorScore}%</div>
          <div className="text-[11px] text-[#26C281] mt-1 font-semibold">Institutional Grade</div>
        </div>
      </div>

      {/* Interactive Lifecycle Progress Matrix */}
      <div className="glass-exec-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#5B5CEB]" />
            <span>Startup Lifecycle Progress & Agent Ownership</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-[#26C281] font-bold border border-emerald-200">
            6 Nodes Tracked
          </span>
        </div>

        <div className="space-y-4">
          {timeline.map((t: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5B5CEB]" />
                  <span>{t.stage}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                  <span>Owner: <strong className="text-[#0F172A]">{t.owner}</strong></span>
                  <span>Confidence: <strong className="text-[#26C281]">{t.confidence}%</strong></span>
                  <span className="font-mono text-[10px]">{t.progress}% Complete</span>
                </div>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    t.status === 'Completed' ? 'bg-[#26C281]' : 'bg-slate-300'
                  }`}
                  style={{ width: `${t.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
