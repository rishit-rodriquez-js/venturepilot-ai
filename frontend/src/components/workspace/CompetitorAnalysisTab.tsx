"use client";

import React, { useState } from 'react';
import { Target, Shield, Globe, TrendingUp, Building2 } from 'lucide-react';

interface CompProps {
  data?: any;
}

export const CompetitorAnalysisTab: React.FC<CompProps> = ({ data }) => {
  const [region, setRegion] = useState<'India' | 'Global'>('India');

  const defaultCompetitors = [
    { name: "Your Startup", funding: "₹2.0 Crore Ask", strength: "Autonomous AI Agent Workflow + RAG", weakness: "Early brand awareness", moat: "Proprietary LangGraph Swarm Engine" },
    { name: "Legacy SaaS Consultancies", funding: "Bootstrapped", strength: "Established corporate networks", weakness: "Manual execution & slow SLA turnaround", moat: "Human relationships" },
    { name: "Global Generic AI Wrappers", funding: "$5M Seed", strength: "High initial marketing budget", weakness: "Lack of Indian statutory/tax alignment", moat: "Basic UI prompt wrapper" }
  ];

  const competitors = data?.competitors || defaultCompetitors;
  const gapAnalysis = data?.gap_analysis || "Legacy providers charge high retainer fees with manual deliverables. VenturePilot AI delivers 10x faster execution with RAG memory.";
  const competitiveAdvantage = data?.competitive_advantage || "Autonomous multi-agent orchestration with direct Supabase vector isolation and LangSmith auditability.";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Target className="w-5 h-5 text-[#5B5CEB]" />
            <span>Competitor & Strategic Moat Analysis</span>
          </h2>
          <p className="text-xs text-[#64748B]">Benchmark against market incumbents and statutory ecosystem schemes.</p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-2 bg-[#F7F8FC] p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <Globe className="w-4 h-4 text-[#5B5CEB] ml-2" />
          <span>Region:</span>
          <button
            onClick={() => setRegion('India')}
            className={`px-3 py-1 rounded-xl transition ${
              region === 'India' ? 'bg-[#5B5CEB] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            India (₹ Lakhs/Cr)
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

      {/* Indian Ecosystem Statutory Schemes Banner */}
      <div className="p-5 rounded-[24px] bg-gradient-to-r from-indigo-50 via-teal-50 to-white border border-indigo-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#5B5CEB]">
            <Building2 className="w-4 h-4 text-[#00C6AE]" />
            <span>Indian Statutory & VC Ecosystem Integration</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#26C281] border border-emerald-200">
            DPIIT Recognized
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-0.5">
            <div className="font-bold text-[#0F172A]">Startup India (SISFS)</div>
            <div className="text-[10px] text-[#26C281] font-extrabold">Grant up to ₹50 Lakhs</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-0.5">
            <div className="font-bold text-[#0F172A]">SIDBI Fund of Funds</div>
            <div className="text-[10px] text-[#5B5CEB] font-extrabold">₹10,000 Cr Corpus</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-0.5">
            <div className="font-bold text-[#0F172A]">ONDC & UPI Stack</div>
            <div className="text-[10px] text-[#8C52FF] font-extrabold">Zero Payment Friction</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-0.5">
            <div className="font-bold text-[#0F172A]">DPIIT 80-IAC Tax Exemption</div>
            <div className="text-[10px] text-[#26C281] font-extrabold">3 Years 100% Tax Holiday</div>
          </div>
        </div>
      </div>

      {/* Competitors Matrix Table */}
      <div className="glass-exec-card p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center justify-between">
          <span>Competitive Landscape Comparison</span>
          <span className="text-[10px] text-[#64748B] font-mono">Currency: {region === 'India' ? 'INR (₹)' : 'USD ($)'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[#64748B] font-bold uppercase text-[10px]">
                <th className="pb-3">Company</th>
                <th className="pb-3">Funding Raised</th>
                <th className="pb-3">Key Advantage</th>
                <th className="pb-3">Vulnerability</th>
                <th className="pb-3">Defensible Moat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {competitors.map((c: any, idx: number) => (
                <tr key={idx} className={c.name.includes("Your") ? "bg-indigo-50/50 font-bold" : ""}>
                  <td className="py-3.5 px-2 text-[#0F172A]">
                    {c.name}
                    {c.name.includes("Your") && (
                      <span className="ml-2 text-[9px] px-2 py-0.5 rounded bg-[#5B5CEB] text-white">Active</span>
                    )}
                  </td>
                  <td className="py-3.5 px-2 text-[#5B5CEB] font-extrabold">{c.funding}</td>
                  <td className="py-3.5 px-2 text-[#64748B]">{c.strength}</td>
                  <td className="py-3.5 px-2 text-rose-600">{c.weakness}</td>
                  <td className="py-3.5 px-2 text-[#26C281] font-semibold">{c.moat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Moat & Market Gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-exec-card p-6 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B5CEB] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00C6AE]" />
            <span>Market Gap & Opportunity Analysis</span>
          </h4>
          <p className="text-xs text-[#64748B] leading-relaxed">{gapAnalysis}</p>
        </div>

        <div className="glass-exec-card p-6 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C52FF] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#8C52FF]" />
            <span>Your Defensible Competitive Advantage</span>
          </h4>
          <p className="text-xs text-[#64748B] leading-relaxed">{competitiveAdvantage}</p>
        </div>
      </div>
    </div>
  );
};
