"use client";

import React from 'react';
import { History, ExternalLink, Sparkles, Inbox } from 'lucide-react';

interface AuditProps {
  logs?: any[];
}

export const AuditTrailTab: React.FC<AuditProps> = ({ logs = [] }) => {
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
          <p className="text-xs text-[#64748B]">Real-time immutable log of founder commands, RAG indexings, and AI multi-agent workflow executions.</p>
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
        {logs.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5B5CEB] flex items-center justify-center mx-auto border border-indigo-100">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-[#0F172A]">No Agent Executions Recorded Yet</h4>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Execute an AI Co-Founder prompt, upload a RAG document, or trigger a section regeneration to record live LangSmith execution traces.
              </p>
            </div>
          </div>
        ) : (
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
                {logs.map((l: any, idx: number) => {
                  const displayTime = l.timestamp ? (l.timestamp.includes('T') ? new Date(l.timestamp).toLocaleTimeString() : l.timestamp) : 'Just Now';
                  const traceDisplay = l.trace_id ? (l.trace_id.length > 18 ? `${l.trace_id.slice(0, 16)}...` : l.trace_id) : 'Active Run';

                  return (
                    <tr key={idx} className="hover:bg-[#F7F8FC] transition">
                      <td className="py-3 px-3 font-mono text-[#64748B] font-bold">{displayTime}</td>
                      <td className="py-3 px-3 font-extrabold text-[#00C6AE]">{l.agent || 'AI Engine'}</td>
                      <td className="py-3 px-3 font-mono text-xs text-[#0F172A] font-semibold">{l.action}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-[#26C281]">
                          {l.status || 'Completed'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#5B5CEB] font-bold">{l.latency || '0.3s'}</td>
                      <td className="py-3 px-3 font-mono text-[#64748B]">{l.tokens ? l.tokens.toLocaleString() : '0'}</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-[#8C52FF]">
                        <a
                          href={langsmithWorkspaceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Inspect live run tree on LangSmith"
                          className="hover:underline inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-indigo-50 text-[#5B5CEB] border border-indigo-200"
                        >
                          <span>{traceDisplay}</span>
                          <ExternalLink className="w-3 h-3 text-[#5B5CEB]" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
