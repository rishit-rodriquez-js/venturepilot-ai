"use client";

import React from 'react';
import { Cpu, Award, DollarSign, Clock, Layers, CheckCircle2, ShieldCheck, AlertCircle, TrendingUp } from 'lucide-react';

interface OverviewProps {
  project: any;
  aiData?: any;
}

export const OverviewTab: React.FC<OverviewProps> = ({ project, aiData }) => {
  const health = aiData?.overview?.health_scores || {
    validation: 92,
    market: 85,
    finance: 88,
    investor: 90
  };

  const recs = [
    { priority: "High", text: `Interview potential ${project?.industry || 'Enterprise'} customer leads.`, status: "Action Required" },
    { priority: "Medium", text: "Optimize unit economics & pricing strategy for target market.", status: "In Progress" },
    { priority: "Low", text: "Apply for startup recognition & seed grant funding.", status: "Queued" }
  ];

  const timeline = [
    { stage: "Idea Created", progress: 100, status: "Completed", owner: "Founder", confidence: 98, updated: "Today" },
    { stage: "Validation", progress: 85, status: "Active", owner: "AI Co-Founder", confidence: 92, updated: "Today" },
    { stage: "Research", progress: 100, status: "Completed", owner: "Research Agent", confidence: 96, updated: "Today" },
    { stage: "Business Plan", progress: 80, status: "Active", owner: "Planner Agent", confidence: 89, updated: "Today" },
    { stage: "Financial Model", progress: 70, status: "Active", owner: "Finance Agent", confidence: 88, updated: "Today" },
    { stage: "Investor Ready", progress: 60, status: "Queued", owner: "Investor Agent", confidence: 85, updated: "Pending" }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center icon-pill-primary">
            <Cpu className="w-4 h-4" />
          </div>
          <span>Executive CEO Summary — {project?.name || "Your Startup"}</span>
        </h2>
        <p className="text-xs text-[#64748B]">Overall health scores, prioritized AI co-founder directives, and lifecycle stage progress.</p>
      </div>

      {/* Startup Health Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Validation Score</div>
          <div className="text-3xl font-extrabold text-[#5B5CEB]">{health.validation}%</div>
          <div className="text-[11px] text-[#26C281] mt-1 font-semibold">92% Problem-Solution Fit</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Market Analysis</div>
          <div className="text-3xl font-extrabold text-[#00C6AE]">{health.market}%</div>
          <div className="text-[11px] text-[#00C6AE] mt-1 font-semibold">pgvector RAG Verified</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Financial Health</div>
          <div className="text-3xl font-extrabold text-[#8C52FF]">{health.finance}%</div>
          <div className="text-[11px] text-[#8C52FF] mt-1 font-semibold">18 Month Runway (INR ₹)</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Investor Readiness</div>
          <div className="text-3xl font-extrabold text-[#26C281]">{health.investor}%</div>
          <div className="text-[11px] text-[#26C281] mt-1 font-semibold">Institutional Grade</div>
        </div>
      </div>

      {/* Interactive Lifecycle Progress Bar Matrix */}
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
                    t.status === 'Completed' ? 'bg-[#26C281]' : t.status === 'Active' ? 'bg-[#5B5CEB] animate-pulse' : 'bg-slate-300'
                  }`}
                  style={{ width: `${t.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass-exec-card p-6 space-y-4">
        <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#26C281]" />
          <span>AI Co-Founder Directives & Action Items</span>
        </h3>

        <div className="space-y-2.5">
          {recs.map((r: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  r.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                  r.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                }`}>
                  {r.priority} Priority
                </span>
                <span className="font-bold text-[#0F172A]">{r.text}</span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
