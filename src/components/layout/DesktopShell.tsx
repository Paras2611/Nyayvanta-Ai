import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Scale,
  LayoutDashboard,
  MessageSquare,
  Search,
  Briefcase,
  FileText,
  Bookmark,
  History,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
  AlertTriangle
} from 'lucide-react';

interface DesktopShellProps {
  children?: React.ReactNode;
  evidenceContent?: React.ReactNode;
  showEvidencePanel?: boolean;
}

export const DesktopShell: React.FC<DesktopShellProps> = ({
  children,
  evidenceContent,
  showEvidencePanel = false,
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { label: t('nav.dashboard', 'Dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('nav.ask', 'Ask Nyayavanta'), path: '/chat', icon: MessageSquare },
    { label: t('nav.legal_search', 'Legal Search'), path: '/legal-search', icon: Search },
    { label: t('nav.case_search', 'Case Search'), path: '/case-search', icon: Briefcase },
    { label: t('nav.documents', 'Documents'), path: '/documents', icon: FileText },
    { label: t('nav.saved', 'Saved Research'), path: '/saved', icon: Bookmark },
    { label: t('nav.history', 'History'), path: '/history', icon: History },
  ];

  const categories = [
    { name: 'Criminal Law', count: 'Bare Act', path: '/legal-search?cat=criminal' },
    { name: 'Civil Law', count: 'Bare Act', path: '/legal-search?cat=civil' },
    { name: 'Property Law', count: 'TPA 1882', path: '/legal-search?cat=property' },
    { name: 'Family Law', count: 'Bare Act', path: '/legal-search?cat=family' },
    { name: 'Contract Law', count: 'ICA 1872', path: '/legal-search?cat=contract' },
    { name: 'Consumer Law', count: 'CPA 2019', path: '/legal-search?cat=consumer' },
    { name: 'Cyber Law', count: 'IT Act', path: '/legal-search?cat=cyber' },
    { name: 'Constitutional Law', count: 'Constitution', path: '/legal-search?cat=constitutional' },
    { name: 'Labour Law', count: 'IDA / PGA', path: '/legal-search?cat=labour' },
    { name: 'Corporate Law', count: 'Companies Act', path: '/legal-search?cat=corporate' },
  ];

  return (
    <div className={`min-h-screen flex flex-col bg-[#F7F8FA] dark:bg-[#080D18] text-[#111827] dark:text-[#F9FAFB]`}>
      {/* Persistent Legal Disclaimer Top Bar */}
      <div className="bg-[#172554] text-slate-200 text-xs px-4 py-1.5 flex items-center justify-between border-b border-blue-900/40">
        <div className="flex items-center gap-2 max-w-5xl">
          <Shield size={14} className="text-amber-400 shrink-0" />
          <span className="truncate">
            <strong>Nyayavanta Legal Assistant:</strong> Informational and research assistance only. Not legal advice. Never guarantees legal outcomes.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-[#0B1220] border border-blue-900/60 rounded px-1.5 py-0.5 text-xs text-slate-300"
          >
            <option value="en">EN (English)</option>
            <option value="hi">HI (हिंदी)</option>
            <option value="mr">MR (मराठी)</option>
          </select>
          <button
            onClick={toggleTheme}
            className="p-1 text-slate-300 hover:text-white rounded"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Desktop Sidebar (Left) */}
        <aside className="w-64 bg-[#0B1220] text-slate-300 hidden md:flex flex-col justify-between shrink-0 border-r border-slate-800">
          <div>
            {/* Logo */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold shadow-md">
                <Scale size={20} />
              </div>
              <div>
                <h1 className="font-bold text-white tracking-wide text-base leading-tight">
                  NYAYAVANTA
                </h1>
                <p className="text-[11px] text-indigo-300 font-medium">Indian Legal Assistant</p>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#172554] text-white border-l-4 border-[#4F46E5]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-indigo-400' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Legal Domains List */}
            <div className="px-4 pt-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Legal Domains
              </p>
              <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Settings / Profile */}
          <div className="p-3 border-t border-slate-800 space-y-1 text-sm">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              <User size={16} />
              <span>{t('nav.profile', 'Profile')}</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              <Settings size={16} />
              <span>{t('nav.settings', 'Settings')}</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-3 px-3 py-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
            >
              <LogOut size={16} />
              <span>{t('nav.logout', 'Logout')}</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-3 bg-[#0B1220] text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileDrawerOpen(true)} className="p-1 text-slate-300">
              <Menu size={22} />
            </button>
            <Scale size={18} className="text-indigo-400" />
            <span className="font-bold text-sm tracking-wide">NYAYAVANTA</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/chat" className="text-xs bg-indigo-600 px-2 py-1 rounded font-medium">
              Ask AI
            </Link>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/60 md:hidden">
            <div className="w-72 bg-[#0B1220] text-slate-300 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Scale size={20} className="text-indigo-400" />
                    <span className="font-bold text-white">NYAYAVANTA</span>
                  </div>
                  <button onClick={() => setMobileDrawerOpen(false)} className="text-slate-400">
                    <X size={20} />
                  </button>
                </div>
                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded text-sm text-slate-300 hover:bg-slate-800"
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="pt-4 border-t border-slate-800 text-sm space-y-1">
                <Link
                  to="/settings"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 rounded text-slate-400 hover:text-white"
                >
                  Settings
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 rounded text-rose-400"
                >
                  Logout
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)}></div>
          </div>
        )}

        {/* Main Workspace (Center) */}
        <main className="flex-1 overflow-y-auto bg-[#F7F8FA] dark:bg-[#080D18] flex flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children || <Outlet />}
          </div>
        </main>

        {/* Context / Evidence Panel (Right) - Collapsible or conditionally shown */}
        {showEvidencePanel && evidenceContent && (
          <aside className="w-80 lg:w-96 bg-white dark:bg-[#111827] border-l border-[#E2E8F0] dark:border-[#243047] hidden xl:flex flex-col shrink-0 overflow-y-auto">
            {evidenceContent}
          </aside>
        )}
      </div>
    </div>
  );
};
