import React from 'react';
import {
  ArrowLeft,
  FileText,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  Scale,
  Sparkles,
  BookOpen,
  Send,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { LegalAnalysisResponse, SupportedDomainId } from '../types/legal';
import { SUPPORTED_DOMAINS } from '../data/legalDomains';
import { EvidenceVerificationPanel } from './EvidenceVerificationPanel';
import { StatutoryAuthorityCard } from './StatutoryAuthorityCard';

interface CaseReportViewProps {
  analysis: LegalAnalysisResponse;
  onBack: () => void;
  onOpenNoticeStudio: () => void;
}

export const CaseReportView: React.FC<CaseReportViewProps> = ({
  analysis,
  onBack,
  onOpenNoticeStudio
}) => {
  const domainMeta = SUPPORTED_DOMAINS[analysis.domainId] || SUPPORTED_DOMAINS.consumer;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Intake</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNoticeStudio}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <FileText className="w-4 h-4" />
            <span>Open Notice Studio</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Case Header Hero */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider border ${domainMeta.colorScheme.badge}`}>
                {domainMeta.shortTitle} Dispute Intelligence
              </span>
              <span className="text-xs font-mono text-slate-400">
                Case ID: <strong>{analysis.caseId}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-legal tracking-tight">
              Legal Case & Evidence Analysis
            </h1>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">GENERATION TIMESTAMP</span>
            <span className="text-xs font-medium text-slate-300">
              {new Date(analysis.timestamp).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Case Summary */}
        <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider block mb-1">
            Executive Summary:
          </span>
          <p className="text-sm text-slate-200 leading-relaxed">
            {analysis.caseSummary}
          </p>
        </div>

        {/* Plain English Legal Assessment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Legal Grounds & Strengths</span>
            </h4>
            <ul className="space-y-1 text-xs text-emerald-100/90 pl-3 list-disc">
              {analysis.plainEnglishAnalysis.keyLegalGrounds.map((ground, idx) => (
                <li key={idx}>{ground}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Procedural Roadblocks & Timelines</span>
            </h4>
            <ul className="space-y-1 text-xs text-amber-100/90 pl-3 list-disc">
              {analysis.plainEnglishAnalysis.proceduralRoadblocks.map((block, idx) => (
                <li key={idx}>{block}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Module 1: Evidence & Verification Matrix */}
      <EvidenceVerificationPanel
        analysis={analysis}
        onOpenNoticeDraft={onOpenNoticeStudio}
      />

      {/* Module 2: Bare Acts & Statutory Authorities */}
      <StatutoryAuthorityCard
        statutorySections={analysis.statutorySections}
        jurisdiction={analysis.jurisdiction}
      />

      {/* Module 3: Next Informational Steps */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-serif-legal">
              Possible Informational Next Steps & Procedural Roadmap
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {analysis.nextSteps.length} Steps Outlined
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.nextSteps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-5 bg-slate-800/50 border border-slate-700/80 rounded-2xl flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    {step.stepNumber}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-750">
                    {step.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100 mb-1">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {step.description}
                </p>

                <div className="space-y-1">
                  {step.actionableNotes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-400">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/50 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Timeline:</span>
                <span className="text-amber-400 font-semibold">{step.recommendedTimeline}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pre-Litigation Notice CTA */}
        <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-transparent border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">
              Ready to generate your Pre-Litigation Legal Notice?
            </h4>
            <p className="text-xs text-slate-300">
              Customize dates, demands, and export a ready-to-dispatch legal notice draft formatted for Indian delivery standards.
            </p>
          </div>

          <button
            onClick={onOpenNoticeStudio}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Launch Notice Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
