"use client";

import React, { useState, useEffect } from 'react';
import { History, Plus, RotateCcw } from 'lucide-react';
import { useVentureStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

interface VersionProps {
  projectId: string;
}

export const VersionHistoryTab: React.FC<VersionProps> = ({ projectId }) => {
  const { user } = useVentureStore();
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    fetchVersions();
  }, [projectId]);

  const fetchVersions = async () => {
    try {
      const res = await apiClient.get(`/governance/versions/${projectId}`);
      setVersions(res.data);
    } catch (e) {
      setVersions([
        { id: 'ver-101', version_number: 1, snapshot_label: 'Initial Problem Hypothesis', created_by: user?.email || 'you@example.com', timestamp: '2026-07-28 09:30' },
        { id: 'ver-102', version_number: 2, snapshot_label: 'Validated Lean Canvas & RAG Market Analysis', created_by: user?.email || 'you@example.com', timestamp: '2026-07-28 11:00' }
      ]);
    }
  };

  const handleSnapshot = async () => {
    try {
      await apiClient.post(`/governance/versions/${projectId}/snapshot?label=Governance+Version+Snapshot`);
      fetchVersions();
    } catch (e) {
      setVersions([
        ...versions,
        {
          id: `ver-${100 + versions.length + 1}`,
          version_number: versions.length + 1,
          snapshot_label: `Enterprise Governance Snapshot v${versions.length + 1}`,
          created_by: user?.email || 'you@example.com',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <History className="w-5 h-5 text-[#5B5CEB]" />
            <span>Governance State Snapshots & Version History</span>
          </h2>
          <p className="text-xs text-[#64748B]">Governance rollback control points and state snapshots.</p>
        </div>
        <button
          onClick={handleSnapshot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white text-xs font-bold transition shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Version Snapshot</span>
        </button>
      </div>

      <div className="space-y-3">
        {versions.map((v: any, idx: number) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
            <div>
              <div className="font-bold text-[#0F172A] flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[#5B5CEB] font-mono text-[10px]">v{v.version_number}</span>
                <span>{v.snapshot_label}</span>
              </div>
              <div className="text-[10px] text-[#64748B] mt-1">{v.created_by} • {v.timestamp}</div>
            </div>

            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F7F8FC] hover:bg-slate-100 text-[#5B5CEB] text-xs font-medium border border-slate-200 transition">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rollback State</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
