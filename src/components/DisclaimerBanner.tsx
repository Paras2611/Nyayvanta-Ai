import React from 'react';
import { AlertCircle, Scale, ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 text-xs text-slate-400">
      <div className="w-full space-y-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-200">
              Statutory Information Disclaimer & Bar Council of India Compliance
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              LawLink is an AI-assisted legal information and research system, <strong>NOT a replacement for a qualified legal professional</strong> or advocate enrolled with the Bar Council of India. Information generated herein does not constitute formal attorney-client advice or legal solicitation under the Advocates Act, 1961. Always consult an enrolled advocate or qualified legal practitioner before instituting formal legal proceedings before any Court, Commission, or Tribunal in India.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-900 w-full">
          <div>
            <span>LawLink © 2025 • Strict 4-Domain Evidence-First Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Supported: Consumer • Tenancy • Employment • Contract</span>
            <span>National Legal Services Helpline: 15100</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
