import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [filename, setFilename] = useState('Sample_Lease_Agreement.pdf');
  const [pipelineState, setPipelineState] = useState<string>('Idle');
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResponse | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'input' | 'findings'>('input');

  const sampleAgreements = [
    {
      title: 'Residential Lease (Deposit Forfeiture)',
      file: 'Bengaluru_Tenancy_Agreement.pdf',
      text: `RESIDENTIAL LEASE AGREEMENT\nThis Agreement is made on 01-10-2025 between Shri R. K. Sharma (Lessor) and Anand Verma (Lessee).\nClause 4: The Lessee has deposited a Security Deposit of INR 1,50,000.\nClause 8: In the event of default or early vacation, the entire security deposit shall be forfeited as liquidated damages.\nClause 14: Any dispute arising out of this agreement shall be referred to Sole Arbitrator appointed by Lessor.\nClause 18: Courts in Bengaluru shall have exclusive jurisdiction.`
    },
    {
      title: 'Employment Offer (1-Yr Non-Compete)',
      file: 'Tech_Employment_Contract.pdf',
      text: `EMPLOYMENT AGREEMENT\nEntered on 15-06-2024 between CloudTech Private Limited and Priya Nair.\nClause 5: Designation: Lead Software Architect.\nClause 9: The employee agrees that for a period of 12 months following resignation or termination, employee shall not engage or work for any competitor in India.\nClause 12: Training bond damages of INR 3,00,000 are stipulated in case of departure within 2 years.`
    }
  ];

  const handleRunAnalysis = async (textToUse?: string, nameToUse?: string) => {
    const text = textToUse !== undefined ? textToUse : inputText;
    const name = nameToUse || filename;
    if (!text.trim()) return;

    setActiveMobileTab('findings');

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
    <div className="space-y-5 sm:space-y-6">
      <div className="space-y-1.5 sm:space-y-2">
        <h1 className="text-xl md:text-2xl font-black text-[#1E1B2E] dark:text-white flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#684EC9] dark:text-purple-300 flex items-center justify-center shrink-0 shadow-2xs">
            <FileText size={20} />
          </div>
          <span>{t('documents.title')}</span>
        </h1>
        <p className="text-xs md:text-sm text-[#544E6D] dark:text-slate-400">
          {t('documents.subtitle')}
        </p>
      </div>

      {/* Preset Samples - Swipeable Track on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-[#7E779C] shrink-0">
          {t('documents.sample_agreements')}
        </span>
        {sampleAgreements.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(s.text);
              setFilename(s.file);
              handleRunAnalysis(s.text, s.file);
            }}
            className="text-xs px-3 py-1.5 rounded-xl border border-[#E8E3F5] dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-[#684EC9] text-[#544E6D] dark:text-slate-300 hover:bg-[#EDE9FE] dark:hover:bg-purple-950/30 font-bold transition-all shadow-2xs cursor-pointer shrink-0 press-feedback"
          >
            {idx === 0 ? t('documents.sample_rental') : t('documents.sample_employment')}
          </button>
        ))}
      </div>

      {/* Mobile Tab Segmented Switcher (lg:hidden) */}
      <div className="flex lg:hidden bg-[#EDE9FE] dark:bg-[#1E1836] p-1 rounded-2xl border border-[#D8D1EE] dark:border-[#382F5E]">
        <button
          onClick={() => setActiveMobileTab('input')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'input'
              ? 'bg-white dark:bg-[#2C244C] text-[#573EAE] dark:text-white shadow-xs'
              : 'text-[#544E6D] dark:text-[#A59FC2]'
          }`}
        >
          <UploadCloud size={14} />
          <span>{t('documents.tab_input')}</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('findings')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'findings'
              ? 'bg-white dark:bg-[#2C244C] text-[#573EAE] dark:text-white shadow-xs'
              : 'text-[#544E6D] dark:text-[#A59FC2]'
          }`}
        >
          <Scale size={14} />
          <span>{t('documents.tab_findings')}</span>
          {analysisResult && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* Split Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input / Viewer */}
        <div className={`p-4 sm:p-6 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-4 shadow-xs flex flex-col justify-between ${
          activeMobileTab === 'findings' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#1E1B2E] dark:text-white flex items-center gap-2">
                <UploadCloud size={18} className="text-[#684EC9]" />
                <span>{t('documents.upload_title')}</span>
              </h2>
              <span className="text-xs font-mono text-[#7E779C] bg-[#F8F7FC] dark:bg-slate-800 px-2 py-0.5 rounded-md border border-[#E8E3F5] dark:border-slate-700 max-w-[140px] sm:max-w-none truncate">
                {filename}
              </span>
            </div>

            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('documents.placeholder_textarea')}
              className="w-full p-3.5 sm:p-4 rounded-2xl border border-[#E8E3F5] dark:border-slate-700 bg-[#F8F7FC] dark:bg-slate-900 text-xs font-mono text-[#1E1B2E] dark:text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#684EC9]/20 focus:border-[#684EC9] shadow-inner lg:min-h-[320px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-2 gap-3">
            <span className="text-xs text-[#544E6D] dark:text-slate-400">
              Pipeline State: <strong className="text-[#684EC9] font-bold">{pipelineState}</strong>
            </span>
            <button
              onClick={() => handleRunAnalysis()}
              disabled={pipelineState !== 'Idle' && pipelineState !== 'Complete'}
              className="px-6 py-2.5 bg-[#684EC9] hover:bg-[#573EB0] text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer transition-colors min-h-[42px] press-feedback"
            >
              {pipelineState !== 'Idle' && pipelineState !== 'Complete' ? t('documents.btn_analyzing') : t('documents.btn_analyze')}
            </button>
          </div>
        </div>

        {/* Right: Analysis & Findings */}
        <div className={`p-4 sm:p-6 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-4 shadow-xs overflow-y-auto max-h-[650px] ${
          activeMobileTab === 'input' ? 'hidden lg:block' : 'block'
        }`}>
          {!analysisResult ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-[#7E779C] min-h-[350px]">
              <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] dark:bg-purple-950/40 text-[#684EC9] flex items-center justify-center">
                <Scale size={28} />
              </div>
              <p className="font-bold text-sm text-[#1E1B2E] dark:text-slate-200">
                {t('saved.empty_title')}
              </p>
              <p className="text-xs text-[#544E6D] dark:text-slate-400 max-w-xs">
                {t('documents.awaiting_analysis')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Status & Risk */}
              <div className="flex items-start justify-between pb-3 border-b border-[#E8E3F5] dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1E1B2E] dark:text-white">
                    {analysisResult.documentType}
                  </h3>
                  <p className="text-xs text-[#7E779C]">{analysisResult.filename}</p>
                </div>
                <RiskBadge risk={analysisResult.riskLevel} />
              </div>

              {/* Parties & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-[#F8F7FC] dark:bg-slate-900/40 p-3.5 rounded-2xl border border-[#E8E3F5] dark:border-slate-800">
                <div>
                  <span className="text-[#7E779C] uppercase font-bold text-[10px]">{t('documents.parties')}:</span>
                  <p className="font-bold text-[#1E1B2E] dark:text-slate-300">
                    {analysisResult.parties.join(' & ')}
                  </p>
                </div>
                <div>
                  <span className="text-[#7E779C] uppercase font-bold text-[10px]">{t('documents.dates')}:</span>
                  <p className="font-bold text-[#1E1B2E] dark:text-slate-300">
                    {analysisResult.dates.join(', ')}
                  </p>
                </div>
              </div>

              {/* Detected Clauses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#573EAE] dark:text-purple-400 uppercase tracking-wider">
                  {t('documents.clauses_analyzed')} ({analysisResult.importantClauses.length})
                </h4>
                {analysisResult.importantClauses.map((clause, i) => (
                  <div
                    key={i}
                    className="p-4 border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-2 bg-white dark:bg-[#111827] text-xs shadow-xs hover:border-[#DDD6FE] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1E1B2E] dark:text-white text-xs sm:text-sm">
                        {clause.clauseTitle}
                      </span>
                      <RiskBadge risk={clause.riskRating} />
                    </div>
                    <p className="text-[11px] font-mono text-[#544E6D] dark:text-slate-300 bg-[#F8F7FC] dark:bg-slate-900 p-2.5 rounded-xl border border-[#E8E3F5] dark:border-slate-800 italic">
                      "{clause.extractedSnippet}"
                    </p>
                    <p className="text-xs text-[#544E6D] dark:text-slate-300 leading-relaxed font-medium">
                      {clause.legalImplication}
                    </p>
                    {clause.relevantStatuteSnippet && (
                      <div className="text-[11px] text-[#684EC9] dark:text-purple-400 font-bold">
                        Statutory Reference: {clause.relevantStatuteSnippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actionable Recommendations */}
              <div className="p-4 bg-[#F6F4FD] dark:bg-purple-950/20 border border-[#DDD6FE] dark:border-purple-900 rounded-2xl space-y-2 text-xs">
                <h4 className="font-bold text-[#46328D] dark:text-purple-200 uppercase tracking-wider text-[11px]">
                  {t('documents.recommendations')}
                </h4>
                <ul className="space-y-1.5 text-[#544E6D] dark:text-slate-300 list-disc pl-4">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="leading-relaxed">{rec}</li>
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
                  className="flex items-center gap-1.5 text-xs font-bold text-[#684EC9] dark:text-purple-400 hover:text-[#573EB0] hover:underline cursor-pointer"
                >
                  <span>{t('search.ask_ai')}</span>
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
