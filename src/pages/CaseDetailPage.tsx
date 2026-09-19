import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Scale,
  Calendar,
  Building,
  User,
  ExternalLink,
  MessageSquare,
  BookmarkPlus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import { fetchCaseDetail, saveResearchItem } from '../services/api';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCaseDetail(id).then(setCaseData).catch(console.error);
    }
  }, [id]);

  if (!caseData) {
    return (
      <div className="text-center py-12 space-y-3">
        <Scale size={32} className="mx-auto text-indigo-600 animate-pulse" />
        <p className="text-sm text-slate-500">Loading authoritative judicial record...</p>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await saveResearchItem({
        title: caseData.caseName,
        itemType: 'Case',
        referenceId: caseData.id,
        description: caseData.summary,
        dataPayload: caseData
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/case-search')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#544E6D] dark:text-slate-400 hover:text-[#684EC9] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft size={16} />
          <span>Back to Landmark Cases</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E3F5] dark:border-slate-700 bg-white dark:bg-[#111827] text-[#1E1B2E] dark:text-slate-200 hover:border-[#684EC9] font-bold shadow-xs transition-colors cursor-pointer press-feedback"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-emerald-500 font-bold">Saved!</span>
              </>
            ) : (
              <>
                <BookmarkPlus size={14} className="text-[#684EC9]" />
                <span>Save Case</span>
              </>
            )}
          </button>
          <button
            onClick={() =>
              navigate(`/chat?q=${encodeURIComponent(`Explain the legal holding of ${caseData.caseName} (${caseData.citationStr})`)}`)
            }
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-xs px-4 py-2.5 rounded-xl bg-[#684EC9] hover:bg-[#573EB0] text-white font-bold shadow-xs transition-colors cursor-pointer press-feedback"
          >
            <MessageSquare size={14} />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="p-5 sm:p-7 md:p-8 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold text-[#684EC9] dark:text-purple-400 bg-[#EDE9FE] dark:bg-purple-950 px-3 py-1 rounded-lg border border-[#DDD6FE] dark:border-purple-800">
            {caseData.citationStr}
          </span>
          <span className="text-xs text-[#7E779C] flex items-center gap-1 font-medium">
            <Calendar size={13} />
            <span>Pronounced: {caseData.judgmentDate || 'Established'}</span>
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1E1B2E] dark:text-white leading-tight">
          {caseData.caseName}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#E8E3F5] dark:border-slate-800">
          <div>
            <span className="text-[#7E779C] uppercase font-bold text-[10px] tracking-wider block mb-1">Court / Bench</span>
            <p className="font-bold text-[#1E1B2E] dark:text-slate-200 text-sm">{caseData.court}</p>
            {caseData.bench && <p className="text-[#544E6D] dark:text-slate-400 text-xs mt-0.5">{caseData.bench}</p>}
          </div>
          <div>
            <span className="text-[#7E779C] uppercase font-bold text-[10px] tracking-wider block mb-1">Parties in Dispute</span>
            <p className="font-bold text-[#1E1B2E] dark:text-slate-200 text-sm">
              {caseData.petitioner || 'Petitioner'} vs {caseData.respondent || 'Respondent'}
            </p>
          </div>
        </div>
      </div>

      {/* Adaptive Procedural Timeline */}
      <div className="p-5 sm:p-7 md:p-8 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-[#684EC9]" />
          <h2 className="font-black text-sm text-[#1E1B2E] dark:text-white uppercase tracking-wider">
            Procedural Timeline
          </h2>
        </div>
        <p className="text-xs text-[#544E6D] dark:text-slate-400">
          Filing → Hearing → Interim Order → Judgment → Appeal → Final Disposition
        </p>

        {/* Mobile Vertical Connected Timeline (sm:hidden) */}
        <div className="sm:hidden relative border-l-2 border-[#DDD6FE] dark:border-purple-900/60 ml-3.5 my-2 space-y-4 pl-4">
          {(caseData.timelineMilestones || []).map((m: any, idx: number) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-[#684EC9] border-2 border-white dark:border-[#111827] shadow-2xs" />
              <div className="p-3 rounded-xl border border-[#E8E3F5] dark:border-slate-800 bg-[#F8F7FC] dark:bg-slate-900/40 text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#684EC9] dark:text-purple-400 uppercase tracking-wider block">
                  {m.step}
                </span>
                <p className="font-bold text-[11px] text-[#1E1B2E] dark:text-slate-200">
                  {m.date}
                </p>
                <p className="text-[11px] text-[#544E6D] dark:text-slate-400">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet Horizontal Grid (hidden sm:grid) */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-2">
          {(caseData.timelineMilestones || []).map((m: any, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-[#E8E3F5] dark:border-slate-800 bg-[#F8F7FC] dark:bg-slate-900/40 text-xs space-y-1 shadow-2xs relative"
            >
              <span className="text-[10px] font-bold text-[#684EC9] dark:text-purple-400 uppercase tracking-wider block">
                {m.step}
              </span>
              <p className="font-bold text-[11px] text-[#1E1B2E] dark:text-slate-200 line-clamp-1">
                {m.date}
              </p>
              <p className="text-[10px] text-[#544E6D] dark:text-slate-400 line-clamp-2">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Judgment Summary & Court Reasoning */}
      <div className="space-y-4">
        <section className="p-6 sm:p-8 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
          <h2 className="font-black text-sm text-[#1E1B2E] dark:text-white uppercase tracking-wider">
            Judgment Summary & Crux
          </h2>
          <p className="text-xs sm:text-sm text-[#544E6D] dark:text-slate-300 leading-relaxed font-normal">
            {caseData.summary}
          </p>
        </section>

        <section className="p-6 sm:p-8 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
          <h2 className="font-black text-sm text-[#1E1B2E] dark:text-white uppercase tracking-wider">
            Court Reasoning & Ratio Decidendi
          </h2>
          <p className="text-xs sm:text-sm text-[#544E6D] dark:text-slate-300 leading-relaxed font-normal">
            {caseData.courtReasoning}
          </p>
        </section>

        <section className="p-5 sm:p-6 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-1.5 shadow-xs">
          <h3 className="font-bold text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            Final Outcome & Disposition
          </h3>
          <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
            {caseData.outcome}
          </p>
        </section>

        {caseData.sourceUrl && (
          <div className="text-center pt-2">
            <a
              href={caseData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#684EC9] hover:underline font-bold"
            >
              <span>View Full Judgment on Official Portal</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
