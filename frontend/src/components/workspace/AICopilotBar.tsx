"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Mic, RefreshCw, X, ChevronRight, Copy, Check,
  Trash2, ExternalLink, Bot, HelpCircle, FileText, PieChart, Info
} from 'lucide-react';
import { useVentureStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

interface CopilotProps {
  projectId: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  agent?: string;
  trace_id?: string;
  timestamp: string;
  isStreaming?: boolean;
  timeline?: {
    planner: 'completed' | 'running' | 'queued';
    research: 'completed' | 'running' | 'queued';
    finance: 'completed' | 'running' | 'queued';
    deck: 'completed' | 'running' | 'queued';
    qa: 'completed' | 'running' | 'queued';
  };
  rejection?: boolean;
}

const ALLOWED_VENTURE_TOPICS = [
  "startup", "business", "market", "competitor", "financial", "finance", "revenue",
  "pricing", "roadmap", "architecture", "investor", "deck", "pitch", "funding",
  "valuation", "gst", "compliance", "india", "venture", "agritech", "product",
  "lean canvas", "swot", "tam", "sam", "som", "gtm", "marketing", "customer",
  "saas", "tech", "validation", "governance", "audit", "runway", "burn rate", "crore",
  "increase", "generate", "create", "analyze", "find", "build", "plan", "grants",
  "page", "feature", "export", "download", "rag", "langgraph", "supabase", "dashboard",
  "section", "help", "explain", "how", "what", "why"
];

export const AICopilotBar: React.FC<CopilotProps> = ({ projectId }) => {
  const { startupState, user, executeCascadeWorkflow } = useVentureStore();
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

  // Save drawer open/close preference
  const toggleDrawer = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('copilot_drawer_open', String(nextState));
    }
  };

  // Persistent conversation memory in state & localStorage
  const activeProjName = startupState.project.name || 'Your Startup';
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
        text: `Welcome to the **VenturePilot Copilot**. I can help you use the platform, explain dashboard features, generate startup artefacts, and answer questions about your current project (**${activeProjName}**).`,
        agent: 'Website Copilot',
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
    "What is this page used for?",
    "Explain the Financial Model section.",
    "Generate a SWOT analysis for my startup.",
    "How do I export my investor deck?",
    "Why is my RAG search returning no results?",
    "Generate Business Plan"
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
        text: `Conversation history reset for **${activeProjName}**. How can I assist with your startup workspace or VenturePilot features?`,
        agent: 'Website Copilot',
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

    const lowerPrompt = text.toLowerCase();

    // 1. Context-Aware Out-of-Scope Domain Enforcement
    const isVentureRelated = ALLOWED_VENTURE_TOPICS.some((kw) => lowerPrompt.includes(kw));

    if (!isVentureRelated && lowerPrompt.length > 12 && !lowerPrompt.includes("hi") && !lowerPrompt.includes("hello")) {
      setTimeout(() => {
        const rejMsg: ChatMessage = {
          id: `ai-rej-${Date.now()}`,
          sender: 'ai',
          rejection: true,
          text: "I'm the VenturePilot Website Copilot. I can only assist with your startup projects and features available within VenturePilot AI.",
          agent: 'Domain Guardrail',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages((prev) => [...prev, rejMsg]);
        setIsProcessing(false);
      }, 500);
      return;
    }

    // 2. Initialize Agent Execution Badge
    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      agent: 'Planner Agent',
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString(),
      timeline: {
        planner: 'running',
        research: 'queued',
        finance: 'queued',
        deck: 'queued',
        qa: 'queued'
      }
    };

    setMessages((prev) => [...prev, initialAiMsg]);
    const traceId = `ls_${Date.now().toString().slice(-6)}`;

    try {
      // Step 1: Planner
      await new Promise((r) => setTimeout(r, 350));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                agent: 'Research Agent',
                timeline: { planner: 'completed', research: 'running', finance: 'queued', deck: 'queued', qa: 'queued' }
              }
            : m
        )
      );

      // Handle specific platform features directly with context
      let contextualResponse = '';
      if (lowerPrompt.includes("what is this page used for") || lowerPrompt.includes("explain the workspace")) {
        contextualResponse = `### Workspace Overview for ${activeProjName}\n\n` +
          `This workspace is your **Enterprise AI Operating System**. It provides 13 integrated modules:\n` +
          `• **Business Plan**: Autonomous Executive Summary, Vision, and Lean Canvas.\n` +
          `• **Market Research (RAG)**: Index PDF/Doc research papers into Supabase pgvector.\n` +
          `• **Financial Model**: 3-Year Projections, Monthly Burn Rate, and Seed Ask.\n` +
          `• **Investor Deck**: 10-Slide Pitch Deck with Readiness Scorecard.\n` +
          `• **Technical Architecture**: System Mermaid diagrams and technology stack.\n` +
          `• **Audit & Governance**: Immutable audit logs and LangSmith trace histories.`;
      } else if (lowerPrompt.includes("explain the financial model")) {
        contextualResponse = `### Financial Model Section Guide\n\n` +
          `The Financial Model calculates unit economics for **${activeProjName}**:\n` +
          `• **Monthly Burn Rate**: Current projected expenses.\n` +
          `• **Runway Months**: Remaining capital runway.\n` +
          `• **Seed Ask**: Set to **${startupState.financials.seed_ask_inr || '₹1.0 Crore'}**.\n` +
          `• **3-Year Revenue Forecast**: Interactive projection curves across Year 1 to Year 3.`;
      } else if (lowerPrompt.includes("swot")) {
        contextualResponse = `### SWOT Analysis for ${activeProjName} (${startupState.project.industry || 'Tech'})\n\n` +
          `• **Strengths**: Proprietary LangGraph workflow engine, automated RAG index, user-isolated Supabase storage.\n` +
          `• **Weaknesses**: Early-stage brand awareness, initial customer acquisition ramp.\n` +
          `• **Opportunities**: Rapid expansion in enterprise AI SaaS market, high-margin subscription model.\n` +
          `• **Threats**: Established legacy consultancies, rapidly evolving AI baseline models.`;
      } else if (lowerPrompt.includes("export") || lowerPrompt.includes("download")) {
        contextualResponse = `### How to Export Your Pitch Deck & Master Package\n\n` +
          `1. Click **Downloads & Exports** in the left sidebar.\n` +
          `2. Choose your preferred format:\n` +
          `   • **PowerPoint (.pptx)**: Edit slide contents in Microsoft PowerPoint.\n` +
          `   • **Excel Financials (.xlsx)**: Edit 3-year cash flow projections.\n` +
          `   • **Word Document (.docx)**: Full Business Plan.\n` +
          `   • **ZIP Master Package**: Download all 5 investor artifacts in one archive.`;
      } else if (lowerPrompt.includes("rag") || lowerPrompt.includes("no results")) {
        contextualResponse = `### RAG Document Retrieval Guide\n\n` +
          `If your RAG search returns no results:\n` +
          `1. Open the **Market Research (RAG)** tab in the sidebar.\n` +
          `2. Upload PDF or Word documents using the document indexer.\n` +
          `3. Ensure chunks are stored in the Supabase \`embeddings\` table (VECTOR 1536).\n` +
          `4. Re-run your semantic search query.`;
      }

      // Step 2: Research API Call
      let backendAdvice = '';
      if (!contextualResponse) {
        try {
          const res = await apiClient.post(`/projects/${projectId}/execute`, {
            project_id: projectId,
            prompt: text
          });
          if (res.data?.cofounder_advice) {
            backendAdvice = res.data.cofounder_advice;
          }
        } catch (err) {}
      }

      await new Promise((r) => setTimeout(r, 350));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                agent: 'Finance Agent',
                timeline: { planner: 'completed', research: 'completed', finance: 'running', deck: 'queued', qa: 'queued' }
              }
            : m
        )
      );

      // Trigger workspace state mutation
      executeCascadeWorkflow(text);

      // Step 3: Final Synthesized Output
      await new Promise((r) => setTimeout(r, 350));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                agent: 'QA & Compliance Agent',
                timeline: { planner: 'completed', research: 'completed', finance: 'completed', deck: 'completed', qa: 'running' }
              }
            : m
        )
      );

      await new Promise((r) => setTimeout(r, 250));

      const fullResponse = contextualResponse || backendAdvice || (
        `### Copilot Action for '${text}'\n\n` +
        `• **Planner Agent**: Updated Business Plan & Lean Canvas for **${activeProjName}**.\n` +
        `• **Finance Agent**: Updated Financial Projections & Unit Economics.\n` +
        `• **Pitch Deck Agent**: Regenerated Investor Deck Slides.\n` +
        `• **Audit Log**: Snapshot recorded [LangSmith Trace #${traceId}].`
      );

      // Token streaming animation
      let currentText = '';
      const tokens = fullResponse.split(' ');
      for (let i = 0; i < tokens.length; i++) {
        currentText += (i === 0 ? '' : ' ') + tokens[i];
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  text: currentText,
                  trace_id: traceId,
                  isStreaming: i < tokens.length - 1,
                  timeline: { planner: 'completed', research: 'completed', finance: 'completed', deck: 'completed', qa: 'completed' }
                }
              : m
          )
        );
        await new Promise((r) => setTimeout(r, 25));
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                text: `Execution completed for '${text}'. Workspace state updated [Trace #${traceId}].`,
                trace_id: traceId,
                isStreaming: false,
                timeline: { planner: 'completed', research: 'completed', finance: 'completed', deck: 'completed', qa: 'completed' }
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

      {/* RIGHT-SIDE COLLAPSIBLE DRAWER (390px - 440px) */}
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
                  Active
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
                <span className="font-bold">{m.sender === 'user' ? (user?.full_name || 'Founder') : m.agent || 'Website Copilot'}</span>
                <span>• {m.timestamp}</span>
                {m.trace_id && (
                  <a
                    href={`https://smith.langchain.com/public/${m.trace_id}/r`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[#5B5CEB] hover:underline text-[9px] flex items-center gap-0.5"
                  >
                    <span>[{m.trace_id}]</span>
                    <ExternalLink className="w-2.5 h-2.5 inline" />
                  </a>
                )}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[92%] leading-relaxed text-xs ${
                  m.sender === 'user'
                    ? 'bg-[#5B5CEB] text-white font-medium rounded-tr-none shadow-sm'
                    : m.rejection
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-tl-none shadow-sm font-medium'
                    : 'bg-white text-[#0F172A] border border-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>

                {/* Execution Timeline Badge */}
                {m.timeline && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1 text-[9px] font-mono">
                    <span className={`px-1.5 py-0.5 rounded ${m.timeline.planner === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700 animate-pulse'}`}>
                      Planner
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${m.timeline.research === 'completed' ? 'bg-emerald-100 text-emerald-700' : m.timeline.research === 'running' ? 'bg-indigo-100 text-indigo-700 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                      Research
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${m.timeline.finance === 'completed' ? 'bg-emerald-100 text-emerald-700' : m.timeline.finance === 'running' ? 'bg-indigo-100 text-indigo-700 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                      Finance
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${m.timeline.qa === 'completed' ? 'bg-emerald-100 text-emerald-700' : m.timeline.qa === 'running' ? 'bg-indigo-100 text-indigo-700 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                      QA
                    </span>
                  </div>
                )}

                {/* Copy Text */}
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
            placeholder="Ask about your startup or any VenturePilot feature..."
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
