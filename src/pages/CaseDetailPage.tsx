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
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/case-search')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Landmark Cases</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] hover:border-indigo-500 transition-colors"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Saved!</span>
              </>
            ) : (
              <>
                <BookmarkPlus size={14} />
                <span>Save Case</span>
              </>
            )}
          </button>
          <button
            onClick={() =>
              navigate(`/chat?q=${encodeURIComponent(`Explain the legal holding of ${caseData.caseName} (${caseData.citationStr})`)}`)
            }
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
          >
            <MessageSquare size={14} />
            <span>Ask Nyayavanta</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded">
            {caseData.citationStr}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar size={13} />
            <span>Pronounced: {caseData.judgmentDate || 'Established'}</span>
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
          {caseData.caseName}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-slate-400">Court / Bench:</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{caseData.court}</p>
            {caseData.bench && <p className="text-slate-500 text-[11px]">{caseData.bench}</p>}
          </div>
          <div>
            <span className="text-slate-400">Parties:</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {caseData.petitioner || 'Petitioner'} vs {caseData.respondent || 'Respondent'}
            </p>
          </div>
        </div>
      </div>

      {/* Procedural Timeline */}
      <div className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-indigo-600" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Procedural Timeline
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Filing → Hearing → Interim Order → Judgment → Appeal → Final Outcome
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2">
          {(caseData.timelineMilestones || []).map((m: any, idx: number) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs space-y-1"
            >
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                {m.step}
              </span>
              <p className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 line-clamp-1">
                {m.date}
              </p>
              <p className="text-[10px] text-slate-500 line-clamp-2">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Judgment Summary & Court Reasoning */}
      <div className="space-y-4">
        <section className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-sm">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Judgment Summary & Crux
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {caseData.summary}
          </p>
        </section>

        <section className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-sm">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Court Reasoning & Ratio Decidendi
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {caseData.courtReasoning}
          </p>
        </section>

        <section className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1">
          <h3 className="font-bold text-xs text-emerald-800 dark:text-emerald-300 uppercase">
            Final Outcome & Disposition
          </h3>
          <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            {caseData.outcome}
          </p>
        </section>

        {caseData.sourceUrl && (
          <div className="text-center pt-2">
            <a
              href={caseData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-semibold"
            >
              <span>View Full Judgment on Official Indian Kanoon / Supreme Court Portal</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
