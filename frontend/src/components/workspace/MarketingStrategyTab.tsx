"use client";

import React, { useState } from 'react';
import {
  Megaphone, Target, Users, TrendingUp, Sparkles, CheckCircle2,
  Zap, Share2, Award, ArrowUpRight, Repeat, LineChart, ShieldCheck, RefreshCw
} from 'lucide-react';
import { useVentureStore } from '@/lib/store';

interface MarketingProps {
  data?: any;
}

export const MarketingStrategyTab: React.FC<MarketingProps> = ({ data }) => {
  const { startupState } = useVentureStore();
  const project = startupState.project;
  const projName = project.name || 'Your Startup';
  const industry = project.industry || 'Enterprise SaaS';

  const [activeChannelFilter, setActiveChannelFilter] = useState<'all' | 'digital' | 'ai_search' | 'viral'>('all');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const positioning = data?.positioning || `The premier AI-powered ${industry} platform transforming customer workflows through autonomous execution.`;

  const channels = [
    { name: "LinkedIn B2B Authority", category: 'digital', trend: "High Conversion", detail: "Founder-led thought leadership & automated executive DM campaigns.", metrics: "CAC: ₹3,400 • LTV: ₹48,000" },
    { name: "GEO (Generative Engine Optimisation)", category: 'ai_search', trend: "2026 Trend", detail: "Optimizing docs & schema for Perplexity, ChatGPT & Gemini RAG search.", metrics: "Organic Inbound: 42%" },
    { name: "X (Twitter) Build-in-Public", category: 'viral', trend: "Viral Inbound", detail: "Daily milestone threads, Product Hunt teaser previews & demo GIFs.", metrics: "3.2x Engagement" },
    { name: "Product Hunt & Hacker News Launch", category: 'viral', trend: "Launch Day", detail: "Structured 24-hr launch push with early adopter rewards & Show HN post.", metrics: "Target: Top 3 Product of the Day" },
    { name: "SEO & AI Search Indexing", category: 'ai_search', trend: "Evergreen", detail: "Topic-cluster blog posts targeting long-tail intent keywords.", metrics: "Target: 15,000 Monthly Visits" },
    { name: "Short-Form Video (YouTube Shorts & IG)", category: 'digital', trend: "High Retention", detail: "60-second product demo clips showcasing real AI transformation.", metrics: "Completion Rate: 68%" }
  ];

  const filteredChannels = activeChannelFilter === 'all' 
    ? channels 
    : channels.filter(c => c.category === activeChannelFilter);

  const handleRegenerateStrategy = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => setIsGeneratingPlan(false), 800);
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

      {/* Modern Gradient positioning Banner (Indigo / Violet / Emerald / Cyan) */}
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
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5">
          <div className="text-[9px] uppercase font-bold text-[#64748B]">CAC Target</div>
          <div className="text-base font-extrabold text-[#5B5CEB]">₹3,200</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5">
          <div className="text-[9px] uppercase font-bold text-[#64748B]">Target LTV</div>
          <div className="text-base font-extrabold text-[#26C281]">₹48,000</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5">
          <div className="text-[9px] uppercase font-bold text-[#64748B]">LTV : CAC</div>
          <div className="text-base font-extrabold text-[#00C6AE]">15 : 1</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5">
          <div className="text-[9px] uppercase font-bold text-[#64748B]">Target MRR</div>
          <div className="text-base font-extrabold text-[#8C52FF]">₹12.5 Lakh</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5">
          <div className="text-[9px] uppercase font-bold text-[#64748B]">Activation</div>
          <div className="text-base font-extrabold text-[#26C281]">44%</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5">
          <div className="text-[9px] uppercase font-bold text-[#64748B]">Retention</div>
          <div className="text-base font-extrabold text-[#5B5CEB]">88%</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5">
          <div className="text-[9px] uppercase font-bold text-[#64748B]">Monthly Churn</div>
          <div className="text-base font-extrabold text-emerald-600">1.8%</div>
        </div>
      </div>

      {/* Target Customer Personas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Persona */}
        <div className="glass-exec-card p-6 space-y-3 border-l-4 border-l-[#5B5CEB]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5B5CEB]" />
              <span>Primary Customer Persona</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-[#5B5CEB] border border-indigo-200">
              High Priority
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-extrabold text-[#0F172A]">Startup Founders & Tech Executives</div>
            <div className="text-xs text-[#64748B]">Early-stage venture builders seeking fast investor readiness and automated pitch decks.</div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-[#0F172A]">
            <div className="font-bold text-[11px] text-[#64748B]">Core Pain Points:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>High cost of hiring separate financial & pitch consultants.</li>
              <li>Months wasted drafting business plans instead of building product.</li>
              <li>Lack of structured RAG data ingestion for investor due diligence.</li>
            </ul>
          </div>
        </div>

        {/* Secondary Persona */}
        <div className="glass-exec-card p-6 space-y-3 border-l-4 border-l-[#00C6AE]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#00C6AE]" />
              <span>Secondary Customer Persona</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#00C6AE] border border-emerald-200">
              Growth Focus
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-extrabold text-[#0F172A]">Incubators, Accelerators & VCs</div>
            <div className="text-xs text-[#64748B]">Institutional managers evaluating portfolio startup readiness and compliance.</div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-[#0F172A]">
            <div className="font-bold text-[11px] text-[#64748B]">Core Pain Points:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Manual review bottleneck across 50+ cohort startups.</li>
              <li>Inconsistent financial projections and missing unit economics.</li>
              <li>Unstructured audit trails during diligence rounds.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Acquisition Channels & GEO Trends */}
      <div className="glass-exec-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#8C52FF]" />
              <span>Go-To-Market Acquisition Channels & GEO Trends</span>
            </h3>
            <p className="text-[11px] text-[#64748B]">Generative Engine Optimisation (GEO), AI Search, and organic channels.</p>
          </div>

          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => setActiveChannelFilter('all')}
              className={`px-3 py-1 rounded-lg font-extrabold transition ${activeChannelFilter === 'all' ? 'bg-[#5B5CEB] text-white' : 'bg-[#F7F8FC] text-slate-600 hover:bg-slate-200'}`}
            >
              All
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
              AI & GEO Search
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
          {filteredChannels.map((c, idx) => (
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

      {/* AI Growth Experiments & Campaign Ideas */}
      <div className="glass-exec-card p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FF6A3D]" />
          <span>AI Growth Experiments & Campaign Ideas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-[#5B5CEB]">AI Content Calendar</div>
            <p className="text-[11px] text-[#64748B]">Automated generation of 30 weekly posts on LinkedIn & X highlighting product features.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-[#8C52FF]">Automated Email Sequences</div>
            <p className="text-[11px] text-[#64748B]">5-step lead nurture workflow delivering free valuation check & Lean Canvas template.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-[#00C6AE]">AI Influencer Outreach</div>
            <p className="text-[11px] text-[#64748B]">Targeting top 20 startup ecosystem creators for co-branded teardown demos.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-[#26C281]">Viral Teardown Campaign</div>
            <p className="text-[11px] text-[#64748B]">Public AI pitch deck reviews of famous unicorns (e.g. Airbnb, Uber, Razorpay).</p>
          </div>
        </div>
      </div>
    </div>
  );
};
