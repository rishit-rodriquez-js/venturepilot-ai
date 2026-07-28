"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Compass, Layers, PieChart, ShieldAlert, Cpu, FileText, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const pathname = usePathname();
  const isWorkspace = pathname.includes('/workspace');

  const workspaceTabs = [
    { id: 'cofounder', label: 'AI Co-Founder Hub', icon: Cpu },
    { id: 'canvas', label: 'Lean & Business Canvas', icon: Layers },
    { id: 'market', label: 'Market & Competitors', icon: Compass },
    { id: 'tech', label: 'Technical Blueprint', icon: FileText },
    { id: 'financials', label: 'Financial Forecasts', icon: PieChart },
    { id: 'investor', label: 'Investor Scorecard', icon: ShieldAlert },
    { id: 'governance', label: 'Governance & Audit', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Navigation</div>
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                pathname === '/dashboard' ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Projects Dashboard</span>
            </Link>
          </nav>
        </div>

        {isWorkspace && onTabChange && (
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Startup OS Modules</div>
            <nav className="space-y-1">
              {workspaceTabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onTabChange(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition text-left ${
                      isActive ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <div className="p-3 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-xs">
        <div className="text-slate-300 font-semibold mb-1">VenturePilot Enterprise</div>
        <div className="text-slate-500 text-[11px]">PGVector RLS & LangSmith Active</div>
      </div>
    </aside>
  );
};
