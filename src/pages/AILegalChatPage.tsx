import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Send,
  Paperclip,
  Mic,
  Loader2,
  Scale,
  Shield,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  BookmarkPlus,
  RefreshCw,
  Plus
} from 'lucide-react';
import { sendChatQuery, EvidenceBackedResponse } from '../services/api';
import { EvidencePanel } from '../components/chat/EvidencePanel';
import { AIResponseView } from '../components/chat/AIResponseView';
import { ClarificationCard } from '../components/chat/ClarificationCard';

interface MessageEntry {
  id: string;
  sender: 'user' | 'ai';
  content?: string;
  response?: EvidenceBackedResponse;
}

export const AILegalChatPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialDomain = searchParams.get('domain') || 'consumer';

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState<string>('');
  const [activeResponse, setActiveResponse] = useState<EvidenceBackedResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const runProcessingSteps = () => {
    const states = [
      'Searching Indian legal sources...',
      'Finding relevant statutory provisions...',
      'Retrieving landmark judgments...',
      'Comparing authorities & jurisdictions...',
      'Generating grounded response...',
      'Verifying legal claims against evidence...'
    ];

    let step = 0;
    setProcessingState(states[0]);
    const interval = setInterval(() => {
      step++;
      if (step < states.length) {
        setProcessingState(states[step]);
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  };

  const handleSend = async (queryText?: string, clarificationAnswers?: Record<string, any>) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    // Add user message if not just submitting clarification answers
    if (!clarificationAnswers) {
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, sender: 'user', content: text }
      ]);
      setInputQuery('');
    }

    setIsProcessing(true);
    const cancelSteps = runProcessingSteps();

    try {
      const response = await sendChatQuery(
        text,
        selectedDomain,
        activeResponse?.conversationId,
        clarificationAnswers
      );

      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, sender: 'ai', response }
      ]);

      setActiveResponse(response);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Fallback message
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          content: 'Unable to connect to Nyayavanta API. Please ensure the backend server is running.'
        }
      ]);
    } finally {
      cancelSteps();
      setIsProcessing(false);
      setProcessingState('');
    }
  };

  const handleClarificationSubmit = (answers: Record<string, any>) => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    handleSend(lastUserMsg?.content || 'Case Inquiry', answers);
  };

  return (
    <div className="flex h-[calc(100vh-5.5rem)] -m-4 md:-m-6 lg:-m-8 bg-[#F7F8FA] dark:bg-[#080D18]">
      {/* 1. Left History Panel (Desktop) */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1220] hidden lg:flex flex-col justify-between shrink-0">
        <div className="p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Research Sessions
            </span>
            <button
              onClick={() => {
                setMessages([]);
                setActiveResponse(null);
              }}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600"
              title="New Legal Inquiry"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            <p className="text-[10px] font-semibold text-slate-400 uppercase pt-2">Today</p>
            <div
              onClick={() => {}}
              className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-medium cursor-pointer border border-indigo-200 dark:border-indigo-900/60 truncate"
            >
              Security Deposit Retention in Tenancy
            </div>
            <div
              onClick={() => {}}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer truncate"
            >
              Section 27 ICA Non-Compete Restraint
            </div>

            <p className="text-[10px] font-semibold text-slate-400 uppercase pt-3">Previous 7 Days</p>
            <div className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer truncate">
              E-Daakhil Defective Product Refund
            </div>
            <div className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer truncate">
              MSME Samadhaan 45-Day Overdue Recovery
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Active Domain:</span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 font-medium text-slate-800 dark:text-slate-200"
          >
            <option value="consumer">Consumer</option>
            <option value="tenancy">Tenancy</option>
            <option value="employment">Employment</option>
            <option value="contract">Contract</option>
          </select>
        </div>
      </div>

      {/* 2. Center Chat & Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F7F8FA] dark:bg-[#080D18]">
        {/* Workspace Header */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Scale size={20} className="text-indigo-600" />
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                Nyayavanta AI Research Workspace
              </h2>
              <p className="text-[11px] text-slate-500">
                Evidence-First Legal Intelligence • Domain: <span className="font-semibold text-indigo-600 uppercase">{selectedDomain}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
              ● RAG Engine Active
            </span>
          </div>
        </div>

        {/* Message Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 text-slate-500 py-12">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
                <Scale size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  Ask a Specific Legal Question
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Provide dispute facts, financial quantum, or contractual terms. Nyayavanta will retrieve authentic Indian statutory authorities and binding precedents.
                </p>
              </div>

              {/* Sample Prompts */}
              <div className="space-y-2 w-full pt-2 text-left">
                <button
                  onClick={() =>
                    handleSend(
                      'Landlord is withholding my deposit of Rs 80,000 after I vacated the flat with proper 15-day notice in Bengaluru.'
                    )
                  }
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 transition-colors text-slate-700 dark:text-slate-300"
                >
                  "Landlord withholding deposit of Rs 80,000 after vacation in Bengaluru."
                </button>
                <button
                  onClick={() =>
                    handleSend(
                      'Can my employer enforce a 1-year non-compete clause after I resigned from my software job?'
                    )
                  }
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 transition-colors text-slate-700 dark:text-slate-300"
                >
                  "Can my employer enforce a post-employment non-compete clause in India?"
                </button>
                <button
                  onClick={() =>
                    handleSend(
                      'Buyer is refusing to pay MSME invoices overdue by 90 days. What statutory remedies exist under the MSMED Act?'
                    )
                  }
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 transition-colors text-slate-700 dark:text-slate-300"
                >
                  "Buyer refusing to pay overdue MSME invoices beyond 45 days."
                </button>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className="space-y-3">
              {m.sender === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-2xl bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs text-sm shadow-sm leading-relaxed">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl rounded-tl-xs shadow-sm space-y-4">
                  {m.response?.isClarification && m.response.clarification ? (
                    <ClarificationCard
                      payload={m.response.clarification}
                      onSubmitAnswers={handleClarificationSubmit}
                    />
                  ) : m.response ? (
                    <AIResponseView response={m.response} />
                  ) : (
                    <p className="text-sm text-slate-800 dark:text-slate-200">{m.content}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Processing State Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-3 p-4 max-w-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs text-xs text-slate-600 dark:text-slate-400">
              <Loader2 size={18} className="animate-spin text-indigo-600 shrink-0" />
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {processingState || 'Consulting Indian legal corpus...'}
                </span>
                <p className="text-[11px] text-slate-400">Never exposing internal chain-of-thought</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 max-w-4xl mx-auto"
          >
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Describe your legal question or situation in detail..."
                disabled={isProcessing}
                className="w-full pl-4 pr-20 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute right-2 flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  title="Attach Agreement / Notice (PDF, TXT)"
                  className="p-1.5 hover:text-slate-600 rounded"
                >
                  <Paperclip size={16} />
                </button>
                <button
                  type="button"
                  title="Voice input placeholder"
                  className="p-1.5 hover:text-slate-600 rounded"
                >
                  <Mic size={16} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className={`p-3 rounded-xl flex items-center justify-center transition-colors shadow-sm ${
                isProcessing || !inputQuery.trim()
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              }`}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Right Evidence & Sources Panel (Desktop) */}
      <div className="w-80 lg:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hidden xl:flex flex-col shrink-0 overflow-y-auto">
        <EvidencePanel
          relevantLaw={activeResponse?.relevantLaw}
          relevantCases={activeResponse?.relevantCases}
          claimsVerification={activeResponse?.verification}
          confidence={activeResponse?.confidence}
          sources={activeResponse?.sources}
        />
      </div>
    </div>
  );
};
