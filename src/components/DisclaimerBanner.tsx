import React from 'react';
import { AlertCircle, Scale, ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <footer className="bg-[#F8F7FC] border-t border-[#E8E3F5] py-5 text-xs text-[#544E6D] mt-auto">
      <div className="w-full space-y-3 px-2 sm:px-4">
        <div className="p-4 sm:p-5 bg-white border border-[#DDD6FE] rounded-2xl flex flex-col sm:flex-row items-start gap-3 shadow-xs">
          <Scale className="w-5 h-5 text-[#684EC9] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#1E1B2E] text-xs sm:text-sm">
              Statutory Information Disclaimer & Bar Council of India Compliance
            </h4>
            <p className="text-[#544E6D] leading-relaxed text-xs">
              Nyayavanta is an AI-assisted legal research and information platform, <strong className="text-[#1E1B2E]">NOT a replacement for an advocate enrolled with the Bar Council of India</strong>. Information provided does not create an attorney-client relationship under the Advocates Act, 1961. Always consult a qualified advocate before instituting formal legal proceedings.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#7E779C] pt-2 px-2">
          <div>
            <span>Nyayavanta © 2026 • Evidence-First Indian Legal Intelligence</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span>Supported: Consumer • Tenancy • Employment • Contract</span>
            <span className="font-bold text-[#684EC9]">National Legal Aid: 15100</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
