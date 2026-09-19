import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Shield, Bell, Moon, Sun, Globe, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [historyRetention, setHistoryRetention] = useState('90');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-black text-[#1E1B2E] dark:text-white flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#684EC9] dark:text-purple-300 flex items-center justify-center shrink-0">
            <Settings size={20} />
          </div>
          <span>{t('settings.title')}</span>
        </h1>
        <p className="text-xs md:text-sm text-[#544E6D] dark:text-slate-400">
          {t('settings.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Appearance Section */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
          <h2 className="text-xs font-bold text-[#573EAE] dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Sun size={16} className="text-amber-500" />
            <span>{t('settings.appearance')}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              { id: 'light', label: t('settings.theme_light'), icon: Sun },
              { id: 'dark', label: t('settings.theme_dark'), icon: Moon }
            ].map((th) => {
              const IconComp = th.icon;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id as 'light' | 'dark')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold cursor-pointer flex items-center justify-between transition-all press-feedback ${
                    theme === th.id
                      ? 'bg-[#EDE9FE] dark:bg-purple-950/40 border-[#684EC9] text-[#46328D] dark:text-purple-200 shadow-xs'
                      : 'bg-[#F8F7FC] dark:bg-slate-900/40 border-[#E8E3F5] dark:border-slate-700 text-[#544E6D] dark:text-slate-300 hover:bg-[#EDE9FE]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComp size={15} />
                    <span>{th.label}</span>
                  </div>
                  {theme === th.id && <CheckCircle2 size={16} className="text-[#684EC9]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Section */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
          <h2 className="text-xs font-bold text-[#573EAE] dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Globe size={16} className="text-[#684EC9]" />
            <span>{t('settings.language')}</span>
          </h2>
          <p className="text-xs text-[#544E6D] dark:text-slate-400">
            {t('settings.language_desc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'mr', label: 'मराठी (Marathi)' }
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer press-feedback ${
                  i18n.language.startsWith(lang.code)
                    ? 'bg-[#684EC9] text-white border-[#684EC9] shadow-xs'
                    : 'bg-[#F8F7FC] dark:bg-slate-900 border-[#E8E3F5] dark:border-slate-700 text-[#544E6D] dark:text-slate-300 hover:bg-[#EDE9FE]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications & Privacy */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <h2 className="text-xs font-bold text-[#573EAE] dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Bell size={16} className="text-emerald-500" />
            <span>{t('settings.notifications')}</span>
          </h2>
          <p className="text-xs text-[#544E6D] dark:text-slate-400">
            {t('settings.notifications_desc')}
          </p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 accent-[#684EC9] rounded"
            />
            <span className="text-xs font-semibold text-[#1E1B2E] dark:text-slate-300">
              {t('settings.notifications')}
            </span>
          </label>
        </div>

        {/* Retention Policy */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
          <h2 className="text-xs font-bold text-[#573EAE] dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Shield size={16} className="text-[#684EC9]" />
            <span>{t('settings.privacy')}</span>
          </h2>
          <p className="text-xs text-[#544E6D] dark:text-slate-400">
            {t('settings.privacy_desc')}
          </p>
          <select
            value={historyRetention}
            onChange={(e) => setHistoryRetention(e.target.value)}
            className="w-full sm:w-auto p-3 rounded-2xl border border-[#E8E3F5] dark:border-slate-700 bg-[#F8F7FC] dark:bg-[#111827] text-xs font-bold text-[#1E1B2E] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#684EC9]/20"
          >
            <option value="30">Retain history for 30 days</option>
            <option value="90">Retain history for 90 days (Recommended)</option>
            <option value="365">Retain history for 1 year</option>
            <option value="never">Do not store history (Zero-retention mode)</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-6 py-3 bg-[#684EC9] hover:bg-[#573EB0] text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer transition-colors min-h-[44px] press-feedback w-full sm:w-auto"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-300" />
                <span>{t('settings.saved')}</span>
              </>
            ) : (
              <span>{t('settings.save')}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
