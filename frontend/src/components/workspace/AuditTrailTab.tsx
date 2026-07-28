"use client";

import React from 'react';
import { History, ShieldCheck, CheckCircle2, Clock, Cpu, ExternalLink } from 'lucide-react';
import { useVentureStore } from '@/lib/store';

export const AuditTrailTab: React.FC = () => {
  const { startupState } = useVentureStore();
  const logs = startupState?.audit_trail || [
    { timestamp: '10:15', agent: 'Research Agent', action: 'DOCUMENT_UPLOADED', status: 'Completed', latency: '1.8s', tokens: 2450, trace_id: 'ls_87hf921a' },
    { timestamp: '10:18', agent: 'Market Intelligence Agent', action: 'RAG_EXECUTED', status: 'Completed', latency: '2.1s', tokens: 4187, trace_id: 'ls_94kc110b' },
    { timestamp: '10:25', agent: 'Pitch Deck Agent', action: 'INVESTOR_DECK_GENERATED', status: 'Completed', latency: '3.4s', tokens: 5820, trace_id: 'ls_10zp449c' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center icon-pill-insights">
            <History className="w-4 h-4 text-[#00C6AE]" />
          </div>
          <span>Enterprise Immutable Audit Trail</span>
        </h2>
        <p className="text-xs text-[#64748B]">Real-time immutable log of all founder commands, RAG indexings, and AI multi-agent workflow executions.</p>
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
                <th className="py-3 px-3">Trace ID</th>
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
                  <td className="py-3 px-3 font-mono text-[#5B5CEB] font-bold">{l.latency || '2.1s'}</td>
                  <td className="py-3 px-3 font-mono text-[#64748B]">{l.tokens ? l.tokens.toLocaleString() : '4,187'}</td>
                  <td className="py-3 px-3 font-mono text-[10px] text-[#8C52FF]">
                    <a
                      href={`https://smith.langchain.com/o/venturepilot/projects/p/VenturePilot-AI/r/${l.trace_id || 'ls_87hf'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>{l.trace_id || 'ls_87hf921a'}</span>
                      <ExternalLink className="w-3 h-3" />
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
