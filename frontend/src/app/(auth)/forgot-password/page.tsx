"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Rocket, Mail, ArrowRight, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetErr) {
        console.warn(resetErr.message || resetErr);
        setError(resetErr.message || 'Failed to send password reset email.');
      } else {
        setMessage(`Password reset link sent to ${email}. Please check your inbox.`);
      }
    } catch (err: any) {
      console.warn(err?.message || err);
      setError(err?.message || 'An error occurred while sending password reset link.');
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
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Reset Your Password</h1>
            <p className="text-xs text-[#64748B]">Enter your email address and we will send you a password reset link.</p>
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

          <form onSubmit={handleResetRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#64748B] mb-1.5">Founder Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
              <span>{loading ? 'Sending Reset Link...' : 'Send Reset Link'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-[#64748B]">
            Remember your password?{' '}
            <Link href="/login" className="text-[#5B5CEB] font-bold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 px-6 border-t border-slate-200 text-center text-[11px] text-[#64748B] z-20">
        Enterprise-grade AI Startup Operating System • Powered by OpenAI & Supabase
      </footer>
    </div>
  );
}
