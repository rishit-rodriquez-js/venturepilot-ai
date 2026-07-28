"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useVentureStore } from '@/lib/store';
import { Rocket, ArrowRight, Play, CheckCircle2, Cpu, Sparkles, Database, Award, BarChart2, Globe, X, RefreshCw } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useVentureStore();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeDemoStep, setActiveDemoStep] = useState(0);

  const demoSteps = [
    {
      title: "Step 1: Idea Ingestion & Structuring",
      description: "Autonomous Planner Agent converts raw problem/solution text into an institutional venture structure.",
      agent: "Planner Agent",
      codeSnippet: "INGESTING: 'India-First AI Agronomy System for Smallholders'\n→ Initializing Lean Canvas matrix & DPIIT statutory schema...",
      score: 74
    },
    {
      title: "Step 2: Vector RAG Research Memory",
      description: "Research Agent embeds user documents with text-embedding-3-small into pgvector vector store.",
      agent: "Research Agent",
      codeSnippet: "INDEXING: 'NITI_Aayog_Agritech_Report_2026.pdf'\n→ 96 Chunks embedded. Top Cosine Match: 0.96 (Agritech TAM ₹2.4L Cr).",
      score: 82
    },
    {
      title: "Step 3: Financial & Unit Economics Model",
      description: "Finance Agent models monthly burn rate (INR ₹), 24-month runway, break-even timeline, and Seed Ask.",
      agent: "Finance Agent",
      codeSnippet: "CALCULATING: INR Unit Economics\n→ Monthly Burn: ₹5 Lakhs | Runway: 24 Months | Seed Ask: ₹2.0 Crore.",
      score: 88
    },
    {
      title: "Step 4: Institutional Investor Pitch Deck",
      description: "Pitch Deck Agent generates 10 PowerPoint slides with real pitch content and exportable PPTX file.",
      agent: "Investor Deck Agent",
      codeSnippet: "GENERATING: PitchDeck.pptx & FinancialModel.xlsx\n→ Institutional Score: 89/100 (Ready for Term Sheet).",
      score: 89
    }
  ];

  const handleStartBuilding = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user || user) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  const pipeline = [
    { step: "01", title: "Idea Validation", status: "Completed" },
    { step: "02", title: "RAG Research", status: "Completed" },
    { step: "03", title: "Business Plan", status: "Active" },
    { step: "04", title: "Financial Model", status: "Active" },
    { step: "05", title: "Investor Deck", status: "Queued" },
    { step: "06", title: "Launch OS", status: "Queued" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#0F172A] selection:bg-[#5B5CEB] selection:text-white relative overflow-hidden bg-executive-mesh flex flex-col justify-between">
      
      {/* Floating Header Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 max-w-6xl w-[92%] h-16 px-6 glass-floating-nav flex items-center justify-between z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B5CEB] via-[#00C6AE] to-[#8C52FF] flex items-center justify-center text-white shadow-md shadow-[#5B5CEB]/20">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#0F172A]">VenturePilot AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#64748B]">
          <a href="#how-it-works" className="hover:text-[#5B5CEB] transition">How It Works</a>
          <a href="#agents" className="hover:text-[#8C52FF] transition">AI Agents</a>
          <a href="#india" className="hover:text-[#00C6AE] transition">Designed for India</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0F172A] hover:bg-slate-100 transition"
          >
            Sign In
          </Link>
          <button
            onClick={handleStartBuilding}
            className="px-4 py-2 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-lg shadow-[#5B5CEB]/25 flex items-center gap-1.5 transition"
          >
            <span>Start Building</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hero Headline */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-[#5B5CEB]">
            <Sparkles className="w-4 h-4 text-[#8C52FF]" />
            <span>Enterprise AI Startup Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]">
            Build an Investor-Ready Startup with your <br />
            <span className="bg-gradient-to-r from-[#5B5CEB] via-[#00C6AE] to-[#8C52FF] bg-clip-text text-transparent">
              AI Co-Founder.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-xl">
            Transform raw ideas into institutionally vetted businesses using autonomous LangGraph agents, persistent pgvector RAG memory, and Indian statutory compliance.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleStartBuilding}
              className="px-6 py-3.5 rounded-2xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-xl shadow-[#5B5CEB]/25 flex items-center gap-2 transition transform active:scale-[0.99]"
            >
              <span>Start Building Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setShowDemoModal(true); setActiveDemoStep(0); }}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-200 text-xs font-extrabold shadow-sm flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 text-[#5B5CEB]" />
              <span>Watch Interactive Guided Demo</span>
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-[#64748B]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#26C281]" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#26C281]" />
              <span>India First (DPIIT & GST)</span>
            </div>
          </div>
        </div>

        {/* Right Animated Mock Workspace */}
        <div className="lg:col-span-6">
          <div className="glass-exec-card p-6 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-[#0F172A] ml-2">Sample Startup — Live AI OS Workspace</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-[#26C281] font-bold border border-emerald-200">
                Running
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#64748B]">Active Agent</div>
                <div className="text-xs font-extrabold text-[#5B5CEB] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#8C52FF]" />
                  <span>Market RAG Agent</span>
                </div>
                <p className="text-[10px] text-[#64748B]">Ingested Market Research Report (96% Match)</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#64748B]">Investor Score</div>
                <div className="text-xl font-extrabold text-[#26C281]">89/100</div>
                <p className="text-[10px] text-[#26C281] font-semibold">Institutional Ready</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                <span>Executive Business Summary</span>
                <span className="text-[#8C52FF] text-[10px]">AI Co-Founder Synthesized</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Sample AI Startup delivers autonomous workflow automation for enterprise operations, capturing a multi-million dollar TAM with institutional investor readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Guided Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl bg-white p-6 rounded-[28px] shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
                <Sparkles className="w-4 h-4 text-[#5B5CEB]" />
                <span>Interactive VenturePilot AI Guided Walkthrough</span>
              </div>
              <button onClick={() => setShowDemoModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Navigation Bar */}
            <div className="grid grid-cols-4 gap-2">
              {demoSteps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDemoStep(idx)}
                  className={`p-2 rounded-xl text-left border transition ${
                    activeDemoStep === idx
                      ? 'bg-[#5B5CEB] text-white border-[#5B5CEB] shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase opacity-80">Step {idx + 1}</div>
                  <div className="text-xs font-extrabold truncate">{s.agent}</div>
                </button>
              ))}
            </div>

            {/* Active Step Content */}
            <div className="p-6 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">{demoSteps[activeDemoStep].title}</h3>
                  <p className="text-xs text-[#64748B] mt-1">{demoSteps[activeDemoStep].description}</p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#26C281] border border-emerald-200 text-xs font-bold">
                  Readiness: {demoSteps[activeDemoStep].score}/100
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0E14] text-cyan-300 font-mono text-xs space-y-2 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Agent Stream Terminal</div>
                <pre className="whitespace-pre-wrap">{demoSteps[activeDemoStep].codeSnippet}</pre>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  disabled={activeDemoStep === 0}
                  onClick={() => setActiveDemoStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  disabled={activeDemoStep === demoSteps.length - 1}
                  onClick={() => setActiveDemoStep((prev) => Math.min(demoSteps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40"
                >
                  Next Step
                </button>
              </div>

              <button
                onClick={() => { setShowDemoModal(false); handleStartBuilding(); }}
                className="px-6 py-2.5 rounded-xl bg-[#5B5CEB] text-white font-extrabold text-xs shadow-lg shadow-[#5B5CEB]/20 flex items-center gap-1.5"
              >
                <span>Launch Venture Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Agents Section */}
      <section id="agents" className="py-16 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#8C52FF] text-xs font-bold border border-purple-200">
            <Cpu className="w-4 h-4" />
            <span>Autonomous Multi-Agent Swarm</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Powered by Specialized LangGraph AI Agents</h2>
          <p className="text-xs text-[#64748B]">Each agent owns a dedicated domain of your startup execution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#5B5CEB] flex items-center justify-center font-extrabold text-sm">
              01
            </div>
            <h3 className="font-extrabold text-base text-[#0F172A]">Planner & Strategy Agent</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Synthesizes raw prompts into Lean Canvas models, value propositions, customer personas, and competitive moats.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00C6AE] flex items-center justify-center font-extrabold text-sm">
              02
            </div>
            <h3 className="font-extrabold text-base text-[#0F172A]">RAG Research Agent</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Indexes uploaded PDFs and documents into pgvector memory using OpenAI embeddings for real citation retrieval.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#8C52FF] flex items-center justify-center font-extrabold text-sm">
              03
            </div>
            <h3 className="font-extrabold text-base text-[#0F172A]">Financial & Statutory Agent</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Calculates INR ₹ monthly burn rates, 24-mo runway, Lakhs/Crores financial models, DPIIT and SISFS statutory schemes.
            </p>
          </div>
        </div>
      </section>

      {/* Designed for India Section */}
      <section id="india" className="py-16 px-6 max-w-7xl mx-auto w-full bg-white rounded-[32px] border border-slate-200 shadow-sm space-y-8 my-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#26C281] text-xs font-bold border border-emerald-200">
            <Globe className="w-4 h-4" />
            <span>India-First Ecosystem Integration</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Built for Indian Founders & Statutory Realities</h2>
          <p className="text-xs text-[#64748B]">Default INR ₹ currency, Lakhs/Crores math, DPIIT Startup India, SISFS seed grants, GST and UPI integration pathways.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
            <div className="text-xs font-extrabold text-[#0F172A]">DPIIT Startup India</div>
            <p className="text-[10px] text-[#64748B]">80-IAC Tax Exemption & Statutory Filing</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
            <div className="text-xs font-extrabold text-[#0F172A]">SISFS Seed Grants</div>
            <p className="text-[10px] text-[#64748B]">Grants up to ₹50 Lakhs via Incubators</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
            <div className="text-xs font-extrabold text-[#0F172A]">INR Unit Economics</div>
            <p className="text-[10px] text-[#64748B]">Calculated in Lakhs & Crores (₹)</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
            <div className="text-xs font-extrabold text-[#0F172A]">ONDC & UPI Stack</div>
            <p className="text-[10px] text-[#64748B]">Digital Payment & Commerce Protocols</p>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section id="how-it-works" className="py-16 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">How VenturePilot AI Operates</h2>
          <p className="text-xs text-[#64748B]">Autonomous node-by-node execution pipeline powering your startup lifecycle.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipeline.map((p, idx) => (
            <div key={idx} className="glass-exec-card p-4 text-center space-y-2">
              <div className="text-lg font-extrabold text-[#5B5CEB]">{p.step}</div>
              <div className="text-xs font-bold text-[#0F172A]">{p.title}</div>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                p.status === 'Completed' ? 'bg-emerald-50 text-[#26C281] border border-emerald-200' : 'bg-slate-100 text-[#64748B]'
              }`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-[#64748B]">
        VenturePilot AI — Executive AI Startup Operating System • Powered by OpenAI & LangGraph
      </footer>
    </div>
  );
}
