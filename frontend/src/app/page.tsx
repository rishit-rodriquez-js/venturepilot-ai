"use client";

import React from 'react';
import Link from 'next/link';
import { Rocket, ShieldCheck, Cpu, Layers, Compass, ArrowRight, CheckCircle, Sparkles, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Navigation Header */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">VenturePilot</span>
            <span className="text-xs font-bold text-cyan-400 ml-1.5 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">AI OS</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
          >
            Launch VenturePilot
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-20 text-center space-y-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-xs font-semibold text-cyan-300 shadow-inner">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Next-Generation Enterprise AI Startup Operating System</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-100 leading-[1.1]">
          Your Persistent <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Autonomous AI Co-Founder
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
          Transform raw startup ideas into investor-ready businesses. Powered by LangGraph agent swarms, Supabase pgvector memory, real-time market intelligence, and immutable governance audit trails.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition"
          >
            <span>Open Projects Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base transition"
          >
            Create Founder Account
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Lean & Business Canvas</h3>
            <p className="text-xs text-slate-400">Dynamic 9-box business framework automatically generated and refined by autonomous agent workflows.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Market Intelligence & Radar</h3>
            <p className="text-xs text-slate-400">Calculates TAM/SAM/SOM breakdown, competitor matrix positioning, and defensive moat analysis.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">100-Point Investor Scorecard</h3>
            <p className="text-xs text-slate-400">Institutional pitch deck generator, unit economic financial forecasts, and Q&A defense simulator.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-8 text-center text-xs text-slate-500">
        <p>© 2026 VenturePilot AI Inc. Enterprise AI Startup Operating System. Built with Next.js 15, FastAPI, LangGraph, & Supabase pgvector.</p>
      </footer>
    </div>
  );
}
