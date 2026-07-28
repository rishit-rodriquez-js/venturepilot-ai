"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVentureStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Rocket, Search, LogOut, Command, Sparkles, FileText, Download, BarChart2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, activeProject, clearStore } = useVentureStore();
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandBar((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Signed out local session");
    }
    // Clear Zustand store & browser cache completely on signout
    clearStore();
    window.localStorage.clear();
    window.sessionStorage.clear();
    router.push('/');
  };

  return (
    <>
      <header className="h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B5CEB] flex items-center justify-center text-white shadow-md shadow-[#5B5CEB]/20">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#0F172A]">VenturePilot AI</span>
          </Link>

          {/* Raycast Trigger Input */}
          <button
            onClick={() => setShowCommandBar(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F7F8FC] border border-slate-200 text-xs text-[#64748B] hover:border-slate-300 transition"
          >
            <Search className="w-3.5 h-3.5 text-[#5B5CEB]" />
            <span>Ask VenturePilot or run command...</span>
            <kbd className="ml-4 px-1.5 py-0.5 rounded bg-white text-[10px] font-mono border border-slate-200 text-slate-400">⌘K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {activeProject && (
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#0F172A] px-3 py-1.5 rounded-xl bg-[#F7F8FC] border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#26C281] animate-pulse" />
              <span>Active: {activeProject.name}</span>
            </div>
          )}

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[#0F172A]">{user?.full_name || 'Founder'}</div>
              <div className="text-[10px] text-[#64748B] uppercase font-semibold">{user?.role || 'Founder'}</div>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Spotlight Command Bar Modal */}
      {showCommandBar && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4 z-50">
          <div className="w-full max-w-xl bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden space-y-3 p-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <Command className="w-5 h-5 text-[#5B5CEB]" />
              <input
                type="text"
                autoFocus
                value={cmdSearch}
                onChange={(e) => setCmdSearch(e.target.value)}
                placeholder="Type a command or search workspace..."
                className="flex-1 text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none"
              />
              <button onClick={() => setShowCommandBar(false)} className="text-xs text-slate-400 hover:text-slate-600">ESC</button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase text-[#64748B] px-2">Suggested Actions</div>
              <button
                onClick={() => { setShowCommandBar(false); if (activeProject) router.push(`/workspace/${activeProject.id}`); }}
                className="w-full p-2.5 rounded-xl hover:bg-[#F7F8FC] text-left text-xs font-semibold text-[#0F172A] flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8C52FF]" />
                  <span>Generate GTM Strategy</span>
                </div>
                <span className="text-[10px] text-slate-400">Action</span>
              </button>

              <button
                onClick={() => { setShowCommandBar(false); if (activeProject) router.push(`/workspace/${activeProject.id}`); }}
                className="w-full p-2.5 rounded-xl hover:bg-[#F7F8FC] text-left text-xs font-semibold text-[#0F172A] flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00C6AE]" />
                  <span>Upload Market Research Report</span>
                </div>
                <span className="text-[10px] text-slate-400">RAG</span>
              </button>

              <button
                onClick={() => { setShowCommandBar(false); if (activeProject) router.push(`/workspace/${activeProject.id}`); }}
                className="w-full p-2.5 rounded-xl hover:bg-[#F7F8FC] text-left text-xs font-semibold text-[#0F172A] flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#26C281]" />
                  <span>Run Agent Evaluation</span>
                </div>
                <span className="text-[10px] text-slate-400">LangSmith</span>
              </button>

              <button
                onClick={() => { setShowCommandBar(false); if (activeProject) router.push(`/workspace/${activeProject.id}`); }}
                className="w-full p-2.5 rounded-xl hover:bg-[#F7F8FC] text-left text-xs font-semibold text-[#0F172A] flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#5B5CEB]" />
                  <span>Export Master Investor Package Zip</span>
                </div>
                <span className="text-[10px] text-slate-400">Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
