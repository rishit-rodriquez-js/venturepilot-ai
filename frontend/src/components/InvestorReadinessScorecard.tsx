"use client";

import React from 'react';
import { ShieldAlert, Award, Presentation, HelpCircle, CheckCircle2 } from 'lucide-react';

interface InvestorProps {
  data?: any;
}

export const InvestorReadinessScorecard: React.FC<InvestorProps> = ({ data }) => {
  const overall = data?.overall_score || 88;
  const team = data?.team_score || 90;
  const market = data?.market_score || 92;
  const product = data?.product_score || 85;
  const financial = data?.financial_score || 85;

  const slides = data?.pitch_deck_slides || [
    { slide_title: "1. Executive Summary", core_bullet: "VenturePilot AI is the AI Startup Operating System transforming ideas into investor-ready startups." },
    { slide_title: "2. The Problem", core_bullet: "Founders spend 600+ hours yearly on administrative debt, non-persistent docs, and stale spreadsheet projections." },
    { slide_title: "3. The Solution & AI Moat", core_bullet: "Autonomous LangGraph multi-agent system backed by persistent Supabase pgvector memory store." },
    { slide_title: "4. Market Opportunity & Growth", core_bullet: "$48.5B TAM with 4.5x LTV/CAC ratio and 24-month capital efficiency runway." }
  ];

  const qa = data?.investor_qa_pairs || [
    { question: "What is your primary technological moat?", recommended_answer: "Our persistent vector memory coupled with enterprise Row Level Security and multi-agent LangGraph workflow orchestration." },
    { question: "How do you mitigate API pricing and model vendor risks?", recommended_answer: "Our backend utilizes model-agnostic abstraction protocols allowing seamless model failovers and local LLM fallbacks." }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>Investor Readiness Scorecard & Pitch Generator</span>
        </h2>
        <p className="text-xs text-slate-400">Comprehensive 100-point venture readiness index, auto-generated pitch deck slides, and investor Q&A simulator.</p>
      </div>

      {/* Score Header */}
      <div className="p-6 rounded-xl border border-indigo-800/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-500 bg-indigo-950/60 flex items-center justify-center text-3xl font-extrabold text-indigo-300 shadow-lg shadow-indigo-500/20">
            {overall}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Overall Investor Readiness Index</div>
            <div className="text-lg font-bold text-slate-100">Top 5% Institutional Grade Startup</div>
            <div className="text-xs text-slate-400">High probability of securing Pre-Seed / Seed institutional term sheet.</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Team</div>
            <div className="text-lg font-bold text-slate-200">{team}/100</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Market</div>
            <div className="text-lg font-bold text-slate-200">{market}/100</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Product</div>
            <div className="text-lg font-bold text-slate-200">{product}/100</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Financials</div>
            <div className="text-lg font-bold text-slate-200">{financial}/100</div>
          </div>
        </div>
      </div>

      {/* Pitch Deck Outline */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Presentation className="w-4 h-4 text-cyan-400" />
          <span>Auto-Generated Investor Pitch Deck Outline</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slides.map((s: any, idx: number) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-cyan-300">{s.slide_title}</div>
              <div className="text-xs text-slate-300">{s.core_bullet}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Investor Q&A Simulator */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Investor Defense Q&A Simulator</span>
        </h3>
        <div className="space-y-3">
          {qa.map((q: any, idx: number) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                <span>Q:</span>
                <span>{q.question}</span>
              </div>
              <div className="text-xs text-slate-300 pl-4 border-l-2 border-slate-700">
                <span className="font-semibold text-cyan-400">AI Defense Strategy: </span>
                <span>{q.recommended_answer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
