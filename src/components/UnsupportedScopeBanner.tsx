import React from 'react';
import { AlertOctagon, ExternalLink, Phone, ShieldCheck, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { UnsupportedDomainDetails } from '../data/legalDomains';

interface UnsupportedScopeBannerProps {
  unsupportedData: {
    category: string;
    label: string;
    rejectionReason: string;
    safeRedirectionGuide: {
      appropriateForum: string;
      freeLegalAidAgency: string;
      helplineNumber: string;
      keyAdvice: string;
      officialPortal?: string;
    };
  };
  onBackToSupported: () => void;
  detectedQuery?: string;
}

export const UnsupportedScopeBanner: React.FC<UnsupportedScopeBannerProps> = ({
  unsupportedData,
  onBackToSupported,
  detectedQuery
}) => {
  const guide = unsupportedData.safeRedirectionGuide;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 my-6">
      <div className="bg-gradient-to-b from-rose-950/40 to-slate-900 border-2 border-rose-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-rose-950/50 relative overflow-hidden">
        {/* Top Warning Banner */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 flex-shrink-0 mt-1">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Scope Restriction Enforcement
              </span>
              <span className="text-xs text-slate-400">
                Detected Matter: <strong className="text-slate-200">{unsupportedData.label}</strong>
              </span>
            </div>

            {/* Mandatory verbatim statement */}
            <h2 className="text-2xl font-bold text-white tracking-tight font-serif-legal mb-2">
              This case type is currently outside LawLink&apos;s supported MVP scope.
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {unsupportedData.rejectionReason}
            </p>

            {detectedQuery && (
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-400 mb-6">
                <span className="text-slate-500 font-mono block mb-1">Your query was:</span>
                <span className="italic text-slate-300">&ldquo;{detectedQuery}&rdquo;</span>
              </div>
            )}
          </div>
        </div>

        {/* Why LawLink Restricts Scope Box */}
        <div className="mt-4 p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <Info className="w-4 h-4" />
            <span>Why LawLink Enforces Strict Domain Boundaries</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            LawLink is committed to responsible legal AI. Matters involving criminal liberty, bodily harm, family disputes, constitutional litigation, or corporate insolvency involve high-stakes proceedings, confidential mediation, or custodial procedures where automated informational models cannot substitute qualified legal advocates.
          </p>
        </div>

        {/* Safe Redirection & Official Legal Aid Section */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safe Informational Redirection & Official Indian Authorities</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-800/50 rounded-lg border border-slate-750">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Designated Forum / Competent Authority
              </span>
              <p className="text-xs text-slate-200 font-medium">
                {guide.appropriateForum}
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/50 rounded-lg border border-slate-750">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Free Legal Aid Body (Under Legal Services Authorities Act, 1987)
              </span>
              <p className="text-xs text-slate-200 font-medium">
                {guide.freeLegalAidAgency}
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/50 rounded-lg border border-slate-750">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Official Helpline & Emergency Assistance
              </span>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Phone className="w-4 h-4" />
                <span>{guide.helplineNumber}</span>
              </div>
            </div>

            {guide.officialPortal && (
              <div className="p-3.5 bg-slate-800/50 rounded-lg border border-slate-750 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Official Portal
                </span>
                <a
                  href={guide.officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  <span>Visit {new URL(guide.officialPortal).hostname}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-200/90 leading-relaxed">
              <strong>Key Guidance:</strong> {guide.keyAdvice}
            </p>
          </div>
        </div>

        {/* Supported MVP Domains Reminder */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>LawLink currently supports: </span>
            <strong className="text-slate-300">Consumer, Tenancy, Employment & Contract Disputes.</strong>
          </div>

          <button
            onClick={onBackToSupported}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition shadow-lg shadow-amber-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Supported Case Types</span>
          </button>
        </div>
      </div>
    </div>
  );
};
