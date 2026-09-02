import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileSearch,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info
} from 'lucide-react';
import { LegalAnalysisResponse, VerificationClaim, VerificationStatus } from '../types/legal';

interface EvidenceVerificationPanelProps {
  analysis: LegalAnalysisResponse;
  onOpenNoticeDraft: () => void;
}

export const EvidenceVerificationPanel: React.FC<EvidenceVerificationPanelProps> = ({
  analysis,
  onOpenNoticeDraft
}) => {
  const [activeTab, setActiveTab] = useState<'claims' | 'facts' | 'clauses' | 'uncertainties'>('claims');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED_STATUTORY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            <span>VERIFIED STATUTORY</span>
          </span>
        );
      case 'ESTABLISHED_PRINCIPLE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <BookOpen className="w-3 h-3" />
            <span>ESTABLISHED PRINCIPLE</span>
          </span>
        );
      case 'DOCUMENT_SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <FileSearch className="w-3 h-3" />
            <span>DOCUMENT SUPPORTED</span>
          </span>
        );
      case 'REQUIRES_PRIMARY_VERIFICATION':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>REQUIRES PRIMARY VERIFICATION</span>
          </span>
        );
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'CONDITIONAL':
      default:
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Evidence & Confidence Header */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-serif-legal">
                Evidence & Verification Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Core Design Principle: <em className="text-slate-300">&ldquo;Don&apos;t make AI look magical. Make its evidence visible.&rdquo;</em>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${getConfidenceColor(analysis.confidenceLevel)}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span>Confidence: {analysis.confidenceLevel}</span>
            </div>
          </div>
        </div>

        {/* Confidence Rationale Note */}
        <div className="mt-4 p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">Confidence Rationale: </strong>
            <span>{analysis.confidenceRationale}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-6 bg-slate-900/50 overflow-x-auto">
        <button
          onClick={() => setActiveTab('claims')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'claims'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Claims & Verification ({analysis.claimsVerification.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('facts')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'facts'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Extracted Facts ({analysis.extractedFacts.length})</span>
        </button>

        {analysis.analyzedClauses && analysis.analyzedClauses.length > 0 && (
          <button
            onClick={() => setActiveTab('clauses')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'clauses'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>Document Clauses ({analysis.analyzedClauses.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('uncertainties')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'uncertainties'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Uncertainty & Gaps ({analysis.uncertaintiesAndGaps.missingDocuments.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* TAB 1: CLAIMS VERIFICATION MATRIX */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
              <span>Every assertion is cross-referenced against statutory authority or documentary evidence.</span>
              <span className="font-mono text-[11px]">{analysis.claimsVerification.length} Claims Assessed</span>
            </div>

            <div className="space-y-3">
              {analysis.claimsVerification.map((claim) => {
                const isExpanded = expandedClaimId === claim.id;
                return (
                  <div
                    key={claim.id}
                    className="bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 rounded-xl p-4 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          {getStatusBadge(claim.verificationStatus)}
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded">
                            Confidence: {claim.confidenceRating}%
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100">
                          {claim.claimStatement}
                        </h4>
                      </div>

                      <button
                        onClick={() => setExpandedClaimId(isExpanded ? null : claim.id)}
                        className="self-end sm:self-center p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900/60"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/50 mt-2">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Evidence / Source:</span>
                        <span className="text-slate-200 font-medium">{claim.evidenceSource}</span>
                      </div>
                      {claim.statutoryCitation && (
                        <div>
                          <span className="text-slate-400 text-[11px] block">Statutory Citation:</span>
                          <span className="text-amber-400 font-mono text-[11px]">{claim.statutoryCitation}</span>
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 p-3 bg-slate-900/80 border border-slate-750 rounded-lg text-xs text-slate-300">
                        <span className="font-semibold text-slate-200 block mb-1">Verification Justification:</span>
                        <p className="leading-relaxed">{claim.statusJustification}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: EXTRACTED FACTS */}
        {activeTab === 'facts' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Structured factual entities extracted from your submission and documents.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.extractedFacts.map((fact, idx) => (
                <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700/80 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-700">
                      {fact.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {fact.sourceType}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    {fact.label}
                  </span>

                  <p className="text-sm font-bold text-slate-100">
                    {fact.value}
                  </p>

                  {fact.sourceSnippet && (
                    <div className="mt-2 p-2 bg-slate-900/60 rounded text-[11px] text-slate-400 font-mono">
                      Snippet: &ldquo;{fact.sourceSnippet}&rdquo;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENT CLAUSES */}
        {activeTab === 'clauses' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Specific contractual clauses analyzed against Indian statutory principles.
            </p>

            <div className="space-y-3">
              {analysis.analyzedClauses?.map((clause, idx) => (
                <div key={idx} className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-bold text-slate-100">
                      {clause.clauseTitle}
                    </h5>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        clause.riskRating === 'POTENTIALLY_VOID'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : clause.riskRating === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      Risk: {clause.riskRating}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded-lg text-xs font-mono text-slate-300 mb-2 border border-slate-800">
                    &ldquo;{clause.extractedSnippet}&rdquo;
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Legal Implication: </strong> {clause.legalImplication}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: UNCERTAINTIES, GAPS & DEFENSES */}
        {activeTab === 'uncertainties' && (
          <div className="space-y-6">
            {/* Missing Evidentiary Documents */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileSearch className="w-4 h-4 text-amber-400" />
                <span>Documents Needed to Strengthen Case</span>
              </h4>
              <div className="space-y-2">
                {analysis.uncertaintiesAndGaps.missingDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center font-mono text-[10px] text-amber-400 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Assumptions */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>Critical AI Model Assumptions</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc">
                {analysis.uncertaintiesAndGaps.criticalAssumptions.map((asm, idx) => (
                  <li key={idx}>{asm}</li>
                ))}
              </ul>
            </div>

            {/* Potential Opposite Party Defenses */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Anticipated Opposing Defenses</span>
              </h4>
              <div className="space-y-2">
                {analysis.uncertaintiesAndGaps.potentialOppositePartyDefenses.map((def, idx) => (
                  <div key={idx} className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs text-rose-200/90">
                    <strong>Defense {idx + 1}: </strong> {def}
                  </div>
                ))}
              </div>
            </div>

            {analysis.uncertaintiesAndGaps.stateSpecificVariations && (
              <div className="p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-300">
                <strong className="text-amber-400 block mb-1">State-Specific Variations Note:</strong>
                <p>{analysis.uncertaintiesAndGaps.stateSpecificVariations}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
