"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useVentureStore } from '@/lib/store';
import { Rocket, Mail, Lock, User, Building, ArrowRight, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useVentureStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company: company || 'My Startup',
            role: 'founder', // Always Founder by default for all self-registered accounts
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        // Hydrate store as founder
        setUser({
          id: `user-${Date.now()}`,
          email,
          full_name: fullName || email.split('@')[0],
          role: 'founder',
          company: company || 'My Startup'
        });
        setMessage('Registration successful! Redirecting to workspace dashboard...');
        setTimeout(() => router.push('/dashboard'), 800);
        return;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName || email.split('@')[0],
          role: 'founder',
          company: company || 'My Startup'
        });

        if (data.session) {
          setMessage('Founder account created successfully! Redirecting...');
          setTimeout(() => router.push('/dashboard'), 800);
        } else {
          setMessage('Verification link sent to your email! Please check your inbox or sign in.');
          setTimeout(() => router.push('/login'), 1500);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#5B5CEB] shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#26C281]" />
            <span>Join 10,000+ Founders Building Startups</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            Create Your Founder Account on <br />
            <span className="bg-gradient-to-r from-[#5B5CEB] via-[#00C6AE] to-[#8C52FF] bg-clip-text text-transparent">
              VenturePilot AI OS
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-lg">
            Access multi-agent LangGraph workflows, persistent pgvector RAG document memory, India-first statutory compliance models, and institutional pitch deck exporters.
          </p>
        </div>

        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-[28px] shadow-xl border border-slate-200 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Sign Up as Founder</h2>
              <p className="text-xs text-[#64748B]">Every new account receives full Founder OS permissions.</p>
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

            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1">Your Startup Name (Optional)</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. NovaTech Labs"
                    className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-lg shadow-[#5B5CEB]/25 flex items-center justify-center gap-2 transition disabled:opacity-60 mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{loading ? 'Creating Founder Account...' : 'Create Account'}</span>
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-[#64748B]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#5B5CEB] font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 px-6 border-t border-slate-200 text-center text-[11px] text-[#64748B] z-20">
        Enterprise-grade AI Startup Operating System • Powered by OpenAI & Supabase
      </footer>
    </div>
  );
}
