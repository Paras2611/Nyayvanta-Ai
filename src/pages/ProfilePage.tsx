import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, Key, LogOut, CheckCircle2 } from 'lucide-react';
import { fetchProfile, updateProfile } from '../services/api';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>({
    full_name: 'Nyayavanta Legal Researcher',
    email: 'guest@nyayavanta.in',
    role: 'advocate'
  });
  const [fullName, setFullName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfile(data);
        setFullName(data.full_name || '');
      })
      .catch(console.error);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile({ full_name: fullName });
      setProfile(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="text-indigo-600" size={24} />
          <span>User Profile & Credentials</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Manage your advocate/researcher credentials and authentication preferences.
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 shadow-sm">
        {/* Avatar & Status Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-md">
            {profile.full_name?.slice(0, 2).toUpperCase() || 'NY'}
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              {profile.full_name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Mail size={12} />
                <span>{profile.email}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Legal Name / Advocate Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Platform Role
            </label>
            <input
              type="text"
              value={profile.role || 'Legal Researcher'}
              disabled
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 capitalize cursor-not-allowed"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('nyayavanta_token');
                navigate('/login');
              }}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:underline font-semibold"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
