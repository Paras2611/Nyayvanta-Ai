import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Printer,
  Download,
  FileText,
  Mail,
  Send,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { LegalAnalysisResponse } from '../types/legal';

interface LegalNoticeDraftModalProps {
  analysis: LegalAnalysisResponse;
  onClose: () => void;
}

export const LegalNoticeDraftModal: React.FC<LegalNoticeDraftModalProps> = ({
  analysis,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [cureDays, setCureDays] = useState(15);
  const [senderName, setSenderName] = useState('[Your Legal Name]');
  const [senderAddress, setSenderAddress] = useState('[Your Complete Address & Phone Number]');

  const notice = analysis.noticeTemplateDraft;
  const oppositeParty = analysis.extractedFacts.find((f) => f.label.includes('Opposite Party'))?.value || 'Opposite Party';
  const disputedAmount = analysis.extractedFacts.find((f) => f.category === 'FINANCIALS')?.value || 'Disputed Amount';

  const fullFormattedNotice = `REGISTERED POST WITH ACKNOWLEDGEMENT DUE (RPAD) & REGISTERED EMAIL
WITHOUT PREJUDICE

Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

TO,
${oppositeParty}
Address: [Insert Complete Registered / Business Address of Opposite Party]

FROM,
${senderName}
Address: ${senderAddress}

SUBJECT: PRE-LITIGATION LEGAL NOTICE UNDER INDIAN LAW FOR ${notice?.subject || 'REDRESSAL OF GRIEVANCE AND RECOVERY OF CONSIDERATION'}

Sir / Madam,

Under instructions from and on behalf of my client / the undersigned Complainant, I hereby serve upon you this formal Pre-Litigation Legal Notice as follows:

1. FACTUAL CHRONOLOGY:
${notice?.factsChronology.map((fact, idx) => `   (${String.fromCharCode(97 + idx)}) ${fact}`).join('\n') || '   (a) That a valid relationship and consideration occurred between the parties.'}

2. STATUTORY VIOLATIONS & BREACH OF LAW:
   That your aforesaid unilateral and arbitrary actions constitute a direct statutory violation under:
${notice?.legalViolationsCited.map((violation) => `   - ${violation}`).join('\n') || '   - Applicable Indian Civil and Commercial Statutes'}

3. SUMMARY OF DEMANDS:
   In view of the above undisputed facts, you are hereby called upon to comply with the following demands within FIFTEEN (${cureDays}) DAYS from the receipt of this Notice:
${notice?.demandsList.map((demand, idx) => `   ${idx + 1}. ${demand}`).join('\n') || `   1. Release the full consideration sum of ${disputedAmount}.`}

4. STATUTORY CONSEQUENCES & WARNING:
   ${notice?.statutoryWarning || 'PLEASE TAKE NOTE that if you fail to comply with the requisitions within the stipulated cure period, appropriate legal proceedings will be instituted before the competent Forum / Commission / Court entirely at your risk, cost, and legal consequences.'}

Yours faithfully,

_____________________________
[${senderName}]
Complainant / Authorized Signatory
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullFormattedNotice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Legal Notice - LawLink</title>
            <style>
              body { font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.6; margin: 40px; color: #000; }
              pre { font-family: inherit; white-space: pre-wrap; word-wrap: break-word; }
            </style>
          </head>
          <body>
            <pre>${fullFormattedNotice}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white font-serif-legal">
                Pre-Litigation Legal Notice Studio
              </h3>
              <p className="text-xs text-slate-400">
                Tailored for Indian statutory standards & RPAD delivery protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Toolbar */}
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Your Full Name:</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Your Contact & Address:</label>
            <input
              type="text"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Cure Period Window (Days):</label>
            <select
              value={cureDays}
              onChange={(e) => setCureDays(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
            >
              <option value={15}>15 Days (Standard Indian Legal Practice)</option>
              <option value={7}>7 Days (Urgent Settlement / Dues)</option>
              <option value={30}>30 Days (Statutory Eviction / Lease Notice)</option>
            </select>
          </div>
        </div>

        {/* Notice Preview */}
        <div className="p-6 max-h-[55vh] overflow-y-auto bg-slate-950/90 font-mono text-xs text-slate-200 leading-relaxed border-b border-slate-800">
          <pre className="whitespace-pre-wrap font-mono">{fullFormattedNotice}</pre>
        </div>

        {/* Delivery Guidelines & Action Bar */}
        <div className="p-5 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Crucial:</strong> Always send via Registered Post AD (RPAD) and keep the postal receipt & tracking report as court evidence.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied Notice!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Full Notice</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
