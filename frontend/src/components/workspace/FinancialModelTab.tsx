"use client";

import React from 'react';
import { DollarSign, TrendingUp, Flame, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FinancialProps {
  data?: any;
}

export const FinancialModelTab: React.FC<FinancialProps> = ({ data }) => {
  const costs = data?.costs || [
    { item: "Company Registration (Pvt Ltd / OPC)", amount_inr: 15000 },
    { item: "GST & MSME / Udyam Registration", amount_inr: 5000 },
    { item: "Trademark Filing & Legal Counsel", amount_inr: 25000 },
    { item: "Cloud Infrastructure (Supabase & Vercel)", amount_inr: 45000 },
    { item: "Core Engineering Salaries (Monthly)", amount_inr: 350000 },
    { item: "FPO Field Pilot & Marketing", amount_inr: 60000 }
  ];

  const funding = data?.funding_pathways || [
    { source: "Startup India Seed Fund Scheme (SISFS)", amount: "₹50 Lakhs Grant" },
    { source: "SIDBI / State Startup Mission", amount: "₹25 Lakhs Soft Loan" },
    { source: "Angel Networks (IAN / Mumbai Angels)", amount: "₹70 Lakhs Equity" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center icon-pill-success">
            <DollarSign className="w-4 h-4" />
          </div>
          <span>India Financial Model & Unit Economics (₹ INR)</span>
        </h2>
        <p className="text-xs text-[#64748B]">Statutory Indian setup costs, GST/MSME budget, 3-year ARR in ₹, and government grant funding.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Monthly Burn Rate</div>
          <div className="text-2xl font-extrabold text-[#0F172A]">₹5,00,000 /mo</div>
          <div className="text-[11px] text-[#64748B] mt-1 font-semibold">₹5 Lakhs / month</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Cash Runway</div>
          <div className="text-2xl font-extrabold text-[#26C281]">24 Months</div>
          <div className="text-[11px] text-[#26C281] mt-1 font-semibold">High Capital Efficiency</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Break-Even Point</div>
          <div className="text-2xl font-extrabold text-[#5B5CEB]">Month 14</div>
          <div className="text-[11px] text-[#5B5CEB] mt-1 font-semibold">Targeting 300 FPO Clusters</div>
        </div>

        <div className="glass-exec-card p-5">
          <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">Total Seed Funding Ask</div>
          <div className="text-2xl font-extrabold text-[#8C52FF]">₹2.0 Crore</div>
          <div className="text-[11px] text-[#8C52FF] mt-1 font-semibold">SISFS + Angel Networks</div>
        </div>
      </div>

      {/* Indian Cost Breakdown Table */}
      <div className="glass-exec-card p-6 space-y-4">
        <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Indian Company Setup & Statutory Cost Breakdown (₹)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#64748B] font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Expense Category</th>
                <th className="py-3 px-3 text-right">Cost (₹ INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#0F172A]">
              {costs.map((c: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" />
                    <span className="font-semibold">{c.item}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#26C281]">₹{c.amount_inr.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3-Year Growth Projections & Indian Funding Pathways */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-exec-card p-6 space-y-3">
          <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">3-Year Revenue Growth (₹ INR)</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#0F172A]">Year 1 Target</div>
                <div className="text-[11px] text-[#64748B]">300 FPO Clusters @ ₹1,499/mo</div>
              </div>
              <div className="text-lg font-extrabold text-[#5B5CEB]">₹45 Lakhs</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#0F172A]">Year 2 Target</div>
                <div className="text-[11px] text-[#64748B]">1,200 FPO Clusters</div>
              </div>
              <div className="text-lg font-extrabold text-[#26C281]">₹1.8 Crore</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-purple-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#8C52FF]">Year 3 Target</div>
                <div className="text-[11px] text-[#64748B]">4,500 FPO Clusters</div>
              </div>
              <div className="text-lg font-extrabold text-[#8C52FF]">₹6.5 Crore</div>
            </div>
          </div>
        </div>

        <div className="glass-exec-card p-6 space-y-3">
          <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Indian Funding Pathways</h3>
          <div className="space-y-3">
            {funding.map((f: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">{f.source}</div>
                  <div className="text-[10px] text-[#26C281] font-semibold mt-0.5">Government / Institutional Grant</div>
                </div>
                <div className="text-sm font-extrabold text-[#26C281]">{f.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
