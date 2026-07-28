"use client";

import React from 'react';
import { Compass, TrendingUp, ShieldAlert, Target, Award } from 'lucide-react';

interface MarketIntelProps {
  data?: any;
}

export const MarketIntelRadar: React.FC<MarketIntelProps> = ({ data }) => {
  const tam = data?.tam_billions || 48.5;
  const sam = data?.sam_billions || 12.2;
  const som = data?.som_millions || 450.0;

  const competitors = data?.competitors || [
    { name: "Legacy Financial Consulting", strengths: "Established reputation & trusted brand", weaknesses: "Manual, slow, and expensive ($20k+/mo)", moat: "High human relationships" },
    { name: "Basic LLM Wrappers", strengths: "Inexpensive copy generation", weaknesses: "No state persistence, no real-time audit trail", moat: "Very Low" },
    { name: "VenturePilot AI (Your System)", strengths: "Autonomous LangGraph multi-agent execution with pgvector state", weaknesses: "New brand entrant", moat: "High (Persistent Vector Memory)" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" />
          <span>Market Intelligence & Competitor Matrix</span>
        </h2>
        <p className="text-xs text-slate-400">Real-time market size analysis, competitor positioning, and SWOT synthesis.</p>
      </div>

      {/* TAM SAM SOM Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-indigo-800/40 bg-indigo-950/20 backdrop-blur-md relative overflow-hidden">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Addressable Market (TAM)</div>
          <div className="text-3xl font-extrabold text-indigo-300">${tam}B</div>
          <div className="text-[11px] text-slate-500 mt-2">Global Enterprise Startup & Operations Management Software</div>
        </div>

        <div className="p-5 rounded-xl border border-cyan-800/40 bg-cyan-950/20 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Serviceable Addressable Market (SAM)</div>
          <div className="text-3xl font-extrabold text-cyan-300">${sam}B</div>
          <div className="text-[11px] text-slate-500 mt-2">B2B SaaS & Tech Startups seeking automated CFO / COO OS</div>
        </div>

        <div className="p-5 rounded-xl border border-emerald-800/40 bg-emerald-950/20 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Serviceable Obtainable Market (SOM)</div>
          <div className="text-3xl font-extrabold text-emerald-300">${som}M</div>
          <div className="text-[11px] text-slate-500 mt-2">Target Year 3 Capture (3.6% of SAM)</div>
        </div>
      </div>

      {/* Competitor Matrix Table */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <span>Competitive Landscape & Moat Radar</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Competitor Entity</th>
                <th className="py-2.5 px-3">Key Strengths</th>
                <th className="py-2.5 px-3">Core Weaknesses</th>
                <th className="py-2.5 px-3">Defensibility / Moat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {competitors.map((c: any, idx: number) => (
                <tr key={idx} className={c.name.includes("VenturePilot") ? "bg-cyan-950/30 font-semibold text-cyan-200" : "text-slate-300"}>
                  <td className="py-3 px-3 flex items-center gap-2">
                    {c.name.includes("VenturePilot") && <Award className="w-4 h-4 text-cyan-400" />}
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{c.strengths}</td>
                  <td className="py-3 px-3 text-slate-400">{c.weaknesses}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.moat.includes("High") ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800"
                    }`}>
                      {c.moat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
