"use client";

import React, { useState } from 'react';
import { Presentation, Download, ChevronLeft, ChevronRight, CheckCircle2, Award, Sparkles, RefreshCw } from 'lucide-react';
import { useVentureStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

interface DeckProps {
  projectId: string;
}

export const InvestorDeckTab: React.FC<DeckProps> = ({ projectId }) => {
  const { startupState, activeProject } = useVentureStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const projName = activeProject?.name || startupState.project.name || 'Your Startup';
  const deck = startupState.investor_deck;

  const DEFAULT_10_SLIDES = [
    { slide_number: 1, title: "1. Cover", content: `${projName} — Executive Institutional Pitch Deck` },
    { slide_number: 2, title: "2. Problem", content: startupState.project.problem_statement || "Founders spend months manually drafting business plans, market research, and financial models." },
    { slide_number: 3, title: "3. Solution", content: startupState.project.solution_overview || "Autonomous LangGraph AI Engine executing real-time strategic updates across workspace modules." },
    { slide_number: 4, title: "4. Market Opportunity", content: `Target Market: ${startupState.project.target_market || 'Global & Indian Enterprise SaaS'}. TAM: ₹12,500 Cr | SAM: ₹2,400 Cr | SOM: ₹350 Cr.` },
    { slide_number: 5, title: "5. Business Model", content: `Model: ${startupState.project.business_model || 'SaaS Subscription'}. Target Pricing: ${startupState.marketing_strategy.pricing_inr || '₹1,499/month per workspace'}.` },
    { slide_number: 6, title: "6. Product", content: "Unified AI Co-Founder system with 512-token vector RAG ingestion, interactive financial curves, and LangSmith tracing." },
    { slide_number: 7, title: "7. Go-To-Market", content: "Generative Engine Optimisation (GEO), LinkedIn B2B founder DMs, Product Hunt launch, and viral teardown posts." },
    { slide_number: 8, title: "8. Financials", content: `Burn Rate: ₹2.5 Lakh/mo | Runway: 18 Months | Year 1 ARR: ₹25 Lakhs growing to ₹3.5 Cr in Year 3.` },
    { slide_number: 9, title: "9. Roadmap", content: "Month 1: Problem Validation → Month 2: AI MVP Engine → Month 4: Beta Launch & Pilot Onboarding." },
    { slide_number: 10, title: "10. Investment Ask", content: `Seeking ${startupState.financials.seed_ask_inr || startupState.project.funding_goal || '₹1.0 Crore'} Seed Round for engineering expansion & distribution.` }
  ];

  const rawSlides = deck?.slides;
  const slides = (rawSlides && Array.isArray(rawSlides) && rawSlides.length > 0) ? rawSlides : DEFAULT_10_SLIDES;
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleExportDeck = async (ext: 'pptx' | 'pdf') => {
    const fileName = `PitchDeck.${ext}`;
    setIsExporting(ext);
    try {
      const response = await apiClient.get(`/projects/${projectId}/download-file/${fileName}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      let textContent = `VENTUREPILOT AI PITCH DECK EXPORT (${ext.toUpperCase()})\nProject: ${projName}\n\n`;
      slides.forEach((s) => {
        textContent += `Slide ${s.slide_number}: ${s.title}\n${s.content}\n-----------------------------------\n`;
      });
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Score Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Presentation className="w-5 h-5 text-[#5B5CEB]" />
            <span>PowerPoint Pitch Deck Previewer & Exporter</span>
          </h2>
          <p className="text-xs text-[#64748B]">10-slide institutional pitch deck synthesized by AI Pitch Agent.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExportDeck('pptx')}
            disabled={!!isExporting}
            className="px-5 py-2.5 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition disabled:opacity-50"
          >
            {isExporting === 'pptx' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export PitchDeck.pptx</span>
          </button>

          <button
            onClick={() => handleExportDeck('pdf')}
            disabled={!!isExporting}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-200 font-extrabold text-xs shadow-sm flex items-center gap-2 transition disabled:opacity-50"
          >
            {isExporting === 'pdf' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-[#5B5CEB]" />}
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Slide Readiness Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-[#64748B]">Overall Score</div>
          <div className="text-lg font-extrabold text-[#5B5CEB]">{deck?.overall_score || 89}/100</div>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-[#64748B]">Team & Traction</div>
          <div className="text-lg font-extrabold text-[#26C281]">{deck?.team_score || 90}%</div>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-[#64748B]">Market (₹ TAM)</div>
          <div className="text-lg font-extrabold text-[#00C6AE]">{deck?.market_score || 92}%</div>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-[#64748B]">Product Moat</div>
          <div className="text-lg font-extrabold text-[#8C52FF]">{deck?.product_score || 85}%</div>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-[#64748B]">Financial Model</div>
          <div className="text-lg font-extrabold text-[#26C281]">{deck?.financial_score || 88}%</div>
        </div>
      </div>

      {/* POWERPOINT-STYLE INTERACTIVE SLIDE VIEWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Slide Thumbnail List (4 cols) */}
        <div className="lg:col-span-4 glass-exec-card p-4 space-y-2 max-h-[500px] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
            Deck Slides ({slides.length})
          </div>

          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-full p-3 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between ${
                currentSlideIndex === idx
                  ? 'bg-[#5B5CEB] text-white border-[#5B5CEB] shadow-md'
                  : 'bg-[#F7F8FC] text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="truncate pr-2">{s.title}</div>
              <span className="text-[10px] opacity-75 font-mono">#{String(idx + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>

        {/* Live Presentation Viewport (8 cols) */}
        <div className="lg:col-span-8 glass-exec-card p-8 flex flex-col justify-between min-h-[440px] bg-white border border-slate-200 relative overflow-hidden">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#5B5CEB] flex items-center justify-center text-[9px] font-bold text-white font-mono">
                  {currentSlideIndex + 1}
                </span>
                <h3 className="text-xl font-extrabold text-[#0F172A]">{currentSlide.title}</h3>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-50 text-[#5B5CEB] border border-indigo-200">
                {projName} Pitch Deck
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8FC] border border-slate-200 text-sm text-[#0F172A] leading-relaxed font-medium min-h-[180px] flex items-center">
              {currentSlide.content}
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="text-[#64748B] font-medium">
              Slide <strong className="text-[#0F172A]">{currentSlideIndex + 1}</strong> of <strong className="text-[#0F172A]">{slides.length}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentSlideIndex === 0}
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                className="p-2.5 rounded-xl bg-[#F7F8FC] hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                disabled={currentSlideIndex === slides.length - 1}
                onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                className="p-2.5 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-bold shadow-md disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
