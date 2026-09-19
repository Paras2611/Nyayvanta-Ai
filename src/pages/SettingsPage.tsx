import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Shield, Bell, Moon, Sun, Globe, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [notifications, setNotifications] = useState(true);
  const [historyRetention, setHistoryRetention] = useState('90');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
          <span>{t('settings.title', 'Settings & Preferences')}</span>
        </h1>
        <p className="text-xs md:text-sm text-[#544E6D] dark:text-slate-400">
          Configure appearance, multi-lingual legal terminology, notification alerts, and retention policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Appearance Section */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
          <h2 className="text-xs font-bold text-[#573EAE] dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Sun size={16} className="text-amber-500" />
            <span>{t('settings.appearance', 'Appearance & Theme')}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { id: 'light', label: t('settings.theme_light', 'Light Lavender (Default)') },
              { id: 'dark', label: t('settings.theme_dark', 'Dark Theme') },
              { id: 'system', label: t('settings.theme_system', 'System Default') }
            ].map((th) => (
              <label
                key={th.id}
                className={`p-3.5 rounded-2xl border text-xs font-bold cursor-pointer flex items-center justify-between transition-all ${
                  theme === th.id
                    ? 'bg-[#EDE9FE] dark:bg-purple-950/40 border-[#684EC9] text-[#46328D] dark:text-purple-200 shadow-xs'
                    : 'bg-[#F8F7FC] dark:bg-slate-900/40 border-[#E8E3F5] dark:border-slate-700 text-[#544E6D] dark:text-slate-300 hover:bg-[#EDE9FE]'
                }`}
              >
                <span>{th.label}</span>
                <input
                  type="radio"
                  name="theme"
                  value={th.id}
                  checked={theme === th.id}
                  onChange={() => handleThemeChange(th.id as any)}
                  className="accent-[#684EC9]"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Language Section */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
          <h2 className="text-xs font-bold text-[#573EAE] dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Globe size={16} className="text-[#684EC9]" />
            <span>{t('settings.language', 'Language Preference')}</span>
          </h2>
          <p className="text-xs text-[#544E6D] dark:text-slate-400">
            {t('settings.language_label', 'Select interface language for legal summaries and navigation:')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { code: 'en', label: 'English (Central Acts)' },
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'mr', label: 'मराठी (Marathi)' }
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  i18n.language === lang.code
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
            <span>{t('settings.notifications', 'Notifications & Alerts')}</span>
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 accent-[#684EC9] rounded"
            />
            <span className="text-xs font-semibold text-[#1E1B2E] dark:text-slate-300">
              {t('settings.notifications_label', 'Enable research notifications and statutory updates')}
            </span>
          </label>
        </div>

        {/* Retention Policy */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
          <h2 className="text-xs font-bold text-[#573EAE] dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Shield size={16} className="text-[#684EC9]" />
            <span>{t('settings.privacy', 'Privacy & Retention')}</span>
          </h2>
          <p className="text-xs text-[#544E6D] dark:text-slate-400">
            {t('settings.privacy_label', 'Manage conversation history retention and uploaded file purging')}
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
            className="flex items-center gap-1.5 px-6 py-3 bg-[#684EC9] hover:bg-[#573EB0] text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer transition-colors min-h-[44px]"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-300" />
                <span>Settings Applied!</span>
              </>
            ) : (
              <span>{t('settings.save', 'Save Changes')}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
