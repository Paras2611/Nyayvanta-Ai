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
  LogOut,
  Shield,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { DisclaimerBanner } from '../DisclaimerBanner';

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
  const isChatPage = location.pathname.startsWith('/chat');
  
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
    <div className="min-h-screen flex flex-col bg-[#F8F7FC] text-[#1E1B2E]">
      {/* 1. Persistent Legal Disclaimer Top Bar - Light Lavender Aesthetic */}
      <header className="bg-[#EDE9FE] text-[#46328D] text-xs px-3 sm:px-4 py-2 flex items-center justify-between border-b border-[#D8D1EE] shrink-0 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2 max-w-4xl min-w-0">
          <Shield size={14} className="text-[#684EC9] shrink-0" />
          <p className="truncate text-[11px] sm:text-xs">
            <strong className="font-semibold">Nyayavanta Indian Legal Intelligence:</strong> Informational and research assistance only. Not formal legal advice.
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-[#D8D1EE]">
            <Globe size={12} className="text-[#684EC9]" />
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              aria-label="Language selection"
              className="bg-transparent text-xs text-[#46328D] font-medium focus:outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
            </select>
          </div>
        </div>
      </header>

      {/* 2. Main App Shell */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Desktop Sidebar (Left) */}
        <aside className="w-60 xl:w-64 bg-[#F8F7FC] text-[#1E1B2E] hidden md:flex flex-col justify-between shrink-0 border-r border-[#E8E3F5] shadow-xs">
          <div className="flex flex-col overflow-y-auto">
            {/* Logo Banner */}
            <Link to="/dashboard" className="p-4 border-b border-[#E8E3F5] flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C66DC] to-[#573EAE] flex items-center justify-center text-white font-black shadow-sm">
                <Scale size={19} />
              </div>
              <div>
                <h1 className="font-extrabold text-[#241C48] tracking-wide text-sm leading-tight">
                  NYAYAVANTA-AI
                </h1>
                <p className="text-[11px] text-[#684EC9] font-medium">Indian Legal Assistant</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-white text-[#573EAE] shadow-xs border border-[#E0D9F7]'
                        : 'text-[#544E6D] hover:bg-[#EBE6F8] hover:text-[#241C48]'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-[#684EC9]' : 'text-[#7E779C]'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Legal Domains List */}
            <div className="px-4 pt-3 pb-2 border-t border-[#E8E3F5]">
              <p className="text-[10px] font-bold text-[#7E779C] uppercase tracking-wider mb-2">
                Legal Domains
              </p>
              <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#EBE6F8] text-[#544E6D] hover:text-[#241C48] text-xs transition-colors"
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] bg-[#E8E3F5] text-[#573EAE] font-mono px-1.5 py-0.5 rounded shrink-0">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Settings / Profile */}
          <div className="p-3 border-t border-[#E8E3F5] space-y-1 text-xs font-medium">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#544E6D] hover:bg-[#EBE6F8] hover:text-[#241C48]"
            >
              <User size={15} />
              <span>{t('nav.profile', 'Profile')}</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#544E6D] hover:bg-[#EBE6F8] hover:text-[#241C48]"
            >
              <Settings size={15} />
              <span>{t('nav.settings', 'Settings')}</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={15} />
              <span>{t('nav.logout', 'Logout')}</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-3 bg-[#F4F2FA] text-[#1E1B2E] border-b border-[#E8E3F5] w-full shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-1.5 rounded-lg bg-white border border-[#E0D9F7] text-[#573EAE]"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-[#684EC9] flex items-center justify-center text-white">
                <Scale size={14} />
              </div>
              <span className="font-extrabold text-xs tracking-wide text-[#241C48]">NYAYAVANTA-AI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to="/chat"
              className="text-xs bg-[#684EC9] text-white px-3 py-1.5 rounded-lg font-bold shadow-xs hover:bg-[#573EAE] transition-colors"
            >
              Ask AI
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs md:hidden animate-fade-in">
            <div className="w-72 bg-[#F4F2FA] text-[#1E1B2E] p-4 flex flex-col justify-between shadow-xl h-full">
              <div className="overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F5]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#684EC9] flex items-center justify-center text-white">
                      <Scale size={16} />
                    </div>
                    <span className="font-extrabold text-sm text-[#241C48]">NYAYAVANTA-AI</span>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        location.pathname.startsWith(item.path)
                          ? 'bg-white text-[#684EC9] shadow-xs'
                          : 'text-[#544E6D] hover:bg-[#EBE6F8]'
                      }`}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#E8E3F5] space-y-1 text-xs">
                <Link
                  to="/settings"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 rounded-lg text-[#544E6D] hover:bg-[#EBE6F8]"
                >
                  Settings
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 rounded-lg text-rose-600 font-semibold"
                >
                  Logout
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
          </div>
        )}

        {/* 3. Main Workspace (Center) */}
        <main className="flex-1 overflow-y-auto bg-[#F8F7FC] flex flex-col min-w-0">
          <div className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
            {children || <Outlet />}
          </div>
          {!isChatPage && <DisclaimerBanner />}
        </main>

        {/* 4. Context / Evidence Panel (Right) */}
        {showEvidencePanel && evidenceContent && (
          <aside className="w-80 lg:w-96 bg-white border-l border-[#E8E3F5] hidden xl:flex flex-col shrink-0 overflow-y-auto shadow-xs">
            {evidenceContent}
          </aside>
        )}
      </div>
    </div>
  );
};
