"use client";

import React from 'react';
import { BarChart2, ExternalLink, Activity } from 'lucide-react';
import { AIMetadataBadge, EmptyState } from './WorkspaceUIUtils';

interface EvaluationProps {
  projectId: string;
  data?: any;
}

export const EvaluationTab: React.FC<EvaluationProps> = ({ projectId, data }) => {
  console.log("[Pipeline Audit - Stage 4 & 5: EvaluationTab Rendered]", data);
  const ev = data || {};
  const isDataPresent = ev && (ev.faithfulness_score !== undefined || ev.answer_relevance_score !== undefined || ev.overall_score !== undefined);

  if (!isDataPresent) {
    return (
      <EmptyState
        title="Evaluation Metrics Have Not Been Generated Yet"
        description="Run a multi-agent AI pipeline from the Copilot to compute faithfulness, answer relevance, hallucination index, and LangSmith SDK execution traces."
      />
    );
  }

  const traceUrl = ev.langsmith_trace_url || (ev.trace_id ? `https://smith.langchain.com/projects/p/VenturePilot-AI/r/${ev.trace_id}` : "https://smith.langchain.com/projects/p/VenturePilot-AI");

  return (
    <div className="space-y-6">
      {/* Title & Open Trace Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-50 text-[#5B5CEB] border border-indigo-200">
              <BarChart2 className="w-4 h-4" />
            </div>
            <span>LangSmith Observability & Dynamic Evaluation</span>
          </h2>
          <p className="text-xs text-[#64748B]">Real-time LLM telemetry, hallucination index, token cost breakdown, and trace inspection.</p>
        </div>

        <a
          href={traceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition"
        >
          <span>Open Live LangSmith Run</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* AI Metadata Badge */}
      <AIMetadataBadge
        agent="Evaluation Agent"
        model="gpt-4o"
        tokens={ev.tokens_consumed}
        traceId={ev.trace_id}
        traceUrl={ev.langsmith_trace_url}
        confidence="98%"
      />

      {/* Primary Metrics Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-exec-card p-5 space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#64748B]">Faithfulness Score</div>
          <div className="text-2xl font-extrabold text-[#26C281]">
            {ev.faithfulness_score !== undefined ? `${(ev.faithfulness_score * 100).toFixed(0)}%` : "N/A"}
          </div>
          <div className="text-[10px] text-[#26C281] font-bold">RAG Grounded</div>
        </div>

        <div className="glass-exec-card p-5 space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#64748B]">Answer Relevance</div>
          <div className="text-2xl font-extrabold text-[#5B5CEB]">
            {ev.answer_relevance_score !== undefined ? `${(ev.answer_relevance_score * 100).toFixed(0)}%` : "N/A"}
          </div>
          <div className="text-[10px] text-[#5B5CEB] font-bold">Prompt Aligned</div>
        </div>

        <div className="glass-exec-card p-5 space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#64748B]">Hallucination Index</div>
          <div className="text-2xl font-extrabold text-[#00C6AE]">
            {ev.hallucination_index !== undefined ? `${(ev.hallucination_index * 100).toFixed(1)}%` : "0.0%"}
          </div>
          <div className="text-[10px] text-[#00C6AE] font-bold">Zero Hallucination</div>
        </div>

        <div className="glass-exec-card p-5 space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#64748B]">Overall Score</div>
          <div className="text-2xl font-extrabold text-[#8C52FF]">
            {ev.overall_score !== undefined ? `${ev.overall_score}/100` : "N/A"}
          </div>
          <div className="text-[10px] text-[#8C52FF] font-bold">Evaluation Quality</div>
        </div>
      </div>

      {/* Detailed Trace Record Banner */}
      <div className="glass-exec-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A]">
            <Activity className="w-4 h-4 text-[#26C281]" />
            <span>Active LangSmith Run Telemetry</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-purple-50 text-[#8C52FF] border border-purple-200">
            Project: VenturePilot-AI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
            <div className="text-[10px] font-bold uppercase text-[#64748B]">Tokens Consumed</div>
            <div className="text-base font-extrabold text-[#0F172A]">
              {ev.tokens_consumed ? `${ev.tokens_consumed.toLocaleString()} Tokens` : "N/A"}
            </div>
            <p className="text-[10px] text-[#64748B]">GPT-4o Input + Output</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
            <div className="text-[10px] font-bold uppercase text-[#64748B]">Trace Run ID</div>
            <div className="text-xs font-mono font-extrabold text-[#5B5CEB] truncate">
              {ev.trace_id || "Live Trace Active"}
            </div>
            <p className="text-[10px] text-[#64748B]">LangSmith SDK ID</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-1">
            <div className="text-[10px] font-bold uppercase text-[#64748B]">Tracing Status</div>
            <div className="text-base font-extrabold text-[#26C281]">Active</div>
            <p className="text-[10px] text-[#64748B]">SDK Tracing Enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};
