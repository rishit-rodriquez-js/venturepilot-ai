"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVentureStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Rocket, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, activeProject, setUser, setProjects, setActiveProject } = useVentureStore();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Signed out local session");
    }
    setUser(null);
    setProjects([]);
    setActiveProject(null);
    window.localStorage.clear();
    window.sessionStorage.clear();
    router.push('/');
  };

  return (
    <header className="h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between z-40 sticky top-0">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#5B5CEB] flex items-center justify-center text-white shadow-md shadow-[#5B5CEB]/20">
            <Rocket className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-[#0F172A]">VenturePilot AI</span>
        </Link>
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
  );
};
