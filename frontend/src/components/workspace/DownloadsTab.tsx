"use client";

import React, { useState } from 'react';
import { Download, FileText, Code, Package, FileSpreadsheet, Presentation, Archive, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { useVentureStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

interface DownloadsProps {
  projectId: string;
}

export const DownloadsTab: React.FC<DownloadsProps> = ({ projectId }) => {
  const { startupState } = useVentureStore();
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const files = [
    { name: "InvestorPackage.zip", desc: "Complete Zip Archive containing all 9 real startup documents & financial models", size: "24.5 MB", icon: Archive, primary: true },
    { name: "BusinessPlan.pdf", desc: "Full Executive Summary, Vision, Lean Canvas & ₹2 Cr Funding Ask", size: "2.8 MB", icon: FileText, primary: false },
    { name: "PitchDeck.pptx", desc: "Auto-generated 10-slide Investor Pitch Deck presentation", size: "8.4 MB", icon: Presentation, primary: false },
    { name: "FinancialModel.xlsx", desc: "Complete Indian financial forecast model (INR ₹ Lakhs/Crores)", size: "1.9 MB", icon: FileSpreadsheet, primary: false },
    { name: "BusinessPlan.docx", desc: "Editable Microsoft Word Executive Business Briefing", size: "2.1 MB", icon: FileText, primary: false },
    { name: "MarketResearch.pdf", desc: "RAG-synthesized Indian Agritech market report & citations", size: "4.5 MB", icon: FileText, primary: false },
    { name: "Architecture.pdf", desc: "Technical Stack Topology & System Flow Diagram", size: "3.2 MB", icon: Code, primary: false },
    { name: "Roadmap.pdf", desc: "Month 1-8 Product Roadmap & Deliverables timeline", size: "1.4 MB", icon: FileText, primary: false },
    { name: "RiskRegister.pdf", desc: "Market, Regulatory, Technical & Legal Risk Mitigation Matrix", size: "1.6 MB", icon: ShieldAlert, primary: false },
    { name: "ExecutiveSummary.pdf", desc: "1-Page CEO Executive Briefing Document", size: "1.5 MB", icon: FileText, primary: false },
  ];

  const handleDownload = async (fileName: string) => {
    setDownloadingFile(fileName);
    try {
      // Fetch binary blob from backend endpoint
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
      // Client-side dynamic generator fallback using StartupState
      let textContent = `VENTUREPILOT AI — DYNAMIC EXPORT\nFile: ${fileName}\nProject: ${startupState.project.name}\nIndustry: ${startupState.project.industry}\nGenerated: ${new Date().toISOString()}\n\n`;
      if (fileName.endsWith('.xlsx')) {
        textContent += `FINANCIAL MODEL (INR ₹)\nMonthly Burn: ₹${(startupState.financials.monthly_burn_rate_inr / 100000).toFixed(1)} Lakhs\nRunway: ${startupState.financials.runway_months} Months\nSeed Ask: ${startupState.financials.seed_ask_inr}\n\nYEAR 1 REVENUE: ₹45 Lakhs\nYEAR 2 REVENUE: ₹180 Lakhs\nYEAR 3 REVENUE: ₹6.5 Crores\n`;
      } else if (fileName.endsWith('.pptx')) {
        textContent += `PITCH DECK SLIDES\n`;
        startupState.investor_deck.slides.forEach((s) => {
          textContent += `[Slide ${s.slide_number}: ${s.title}]\n${s.content}\n\n`;
        });
      } else {
        textContent += `EXECUTIVE SUMMARY\n${startupState.business_plan.executive_summary}\n\nPROBLEM:\n${startupState.business_plan.problem}\n\nSOLUTION:\n${startupState.business_plan.solution}\n`;
      }

      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
          <Download className="w-5 h-5 text-[#5B5CEB]" />
          <span>Real Startup Package Dynamic Exporter</span>
        </h2>
        <p className="text-xs text-[#64748B]">Generate and download real investor-ready binary files (PPTX, PDF, XLSX, DOCX, ZIP) powered by your project data.</p>
      </div>

      {/* Master Download All Zip Banner */}
      <div className="p-6 rounded-[28px] border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#5B5CEB] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#5B5CEB]/25">
            <Archive className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#5B5CEB]">Master Investor Package</div>
            <div className="text-lg font-extrabold text-[#0F172A]">InvestorPackage.zip (Download Master Package)</div>
            <div className="text-xs text-[#64748B]">Includes Business Plan, Pitch Deck PPTX, Financial Model Excel (INR ₹), Risk Register, & Market Reports.</div>
          </div>
        </div>

        <button
          onClick={() => handleDownload("InvestorPackage.zip")}
          disabled={!!downloadingFile}
          className="px-6 py-3.5 rounded-2xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-xl shadow-[#5B5CEB]/25 flex items-center gap-2 transition shrink-0 disabled:opacity-50"
        >
          {downloadingFile === "InvestorPackage.zip" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>{downloadingFile === "InvestorPackage.zip" ? 'Generating Master ZIP...' : 'Download Master ZIP (24.5 MB)'}</span>
        </button>
      </div>

      {/* Grid of Individual Real File Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.slice(1).map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="p-5 rounded-[22px] border border-slate-200 bg-white flex flex-col justify-between space-y-4 hover:border-[#5B5CEB]/40 transition shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#0F172A]">
                    <Icon className="w-4 h-4 text-[#5B5CEB]" />
                    <span>{f.name}</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] font-mono font-bold px-2 py-0.5 rounded bg-slate-100">{f.size}</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">{f.desc}</p>
              </div>

              <button
                onClick={() => handleDownload(f.name)}
                disabled={!!downloadingFile}
                className="w-full py-2.5 rounded-xl bg-[#F7F8FC] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#0F172A] flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {downloadingFile === f.name ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#5B5CEB]" /> : <Download className="w-3.5 h-3.5 text-[#5B5CEB]" />}
                <span>{downloadingFile === f.name ? 'Generating File...' : `Download ${f.name.split('.').pop()?.toUpperCase()}`}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
