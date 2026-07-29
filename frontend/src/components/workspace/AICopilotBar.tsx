"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Mic, RefreshCw, ChevronRight, Copy, Check,
  Trash2, ExternalLink, Bot
} from 'lucide-react';
import { useVentureStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

interface CopilotProps {
  projectId: string;
  onRefetchWorkspaceData?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  agent?: string;
  trace_id?: string;
  timestamp: string;
  isStreaming?: boolean;
  rejection?: boolean;
}

export const AICopilotBar: React.FC<CopilotProps> = ({ projectId, onRefetchWorkspaceData }) => {
  const { user, activeProject } = useVentureStore();
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('copilot_drawer_open');
      return savedState === 'true';
    }
    return false;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleDrawer = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('copilot_drawer_open', String(nextState));
    }
  };

  const activeProjName = activeProject?.name || 'Your Startup';
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`copilot_msgs_${projectId}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [
      {
        id: 'm-welcome',
        sender: 'ai',
        text: `Welcome to **VenturePilot AI Copilot**. Every command executes through our backend LangGraph multi-agent swarm, backed by Supabase pgvector RAG memory and LangSmith tracing. How can I assist **${activeProjName}**?`,
        agent: 'LangGraph Swarm Engine',
        timestamp: new Date().toLocaleTimeString()
      }
    ];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`copilot_msgs_${projectId}`, JSON.stringify(messages));
    }
  }, [messages, projectId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const suggestedQuestions = [
    "Synthesize comprehensive Business Plan & Lean Canvas",
    "Run RAG market research and TAM/SAM/SOM sizing",
    "Calculate unit economics and 3-Year Financial Model",
    "Generate 10-slide institutional pitch deck"
  ];

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input requires browser speech recognition support.");
      return;
    }
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'ai',
        text: `Conversation history reset for **${activeProjName}**. How can I assist with your startup workspace?`,
        agent: 'LangGraph Swarm Engine',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleSendMessage = async (userPromptText: string) => {
    const text = userPromptText || prompt;
    if (!text.trim() || isProcessing) return;

    const userMsgId = `u-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text,
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
      text: `Executing multi-agent workflow for '${text}'...`,
      agent: 'LangGraph Swarm Engine',
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, initialAiMsg]);

    try {
      // Execute REAL backend multi-agent workflow
      const response = await apiClient.post(`/projects/${projectId}/execute`, {
        project_id: projectId,
        prompt: text
      });

      const resData = response.data;
      const traceId = resData.trace_id || resData.execution_result?.trace_id;
      const replyText = resData.message || resData.cofounder_advice || `Successfully executed AI workflow for '${text}'. Workspace tables updated in Supabase.`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                text: replyText,
                trace_id: traceId,
                agent: 'LangGraph Swarm Engine',
                isStreaming: false
              }
            : m
        )
      );

      // Trigger real workspace re-fetch from Supabase DB
      if (onRefetchWorkspaceData) {
        onRefetchWorkspaceData();
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
      {/* FLOATING COPILOT TRIGGER BUTTON (Bottom-Right) */}
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
          <div className="flex flex-col text-left">
            <span className="text-xs font-extrabold tracking-wide leading-none">Copilot</span>
            <span className="text-[9px] text-slate-300 leading-tight">VenturePilot AI</span>
          </div>
        </button>
      )}

      {/* RIGHT-SIDE COLLAPSIBLE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Compact Header */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#5B5CEB] flex items-center justify-center text-white shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold flex items-center gap-1.5">
                <span>VenturePilot Copilot</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  LangGraph Active
                </span>
              </div>
              <div className="text-[10px] text-slate-300 truncate max-w-[210px]">
                Active Project: <span className="font-bold text-white">{activeProjName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearChatHistory}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
              title="Reset Chat History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleDrawer}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
              title="Close Drawer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
                {m.trace_id && (
                  <a
                    href="https://smith.langchain.com/projects/VenturePilot-AI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[#5B5CEB] hover:underline text-[9px] flex items-center gap-0.5"
                  >
                    <span>[{m.trace_id.slice(0, 14)}...]</span>
                    <ExternalLink className="w-2.5 h-2.5 inline" />
                  </a>
                )}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[92%] leading-relaxed text-xs ${
                  m.sender === 'user'
                    ? 'bg-[#5B5CEB] text-white font-medium rounded-tr-none shadow-sm'
                    : m.rejection
                    ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none shadow-sm font-medium'
                    : 'bg-white text-[#0F172A] border border-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>

                {/* Copy Button */}
                <div className="mt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyText(m.id, m.text)}
                    className={`text-[10px] font-medium flex items-center gap-1 ${
                      m.sender === 'user' ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {copiedId === m.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
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
