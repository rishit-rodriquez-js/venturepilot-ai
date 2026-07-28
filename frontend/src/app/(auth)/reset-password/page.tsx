"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Rocket, Lock, ArrowRight, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateErr) {
        setError(updateErr.message);
      } else {
        setMessage('Password updated successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

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

      <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center z-10">
        <div className="bg-white p-8 rounded-[28px] shadow-xl border border-slate-200 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Set New Password</h1>
            <p className="text-xs text-[#64748B]">Please enter your new password below.</p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#26C281] text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#64748B] mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#64748B] mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-lg shadow-[#5B5CEB]/25 flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </main>

      <footer className="py-4 px-6 border-t border-slate-200 text-center text-[11px] text-[#64748B] z-20">
        Enterprise-grade AI Startup Operating System • Powered by OpenAI & Supabase
      </footer>
    </div>
  );
}
