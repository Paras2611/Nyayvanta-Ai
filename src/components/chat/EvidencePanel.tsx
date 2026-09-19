import React from 'react';
import {
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  XCircle,
  ExternalLink,
  BookOpen,
  Scale,
  FileCheck,
  Info
} from 'lucide-react';
import {
  LegalSectionItem,
  CaseCitationItem,
  ClaimVerificationItem,
  ConfidenceInfo,
  SourceItem
} from '../../services/api';

interface EvidencePanelProps {
  relevantLaw?: LegalSectionItem[];
  relevantCases?: CaseCitationItem[];
  claimsVerification?: ClaimVerificationItem[];
  confidence?: ConfidenceInfo;
  sources?: SourceItem[];
}

export const VerificationBadge: React.FC<{
  badge: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED' | 'CONFLICTING';
}> = ({ badge }) => {
  switch (badge) {
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
          <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
          <span>VERIFIED</span>
        </span>
      );
    case 'PARTIALLY_VERIFIED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
          <AlertCircle size={13} className="text-amber-600 dark:text-amber-400" />
          <span>PARTIALLY VERIFIED</span>
        </span>
      );
    case 'CONFLICTING':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
          <XCircle size={13} className="text-rose-600 dark:text-rose-400" />
          <span>CONFLICTING</span>
        </span>
      );
    case 'UNVERIFIED':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
          <HelpCircle size={13} className="text-slate-500 dark:text-slate-400" />
          <span>UNVERIFIED</span>
        </span>
      );
  }
};

export const ConfidenceCard: React.FC<{ confidence: ConfidenceInfo }> = ({ confidence }) => {
  return (
    <div className="bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Grounding Confidence
        </span>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
          {confidence.score}% ({confidence.level})
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
        <div
          className="bg-indigo-600 h-full rounded-full transition-all"
          style={{ width: `${Math.min(confidence.score, 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-1">
        {confidence.rationale}
      </p>
      <div className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-950/30 p-1.5 rounded border border-amber-200 dark:border-amber-900/50">
        <Info size={13} className="shrink-0 mt-0.5" />
        <span>{confidence.caveat}</span>
      </div>
    </div>
  );
};

export const ClaimVerificationCard: React.FC<{ claim: ClaimVerificationItem }> = ({ claim }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-white dark:bg-[#111827] space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
          "{claim.claimStatement}"
        </p>
        <VerificationBadge badge={claim.uiBadge} />
      </div>

      <div className="text-[11px] space-y-1 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
        <div className="flex justify-between">
          <span className="text-slate-500">Source:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {claim.statutoryCitation}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Confidence:</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {claim.confidenceRating}%
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
        {claim.statusJustification}
      </p>
    </div>
  );
};

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  relevantLaw = [],
  relevantCases = [],
  claimsVerification = [],
  confidence,
  sources = [],
}) => {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileCheck className="text-indigo-600 dark:text-indigo-400" size={18} />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">Evidence & Sources</h2>
        </div>
        <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium px-2 py-0.5 rounded">
          Verifiable
        </span>
      </div>

      {/* Confidence Card */}
      {confidence && <ConfidenceCard confidence={confidence} />}

      {/* Verification Claims */}
      {claimsVerification.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Claim Grounding ({claimsVerification.length})
          </h3>
          <div className="space-y-2.5">
            {claimsVerification.map((claim) => (
              <ClaimVerificationCard key={claim.id} claim={claim} />
            ))}
          </div>
        </section>
      )}

      {/* Relevant Acts & Sections */}
      {relevantLaw.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Relevant Provisions ({relevantLaw.length})
            </h3>
            <BookOpen size={14} className="text-slate-400" />
          </div>
          <div className="space-y-2">
            {relevantLaw.map((sec) => (
              <div
                key={sec.id}
                className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-[#111827] text-xs space-y-1"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {sec.sectionNumber}
                  </span>
                  {sec.statutoryReferenceUrl && (
                    <a
                      href={sec.statutoryReferenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <p className="font-medium text-slate-800 dark:text-slate-200">{sec.title}</p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {sec.plainEnglishExplanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Relevant Judgments */}
      {relevantCases.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Binding Precedents ({relevantCases.length})
            </h3>
            <Scale size={14} className="text-slate-400" />
          </div>
          <div className="space-y-2">
            {relevantCases.map((c) => (
              <div
                key={c.id}
                className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-[#111827] text-xs space-y-1"
              >
                <p className="font-bold text-slate-800 dark:text-slate-200">{c.caseName}</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                  {c.citationStr} ({c.court})
                </p>
                <p className="text-slate-500 text-[11px] line-clamp-2">{c.summary}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
