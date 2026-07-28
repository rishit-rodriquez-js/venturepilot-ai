"use client";

import React from 'react';
import { Layers, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface LeanCanvasProps {
  canvasData?: {
    problem?: string[];
    solution?: string[];
    key_metrics?: string[];
    value_proposition?: string[];
    unfair_advantage?: string[];
    channels?: string[];
    customer_segments?: string[];
    cost_structure?: string[];
    revenue_streams?: string[];
  };
}

export const LeanCanvasMatrix: React.FC<LeanCanvasProps> = ({ canvasData }) => {
  const defaults = {
    problem: canvasData?.problem || ["Stale financial forecasts in Excel", "40+ hours lost per month on CFO tasks", "Lack of audit trails"],
    solution: canvasData?.solution || ["Autonomous AI CFO Agent Swarm", "Continuous real-time ERP data sync", "Automated scenario modeling"],
    key_metrics: canvasData?.key_metrics || ["Monthly Active Users (MAU)", "Net Revenue Retention (NRR)", "Burn Runway Months"],
    value_proposition: canvasData?.value_proposition || ["Enterprise AI Startup OS accelerating investor readiness by 10x"],
    unfair_advantage: canvasData?.unfair_advantage || ["Proprietary pgvector project memory & LangGraph orchestration"],
    channels: canvasData?.channels || ["Direct Enterprise Outbound", "Venture Capital Accelerator Networks", "Developer Ecosystem"],
    customer_segments: canvasData?.customer_segments || ["B2B SaaS Founders (Series A-B)", "Venture Studios & Incubators"],
    cost_structure: canvasData?.cost_structure || ["LLM API Compute Tokens", "Core Software Engineering", "Enterprise Compliance & Security"],
    revenue_streams: canvasData?.revenue_streams || ["Pro SaaS Tier ($199/mo)", "Enterprise Unlimited Tier ($899/mo)"]
  };

  const Box = ({ title, items, badgeColor = "border-cyan-800/50 bg-cyan-950/20" }: { title: string; items: string[]; badgeColor?: string }) => (
    <div className={`p-4 rounded-xl border ${badgeColor} backdrop-blur-sm flex flex-col justify-between h-full`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">{title}</h4>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">{items.length} items</span>
        </div>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Lean & Business Model Canvas</span>
          </h2>
          <p className="text-xs text-slate-400">Structured 9-box strategic framework synthesized by AI Co-Founder.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Regenerate with AI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Box title="1. Problem" items={defaults.problem} />
        <div className="space-y-4">
          <Box title="2. Solution" items={defaults.solution} />
          <Box title="3. Key Metrics" items={defaults.key_metrics} />
        </div>
        <Box title="4. Unique Value Prop" items={defaults.value_proposition} badgeColor="border-indigo-700/50 bg-indigo-950/30" />
        <div className="space-y-4">
          <Box title="5. Unfair Advantage" items={defaults.unfair_advantage} />
          <Box title="6. Channels" items={defaults.channels} />
        </div>
        <Box title="7. Customer Segments" items={defaults.customer_segments} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Box title="8. Cost Structure" items={defaults.cost_structure} badgeColor="border-rose-900/40 bg-rose-950/10" />
        <Box title="9. Revenue Streams" items={defaults.revenue_streams} badgeColor="border-emerald-900/40 bg-emerald-950/10" />
      </div>
    </div>
  );
};
