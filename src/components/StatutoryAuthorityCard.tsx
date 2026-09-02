import React from 'react';
import { BookOpen, ExternalLink, Scale, Check, ShieldCheck } from 'lucide-react';
import { JurisdictionalAuthority, StatutorySection } from '../types/legal';

interface StatutoryAuthorityCardProps {
  statutorySections: StatutorySection[];
  jurisdiction: JurisdictionalAuthority;
}

export const StatutoryAuthorityCard: React.FC<StatutoryAuthorityCardProps> = ({
  statutorySections,
  jurisdiction
}) => {
  return (
    <div className="space-y-6">
      {/* Competent Forum & Jurisdiction Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white font-serif-legal">
            Designated Forum & Pecuniary Jurisdiction (India)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Appropriate Forum
            </span>
            <span className="text-xs font-bold text-slate-100 block">
              {jurisdiction.forumName}
            </span>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Pecuniary Limit / Band
            </span>
            <span className="text-xs font-bold text-emerald-400 block">
              {jurisdiction.pecuniaryLimit}
            </span>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Statutory Limitation
            </span>
            <span className="text-xs font-bold text-amber-400 block">
              {jurisdiction.limitationPeriod}
            </span>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Statutory Filing Fee
            </span>
            <span className="text-xs font-bold text-slate-200 block">
              {jurisdiction.statutoryFilingFee}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div>
            <strong className="text-slate-300">Territorial Rule: </strong>
            <span>{jurisdiction.territorialJurisdictionRule}</span>
          </div>

          {jurisdiction.eFilingPortalUrl && (
            <a
              href={jurisdiction.eFilingPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-medium transition"
            >
              <span>{jurisdiction.eFilingPortalName || 'E-Filing Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Governing Bare Act Provisions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white font-serif-legal">
              Relevant Statutory Authorities (Bare Acts)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {statutorySections.length} Statutory Sections Cited
          </span>
        </div>

        <div className="space-y-4">
          {statutorySections.map((sec) => (
            <div
              key={sec.id}
              className="bg-slate-800/50 border border-slate-700/80 hover:border-slate-600 rounded-xl p-5 transition space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                    {sec.sectionNumber}
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {sec.actName}, {sec.year} — {sec.title}
                  </h4>
                </div>

                {sec.statutoryReferenceUrl && (
                  <a
                    href={sec.statutoryReferenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-400 transition"
                  >
                    <span>Official Gazette / Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Verbatim Excerpt */}
              <div className="p-3.5 bg-slate-900/80 border-l-2 border-amber-500 rounded-r-lg text-xs font-mono text-slate-300 leading-relaxed">
                <span className="text-[10px] text-amber-500/80 uppercase font-bold tracking-wider block mb-1">
                  Verbatim Statutory Provision:
                </span>
                &ldquo;{sec.keyRuleVerbatim}&rdquo;
              </div>

              {/* Plain English Explanation */}
              <div className="text-xs text-slate-300 space-y-1">
                <p>
                  <strong className="text-slate-200">Plain English Breakdown: </strong>
                  {sec.plainEnglishExplanation}
                </p>
                <p className="text-slate-400">
                  <strong className="text-slate-300">Case Application: </strong>
                  {sec.relevanceToCase}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
