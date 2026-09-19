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
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="text-indigo-600" size={24} />
          <span>{t('settings.title', 'Settings & Preferences')}</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Configure appearance, multi-lingual legal terminology, notification alerts, and retention policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Appearance Section */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sun size={15} className="text-amber-500" />
            <span>{t('settings.appearance', 'Appearance & Theme')}</span>
          </h2>
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { id: 'light', label: t('settings.theme_light', 'Light Theme') },
              { id: 'dark', label: t('settings.theme_dark', 'Dark Theme') },
              { id: 'system', label: t('settings.theme_system', 'System Default') }
            ].map((th) => (
              <label
                key={th.id}
                className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
                  theme === th.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>{th.label}</span>
                <input
                  type="radio"
                  name="theme"
                  value={th.id}
                  checked={theme === th.id}
                  onChange={() => handleThemeChange(th.id as any)}
                  className="text-indigo-600"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Language Section */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Globe size={15} className="text-indigo-600" />
            <span>{t('settings.language', 'Language Preference')}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t('settings.language_label', 'Select interface language for legal summaries and navigation:')}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: 'en', label: 'English (Central Acts)' },
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'mr', label: 'मराठी (Marathi)' }
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                  i18n.language === lang.code
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications & Privacy */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Bell size={15} className="text-emerald-500" />
            <span>{t('settings.notifications', 'Notifications & Alerts')}</span>
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              {t('settings.notifications_label', 'Enable research notifications and statutory updates')}
            </span>
          </label>
        </div>

        {/* Retention Policy */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Shield size={15} className="text-blue-600" />
            <span>{t('settings.privacy', 'Privacy & Retention')}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t('settings.privacy_label', 'Manage conversation history retention and uploaded file purging')}
          </p>
          <select
            value={historyRetention}
            onChange={(e) => setHistoryRetention(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium"
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
            className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
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
