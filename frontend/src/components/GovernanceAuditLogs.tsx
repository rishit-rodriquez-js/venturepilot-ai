"use client";

import React, { useState } from 'react';
import { Settings, ShieldCheck, History, Plus, RotateCcw, CheckCircle2 } from 'lucide-react';

export const GovernanceAuditLogs: React.FC = () => {
  const [snapshots, setSnapshots] = useState([
    { id: 'ver-101', version: 1, label: 'Initial Concept & Problem Hypothesis', author: 'founder@venturepilot.ai', date: '2026-07-28 09:30' },
    { id: 'ver-102', version: 2, label: 'Validated Lean Canvas & Technical Architecture v1', author: 'founder@venturepilot.ai', date: '2026-07-28 11:00' }
  ]);

  const auditEvents = [
    { id: 'audit-1', action: 'PROJECT_CREATE', user: 'founder@venturepilot.ai', detail: 'Created FinPulse AI project workspace', time: '2 hours ago' },
    { id: 'audit-2', action: 'AI_WORKFLOW_RUN', user: 'founder@venturepilot.ai', detail: 'Triggered LangGraph Multi-Agent Lean Canvas synthesis', time: '1 hour ago' },
    { id: 'audit-3', action: 'AI_WORKFLOW_RUN', user: 'founder@venturepilot.ai', detail: 'Generated Technical Architecture & Financial Model', time: '25 mins ago' },
    { id: 'audit-4', action: 'VERSION_SNAPSHOT', user: 'founder@venturepilot.ai', detail: 'Saved governance version snapshot #2', time: '10 mins ago' }
  ];

  const handleNewSnapshot = () => {
    const nextVer = snapshots.length + 1;
    setSnapshots([
      ...snapshots,
      {
        id: `ver-10${nextVer}`,
        version: nextVer,
        label: `Enterprise Governance Snapshot v${nextVer}`,
        author: 'founder@venturepilot.ai',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16)
      }
    ]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Governance, Versioning & Immutable Audit Trail</span>
        </h2>
        <p className="text-xs text-slate-400">Complete audit log history, snapshot state rollbacks, and compliance security verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Version Snapshots */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Project Version History</span>
              </h3>
              <button
                onClick={handleNewSnapshot}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Snapshot</span>
              </button>
            </div>

            <div className="space-y-3">
              {snapshots.map((s) => (
                <div key={s.id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 text-[10px]">v{s.version}</span>
                      <span>{s.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{s.author} • {s.date}</div>
                  </div>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-700 transition">
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>Rollback</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise Audit Logs */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Audit Log Feed</span>
          </h3>

          <div className="space-y-3">
            {auditEvents.map((a) => (
              <div key={a.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{a.action}</span>
                    <span className="text-[10px] text-slate-500">{a.time}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{a.detail}</div>
                  <div className="text-slate-500 text-[10px] font-mono mt-1">{a.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
