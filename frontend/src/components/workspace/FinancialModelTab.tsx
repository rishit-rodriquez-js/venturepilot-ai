"use client";

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Flame, Clock, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface FinancialProps {
  data?: any;
  projectId?: string;
  onRefetch?: () => void;
}

export const FinancialModelTab: React.FC<FinancialProps> = ({ data, projectId, onRefetch }) => {
  const [isRecalculating, setIsRecalculating] = useState(false);

  const costs = data?.costs || [
    { item: "Company Registration (Pvt Ltd / OPC)", amount_inr: 15000 },
    { item: "GST & MSME / Udyam Registration", amount_inr: 5000 },
    { item: "Trademark Filing & Legal Counsel", amount_inr: 25000 },
    { item: "Cloud Infrastructure (Supabase & Compute)", amount_inr: 45000 },
    { item: "Core Engineering Salaries (Monthly)", amount_inr: 350000 },
    { item: "Field Pilots & GTM Marketing", amount_inr: 60000 }
  ];

  const funding = data?.funding_pathways || [
    { source: "Startup India Seed Fund Scheme (SISFS)", amount: "₹50 Lakhs Grant" },
    { source: "SIDBI / State Startup Mission", amount: "₹25 Lakhs Soft Loan" },
    { source: "Angel Networks (IAN / Mumbai Angels)", amount: "₹70 Lakhs Equity" }
  ];

  const handleRecalculate = async () => {
    if (!projectId) return;
    setIsRecalculating(true);
    try {
      await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: "Recalculate Financial Projections & Unit Economics"
      });
      if (onRefetch) onRefetch();
    } catch (err: any) {
      alert(`Backend Execution Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center icon-pill-success">
              <DollarSign className="w-4 h-4" />
            </div>
            <span>Financial Model & Unit Economics (₹ INR)</span>
          </h2>
          <p className="text-xs text-[#64748B]">Statutory Indian setup costs, GST/MSME budget, 3-year ARR projections, and seed ask.</p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="px-4 py-2 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Invoking Finance Agent...' : 'Recalculate Model'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-exec-card p-5">
          <div className="text-xs text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Monthly Burn Rate</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{((data?.monthly_burn_rate_inr || 250000) / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Payroll + Cloud Infrastructure</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-xs text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Runway</span>
          </div>
          <div className="text-2xl font-extrabold text-[#5B5CEB]">
            {data?.runway_months || 18} Months
          </div>
          <div className="text-[11px] text-[#26C281] mt-1 font-semibold">Post Seed Injection</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-xs text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Breakeven Timeline</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            {data?.breakeven_month || "Month 12"}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Unit Positive Margin</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-xs text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <span>Seed Ask</span>
          </div>
          <div className="text-2xl font-extrabold text-[#8C52FF]">
            {data?.seed_ask_inr || "₹2.0 Crore"}
          </div>
          <div className="text-[11px] text-purple-600 mt-1 font-semibold">18 Month Execution</div>
        </div>
      </div>

      {/* Costs & Grants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statutory Costs */}
        <div className="glass-exec-card p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#5B5CEB]" />
            <span>Setup & Operating Costs Breakdown (₹ INR)</span>
          </h3>

          <div className="space-y-2">
            {costs.map((c: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-[#F7F8FC] border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0F172A]">{c.item}</span>
                <span className="font-mono font-bold text-[#5B5CEB]">₹{c.amount_inr?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Funding Pathways */}
        <div className="glass-exec-card p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#26C281]" />
            <span>Seed Capital & Grants Breakdown</span>
          </h3>

          <div className="space-y-2">
            {funding.map((f: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-[#F7F8FC] border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0F172A]">{f.source}</span>
                <span className="font-mono font-bold text-[#26C281]">{f.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
