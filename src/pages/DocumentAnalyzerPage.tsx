import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Scale,
  Search,
  BookOpen,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { analyzeDocument, DocumentAnalysisResponse, ClauseAnalysisItem } from '../services/api';

export const RiskBadge: React.FC<{ risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }> = ({ risk }) => {
  switch (risk) {
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <ShieldCheck size={14} />
          <span>Risk: Low</span>
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          <AlertCircle size={14} />
          <span>Risk: Medium</span>
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <AlertTriangle size={14} />
          <span>Risk: High</span>
        </span>
      );
    case 'CRITICAL':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
          <XCircle size={14} />
          <span>Risk: Critical</span>
        </span>
      );
  }
};

export const DocumentAnalyzerPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [filename, setFilename] = useState('Sample_Lease_Agreement.pdf');
  const [pipelineState, setPipelineState] = useState<string>('Idle');
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResponse | null>(null);

  const sampleAgreements = [
    {
      title: 'Residential Lease with Deposit Forfeiture',
      file: 'Bengaluru_Tenancy_Agreement.pdf',
      text: `RESIDENTIAL LEASE AGREEMENT\nThis Agreement is made on 01-10-2025 between Shri R. K. Sharma (Lessor) and Anand Verma (Lessee).\nClause 4: The Lessee has deposited a Security Deposit of INR 1,50,000.\nClause 8: In the event of default or early vacation, the entire security deposit shall be forfeited as liquidated damages.\nClause 14: Any dispute arising out of this agreement shall be referred to Sole Arbitrator appointed by Lessor.\nClause 18: Courts in Bengaluru shall have exclusive jurisdiction.`
    },
    {
      title: 'Employment Offer Letter with 1-Year Non-Compete',
      file: 'Tech_Employment_Contract.pdf',
      text: `EMPLOYMENT AGREEMENT\nEntered on 15-06-2024 between CloudTech Private Limited and Priya Nair.\nClause 5: Designation: Lead Software Architect.\nClause 9: The employee agrees that for a period of 12 months following resignation or termination, employee shall not engage or work for any competitor in India.\nClause 12: Training bond damages of INR 3,00,000 are stipulated in case of departure within 2 years.`
    }
  ];

  const handleRunAnalysis = async (textToUse?: string, nameToUse?: string) => {
    const text = textToUse !== undefined ? textToUse : inputText;
    const name = nameToUse || filename;
    if (!text.trim()) return;

    // Pipeline steps
    const steps = [
      'Uploading Document...',
      'Extracting Text...',
      'Analyzing Clauses...',
      'Finding Relevant Indian Laws...',
      'Verifying Enforceability...',
      'Complete'
    ];

    let idx = 0;
    setPipelineState(steps[0]);
    const interval = setInterval(() => {
      idx++;
      if (idx < steps.length) {
        setPipelineState(steps[idx]);
      } else {
        clearInterval(interval);
      }
    }, 400);

    try {
      const result = await analyzeDocument(text, name);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setPipelineState('Complete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="text-indigo-600" size={24} />
          <span>Analyze a Legal Document</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Upload or paste legal agreements, notices, or contracts for statutory clause extraction, enforceability check, and risk scoring.
        </p>
      </div>

      {/* Preset Samples */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 self-center">Quick Load Sample:</span>
        {sampleAgreements.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(s.text);
              setFilename(s.file);
              handleRunAnalysis(s.text, s.file);
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 font-medium transition-colors"
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Split Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input / Viewer */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud size={18} className="text-indigo-600" />
              <span>Document Text / Paste Area</span>
            </h2>
            <span className="text-xs text-slate-400">{filename}</span>
          </div>

          <textarea
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste complete agreement text, lease deed clauses, or employment notice..."
            className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Pipeline State: <strong className="text-indigo-600">{pipelineState}</strong>
            </span>
            <button
              onClick={() => handleRunAnalysis()}
              disabled={pipelineState !== 'Idle' && pipelineState !== 'Complete'}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              Analyze Document
            </button>
          </div>
        </div>

        {/* Right: Analysis & Findings */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm overflow-y-auto max-h-[600px]">
          {!analysisResult ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-slate-400">
              <Scale size={32} />
              <p className="font-semibold text-xs">No analysis generated yet</p>
              <p className="text-[11px]">Click "Analyze Document" or select a preset sample above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Status & Risk */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {analysisResult.documentType}
                  </h3>
                  <p className="text-xs text-slate-500">{analysisResult.filename}</p>
                </div>
                <RiskBadge risk={analysisResult.riskLevel} />
              </div>

              {/* Parties & Dates */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400">Parties:</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {analysisResult.parties.join(' & ')}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Key Dates:</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {analysisResult.dates.join(', ')}
                  </p>
                </div>
              </div>

              {/* Detected Clauses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Analyzed Clauses ({analysisResult.importantClauses.length})
                </h4>
                {analysisResult.importantClauses.map((clause, i) => (
                  <div
                    key={i}
                    className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 bg-white dark:bg-[#111827] text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {clause.clauseTitle}
                      </span>
                      <RiskBadge risk={clause.riskRating} />
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800 italic">
                      "{clause.extractedSnippet}"
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {clause.legalImplication}
                    </p>
                    {clause.relevantStatuteSnippet && (
                      <div className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold">
                        Statutory Reference: {clause.relevantStatuteSnippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actionable Recommendations */}
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider text-[11px]">
                  Actionable Informational Steps
                </h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() =>
                    navigate(
                      `/chat?q=${encodeURIComponent(
                        `How to respond to document with risk level ${analysisResult.riskLevel} involving ${analysisResult.documentType}`
                      )}`
                    )
                  }
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                >
                  <span>Ask Nyayavanta About These Findings</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
