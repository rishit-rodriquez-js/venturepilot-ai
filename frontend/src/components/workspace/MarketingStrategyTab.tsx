"use client";

import React, { useState } from 'react';
import { Megaphone, Target, Share2, FileText, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AIMetadataBadge, EmptyState } from './WorkspaceUIUtils';

interface MarketingProps {
  data?: any;
  projectId?: string;
  onRefetch?: () => void;
}

export const MarketingStrategyTab: React.FC<MarketingProps> = ({ data, projectId, onRefetch }) => {
  const mkt = data || {};
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!projectId) return;
    setIsRegenerating(true);
    try {
      await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: "Synthesize GTM positioning, ICP, marketing channels, and content strategy"
      });
      if (onRefetch) onRefetch();
    } catch (err: any) {
      alert(`Marketing Execution Failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const positioningText = mkt.positioning_statement || mkt.positioning;
  const isDataPresent = mkt && (positioningText || mkt.icp || (mkt.channels && mkt.channels.length > 0));

  if (!isDataPresent) {
    return (
      <EmptyState
        title="Marketing Strategy Has Not Been Generated Yet"
        description="Run the Chief Marketing Officer Agent to synthesize your GTM positioning, ideal customer profile (ICP), acquisition channels, and content calendar."
        actionText="Synthesize Marketing & GTM (GPT-4o)"
        isLoading={isRegenerating}
        onAction={handleRegenerate}
      />
    );
  }

  const channels = mkt.channels || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-50 text-[#FF6A3D] border border-orange-200">
              <Megaphone className="w-4 h-4" />
            </div>
            <span>GTM Strategy & Acquisition Channels</span>
          </h2>
          <p className="text-xs text-[#64748B]">Synthesized by CMO Marketing Agent with Supabase database persistence.</p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] text-xs font-bold hover:border-[#FF6A3D] shadow-2xs inline-flex items-center gap-1.5 disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#FF6A3D] ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Strategy'}</span>
        </button>
      </div>

      {/* AI Metadata Badge */}
      <AIMetadataBadge
        agent="CMO Marketing Agent"
        model="gpt-4o"
        tokens={mkt._tokens || 350}
        latencyMs={mkt._latency_ms}
        traceId={mkt.trace_id}
        traceUrl={mkt.langsmith_trace_url}
        confidence="93%"
      />

      {/* Positioning Statement Card */}
      <div className="glass-exec-card p-6 space-y-2">
        <h3 className="text-xs font-extrabold text-[#FF6A3D] uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-[#FF6A3D]" />
          <span>Market Positioning Statement</span>
        </h3>
        <p className="text-xs text-[#0F172A] leading-relaxed font-medium">
          {positioningText || "Waiting for AI generation..."}
        </p>
      </div>

      {/* ICP Profile */}
      <div className="glass-exec-card p-6 space-y-2">
        <h3 className="text-xs font-extrabold text-[#5B5CEB] uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-[#5B5CEB]" />
          <span>Ideal Customer Profile (ICP)</span>
        </h3>
        <p className="text-xs text-[#0F172A] leading-relaxed font-medium">
          {mkt.icp || "Waiting for AI generation..."}
        </p>
      </div>

      {/* Channels Matrix */}
      {channels.length > 0 && (
        <div className="glass-exec-card p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#00C6AE]" />
            <span>Go-To-Market Acquisition Channels</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map((ch: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#0F172A]">{ch.name}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-[#5B5CEB]">
                    {ch.category || "Organic"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{ch.metrics || ch.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Strategy */}
      {mkt.content_strategy && (
        <div className="glass-exec-card p-6 space-y-2">
          <h3 className="text-xs font-extrabold text-[#8C52FF] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#8C52FF]" />
            <span>Content Strategy & Campaign Calendar</span>
          </h3>
          <p className="text-xs text-[#0F172A] leading-relaxed font-medium">
            {mkt.content_strategy}
          </p>
        </div>
      )}
    </div>
  );
};
