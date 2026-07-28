"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { useVentureStore } from '@/lib/store';
import { Plus, Rocket, Award, Layers, ArrowRight, Activity, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { projects, addProject, user } = useVentureStore();
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `proj-${Date.now().toString().slice(-4)}`;
    const newProj = {
      id: newId,
      name: name || "New AI Venture",
      tagline: "Autonomous Agent Business Model",
      industry: industry || "Enterprise AI",
      problem_statement: problem || "High operational latency",
      solution_overview: solution || "Autonomous AI agent workflows",
      stage: "validation" as const,
      readiness_score: 82,
      created_at: new Date().toISOString()
    };
    addProject(newProj);
    setShowModal(false);
    setName('');
    setIndustry('');
    setProblem('');
    setSolution('');
    router.push(`/workspace/${newId}`);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header & Create CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <span>Projects Portfolio Dashboard</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
                  {projects.length} Active Startups
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage your enterprise startup portfolio, monitor investor readiness, and trigger AI agent workflows.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Startup</span>
            </button>
          </div>

          {/* Metrics Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Portfolio Avg Readiness Score</div>
              <div className="text-3xl font-extrabold text-indigo-300">89.5 / 100</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-medium">Institutional Grade Readiness</div>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Vector Memory Context</div>
              <div className="text-3xl font-extrabold text-cyan-300">1,420 Chunks</div>
              <div className="text-[11px] text-slate-500 mt-2">Supabase pgvector (1536d)</div>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">LangGraph Agent Runs</div>
              <div className="text-3xl font-extrabold text-purple-300">48 Workflows</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-medium">100% LangSmith Traced</div>
            </div>
          </div>

          {/* Startup Projects Grid */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Your Startup Ventures</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4 hover:border-slate-700 transition flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {proj.industry}
                        </span>
                        <h3 className="text-lg font-bold text-slate-100 mt-1">{proj.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
                        <Award className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-extrabold text-indigo-300">{proj.readiness_score} pts</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">{proj.tagline || proj.solution_overview}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{proj.problem_statement}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Stage: {proj.stage.toUpperCase()}</span>

                    <Link
                      href={`/workspace/${proj.id}`}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-semibold transition"
                    >
                      <span>Enter OS Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creation Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <div className="w-full max-w-lg glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-cyan-400" />
                    <span>Create New Startup Project</span>
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300 text-xs">Close</button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Startup Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. FinPulse AI"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Sector</label>
                    <input
                      type="text"
                      required
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. FinTech / Enterprise SaaS"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Core Problem Statement</label>
                    <textarea
                      required
                      rows={2}
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="What friction or inefficiency are you solving?"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Solution Overview</label>
                    <textarea
                      required
                      rows={2}
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="How does your AI platform solve this?"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400 text-xs font-semibold hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20"
                    >
                      Launch AI Workflows
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
