"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { LeanCanvasMatrix } from '@/components/LeanCanvasMatrix';
import { MarketIntelRadar } from '@/components/MarketIntelRadar';
import { TechnicalArchitectureView } from '@/components/TechnicalArchitectureView';
import { FinancialForecastChart } from '@/components/FinancialForecastChart';
import { InvestorReadinessScorecard } from '@/components/InvestorReadinessScorecard';
import { GovernanceAuditLogs } from '@/components/GovernanceAuditLogs';
import { useVentureStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { Cpu, Sparkles, Send, Award, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function WorkspacePage() {
  const params = useParams();
  const projectId = (params?.id as string) || "proj-1";
  const { projects } = useVentureStore();

  const currentProj = projects.find((p) => p.id === projectId) || projects[0];

  const [activeTab, setActiveTab] = useState('cofounder');
  const [promptInput, setPromptInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const [aiResult, setAiResult] = useState<any>(null);

  // Auto-load initial AI synthesis if available
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await apiClient.post('/ai-cofounder/execute', {
          project_id: projectId,
          prompt: "Initial startup operating system synthesis"
        });
        setAiResult(res.data);
      } catch (err) {
        console.warn("Using offline fallback mode");
      }
    };
    fetchInitial();
  }, [projectId]);

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsExecuting(true);
    try {
      const res = await apiClient.post('/ai-cofounder/execute', {
        project_id: projectId,
        prompt: promptInput
      });
      setAiResult(res.data);
      setPromptInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {/* Workspace Title Header */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {currentProj?.industry || 'Enterprise SaaS'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {currentProj?.id}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">{currentProj?.name || 'FinPulse AI'}</h1>
              <p className="text-xs text-slate-400 mt-1">{currentProj?.tagline || currentProj?.solution_overview}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-bold">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Investor Score: {aiResult?.investor_readiness?.overall_score || currentProj?.readiness_score || 88}/100</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Supabase RLS Active</span>
              </div>
            </div>
          </div>

          {/* TAB 1: AI Co-Founder Hub & Direct Prompt */}
          {activeTab === 'cofounder' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>AI Co-Founder Interactive Hub</span>
                </h2>
                <p className="text-xs text-slate-400">Directly command your autonomous AI co-founder agent swarm to update business strategy, financial models, and tech architecture.</p>
              </div>

              {/* Prompt Input Box */}
              <form onSubmit={handleRunAgent} className="p-4 rounded-2xl border border-cyan-800/40 bg-slate-900/80 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">Command AI Co-Founder:</span>
                  <span className="flex items-center gap-1 text-[11px] text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>LangGraph Multi-Agent Engine (GPT-4o)</span>
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="e.g. Analyze our competitive moat against legacy consulting models and adjust CAC/LTV projections for Year 2."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={isExecuting}
                    className="absolute right-3 bottom-3 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/25 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Agents Executing...</span>
                      </>
                    ) : (
                      <>
                        <span>Execute Prompt</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Strategic Commentary */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Strategic Executive Summary & 90-Day Roadmap Focus</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiResult?.cofounder_advice || `As your AI Co-Founder for ${currentProj.name}, our priority over the next 90 days is validating customer acquisition channels, locking down enterprise security posture, and demonstrating unit economic scalability.`}
                </p>
              </div>

              {/* Quick Jump Grid to Sub-modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button onClick={() => setActiveTab('canvas')} className="p-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-left transition">
                  <div className="text-xs font-bold text-cyan-400">Lean Canvas Matrix</div>
                  <div className="text-[11px] text-slate-400 mt-1">9-Box strategic business canvas</div>
                </button>
                <button onClick={() => setActiveTab('market')} className="p-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-left transition">
                  <div className="text-xs font-bold text-indigo-400">Market & Competitors</div>
                  <div className="text-[11px] text-slate-400 mt-1">TAM/SAM/SOM & competitive radar</div>
                </button>
                <button onClick={() => setActiveTab('financials')} className="p-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-left transition">
                  <div className="text-xs font-bold text-emerald-400">Financial Forecasts</div>
                  <div className="text-[11px] text-slate-400 mt-1">CAC/LTV, burn rate & runway</div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LEAN CANVAS */}
          {activeTab === 'canvas' && <LeanCanvasMatrix canvasData={aiResult?.lean_canvas} />}

          {/* TAB 3: MARKET INTEL */}
          {activeTab === 'market' && <MarketIntelRadar data={aiResult?.market_intel} />}

          {/* TAB 4: TECHNICAL ARCHITECTURE */}
          {activeTab === 'tech' && <TechnicalArchitectureView data={aiResult?.tech_architecture} />}

          {/* TAB 5: FINANCIALS */}
          {activeTab === 'financials' && <FinancialForecastChart data={aiResult?.financials} />}

          {/* TAB 6: INVESTOR SCORECARD */}
          {activeTab === 'investor' && <InvestorReadinessScorecard data={aiResult?.investor_readiness} />}

          {/* TAB 7: GOVERNANCE & AUDIT */}
          {activeTab === 'governance' && <GovernanceAuditLogs />}
        </main>
      </div>
    </div>
  );
}
