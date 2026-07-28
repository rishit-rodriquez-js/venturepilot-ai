"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useVentureStore } from '@/lib/store';
import { Rocket, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, Cpu, AlertTriangle, Eye, EyeOff, RefreshCw, Github } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useVentureStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [oauthError, setOauthError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check active session strictly on mount
    const checkActiveSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const authUser = data.session.user;
          setUser({
            id: authUser.id,
            email: authUser.email || 'founder@venturepilot.ai',
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Founder',
            role: 'founder',
            company: authUser.user_metadata?.company || 'My Venture'
          });
          router.push('/dashboard');
        }
      } catch (e) {
        // Safe fallback if unauthenticated
      }
    };
    checkActiveSession();
  }, [router, setUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOauthError('');

    try {
      // 1. Enforce REAL Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      // 2. Strict Error Handling: If auth fails, DO NOT redirect
      if (authError) {
        setError(authError.message || 'Invalid email or password. Please verify your credentials.');
        setLoading(false);
        return; // STAY ON LOGIN PAGE
      }

      // 3. Only redirect after valid session verification
      if (data.session && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: 'founder',
          company: data.user.user_metadata?.company || 'My Venture'
        });

        if (!rememberMe) {
          window.sessionStorage.setItem('vp_temp_session', 'true');
        } else {
          window.localStorage.setItem('vp_remember_session', 'true');
        }

        router.push('/dashboard');
      } else {
        setError('Authentication failed. Account session could not be established.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubOAuth = async () => {
    setError('');
    setOauthError('');
    try {
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (oauthErr) {
        setOauthError(`GitHub OAuth error: ${oauthErr.message}`);
      }
    } catch (err: any) {
      setOauthError('GitHub OAuth provider configuration required in Supabase Console.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#0F172A] flex flex-col justify-between selection:bg-[#5B5CEB] selection:text-white relative overflow-hidden bg-executive-mesh">
      
      {/* Top Header Bar */}
      <header className="h-16 px-8 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B5CEB] via-[#00C6AE] to-[#8C52FF] flex items-center justify-center text-white shadow-md shadow-[#5B5CEB]/20">
            <Rocket className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#0F172A]">VenturePilot AI</span>
        </Link>
      </header>

      {/* Main Form Split */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Visual Overview */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#5B5CEB] shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#00C6AE]" />
            <span>Enterprise AI Startup Operating System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            Mission Control for Building <br />
            <span className="bg-gradient-to-r from-[#5B5CEB] via-[#00C6AE] to-[#8C52FF] bg-clip-text text-transparent">
              Investor-Ready Startups
            </span>
          </h1>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Per-User Workspace Isolation Pipeline
            </div>
            <div className="flex items-center justify-between text-xs text-[#0F172A] font-semibold">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#26C281]" /> Supabase Auth</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#26C281]" /> Per-User Data Isolation</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#26C281]" /> pgvector RAG</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-[28px] shadow-xl border border-slate-200 space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Sign In to VenturePilot</h2>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Your AI Co-Founder for Building Investor-Ready Startups.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {oauthError && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>GitHub OAuth Diagnostics</span>
                </div>
                <p className="text-[11px] leading-relaxed">{oauthError}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
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
                    className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F7F8FC] border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#64748B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#5B5CEB] focus:ring-0"
                  />
                  <span>Remember Me</span>
                </label>

                <Link href="/forgot-password" className="text-[#5B5CEB] font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-extrabold text-xs shadow-lg shadow-[#5B5CEB]/25 flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{loading ? 'Authenticating Founder Session...' : 'Sign In'}</span>
              </button>
            </form>

            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-slate-200"></div>
              <span className="absolute bg-white px-3 text-[10px] font-bold uppercase text-[#64748B]">OR</span>
            </div>

            {/* GitHub OAuth Button */}
            <div>
              <button
                onClick={handleGithubOAuth}
                type="button"
                className="w-full py-3 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-2.5 shadow-md transition"
              >
                <Github className="w-4 h-4" />
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="text-center pt-2 text-xs text-[#64748B]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#5B5CEB] font-bold hover:underline">
                Sign Up as Founder
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
