import React from 'react';
import {
  Scale,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Info,
  ListChecks,
  FileText
} from 'lucide-react';
import { EvidenceBackedResponse } from '../../services/api';
import { VerificationBadge } from './EvidencePanel';

interface AIResponseViewProps {
  response: EvidenceBackedResponse;
}

export const AIResponseView: React.FC<AIResponseViewProps> = ({ response }) => {
  return (
    <div className="space-y-6 text-[#1E1B2E] dark:text-slate-200">
      {/* 1. ANSWER */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#684EC9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#573EAE] dark:text-purple-400">
            1. Legal Summary & Answer
          </h3>
        </div>
        <div className="p-4 sm:p-5 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl leading-relaxed text-sm shadow-xs text-[#1E1B2E] dark:text-slate-100 font-medium">
          {response.answer}
        </div>
      </section>

      {/* 2. WHY THIS MAY APPLY */}
      {response.whyThisMayApply && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#684EC9]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#573EAE] dark:text-purple-400">
              2. Why This May Apply
            </h3>
          </div>
          <div className="p-4 sm:p-5 bg-[#F8F7FC] dark:bg-[#0B1220] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl text-sm leading-relaxed text-[#544E6D] dark:text-slate-300">
            {response.whyThisMayApply}
          </div>
        </section>
      )}

      {/* 3. RELEVANT LAW */}
      {response.relevantLaw && response.relevantLaw.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-[#684EC9] dark:text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#573EAE] dark:text-purple-400">
              3. Relevant Statutory Law ({response.relevantLaw.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {response.relevantLaw.map((sec) => (
              <div
                key={sec.id}
                className="p-4 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-2 shadow-xs hover:border-[#DDD6FE] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#684EC9] dark:text-purple-400">
                    {sec.actName} ({sec.year})
                  </span>
                  <span className="text-[11px] bg-[#EDE9FE] dark:bg-slate-800 text-[#46328D] dark:text-purple-300 px-2 py-0.5 rounded-md font-mono font-bold">
                    {sec.sectionNumber}
                  </span>
                </div>
                <p className="font-bold text-xs text-[#1E1B2E] dark:text-white">{sec.title}</p>
                <p className="text-xs text-[#544E6D] dark:text-slate-300 leading-relaxed">
                  {sec.plainEnglishExplanation}
                </p>
                {sec.keyRuleVerbatim && (
                  <p className="text-[11px] text-[#7E779C] dark:text-slate-400 italic border-l-2 border-[#684EC9] pl-2.5">
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
            <Scale size={15} className="text-[#684EC9] dark:text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#573EAE] dark:text-purple-400">
              4. Relevant Precedents & Judgments ({response.relevantCases.length})
            </h3>
          </div>
          <div className="space-y-2.5">
            {response.relevantCases.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-2 shadow-xs hover:border-[#DDD6FE] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#1E1B2E] dark:text-white">{c.caseName}</h4>
                  <span className="text-[11px] font-mono font-bold text-[#684EC9] dark:text-purple-400">
                    {c.citationStr}
                  </span>
                </div>
                <p className="text-[11px] text-[#7E779C] font-medium">{c.court}</p>
                <p className="text-xs text-[#544E6D] dark:text-slate-300 leading-relaxed">
                  {c.summary}
                </p>
                <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
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
            <CheckCircle2 size={15} className="text-[#684EC9] dark:text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#573EAE] dark:text-purple-400">
              5. Possible Informational Next Steps
            </h3>
          </div>
          <div className="space-y-2">
            {response.possibleNextSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-4 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-2 shadow-xs hover:border-[#DDD6FE] transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-[#1E1B2E] dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#EDE9FE] dark:bg-purple-900/50 text-[#684EC9] dark:text-purple-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {step.stepNumber}
                    </span>
                    <span>{step.title}</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] bg-[#F8F7FC] dark:bg-slate-800 px-2 py-0.5 rounded-md text-[#544E6D] dark:text-slate-300 font-semibold border border-[#E8E3F5] dark:border-slate-700 shrink-0">
                    {step.recommendedTimeline}
                  </span>
                </div>
                <p className="text-xs text-[#544E6D] dark:text-slate-300 pl-8 leading-relaxed">
                  {step.description}
                </p>
                {step.actionableNotes && step.actionableNotes.length > 0 && (
                  <ul className="pl-12 list-disc text-[11px] text-[#7E779C] space-y-0.5">
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

      {/* 6. REQUIRED / RECOMMENDED DOCUMENTS FOR CASE PROCEEDING (DATASET GROUNDED) */}
      {response.suggestedDocuments && response.suggestedDocuments.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ListChecks size={16} className="text-[#684EC9] dark:text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#573EAE] dark:text-purple-400">
                {response.proceedingChecklistTitle || '6. Suggested Documents for Case Proceeding (Dataset Grounded)'}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
              {response.suggestedDocuments.filter((d) => d.is_mandatory).length} Mandatory •{' '}
              {response.suggestedDocuments.filter((d) => !d.is_mandatory).length} Supporting
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {response.suggestedDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-2 shadow-xs hover:border-[#DDD6FE] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-xs text-[#1E1B2E] dark:text-white flex items-center gap-1.5">
                      <FileText size={13} className="text-[#684EC9] dark:text-purple-400 shrink-0" />
                      <span>{doc.name}</span>
                    </h4>
                    <span className="text-[10px] text-[#7E779C] font-semibold">{doc.category}</span>
                  </div>
                  <span
                    className={`text-[9px] uppercase px-2 py-0.5 rounded-md font-bold shrink-0 ${
                      doc.is_mandatory
                        ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                    }`}
                  >
                    {doc.is_mandatory ? 'Mandatory' : 'Supporting'}
                  </span>
                </div>

                <p className="text-xs text-[#544E6D] dark:text-slate-300 leading-relaxed">
                  {doc.purpose}
                </p>

                {doc.legal_risk_if_missing && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 leading-snug">
                    <span className="font-semibold">Legal Risk:</span> {doc.legal_risk_if_missing}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#F0EDF9] dark:border-slate-800 text-[10px] text-[#7E779C] dark:text-slate-400 font-mono">
                  <span className="truncate" title={doc.dataset_citation}>
                    Source: {doc.dataset_citation}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
                    Grounded
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. IMPORTANT LIMITATIONS */}
      {response.importantLimitations && response.importantLimitations.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              7. Important Limitations & Scope
            </h3>
          </div>
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
            {response.importantLimitations.map((lim, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span className="leading-relaxed">{lim}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7, 8, 9. Summary Badges */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#E8E3F5] dark:border-slate-800">
        <div className="flex items-center gap-2 text-[#7E779C]">
          <Info size={14} className="text-[#684EC9]" />
          <span>Evidence Sources: {response.sources?.length || 0} authoritative items linked</span>
        </div>
        <div className="text-[11px] text-[#7E779C] font-semibold">
          Verified Claims: {response.verification?.filter((v) => v.uiBadge === 'VERIFIED').length} of{' '}
          {response.verification?.length || 0}
        </div>
      </div>
    </div>
  );
};
