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
  Plus,
  Layers,
  X
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
  const [showMobileEvidence, setShowMobileEvidence] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

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
    <div className="flex h-[calc(100vh-6rem)] md:h-[calc(100vh-5rem)] -m-3 sm:-m-5 md:-m-6 lg:-m-8 bg-[#F8F7FC] dark:bg-[#0E0C17] relative overflow-hidden">
      {/* 1. Left Session History Panel (Desktop only) */}
      <div className="w-56 xl:w-64 border-r border-[#E8E3F5] dark:border-[#26213D] bg-[#F4F2FA] dark:bg-[#13101F] hidden lg:flex flex-col justify-between shrink-0">
        <div className="p-3.5 space-y-3 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7E779C] uppercase tracking-wider">
              Sessions
            </span>
            <button
              onClick={() => {
                setMessages([]);
                setActiveResponse(null);
              }}
              className="p-1.5 rounded-lg bg-white dark:bg-[#221D38] border border-[#E0D9F7] dark:border-[#382F5E] text-[#684EC9] dark:text-[#C4B5FD] hover:bg-[#EBE6F8] shadow-xs"
              title="New Research Inquiry"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            <p className="text-[10px] font-bold text-[#7E779C] uppercase pt-1">Today</p>
            <div
              onClick={() => {}}
              className="p-2.5 rounded-xl bg-white dark:bg-[#221D38] text-[#573EAE] dark:text-[#C4B5FD] font-semibold cursor-pointer border border-[#E0D9F7] dark:border-[#382F5E] shadow-xs truncate"
            >
              Security Deposit Retention
            </div>
            <div
              onClick={() => {}}
              className="p-2.5 rounded-xl hover:bg-[#EBE6F8] dark:hover:bg-[#1D1830] text-[#544E6D] dark:text-[#A59FC2] cursor-pointer truncate transition-colors"
            >
              Section 27 Non-Compete Restraint
            </div>

            <p className="text-[10px] font-bold text-[#7E779C] uppercase pt-2">Previous 7 Days</p>
            <div className="p-2.5 rounded-xl hover:bg-[#EBE6F8] dark:hover:bg-[#1D1830] text-[#544E6D] dark:text-[#A59FC2] cursor-pointer truncate transition-colors">
              E-Daakhil Defective Laptop Refund
            </div>
            <div className="p-2.5 rounded-xl hover:bg-[#EBE6F8] dark:hover:bg-[#1D1830] text-[#544E6D] dark:text-[#A59FC2] cursor-pointer truncate transition-colors">
              MSME Samadhaan Overdue Recovery
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-[#E8E3F5] dark:border-[#26213D] text-xs text-[#544E6D] flex items-center justify-between">
          <span className="text-[11px] font-medium">Domain:</span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="text-xs bg-white dark:bg-[#1A162B] border border-[#D8D1EE] dark:border-[#382F5E] rounded-lg px-2 py-1 font-semibold text-[#573EAE] dark:text-[#C4B5FD]"
          >
            <option value="consumer">Consumer</option>
            <option value="tenancy">Tenancy</option>
            <option value="employment">Employment</option>
            <option value="contract">Contract</option>
          </select>
        </div>
      </div>

      {/* 2. Center Chat & Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F7FC] dark:bg-[#0E0C17]">
        {/* Workspace Top Header */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3F5] dark:border-[#26213D] bg-white dark:bg-[#171424] flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#F4F2FA] dark:bg-[#221D38] flex items-center justify-center text-[#684EC9] dark:text-[#C4B5FD] shrink-0">
              <Scale size={18} />
            </div>
            <div className="truncate">
              <h2 className="font-bold text-xs sm:text-sm text-[#1E1B2E] dark:text-white leading-tight truncate">
                Legal Research Workspace
              </h2>
              <p className="text-[11px] text-[#7E779C] truncate">
                Evidence Grounding • <span className="font-bold text-[#684EC9] uppercase">{selectedDomain}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile/Tablet Toggle for Evidence Panel */}
            <button
              onClick={() => setShowMobileEvidence(!showMobileEvidence)}
              className="xl:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EDE9FE] dark:bg-[#251F3D] text-[#573EAE] dark:text-[#C4B5FD] border border-[#D8D1EE] dark:border-[#382F5E] text-xs font-semibold"
            >
              <Layers size={13} />
              <span className="hidden sm:inline">Evidence & Sources</span>
              <span className="sm:hidden">Evidence</span>
            </button>

            <span className="hidden sm:inline-flex text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
              ● RAG Grounded
            </span>
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-5">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 text-[#7E779C] py-8 sm:py-12">
              <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] dark:bg-[#221D38] flex items-center justify-center text-[#684EC9] dark:text-[#C4B5FD] shadow-xs">
                <Scale size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-[#1E1B2E] dark:text-white">
                  Ask a Specific Indian Legal Question
                </h3>
                <p className="text-xs text-[#544E6D] dark:text-[#A59FC2] leading-relaxed">
                  Describe the dispute facts, consideration quantum, or terms. Nyayavanta connects statements to Bare Acts and Supreme Court decisions.
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
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E3F5] dark:border-[#2D2745] bg-white dark:bg-[#171424] hover:border-[#7C66DC] transition-colors text-[#1E1B2E] dark:text-[#F5F3FF] shadow-xs"
                >
                  "Landlord withholding deposit of Rs 80,000 after vacation in Bengaluru."
                </button>
                <button
                  onClick={() =>
                    handleSend(
                      'Can my employer enforce a 1-year non-compete clause after I resigned from my software job?'
                    )
                  }
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E3F5] dark:border-[#2D2745] bg-white dark:bg-[#171424] hover:border-[#7C66DC] transition-colors text-[#1E1B2E] dark:text-[#F5F3FF] shadow-xs"
                >
                  "Can my employer enforce a post-employment non-compete clause in India?"
                </button>
                <button
                  onClick={() =>
                    handleSend(
                      'Buyer is refusing to pay MSME invoices overdue by 90 days. What statutory remedies exist under the MSMED Act?'
                    )
                  }
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E3F5] dark:border-[#2D2745] bg-white dark:bg-[#171424] hover:border-[#7C66DC] transition-colors text-[#1E1B2E] dark:text-[#F5F3FF] shadow-xs"
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
                  <div className="max-w-2xl bg-[#684EC9] text-white p-3 sm:p-4 rounded-2xl rounded-tr-xs text-xs sm:text-sm shadow-xs leading-relaxed">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl bg-white dark:bg-[#171424] border border-[#E8E3F5] dark:border-[#2D2745] p-4 sm:p-6 rounded-2xl rounded-tl-xs lavender-shadow-sm space-y-4">
                  {m.response?.isClarification && m.response.clarification ? (
                    <ClarificationCard
                      payload={m.response.clarification}
                      onSubmitAnswers={handleClarificationSubmit}
                    />
                  ) : m.response ? (
                    <AIResponseView response={m.response} />
                  ) : (
                    <p className="text-xs sm:text-sm text-[#1E1B2E] dark:text-slate-200">{m.content}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Processing State Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-3 p-3.5 sm:p-4 max-w-md bg-white dark:bg-[#171424] border border-[#E8E3F5] dark:border-[#2D2745] rounded-2xl shadow-xs text-xs text-[#544E6D] dark:text-[#A59FC2]">
              <Loader2 size={18} className="animate-spin text-[#684EC9] shrink-0" />
              <div className="space-y-0.5">
                <span className="font-bold text-[#1E1B2E] dark:text-white">
                  {processingState || 'Consulting Indian legal corpus...'}
                </span>
                <p className="text-[11px] text-[#7E779C]">Never exposing internal chain-of-thought</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-2.5 sm:p-4 bg-white dark:bg-[#171424] border-t border-[#E8E3F5] dark:border-[#26213D] shrink-0 shadow-xs">
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
                className="w-full pl-3.5 sm:pl-4 pr-16 sm:pr-20 py-2.5 sm:py-3 rounded-2xl border border-[#D8D1EE] dark:border-[#382F5E] bg-[#F8F7FC] dark:bg-[#120F1F] text-xs sm:text-sm text-[#1E1B2E] dark:text-white placeholder:text-[#958EB3] focus:outline-none focus:ring-2 focus:ring-[#7C66DC]"
              />
              <div className="absolute right-2 flex items-center gap-1 text-[#7E779C]">
                <button
                  type="button"
                  title="Attach Agreement"
                  className="p-1.5 hover:text-[#573EAE] rounded-lg"
                >
                  <Paperclip size={15} />
                </button>
                <button
                  type="button"
                  title="Voice input placeholder"
                  className="p-1.5 hover:text-[#573EAE] rounded-lg"
                >
                  <Mic size={15} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-center transition-colors shadow-xs ${
                isProcessing || !inputQuery.trim()
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-[#684EC9] hover:bg-[#573EAE] text-white cursor-pointer'
              }`}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Right Evidence & Sources Panel (Desktop Fixed) */}
      <div className="w-80 lg:w-96 border-l border-[#E8E3F5] dark:border-[#26213D] bg-white dark:bg-[#171424] hidden xl:flex flex-col shrink-0 overflow-y-auto">
        <EvidencePanel
          relevantLaw={activeResponse?.relevantLaw}
          relevantCases={activeResponse?.relevantCases}
          claimsVerification={activeResponse?.verification}
          confidence={activeResponse?.confidence}
          sources={activeResponse?.sources}
        />
      </div>

      {/* 4. Slide-over Evidence Panel for Mobile/Tablet */}
      {showMobileEvidence && (
        <div className="fixed inset-0 z-40 flex justify-end xl:hidden bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#171424] h-full flex flex-col shadow-2xl overflow-y-auto">
            <div className="p-3 border-b border-[#E8E3F5] dark:border-[#26213D] flex items-center justify-between sticky top-0 bg-white dark:bg-[#171424] z-10">
              <span className="font-bold text-xs text-[#1E1B2E] dark:text-white flex items-center gap-1.5">
                <Scale size={16} className="text-[#684EC9]" />
                <span>Evidence & Sources</span>
              </span>
              <button
                onClick={() => setShowMobileEvidence(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-2">
              <EvidencePanel
                relevantLaw={activeResponse?.relevantLaw}
                relevantCases={activeResponse?.relevantCases}
                claimsVerification={activeResponse?.verification}
                confidence={activeResponse?.confidence}
                sources={activeResponse?.sources}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
