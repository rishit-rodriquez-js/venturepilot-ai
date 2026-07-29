"use client";

import React, { useState } from 'react';
import { Presentation, Download, ChevronLeft, ChevronRight, CheckCircle2, Award, Sparkles, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface DeckProps {
  projectId: string;
  data?: any;
  onRefetch?: () => void;
}

export const InvestorDeckTab: React.FC<DeckProps> = ({ projectId, data, onRefetch }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const deck = data || {};

  const DEFAULT_10_SLIDES = [
    { slide_number: 1, title: "1. Cover", content: "Executive Institutional Pitch Deck" },
    { slide_number: 2, title: "2. Problem", content: "Founders spend months manually drafting business plans, market research, and financial models." },
    { slide_number: 3, title: "3. Solution", content: "Autonomous LangGraph AI Engine executing real-time strategic updates across workspace modules." },
    { slide_number: 4, title: "4. Market Opportunity", content: "Global addressable market opportunity TAM: ₹24,000 Cr | SAM: ₹4,500 Cr | SOM: ₹180 Cr." },
    { slide_number: 5, title: "5. Business Model", content: "SaaS Subscription + Enterprise API Tiers. Target Pricing: ₹1,499/month per workspace." },
    { slide_number: 6, title: "6. Product & Architecture", content: "Unified AI Co-Founder system with 512-token vector RAG ingestion and LangSmith tracing." },
    { slide_number: 7, title: "7. Go-To-Market", content: "Generative Engine Optimisation (GEO), LinkedIn B2B founder DMs, and Product Hunt launch." },
    { slide_number: 8, title: "8. Financials", content: "Burn Rate: ₹2.5 Lakh/mo | Runway: 18 Months | Year 3 ARR Target: ₹5.0 Cr." },
    { slide_number: 9, title: "9. Product Roadmap", content: "Month 1: Problem Validation → Month 2: AI MVP Engine → Month 4: Beta Launch." },
    { slide_number: 10, title: "10. Investment Ask", content: "Seeking ₹2.0 Crore Seed Round for engineering expansion & distribution." }
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
      const headerType = response.headers['content-type'];
      const mimeType = typeof headerType === 'string' ? headerType : 'application/octet-stream';
      const blob = new Blob([response.data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleRegenerateDeck = async () => {
    setIsRegenerating(true);
    try {
      await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: "Synthesize 10-slide Investor Pitch Deck"
      });
      if (onRefetch) onRefetch();
    } catch (err: any) {
      alert(`Backend Execution Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Score Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-50 text-[#5B5CEB] border border-indigo-200">
              <Presentation className="w-4 h-4" />
            </div>
            <span>10-Slide Institutional Investor Pitch Deck</span>
          </h2>
          <p className="text-xs text-[#64748B]">Dynamically synthesized pitch presentation with slide thumbnails and PPTX export.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRegenerateDeck}
            disabled={isRegenerating}
            className="px-3.5 py-2 rounded-xl bg-[#F7F8FC] hover:bg-slate-100 border border-slate-200 text-xs font-extrabold text-[#0F172A] flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5B5CEB] ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Invoking GPT-4o...' : 'Regenerate Deck'}</span>
          </button>

          <button
            onClick={() => handleExportDeck('pptx')}
            disabled={!!isExporting}
            className="px-4 py-2 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition disabled:opacity-50"
          >
            {isExporting === 'pptx' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export PPTX</span>
          </button>
        </div>
      </div>

      {/* Main Slide Viewer */}
      <div className="glass-exec-card p-8 space-y-6 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B5CEB]">
            {currentSlide.title}
          </span>
          <span className="text-xs font-mono font-bold text-[#64748B]">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>
        </div>

        <div className="py-6 space-y-4">
          <p className="text-sm text-[#0F172A] font-semibold leading-relaxed whitespace-pre-wrap">
            {currentSlide.content}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="px-4 py-2 rounded-xl bg-[#F7F8FC] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  currentSlideIndex === idx ? 'bg-[#5B5CEB] w-6' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="px-4 py-2 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white text-xs font-bold flex items-center gap-1 disabled:opacity-40 transition"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {slides.map((s: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`p-3 rounded-2xl text-left border text-xs space-y-1 transition ${
              currentSlideIndex === idx
                ? 'bg-indigo-50/80 border-[#5B5CEB] shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="font-extrabold text-[#0F172A] truncate">{s.title}</div>
            <div className="text-[10px] text-[#64748B] line-clamp-2">{s.content}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
