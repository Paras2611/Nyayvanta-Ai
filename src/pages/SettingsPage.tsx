import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
      
      <section aria-labelledby="profile-heading">
        <h2 id="profile-heading" className="text-xl font-semibold mb-4">{t('settings.profile')}</h2>
        <Card className="p-6">
          <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" id="name" className="w-full p-2 border rounded" placeholder="Enter your name" />
        </Card>
      </section>

      <section aria-labelledby="appearance-heading">
        <h2 id="appearance-heading" className="text-xl font-semibold mb-4">{t('settings.appearance')}</h2>
        <Card className="p-6 space-y-4">
          <fieldset>
            <legend className="text-sm font-medium mb-2">Theme Selection</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="radio" name="theme" value="light" defaultChecked /> Light</label>
              <label className="flex items-center gap-2"><input type="radio" name="theme" value="dark" /> Dark</label>
              <label className="flex items-center gap-2"><input type="radio" name="theme" value="system" /> System</label>
            </div>
          </fieldset>
        </Card>
      </section>

      <section aria-labelledby="language-heading">
        <h2 id="language-heading" className="text-xl font-semibold mb-4">{t('settings.language')}</h2>
        <Card className="p-6">
          <label htmlFor="language" className="block text-sm font-medium mb-1">{t('settings.language_label')}</label>
          <select id="language" className="w-full p-2 border rounded">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
        </Card>
      </section>

      <section aria-labelledby="notifications-heading">
        <h2 id="notifications-heading" className="text-xl font-semibold mb-4">{t('settings.notifications')}</h2>
        <Card className="p-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm font-medium">{t('settings.notifications_label')}</span>
          </label>
        </Card>
      </section>

      <section aria-labelledby="privacy-heading">
        <h2 id="privacy-heading" className="text-xl font-semibold mb-4">{t('settings.privacy')}</h2>
        <Card className="p-6">
          <p className="text-sm text-gray-600">{t('settings.privacy_label')}</p>
        </Card>
      </section>

      <section aria-labelledby="security-heading">
        <h2 id="security-heading" className="text-xl font-semibold mb-4">{t('settings.security')}</h2>
        <Card className="p-6">
          <p className="text-sm text-gray-600">{t('settings.security_label')}</p>
        </Card>
      </section>

      <button className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {t('settings.save')}
      </button>
    </div>
  );
};
