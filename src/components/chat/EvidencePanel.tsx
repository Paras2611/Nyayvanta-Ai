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
  Info,
  X,
  Sparkles
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
  onClose?: () => void;
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
    <div className="bg-[#F8F7FC] dark:bg-[#0B1220] border border-[#E8E3F5] dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-[#6A6382] dark:text-slate-400 uppercase tracking-wider">
          Grounding Confidence
        </span>
        <span className="text-sm font-bold text-[#684EC9] dark:text-purple-400">
          {confidence.score}% ({confidence.level})
        </span>
      </div>
      <div className="w-full bg-[#E8E3F5] dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
        <div
          className="bg-[#684EC9] h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(confidence.score, 100)}%` }}
        />
      </div>
      <p className="text-xs text-[#544E6D] dark:text-slate-300 leading-relaxed mb-2">
        {confidence.rationale}
      </p>
      <div className="flex items-start gap-1.5 text-[11px] text-[#573EAE] dark:text-amber-300 bg-[#F4F0FD] dark:bg-amber-950/30 p-2 rounded-lg border border-[#DDD6FE] dark:border-amber-900/50">
        <Info size={14} className="shrink-0 mt-0.5 text-[#684EC9]" />
        <span>{confidence.caveat}</span>
      </div>
    </div>
  );
};

export const ClaimVerificationCard: React.FC<{ claim: ClaimVerificationItem }> = ({ claim }) => {
  return (
    <div className="border border-[#E8E3F5] dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-[#111827] space-y-2 shadow-xs hover:border-[#DDD6FE] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-[#1E1B2E] dark:text-slate-200 leading-snug">
          "{claim.claimStatement}"
        </p>
        <VerificationBadge badge={claim.uiBadge} />
      </div>

      <div className="text-[11px] space-y-1 bg-[#F8F7FC] dark:bg-slate-900/50 p-2 rounded-lg border border-[#F0EDF9] dark:border-slate-800/60">
        <div className="flex justify-between">
          <span className="text-[#7E779C]">Source:</span>
          <span className="font-semibold text-[#241C48] dark:text-slate-200">
            {claim.statutoryCitation}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#7E779C]">Confidence:</span>
          <span className="font-bold text-[#684EC9] dark:text-purple-400">
            {claim.confidenceRating}%
          </span>
        </div>
      </div>

      <p className="text-[11px] text-[#7E779C] dark:text-slate-400 italic">
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
  onClose,
}) => {
  const hasNoEvidence =
    relevantLaw.length === 0 &&
    relevantCases.length === 0 &&
    claimsVerification.length === 0 &&
    !confidence;

  return (
    <div className="p-3.5 sm:p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F5] dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileCheck className="text-[#684EC9] dark:text-purple-400" size={17} />
          <h2 className="font-bold text-xs sm:text-sm text-[#1E1B2E] dark:text-white">Evidence & Grounding</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-[11px] bg-[#EDE9FE] dark:bg-purple-950 text-[#573EAE] dark:text-purple-300 font-semibold px-2 py-0.5 rounded-md border border-[#DDD6FE] dark:border-purple-800">
            Verifiable
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#7E779C] hover:text-[#1E1B2E] dark:hover:text-white hover:bg-[#EBE6F8] dark:hover:bg-[#26213D] transition-colors"
              title="Close evidence panel"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Empty State Guidance Card when no evidence has been fetched yet */}
      {hasNoEvidence && (
        <div className="p-4 rounded-2xl bg-[#F8F7FC] dark:bg-[#151221] border border-[#E8E3F5] dark:border-[#2D2644] text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-[#EDE9FE] dark:bg-[#2A2244] flex items-center justify-center text-[#684EC9] dark:text-[#C4B5FD] shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1E1B2E] dark:text-white">
              Awaiting Legal Inquiry
            </h3>
            <p className="text-[11px] text-[#7E779C] dark:text-[#A59FC2] mt-1 leading-relaxed">
              When you submit a query, Nyayavanta retrieves statutory provisions and case law citations, verifying all claims here in real time.
            </p>
          </div>
          <div className="space-y-2 pt-1 text-left">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1D1830] border border-[#E8E3F5] dark:border-[#382F5E] text-[11px] space-y-0.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-[#684EC9] dark:text-[#C4B5FD]">
                <BookOpen size={12} />
                <span>Bare Acts Citations</span>
              </div>
              <p className="text-[10px] text-[#7E779C] dark:text-slate-400">Sections mapped from BNS, BSA, CPC, ICA, and CPA.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1D1830] border border-[#E8E3F5] dark:border-[#382F5E] text-[11px] space-y-0.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-[#684EC9] dark:text-[#C4B5FD]">
                <Scale size={12} />
                <span>Precedents & Judgments</span>
              </div>
              <p className="text-[10px] text-[#7E779C] dark:text-slate-400">Supreme Court and High Court precedent ratios.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1D1830] border border-[#E8E3F5] dark:border-[#2E274D] text-[11px] space-y-0.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={12} />
                <span>Zero-Hallucination Audit</span>
              </div>
              <p className="text-[10px] text-[#7E779C] dark:text-slate-400">Every statement tagged as Verified or Conflicting.</p>
            </div>
          </div>
        </div>
      )}

      {/* Confidence Card */}
      {confidence && <ConfidenceCard confidence={confidence} />}

      {/* Verification Claims */}
      {claimsVerification.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-bold text-[#6A6382] dark:text-slate-400 uppercase tracking-wider">
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
            <h3 className="text-xs font-bold text-[#6A6382] dark:text-slate-400 uppercase tracking-wider">
              Relevant Provisions ({relevantLaw.length})
            </h3>
            <BookOpen size={14} className="text-[#7E779C]" />
          </div>
          <div className="space-y-2">
            {relevantLaw.map((sec) => (
              <div
                key={sec.id}
                className="p-3 border border-[#E8E3F5] dark:border-slate-800 rounded-xl bg-white dark:bg-[#111827] text-xs space-y-1.5 shadow-xs hover:border-[#DDD6FE] transition-colors"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[#684EC9] dark:text-purple-400 bg-[#F4F0FD] dark:bg-purple-950/50 px-1.5 py-0.5 rounded text-[11px]">
                    {sec.sectionNumber}
                  </span>
                  {sec.statutoryReferenceUrl && (
                    <a
                      href={sec.statutoryReferenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7E779C] hover:text-[#684EC9] transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
                <p className="font-bold text-[#1E1B2E] dark:text-slate-200">{sec.title}</p>
                <p className="text-[#544E6D] dark:text-slate-400 text-[11px] leading-relaxed">
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
            <h3 className="text-xs font-bold text-[#6A6382] dark:text-slate-400 uppercase tracking-wider">
              Binding Precedents ({relevantCases.length})
            </h3>
            <Scale size={14} className="text-[#7E779C]" />
          </div>
          <div className="space-y-2">
            {relevantCases.map((c) => (
              <div
                key={c.id}
                className="p-3 border border-[#E8E3F5] dark:border-slate-800 rounded-xl bg-white dark:bg-[#111827] text-xs space-y-1.5 shadow-xs hover:border-[#DDD6FE] transition-colors"
              >
                <p className="font-bold text-[#1E1B2E] dark:text-slate-200">{c.caseName}</p>
                <p className="text-[#684EC9] dark:text-purple-400 font-mono text-[11px] font-semibold">
                  {c.citationStr} ({c.court})
                </p>
                <p className="text-[#544E6D] dark:text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                  {c.summary}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
