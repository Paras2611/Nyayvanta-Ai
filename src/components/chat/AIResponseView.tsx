import React from 'react';
import {
  Scale,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { EvidenceBackedResponse } from '../../services/api';
import { VerificationBadge } from './EvidencePanel';

interface AIResponseViewProps {
  response: EvidenceBackedResponse;
}

export const AIResponseView: React.FC<AIResponseViewProps> = ({ response }) => {
  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      {/* 1. ANSWER */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            1. Legal Summary & Answer
          </h3>
        </div>
        <div className="p-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed text-sm shadow-sm">
          {response.answer}
        </div>
      </section>

      {/* 2. WHY THIS MAY APPLY */}
      {response.whyThisMayApply && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              2. Why This May Apply
            </h3>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl text-sm leading-relaxed">
            {response.whyThisMayApply}
          </div>
        </section>
      )}

      {/* 3. RELEVANT LAW */}
      {response.relevantLaw && response.relevantLaw.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              3. Relevant Statutory Law ({response.relevantLaw.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {response.relevantLaw.map((sec) => (
              <div
                key={sec.id}
                className="p-3.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    {sec.actName} ({sec.year})
                  </span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-semibold">
                    {sec.sectionNumber}
                  </span>
                </div>
                <p className="font-semibold text-xs text-slate-900 dark:text-white">{sec.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sec.plainEnglishExplanation}
                </p>
                {sec.keyRuleVerbatim && (
                  <p className="text-[11px] text-slate-500 italic border-l-2 border-indigo-400 pl-2">
                    "{sec.keyRuleVerbatim.slice(0, 160)}..."
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. RELEVANT CASES */}
      {response.relevantCases && response.relevantCases.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <Scale size={14} className="text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              4. Relevant Precedents & Judgments ({response.relevantCases.length})
            </h3>
          </div>
          <div className="space-y-2.5">
            {response.relevantCases.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{c.caseName}</h4>
                  <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                    {c.citationStr}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{c.court}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {c.summary}
                </p>
                <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded">
                  Legal Holding: {c.relevance}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. POSSIBLE NEXT STEPS */}
      {response.possibleNextSteps && response.possibleNextSteps.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              5. Possible Informational Next Steps
            </h3>
          </div>
          <div className="space-y-2">
            {response.possibleNextSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-3.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[11px]">
                      {step.stepNumber}
                    </span>
                    {step.title}
                  </span>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">
                    {step.recommendedTimeline}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                  {step.description}
                </p>
                {step.actionableNotes && step.actionableNotes.length > 0 && (
                  <ul className="pl-11 list-disc text-[11px] text-slate-500 space-y-0.5">
                    {step.actionableNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. IMPORTANT LIMITATIONS */}
      {response.importantLimitations && response.importantLimitations.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              6. Important Limitations & Scope
            </h3>
          </div>
          <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
            {response.importantLimitations.map((lim, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{lim}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7, 8, 9. Summary Badges */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-500">
          <Info size={14} />
          <span>Evidence Sources: {response.sources?.length || 0} authoritative items linked</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Verified Claims: {response.verification?.filter((v) => v.uiBadge === 'VERIFIED').length} of{' '}
          {response.verification?.length || 0}
        </div>
      </div>
    </div>
  );
};
