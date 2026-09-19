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
        <h1 className="text-xl md:text-2xl font-black text-[#1E1B2E] dark:text-white flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#684EC9] dark:text-purple-300 flex items-center justify-center shrink-0">
            <User size={20} />
          </div>
          <span>User Profile & Credentials</span>
        </h1>
        <p className="text-xs md:text-sm text-[#544E6D] dark:text-slate-400">
          Manage your advocate/researcher credentials and authentication preferences.
        </p>
      </div>

      <div className="p-6 sm:p-8 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
        {/* Avatar & Status Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-[#E8E3F5] dark:border-slate-800 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C66DC] to-[#573EAE] text-white flex items-center justify-center text-xl font-black shadow-md shrink-0">
            {profile.full_name?.slice(0, 2).toUpperCase() || 'NY'}
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-base sm:text-lg text-[#1E1B2E] dark:text-white">
              {profile.full_name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs text-[#544E6D] dark:text-slate-400 flex items-center gap-1">
                <Mail size={13} className="text-[#684EC9]" />
                <span>{profile.email}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E1B2E] dark:text-slate-300">
              Full Legal Name / Advocate Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#E8E3F5] dark:border-slate-700 bg-[#F8F7FC] dark:bg-slate-900 text-xs font-medium text-[#1E1B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#684EC9]/20 focus:border-[#684EC9]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E1B2E] dark:text-slate-300">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full p-3 rounded-2xl border border-[#E8E3F5] dark:border-slate-800 bg-[#F4F2FA] dark:bg-slate-800 text-xs text-[#7E779C] cursor-not-allowed font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E1B2E] dark:text-slate-300">
              Platform Role
            </label>
            <input
              type="text"
              value={profile.role || 'Legal Researcher'}
              disabled
              className="w-full p-3 rounded-2xl border border-[#E8E3F5] dark:border-slate-800 bg-[#F4F2FA] dark:bg-slate-800 text-xs text-[#7E779C] capitalize cursor-not-allowed font-medium"
            />
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-6 py-3 bg-[#684EC9] hover:bg-[#573EB0] text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
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
              className="flex items-center justify-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:underline font-bold py-2"
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
