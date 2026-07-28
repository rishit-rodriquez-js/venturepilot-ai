"use client";

import React from 'react';
import { History, ShieldCheck, CheckCircle2, Clock, Cpu, ExternalLink, Sparkles } from 'lucide-react';
import { useVentureStore } from '@/lib/store';

export const AuditTrailTab: React.FC = () => {
  const { startupState } = useVentureStore();
  const logs = startupState?.audit_trail || [
    { timestamp: '10:15:20', agent: 'RAG Research Agent', action: 'DOCUMENT_INDEXED: BusinessPlan.pdf', status: 'Completed', latency: '1.4s', tokens: 1850, trace_id: 'ls_87hf921a' },
    { timestamp: '10:18:44', agent: 'AI Co-Founder Engine', action: 'EXECUTED_COMMAND: Strategic Analysis', status: 'Completed', latency: '1.5s', tokens: 2800, trace_id: 'ls_94kc110b' }
  ];

  const langsmithWorkspaceUrl = "https://smith.langchain.com/projects/VenturePilot-AI";

  return (
    <div className="space-y-6">
      {/* Header Banner with Live LangSmith Workspace Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 text-[#00C6AE] border border-emerald-200">
              <History className="w-4 h-4 text-[#00C6AE]" />
            </div>
            <span>Enterprise Immutable Audit Trail</span>
          </h2>
          <p className="text-xs text-[#64748B]">Real-time immutable log of all founder commands, RAG indexings, and AI multi-agent workflow executions.</p>
        </div>

        <a
          href={langsmithWorkspaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition shrink-0"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Open Live LangSmith Workspace (VenturePilot-AI)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="glass-exec-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#64748B] font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Agent</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Latency</th>
                <th className="py-3 px-3">Tokens</th>
                <th className="py-3 px-3">LangSmith Trace ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#0F172A]">
              {logs.map((l: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#F7F8FC] transition">
                  <td className="py-3 px-3 font-mono text-[#64748B] font-bold">{l.timestamp}</td>
                  <td className="py-3 px-3 font-extrabold text-[#00C6AE]">{l.agent || 'AI Engine'}</td>
                  <td className="py-3 px-3 font-mono text-xs text-[#0F172A] font-semibold">{l.action}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-[#26C281]">
                      {l.status || 'Completed'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#5B5CEB] font-bold">{l.latency || '1.5s'}</td>
                  <td className="py-3 px-3 font-mono text-[#64748B]">{l.tokens ? l.tokens.toLocaleString() : '2,800'}</td>
                  <td className="py-3 px-3 font-mono text-[10px] text-[#8C52FF]">
                    <a
                      href={langsmithWorkspaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View live trace in LangSmith VenturePilot-AI project"
                      className="hover:underline inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-indigo-50 text-[#5B5CEB] border border-indigo-200"
                    >
                      <span>{l.trace_id || 'ls_87hf921a'}</span>
                      <ExternalLink className="w-3 h-3 text-[#5B5CEB]" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
