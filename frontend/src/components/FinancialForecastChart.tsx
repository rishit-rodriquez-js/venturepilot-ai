"use client";

import React from 'react';
import { PieChart, DollarSign, TrendingUp, Flame, Clock } from 'lucide-react';

interface FinancialProps {
  data?: any;
}

export const FinancialForecastChart: React.FC<FinancialProps> = ({ data }) => {
  const mrr = data?.mrr_target_y1 || 25000.0;
  const arr = data?.arr_target_y3 || 1500000.0;
  const cac = data?.cac_usd || 320.0;
  const ltv = data?.ltv_usd || 4200.0;
  const burn = data?.monthly_burn_rate || 18000.0;
  const runway = data?.runway_months || 24;

  const ratio = (ltv / cac).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-amber-400" />
          <span>Financial Forecasting & Runway Analytics</span>
        </h2>
        <p className="text-xs text-slate-400">3-Year Revenue targets, unit economics (CAC/LTV), monthly burn rate, and runway duration.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Year 1 MRR Target</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">${mrr.toLocaleString()}/mo</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">Targeting $300k ARR Run Rate</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>LTV / CAC Ratio</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">{ratio}x</div>
          <div className="text-[11px] text-slate-500 mt-1">LTV ${ltv} / CAC ${cac}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Monthly Burn Rate</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300">${burn.toLocaleString()}/mo</div>
          <div className="text-[11px] text-slate-500 mt-1">Engineering + API Compute</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Cash Runway</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{runway} Months</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">High Capital Efficiency</div>
        </div>
      </div>

      {/* 3-Year Projection Schedule */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
        <h3 className="text-sm font-bold text-slate-200 mb-4">3-Year Growth & Revenue Projection Model</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Year 1</div>
            <div className="text-xl font-bold text-slate-200 mt-2">$300,000</div>
            <div className="text-[11px] text-slate-500">125 Customers @ $199/mo</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Year 2</div>
            <div className="text-xl font-bold text-cyan-300 mt-2">$750,000</div>
            <div className="text-[11px] text-slate-500">Tier upgrades & enterprise adoption</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950 border border-indigo-950 bg-indigo-950/20">
            <div className="text-xs text-indigo-300 font-semibold uppercase">Year 3</div>
            <div className="text-xl font-bold text-indigo-400 mt-2">${arr.toLocaleString()}</div>
            <div className="text-[11px] text-indigo-300/80">Scale-up ARR Target</div>
          </div>
        </div>
      </div>
    </div>
  );
};
