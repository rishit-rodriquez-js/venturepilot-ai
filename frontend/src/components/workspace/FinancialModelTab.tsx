"use client";

import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, ShieldCheck, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AIMetadataBadge, EmptyState } from './WorkspaceUIUtils';

interface FinProps {
  data?: any;
  projectId?: string;
  onRefetch?: (incomingState?: any) => void;
}

export const FinancialModelTab: React.FC<FinProps> = ({ data, projectId, onRefetch }) => {
  console.log("[Pipeline Audit - Stage 4 & 5: FinancialModelTab Rendered]", data);
  const fin = data || {};
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!projectId) return;
    setIsRegenerating(true);
    try {
      const res = await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: "Synthesize unit economics, 3-year revenue projections, and funding ask"
      });
      if (onRefetch) onRefetch(res.data?.state);
    } catch (err: any) {
      alert(`Financial Model Execution Failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const isDataPresent = fin && (fin.seed_ask_inr || fin.monthly_burn_rate_inr || (fin.projections_3y && fin.projections_3y.length > 0));

  if (!isDataPresent) {
    return (
      <EmptyState
        title="Financial Model Has Not Been Generated Yet"
        description="Run the Chief Financial Officer Agent to synthesize your unit economics, burn rate, runway, seed ask, and 3-year financial projections."
        actionText="Synthesize Financial Model (GPT-4o)"
        isLoading={isRegenerating}
        onAction={handleRegenerate}
      />
    );
  }

  const costs = fin.costs || [];
  const projections = fin.projections_3y || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 text-[#26C281] border border-emerald-200">
              <DollarSign className="w-4 h-4" />
            </div>
            <span>Financial Model & Unit Economics</span>
          </h2>
          <p className="text-xs text-[#64748B]">Synthesized by CFO Finance Agent with Supabase database persistence.</p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] text-xs font-bold hover:border-[#26C281] shadow-2xs inline-flex items-center gap-1.5 disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#26C281] ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Financials'}</span>
        </button>
      </div>

      {/* AI Metadata Badge */}
      <AIMetadataBadge
        agent="Finance CFO Agent"
        model="gpt-4o"
        tokens={fin._tokens || 400}
        latencyMs={fin._latency_ms}
        traceId={fin.trace_id}
        traceUrl={fin.langsmith_trace_url}
        confidence="94%"
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Seed Funding Ask</div>
          <div className="text-2xl font-extrabold text-[#5B5CEB]">
            {fin.seed_ask_inr || "Not generated yet"}
          </div>
          <div className="text-[11px] text-[#26C281] mt-1 font-semibold">Target Seed Round</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Monthly Burn Rate</div>
          <div className="text-2xl font-extrabold text-rose-600">
            {fin.monthly_burn_rate_inr ? `₹${(fin.monthly_burn_rate_inr / 100000).toFixed(1)} Lakhs/mo` : "Not generated yet"}
          </div>
          <div className="text-[11px] text-rose-600 mt-1 font-semibold">Net Cash Outflow</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Runway Months</div>
          <div className="text-2xl font-extrabold text-[#8C52FF]">
            {fin.runway_months ? `${fin.runway_months} Months` : "Not generated yet"}
          </div>
          <div className="text-[11px] text-[#8C52FF] mt-1 font-semibold">Capital Runway</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Breakeven Timeline</div>
          <div className="text-2xl font-extrabold text-[#26C281]">
            {fin.breakeven_month || "Not generated yet"}
          </div>
          <div className="text-[11px] text-[#26C281] mt-1 font-semibold">Cashflow Positive</div>
        </div>
      </div>

      {/* Unit Economics: CAC vs LTV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-exec-card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Customer Acquisition Cost (CAC)</div>
            <div className="text-xl font-extrabold text-[#0F172A] mt-1">
              {fin.cac_inr ? `₹${fin.cac_inr.toLocaleString()}` : "Not generated yet"}
            </div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-indigo-50 text-[#5B5CEB] text-xs font-bold border border-indigo-100">
            Blending Marketing Channels
          </div>
        </div>

        <div className="glass-exec-card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Customer Lifetime Value (LTV)</div>
            <div className="text-xl font-extrabold text-[#26C281] mt-1">
              {fin.ltv_inr ? `₹${fin.ltv_inr.toLocaleString()}` : "Not generated yet"}
            </div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-emerald-50 text-[#26C281] text-xs font-bold border border-emerald-100">
            {fin.ltv_inr && fin.cac_inr ? `LTV/CAC Ratio: ${(fin.ltv_inr / fin.cac_inr).toFixed(1)}x` : "Unit Economics"}
          </div>
        </div>
      </div>

      {/* 3-Year Revenue Forecast Table */}
      <div className="glass-exec-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#26C281]" />
            <span>3-Year Revenue & Customer Projections</span>
          </h3>
        </div>

        {projections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[#64748B] font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Forecast Year</th>
                  <th className="py-2.5 px-3">Revenue (₹ Lakhs)</th>
                  <th className="py-2.5 px-3">Revenue (₹ Crores)</th>
                  <th className="py-2.5 px-3">Paid Customers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {projections.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-[#0F172A]">{p.year}</td>
                    <td className="py-3 px-3 text-[#5B5CEB] font-bold">₹{p.revenue_lakhs} Lakhs</td>
                    <td className="py-3 px-3 text-[#26C281] font-bold">₹{p.revenue_crores} Cr</td>
                    <td className="py-3 px-3 text-[#0F172A]">{p.fpo_customers?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-4">Waiting for AI generation...</p>
        )}
      </div>

      {/* Cost Structure Breakdown Table */}
      {costs.length > 0 && (
        <div className="glass-exec-card p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#8C52FF]" />
            <span>Operating Expenses & Cost Allocation</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {costs.map((c: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-[#0F172A]">{c.item}</div>
                <div className="text-sm font-extrabold text-[#5B5CEB]">
                  ₹{typeof c.amount_inr === 'number' ? c.amount_inr.toLocaleString() : c.amount_inr}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
