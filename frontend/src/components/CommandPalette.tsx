"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, DollarSign, Download, BarChart2, Globe, Command, X, Rocket, Cpu } from 'lucide-react';
import { useVentureStore } from '@/lib/store';

interface CommandPaletteProps {
  onNavigateTab?: (tab: string) => void;
  onOpenWizard?: () => void;
  onExportPackage?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onNavigateTab,
  onOpenWizard,
  onExportPackage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { startupState } = useVentureStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'create_startup',
      label: 'Create Startup Venture',
      category: 'Actions',
      icon: Plus,
      run: () => { setIsOpen(false); onOpenWizard?.(); }
    },
    {
      id: 'open_bp',
      label: 'Open Business Plan',
      category: 'Navigation',
      icon: FileText,
      run: () => { setIsOpen(false); onNavigateTab?.('business_plan'); }
    },
    {
      id: 'open_rag',
      label: 'Upload Market Research & RAG',
      category: 'Navigation',
      icon: Search,
      run: () => { setIsOpen(false); onNavigateTab?.('market_research'); }
    },
    {
      id: 'open_finance',
      label: 'View Financial Model (INR ₹)',
      category: 'Navigation',
      icon: DollarSign,
      run: () => { setIsOpen(false); onNavigateTab?.('financial_model'); }
    },
    {
      id: 'open_deck',
      label: 'Open Investor Pitch Deck',
      category: 'Navigation',
      icon: Rocket,
      run: () => { setIsOpen(false); onNavigateTab?.('investor_deck'); }
    },
    {
      id: 'export_pkg',
      label: 'Export Master Investor Package (ZIP)',
      category: 'Actions',
      icon: Download,
      run: () => { setIsOpen(false); onExportPackage?.(); }
    },
    {
      id: 'open_eval',
      label: 'Run LangSmith Evaluation',
      category: 'Observability',
      icon: BarChart2,
      run: () => { setIsOpen(false); onNavigateTab?.('evaluation'); }
    }
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-start justify-center pt-24 p-4 z-50 animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#5B5CEB] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search actions (e.g. 'Create Startup', 'Export Package')..."
            className="w-full bg-transparent text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none"
          />
          <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="p-3 max-h-[320px] overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No matching commands found.</div>
          ) : (
            filtered.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={act.run}
                  className="w-full p-3 rounded-xl hover:bg-[#F7F8FC] border border-transparent hover:border-slate-200 text-left flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#5B5CEB] flex items-center justify-center group-hover:bg-[#5B5CEB] group-hover:text-white transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0F172A]">{act.label}</div>
                      <div className="text-[10px] text-slate-400">{act.category}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                    Jump
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Command Footer */}
        <div className="p-3 bg-[#F7F8FC] border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-[#5B5CEB]" />
            <span>VenturePilot Action Palette</span>
          </div>
          <span>Press <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[10px] border">Esc</code> to close</span>
        </div>
      </div>
    </div>
  );
};
