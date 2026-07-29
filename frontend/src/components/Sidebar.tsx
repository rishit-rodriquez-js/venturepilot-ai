"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Compass, 
  Target, 
  Cpu, 
  DollarSign, 
  Map, 
  Megaphone, 
  Presentation, 
  Download, 
  BarChart2, 
  History, 
  GitBranch 
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'overview', onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-[#5B5CEB]' },
    { id: 'business_plan', label: 'Business Plan', icon: FileText, color: 'text-[#8C52FF]' },
    { id: 'market_research', label: 'Market Research (RAG)', icon: Compass, color: 'text-[#00C6AE]' },
    { id: 'competitor_analysis', label: 'Competitor Analysis', icon: Target, color: 'text-[#5B5CEB]' },
    { id: 'technical_architecture', label: 'Technical Architecture', icon: Cpu, color: 'text-[#5B5CEB]' },
    { id: 'financial_model', label: 'Financial Model', icon: DollarSign, color: 'text-[#26C281]' },
    { id: 'product_roadmap', label: 'Product Roadmap', icon: Map, color: 'text-[#FFB648]' },
    { id: 'marketing_strategy', label: 'Marketing Strategy', icon: Megaphone, color: 'text-[#FF6A3D]' },
    { id: 'investor_deck', label: 'Investor Deck', icon: Presentation, color: 'text-[#8C52FF]' },
    { id: 'downloads', label: 'Downloads Bundle', icon: Download, color: 'text-[#26C281]' },
    { id: 'evaluation', label: 'Evaluation & Traces', icon: BarChart2, color: 'text-[#5B5CEB]' }
  ];

  return (
    <aside className="w-64 p-4 bg-white/60 backdrop-blur-md border-r border-slate-200 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-3">
          Startup Operating System
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange && onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#5B5CEB] text-white shadow-md shadow-[#5B5CEB]/25 font-bold'
                    : 'text-[#64748B] hover:bg-[#F7F8FC] hover:text-[#0F172A]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
        <div className="text-[10px] font-bold uppercase text-[#64748B]">System Memory</div>
        <div className="text-xs font-bold text-[#0F172A]">Supabase pgvector</div>
        <div className="text-[10px] text-[#26C281] font-semibold">Row Level Security Active</div>
      </div>
    </aside>
  );
};
