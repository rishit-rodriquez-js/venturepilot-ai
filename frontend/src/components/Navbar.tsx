"use client";

import React from 'react';
import Link from 'next/link';
import { useVentureStore } from '@/lib/store';
import { Rocket, ShieldCheck, Sparkles, User, LogOut, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useVentureStore();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-100 tracking-tight">VenturePilot</span>
            <span className="text-xs font-semibold text-cyan-400 ml-1 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/50">AI OS</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>LangGraph Co-Founder Active</span>
        </div>

        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 transition">
          <Bell className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-slate-800"></div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.full_name?.charAt(0) || 'F'}
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-medium text-slate-200">{user?.full_name || 'Founder User'}</div>
            <div className="text-slate-500 uppercase text-[10px] tracking-wider font-semibold">{user?.role || 'Founder'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
