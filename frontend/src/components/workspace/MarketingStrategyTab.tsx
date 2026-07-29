"use client";

import React, { useState } from 'react';
import {
  Megaphone, Target, Users, TrendingUp, Sparkles, CheckCircle2,
  Zap, Share2, Award, ArrowUpRight, Repeat, LineChart, ShieldCheck, RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface MarketingProps {
  data?: any;
  projectId?: string;
  onRefetch?: () => void;
}

export const MarketingStrategyTab: React.FC<MarketingProps> = ({ data, projectId, onRefetch }) => {
  const [activeChannelFilter, setActiveChannelFilter] = useState<'all' | 'digital' | 'ai_search' | 'viral'>('all');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const projName = data?.project?.name || "Your Startup";
  const industry = data?.project?.industry || "Enterprise SaaS";
  const positioning = data?.positioning || "The premier AI-powered platform transforming customer workflows through autonomous execution.";

  const channels = data?.channels || [
    { name: "LinkedIn B2B Authority", category: 'digital', trend: "High Conversion", detail: "Founder-led thought leadership & automated executive DM campaigns.", metrics: "CAC: ₹3,400 • LTV: ₹48,000" },
    { name: "GEO (Generative Engine Optimisation)", category: 'ai_search', trend: "2026 Trend", detail: "Optimizing docs & schema for Perplexity, ChatGPT & Gemini RAG search.", metrics: "Organic Inbound: 42%" },
    { name: "X (Twitter) Build-in-Public", category: 'viral', trend: "Viral Inbound", detail: "Daily milestone threads, Product Hunt teaser previews & demo GIFs.", metrics: "3.2x Engagement" },
    { name: "Product Hunt & Hacker News Launch", category: 'viral', trend: "Launch Day", detail: "Structured 24-hr launch push with early adopter rewards & Show HN post.", metrics: "Target: Top 3 Product of the Day" },
    { name: "SEO & AI Search Indexing", category: 'ai_search', trend: "Evergreen", detail: "Topic-cluster blog posts targeting long-tail intent keywords.", metrics: "Target: 15,000 Monthly Visits" },
    { name: "Short-Form Video (YouTube Shorts & IG)", category: 'digital', trend: "High Retention", detail: "60-second product demo clips showcasing real AI transformation.", metrics: "Completion Rate: 68%" }
  ];

  const filteredChannels = activeChannelFilter === 'all' 
    ? channels 
    : channels.filter((c: any) => c.category === activeChannelFilter);

  const handleRegenerateStrategy = async () => {
    if (!projectId) return;
    setIsGeneratingPlan(true);
    try {
      await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: "Synthesize Marketing Strategy & GTM Engine"
      });
      if (onRefetch) onRefetch();
    } catch (err: any) {
      alert(`Backend Execution Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#5B5CEB]" />
            <span>AI-Powered Growth Strategy & GTM Engine</span>
          </h2>
          <p className="text-xs text-[#64748B]">
            Autonomous marketing positioning, GEO search optimisation, acquisition channels, and growth funnel tailored for <strong className="text-[#0F172A]">{projName}</strong> ({industry}).
          </p>
        </div>

        <button
          onClick={handleRegenerateStrategy}
          disabled={isGeneratingPlan}
          className="px-4 py-2 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPlan ? 'animate-spin' : ''}`} />
          <span>Regenerate AI Strategy</span>
        </button>
      </div>

      {/* Modern Gradient positioning Banner */}
      <div className="p-6 rounded-[24px] bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white border border-indigo-900 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            Market Positioning & Value Proposition
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 inline" /> AI Generated
          </span>
        </div>

        <p className="text-sm font-semibold text-indigo-50 leading-relaxed italic">
          &quot;{positioning}&quot;
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
          <div>Target Market: <strong className="text-white">Global & Indian Enterprise SaaS</strong></div>
          <div>•</div>
          <div>Stage: <strong className="text-emerald-300">Seed Growth</strong></div>
          <div>•</div>
          <div>Primary Moat: <strong className="text-cyan-300">Autonomous LangGraph AI Engine</strong></div>
        </div>
      </div>

      {/* Growth KPIs Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold text-[#64748B] uppercase">Target CAC</div>
          <div className="text-base font-extrabold text-[#5B5CEB]">₹3,400</div>
          <div className="text-[9px] text-[#26C281] font-bold">1:4 LTV/CAC</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold text-[#64748B] uppercase">Target LTV</div>
          <div className="text-base font-extrabold text-[#26C281]">₹48,000</div>
          <div className="text-[9px] text-[#26C281] font-bold">Annual Contract</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold text-[#64748B] uppercase">Payback Period</div>
          <div className="text-base font-extrabold text-[#00C6AE]">2.4 Months</div>
          <div className="text-[9px] text-[#00C6AE] font-bold">Fast Capital Recoup</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold text-[#64748B] uppercase">Mo. Visitor Goal</div>
          <div className="text-base font-extrabold text-[#8C52FF]">15,000</div>
          <div className="text-[9px] text-[#8C52FF] font-bold">Organic GEO / SEO</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold text-[#64748B] uppercase">Lead Conv. Rate</div>
          <div className="text-base font-extrabold text-amber-600">4.8%</div>
          <div className="text-[9px] text-amber-600 font-bold">Freemium to Paid</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold text-[#64748B] uppercase">Viral K-Factor</div>
          <div className="text-base font-extrabold text-rose-500">1.32</div>
          <div className="text-[9px] text-rose-500 font-bold">Self-Amplifying</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold text-[#64748B] uppercase">Net Retention</div>
          <div className="text-base font-extrabold text-indigo-600">128%</div>
          <div className="text-[9px] text-indigo-600 font-bold">Expansion ARR</div>
        </div>
      </div>

      {/* 2026 GTM Channels Matrix */}
      <div className="glass-exec-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-[#5B5CEB]" />
              <span>Multi-Channel Customer Acquisition Matrix</span>
            </h3>
            <p className="text-[11px] text-[#64748B]">Prioritized marketing channels across B2B outreach, AI Search (GEO), and Viral launches.</p>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveChannelFilter('all')}
              className={`px-3 py-1 rounded-lg font-extrabold transition ${activeChannelFilter === 'all' ? 'bg-[#5B5CEB] text-white' : 'bg-[#F7F8FC] text-slate-600 hover:bg-slate-200'}`}
            >
              All (6)
            </button>
            <button
              onClick={() => setActiveChannelFilter('digital')}
              className={`px-3 py-1 rounded-lg font-extrabold transition ${activeChannelFilter === 'digital' ? 'bg-[#5B5CEB] text-white' : 'bg-[#F7F8FC] text-slate-600 hover:bg-slate-200'}`}
            >
              Digital B2B
            </button>
            <button
              onClick={() => setActiveChannelFilter('ai_search')}
              className={`px-3 py-1 rounded-lg font-extrabold transition ${activeChannelFilter === 'ai_search' ? 'bg-[#5B5CEB] text-white' : 'bg-[#F7F8FC] text-slate-600 hover:bg-slate-200'}`}
            >
              GEO / RAG Search
            </button>
            <button
              onClick={() => setActiveChannelFilter('viral')}
              className={`px-3 py-1 rounded-lg font-extrabold transition ${activeChannelFilter === 'viral' ? 'bg-[#5B5CEB] text-white' : 'bg-[#F7F8FC] text-slate-600 hover:bg-slate-200'}`}
            >
              Viral Launch
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredChannels.map((c: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-2 hover:border-[#5B5CEB] transition shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" />
                  <span>{c.name}</span>
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-[#5B5CEB] border border-indigo-200 font-mono">
                  {c.trend}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">{c.detail}</p>
              <div className="pt-2 border-t border-slate-200/80 text-[10px] font-mono text-emerald-700 font-bold">
                {c.metrics}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
