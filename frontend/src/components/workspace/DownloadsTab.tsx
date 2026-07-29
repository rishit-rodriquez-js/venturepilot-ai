"use client";

import React, { useState } from 'react';
import { Download, FileText, Presentation, Code, Map, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface DownloadsProps {
  projectId: string;
  data?: any;
}

export const DownloadsTab: React.FC<DownloadsProps> = ({ projectId, data }) => {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const projName = data?.project?.name || 'Your Startup';

  const files = [
    {
      name: "BusinessPlan.pdf",
      title: "Business Plan (PDF)",
      desc: "Comprehensive Executive Summary, Vision, Mission, Lean Canvas & Funding Ask.",
      size: "2.8 MB",
      icon: FileText,
      badge: "Primary Briefing"
    },
    {
      name: "PitchDeck.pptx",
      title: "Investor Pitch Deck (PPTX)",
      desc: "AI-generated 10-slide institutional presentation ready for pitch meetings.",
      size: "8.4 MB",
      icon: Presentation,
      badge: "10-Slide Deck"
    },
    {
      name: "Roadmap.pdf",
      title: "Product Roadmap (PDF)",
      desc: "Execution timeline, product milestones, priority matrix, and release phases.",
      size: "1.4 MB",
      icon: Map,
      badge: "Timeline Matrix"
    },
    {
      name: "Architecture.pdf",
      title: "System Architecture (PDF)",
      desc: "System topology, LangGraph AI workflow agent flow, and technical stack.",
      size: "3.2 MB",
      icon: Code,
      badge: "Technical Stack"
    }
  ];

  const handleDownload = async (fileName: string) => {
    setDownloadingFile(fileName);
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
      alert(`Download failed: ${err.message}`);
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
          <span>Enterprise Download Center</span>
        </h2>
        <p className="text-xs text-[#64748B]">Four essential investor-ready deliverables dynamically generated for <strong className="text-[#0F172A]">{projName}</strong>.</p>
      </div>

      {/* Grid of 4 Essential File Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {files.map((f, idx) => {
          const Icon = f.icon;
          const isDownloading = downloadingFile === f.name;

          return (
            <div key={idx} className="glass-exec-card p-6 flex flex-col justify-between space-y-4 hover:border-[#5B5CEB]/50 transition shadow-sm border border-slate-200 bg-white">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#5B5CEB] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#0F172A]">{f.title}</div>
                      <div className="text-[10px] text-[#64748B] font-mono">{f.name}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#26C281] border border-emerald-200">
                    {f.badge}
                  </span>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed pt-1">{f.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-[#64748B] font-mono">Format: <strong>{f.name.split('.').pop()?.toUpperCase()}</strong> ({f.size})</span>

                <button
                  onClick={() => handleDownload(f.name)}
                  disabled={!!downloadingFile}
                  className="px-5 py-2.5 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isDownloading ? 'Generating...' : `Download ${f.name}`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
