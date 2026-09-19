import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#F8F7FC] dark:bg-[#0B0914] border-t border-[#E8E3F5] dark:border-[#251F3D] py-5 text-xs text-[#544E6D] dark:text-[#A59FC2] mt-auto">
      <div className="w-full space-y-3 px-2 sm:px-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161224] border border-[#DDD6FE] dark:border-[#382F5E] rounded-2xl flex flex-col sm:flex-row items-start gap-3 shadow-xs">
          <Scale className="w-5 h-5 text-[#684EC9] dark:text-[#A78BFA] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#1E1B2E] dark:text-white text-xs sm:text-sm">
              {t('app.disclaimer_prefix', 'Nyayavanta Indian Legal Intelligence')}
            </h4>
            <p className="text-[#544E6D] dark:text-[#A59FC2] leading-relaxed text-xs">
              {t('app.disclaimer_full', 'Nyayavanta is an AI-assisted legal research and information platform, NOT a replacement for an advocate enrolled with the Bar Council of India. Information provided does not create an attorney-client relationship under the Advocates Act, 1961. Always consult a qualified advocate before instituting formal legal proceedings.')}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#7E779C] pt-2 px-2">
          <div>
            <span>Nyayavanta © 2026 • {t('app.core_principle', 'Evidence-First Indian Legal Intelligence')}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span>{t('dashboard.supported_domains', 'Supported')}: {t('chat.domains.consumer', 'Consumer')} • {t('chat.domains.tenancy', 'Tenancy')} • {t('chat.domains.employment', 'Employment')} • {t('chat.domains.contract', 'Contract')}</span>
            <span className="font-bold text-[#684EC9] dark:text-[#A78BFA]">National Legal Aid: 15100</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
