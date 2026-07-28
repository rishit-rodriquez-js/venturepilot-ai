"use client";

import React from 'react';
import { Megaphone, Target, Share2, CheckCircle2 } from 'lucide-react';

interface MarketingProps {
  data?: any;
}

export const MarketingStrategyTab: React.FC<MarketingProps> = ({ data }) => {
  const positioning = data?.positioning || "The premier India-first AI Startup Operating System accelerating investor readiness from months to days.";
  
  const channels = data?.channels || [
    { name: "WhatsApp Business API", strategy: "Automated regional crop alerts & voice memos for Indian farmers" },
    { name: "LinkedIn B2B Outreach", strategy: "Targeting Agritech VCs and Enterprise Agribusinesses" },
    { name: "YouTube Vernacular Demonstrations", strategy: "Educational video demonstrations in Hindi, Marathi & Kannada" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#F5F8FF] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center icon-glow-violet">
            <Megaphone className="w-4 h-4" />
          </div>
          <span>Marketing Strategy & Go-To-Market Sequence</span>
        </h2>
        <p className="text-xs text-[#94A3B8]">Positioning framework, acquisition channels, and customer launch funnel tailored for India.</p>
      </div>

      <div className="p-6 rounded-[24px] border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 space-y-2">
        <h3 className="text-xs font-bold text-[#7C5CFF] uppercase tracking-wider">Brand Positioning Statement</h3>
        <p className="text-xs text-[#F5F8FF] font-medium italic">&quot;{positioning}&quot;</p>
      </div>

      <div className="p-6 rounded-[24px] border border-white/10 bg-[#121721]/80 backdrop-blur-md space-y-4">
        <h3 className="text-xs font-bold text-[#F5F8FF] uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-[#29D8FF]" />
          <span>Core Customer Acquisition Channels</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((c: any, idx: number) => (
            <div key={idx} className="p-4 rounded-[20px] bg-[#0B0E14] border border-white/10 space-y-2">
              <div className="text-xs font-bold text-[#29D8FF] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22E6A7]" />
                <span>{typeof c === 'string' ? c : c.name}</span>
              </div>
              {typeof c === 'object' && c.strategy && (
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">{c.strategy}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
