"use client";

import Link from 'next/link';
import { Rocket, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#0F172A] flex flex-col justify-between selection:bg-[#5B5CEB] selection:text-white relative overflow-hidden bg-executive-mesh">
      
      <header className="h-16 px-8 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B5CEB] via-[#00C6AE] to-[#8C52FF] flex items-center justify-center text-white shadow-md shadow-[#5B5CEB]/20">
            <Rocket className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#0F172A]">VenturePilot AI</span>
        </Link>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center text-center z-10 space-y-6">
        <div className="bg-white p-8 rounded-[28px] shadow-xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5B5CEB] flex items-center justify-center mx-auto font-extrabold text-xl">
            404
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-[#0F172A]">Page Not Found</h1>
            <p className="text-xs text-[#64748B]">The requested resource or venture workspace could not be located.</p>
          </div>

          <Link
            href="/dashboard"
            className="w-full py-3 rounded-2xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-lg shadow-[#5B5CEB]/20 flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </main>

      <footer className="py-4 px-6 border-t border-slate-200 text-center text-[11px] text-[#64748B] z-20">
        Enterprise-grade AI Startup Operating System • Powered by OpenAI & Supabase
      </footer>
    </div>
  );
}
