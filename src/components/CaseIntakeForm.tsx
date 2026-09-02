import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  AlertCircle,
  HelpCircle,
  IndianRupee,
  Calendar,
  Building2,
  User,
  MapPin,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { INDIAN_STATES_AND_UTS, SUPPORTED_DOMAINS } from '../data/legalDomains';
import { CaseIntakePayload, SupportedDomainId } from '../types/legal';

interface CaseIntakeFormProps {
  domainId: SupportedDomainId;
  initialData?: Partial<CaseIntakePayload>;
  onBack: () => void;
  onSubmit: (data: CaseIntakePayload) => void;
  isAnalyzing: boolean;
}

export const CaseIntakeForm: React.FC<CaseIntakeFormProps> = ({
  domainId,
  initialData,
  onBack,
  onSubmit,
  isAnalyzing
}) => {
  const domainMeta = SUPPORTED_DOMAINS[domainId];

  const [stateOfIncident, setStateOfIncident] = useState(initialData?.stateOfIncident || 'Karnataka');
  const [disputeTitle, setDisputeTitle] = useState(initialData?.disputeTitle || '');
  const [disputeDescription, setDisputeDescription] = useState(initialData?.disputeDescription || '');
  const [complainantRole, setComplainantRole] = useState(
    initialData?.complainantRole ||
      (domainId === 'consumer'
        ? 'Individual Consumer / Buyer'
        : domainId === 'tenancy'
        ? 'Residential Tenant'
        : domainId === 'employment'
        ? 'Exiting Employee'
        : 'Client Enterprise / Buyer')
  );
  const [oppositePartyName, setOppositePartyName] = useState(initialData?.oppositePartyName || '');
  const [oppositePartyType, setOppositePartyType] = useState(
    initialData?.oppositePartyType ||
      (domainId === 'consumer'
        ? 'Brand Manufacturer & E-Commerce Platform'
        : domainId === 'tenancy'
        ? 'Individual Property Owner / Landlord'
        : domainId === 'employment'
        ? 'Private Limited IT Company'
        : 'Vendor / Service Provider Agency')
  );
  const [disputedAmountINR, setDisputedAmountINR] = useState<number | undefined>(
    initialData?.disputedAmountINR || (domainId === 'consumer' ? 45000 : domainId === 'tenancy' ? 120000 : domainId === 'employment' ? 300000 : 500000)
  );
  const [incidentDate, setIncidentDate] = useState(initialData?.incidentDate || '2025-01-15');
  const [noticeAlreadySent, setNoticeAlreadySent] = useState(initialData?.noticeAlreadySent ?? false);
  const [agreementExists, setAgreementExists] = useState(initialData?.agreementExists ?? true);
  const [documentText, setDocumentText] = useState(initialData?.documentText || '');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Domain specific states
  const [domainSpecific, setDomainSpecific] = useState<Record<string, any>>(
    initialData?.domainSpecificAnswers || {}
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setDocumentText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeTitle.trim() || !disputeDescription.trim()) {
      return;
    }

    const payload: CaseIntakePayload = {
      domainId,
      stateOfIncident,
      disputeTitle: disputeTitle.trim(),
      disputeDescription: disputeDescription.trim(),
      complainantRole: complainantRole.trim(),
      oppositePartyName: oppositePartyName.trim() || 'Opposite Party',
      oppositePartyType: oppositePartyType.trim(),
      disputedAmountINR: Number(disputedAmountINR) || 0,
      incidentDate,
      noticeAlreadySent,
      agreementExists,
      documentText: documentText.trim() || undefined,
      domainSpecificAnswers: domainSpecific
    };

    onSubmit(payload);
  };

  // Pecuniary estimation helper for user guidance
  const getPecuniaryPreview = () => {
    const amt = Number(disputedAmountINR) || 0;
    if (domainId === 'consumer') {
      if (amt <= 5000000) {
        return {
          forum: 'District Consumer Commission (DCDRC)',
          notes: 'Up to ₹50 Lakhs. Filed locally in your home district or via E-Daakhil.'
        };
      } else if (amt <= 20000000) {
        return {
          forum: `State Consumer Commission (SCDRC - ${stateOfIncident})`,
          notes: 'Claims between ₹50 Lakhs and ₹2 Crore.'
        };
      } else {
        return {
          forum: 'National Consumer Commission (NCDRC, New Delhi)',
          notes: 'Claims exceeding ₹2 Crore.'
        };
      }
    } else if (domainId === 'tenancy') {
      return {
        forum: `Rent Authority / Rent Court (${stateOfIncident})`,
        notes: 'Governed by local Tenancy Rules and Transfer of Property Act Sec 108.'
      };
    } else if (domainId === 'employment') {
      return {
        forum: 'Labour Conciliation Officer / Controlling Authority (Gratuity)',
        notes: 'Under Payment of Gratuity Act 1972 & Industrial Disputes Act 1947.'
      };
    } else {
      return {
        forum: amt > 300000 ? 'Commercial Court / Division' : 'Civil Judge Senior Division',
        notes: 'Under Indian Contract Act 1872 / Commercial Courts Act 2015.'
      };
    }
  };

  const pecuniaryInfo = getPecuniaryPreview();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Domain Selection</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Step 2 of 4:</span>
          <span className="text-xs font-bold text-amber-400">Structured Case Intake</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Domain Banner */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${domainMeta.colorScheme.badge} mb-2 inline-block`}>
                {domainMeta.shortTitle} Dispute Intake
              </span>
              <h2 className="text-2xl font-bold text-white font-serif-legal">
                {domainMeta.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {domainMeta.tagline}
              </p>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-slate-400 block">GOVERNING ACTS</span>
              <span className="text-xs font-semibold text-slate-200">
                {domainMeta.primaryActs[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Basic Case & Jurisdiction Info */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>1. Jurisdiction & Dispute Overview</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Indian State / Union Territory of Incident *
              </label>
              <select
                value={stateOfIncident}
                onChange={(e) => setStateOfIncident(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {INDIAN_STATES_AND_UTS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Required for state tenancy acts, court fees, and local territorial forum.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Approximate Date of Incident / Cause of Action *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Used to verify statutory limitation period (e.g. 2 years under CPA 2019).
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Dispute Title / Subject Matter *
            </label>
            <input
              type="text"
              required
              value={disputeTitle}
              onChange={(e) => setDisputeTitle(e.target.value)}
              placeholder="e.g. Unlawful retention of security deposit after 30-day notice"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Factual Narrative (Detailed Chronology) *
            </label>
            <textarea
              required
              rows={4}
              value={disputeDescription}
              onChange={(e) => setDisputeDescription(e.target.value)}
              placeholder="State the facts chronologically: when the transaction occurred, agreed terms, what went wrong, communication attempts, and the current refusal..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Parties & Financial Quantum */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>2. Parties & Disputed Value</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Legal Role / Status *
              </label>
              <input
                type="text"
                value={complainantRole}
                onChange={(e) => setComplainantRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Opposite Party / Entity Name *
              </label>
              <input
                type="text"
                required
                value={oppositePartyName}
                onChange={(e) => setOppositePartyName(e.target.value)}
                placeholder="e.g. Apex Electronics / Mr. Sharma / TechCorp Pvt Ltd"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Disputed Quantum / Financial Value (INR ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={disputedAmountINR || ''}
                  onChange={(e) => setDisputedAmountINR(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 75000"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Live Pecuniary Jurisdiction Preview */}
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                Estimated Pecuniary Forum:
              </span>
              <p className="text-xs font-bold text-slate-100">
                {pecuniaryInfo.forum}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {pecuniaryInfo.notes}
              </span>
            </div>
          </div>

          {/* Checkbox status options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3.5 bg-slate-800/40 hover:bg-slate-800/70 rounded-xl border border-slate-700/60 cursor-pointer transition">
              <input
                type="checkbox"
                checked={agreementExists}
                onChange={(e) => setAgreementExists(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500/20"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-200 block">Written Agreement / Invoice Exists</span>
                <span className="text-slate-400 text-[11px]">Lease deed, contract, invoice, appointment letter</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-slate-800/40 hover:bg-slate-800/70 rounded-xl border border-slate-700/60 cursor-pointer transition">
              <input
                type="checkbox"
                checked={noticeAlreadySent}
                onChange={(e) => setNoticeAlreadySent(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500/20"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-200 block">Prior Written Legal Notice Sent</span>
                <span className="text-slate-400 text-[11px]">Formal notice served via email or registered post</span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Evidence & Document Analysis Upload */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>3. Document Intelligence & Text Analysis</span>
            </h3>
            <span className="text-[11px] text-slate-400">Optional but recommended</span>
          </div>

          <p className="text-xs text-slate-400">
            Paste relevant clauses (e.g. non-compete, security deposit refund, termination, arbitration clause) or upload agreement text for clause extraction.
          </p>

          <div className="border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-xl p-4 text-center bg-slate-800/30 transition">
            <input
              type="file"
              id="file-upload"
              accept=".txt,.doc,.docx,.pdf,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-slate-400" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-amber-400 hover:underline">Click to upload document</span> or drag text file here
              </div>
              {uploadedFileName && (
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Uploaded: {uploadedFileName}
                </span>
              )}
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Or Paste Agreement / Notice / Invoice Text Here:
            </label>
            <textarea
              rows={5}
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Paste contract excerpts, warranty terms, email exchanges, or lease clauses for AI verification..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 font-mono leading-relaxed focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <motion.button
            type="button"
            onClick={onBack}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-300 transition cursor-pointer"
          >
            Cancel & Back
          </motion.button>

          <motion.button
            type="submit"
            disabled={isAnalyzing}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Legal Intelligence Model...</span>
              </>
            ) : (
              <>
                <span>Generate Legal Intelligence Report</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};
