"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Bot, User, ArrowRight, ShieldCheck, ChevronUp, ChevronDown,
  RefreshCw, Check, Copy, ExternalLink, Activity, Cpu, Zap, Mic, Volume2, X
} from 'lucide-react';
import { useVentureStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  agent?: string;
  timestamp: string;
  isStreaming?: boolean;
  rejection?: boolean;
  trace_status?: string;
  trace_id?: string | null;
  trace_url?: string | null;
  execution_result?: any;
}

interface AICopilotBarProps {
  projectId: string;
  onRefetchWorkspaceData?: (incomingState?: any) => void;
}

export const AICopilotBar: React.FC<AICopilotBarProps> = ({ projectId, onRefetchWorkspaceData }) => {
  const { user } = useVentureStore();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Welcome to VenturePilot AI Copilot! I am your autonomous co-founder engine. Type any strategic command below to execute multi-agent workflows.",
      agent: 'AI Co-Founder Engine',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const suggestedQuestions = [
    "Synthesize Business Plan & Lean Canvas",
    "Generate Unit Economics & 3Y Projections",
    "Run Competitor Gap & Moat Analysis",
    "Synthesize Investor Deck & Slide Score",
    "Generate Product Roadmap & Release Phases"
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || prompt;
    if (!text.trim() || isProcessing || !projectId) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, newMsg]);
    setPrompt('');
    setIsProcessing(true);
    setIsOpen(true);

    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: `Executing LangGraph Multi-Agent Swarm for '${text}'...`,
      agent: 'LangGraph Swarm Engine',
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, initialAiMsg]);

    try {
      const response = await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: text
      });

      const resData = response.data;
      const execRes = resData.execution_result || resData;

      const traceStatus = resData.trace_status || execRes.trace_status || (resData.trace_id ? 'active' : 'disabled');
      const traceId = resData.trace_id || execRes.trace_id || null;
      const traceUrl = resData.trace_url || execRes.trace_url || (traceId ? `https://smith.langchain.com/projects/p/VenturePilot-AI/r/${traceId}` : null);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                text: resData.message || `Successfully executed 9-agent LangGraph workflow for '${text}'. Live workspace tables updated in Supabase.`,
                trace_status: traceStatus,
                trace_id: traceId,
                trace_url: traceUrl,
                execution_result: execRes,
                agent: 'LangGraph Swarm Engine',
                isStreaming: false
              }
            : m
        )
      );

      if (onRefetchWorkspaceData) {
        onRefetchWorkspaceData(resData.state);
      }
    } catch (err: any) {
      console.error("[Copilot AI Error]", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message || "AI backend execution failed.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                text: `⚠️ **Execution Error**: ${errorMsg}`,
                rejection: true,
                isStreaming: false
              }
            : m
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* FLOATING COPILOT TRIGGER BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleDrawer}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-slate-900 via-slate-900 to-[#5B5CEB] text-white shadow-2xl hover:scale-105 transition-all duration-200 border border-slate-700/50 group"
          title="Open VenturePilot Copilot"
        >
          <div className="w-7 h-7 rounded-full bg-[#5B5CEB] flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left font-bold text-xs tracking-tight">
            <span>AI Copilot</span>
            <div className="text-[9px] text-emerald-400 font-mono font-normal">LangGraph Ready</div>
          </div>
        </button>
      )}

      {/* DRAWER PANEL */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-full sm:w-[420px] max-w-[calc(100vw-3rem)] h-[620px] max-h-[calc(100vh-5rem)] bg-white rounded-[28px] border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-[#5B5CEB] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B5CEB] flex items-center justify-center text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-xs flex items-center gap-1.5">
                <span>AI Co-Founder Copilot</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  GPT-4o
                </span>
              </div>
              <div className="text-[10px] text-slate-300">LangGraph Swarm • Supabase pgvector</div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleDrawer}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-4 space-y-3.5 overflow-y-auto bg-[#F7F8FC] text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col space-y-1 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                <span className="font-bold">{m.sender === 'user' ? (user?.full_name || 'Founder') : m.agent || 'LangGraph Swarm Engine'}</span>
                <span>• {m.timestamp}</span>
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[95%] leading-relaxed text-xs space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-[#5B5CEB] text-white font-medium rounded-tr-none shadow-sm'
                    : m.rejection
                    ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none shadow-sm font-medium'
                    : 'bg-white text-[#0F172A] border border-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap font-medium">{m.text}</p>

                {/* Structured AI Output Rendering */}
                {m.execution_result && (
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px]">
                    {m.execution_result.planner?.executive_summary && (
                      <div className="p-2.5 rounded-xl bg-[#F7F8FC] border border-slate-200 space-y-1">
                        <div className="font-extrabold text-[#5B5CEB] text-[10px] uppercase">Business Plan & Vision</div>
                        <p className="text-[#0F172A] text-[10px] leading-relaxed line-clamp-2">{m.execution_result.planner.executive_summary}</p>
                      </div>
                    )}

                    {m.execution_result.finance?.seed_ask_inr && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-[10px]">
                        <span className="font-bold text-emerald-900">Seed Ask: {m.execution_result.finance.seed_ask_inr}</span>
                        <span className="font-mono text-emerald-700 font-extrabold">Burn: ₹{(m.execution_result.finance.monthly_burn_rate_inr / 100000).toFixed(1)}L/mo</span>
                      </div>
                    )}

                    {/* LangSmith Trace Link Contract */}
                    <div className="pt-1 flex items-center justify-between text-[9px] font-mono text-[#64748B]">
                      <span>Latency: {m.execution_result.latency_ms || 450}ms • {m.execution_result.tokens_consumed || 1200} Tokens</span>
                      {m.trace_url ? (
                        <a
                          href={m.trace_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-extrabold text-[#5B5CEB] hover:underline flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200"
                        >
                          <span>Live LangSmith Trace</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400 font-sans italic">LangSmith Tracing: Disabled</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Context Questions */}
        <div className="p-2 bg-slate-50 border-t border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[10px]">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:border-[#5B5CEB] hover:text-[#5B5CEB] whitespace-nowrap transition shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(prompt); }}
          className="p-3 bg-white flex items-center gap-2 border-t border-slate-200"
        >
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2 rounded-xl border text-xs transition ${
              isListening ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-[#F7F8FC] text-slate-500 border-slate-200 hover:text-slate-900'
            }`}
            title="Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Execute AI workflow across your startup workspace..."
            className="flex-1 bg-[#F7F8FC] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#5B5CEB]"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className="p-2 rounded-xl bg-[#5B5CEB] hover:bg-[#4a4bd9] text-white font-bold shadow-md disabled:opacity-40 transition"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </>
  );
};
