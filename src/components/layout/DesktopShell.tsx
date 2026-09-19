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
  Globe,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
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
  const { isDark, toggleTheme } = useTheme();
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
    { name: t('nav.categories.criminal', 'Criminal Law'), count: 'Bare Act', path: '/legal-search?cat=criminal' },
    { name: t('nav.categories.civil', 'Civil Law'), count: 'Bare Act', path: '/legal-search?cat=civil' },
    { name: t('nav.categories.property', 'Property Law'), count: 'TPA 1882', path: '/legal-search?cat=property' },
    { name: t('nav.categories.family', 'Family Law'), count: 'Bare Act', path: '/legal-search?cat=family' },
    { name: t('nav.categories.contract', 'Contract Law'), count: 'ICA 1872', path: '/legal-search?cat=contract' },
    { name: t('nav.categories.consumer', 'Consumer Law'), count: 'CPA 2019', path: '/legal-search?cat=consumer' },
    { name: t('nav.categories.cyber', 'Cyber Law'), count: 'IT Act', path: '/legal-search?cat=cyber' },
    { name: t('nav.categories.constitutional', 'Constitutional Law'), count: 'Constitution', path: '/legal-search?cat=constitutional' },
    { name: t('nav.categories.labour', 'Labour Law'), count: 'IDA / PGA', path: '/legal-search?cat=labour' },
    { name: t('nav.categories.corporate', 'Corporate Law'), count: 'Companies Act', path: '/legal-search?cat=corporate' },
  ];

  return (
    <div className="h-screen h-dvh flex flex-col bg-[#F8F7FC] dark:bg-[#0B0914] text-[#1E1B2E] dark:text-[#EAE5F8] overflow-hidden">
      {/* 1. Persistent Legal Disclaimer Top Bar - Light Lavender Aesthetic */}
      <header className="bg-[#EDE9FE] dark:bg-[#1A152E] text-[#46328D] dark:text-[#C4B5FD] text-xs px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between border-b border-[#D8D1EE] dark:border-[#2D254D] shrink-0 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2 max-w-4xl min-w-0">
          <Shield size={14} className="text-[#684EC9] dark:text-[#A78BFA] shrink-0" />
          <p className="truncate text-[11px] sm:text-xs">
            <strong className="font-semibold">{t('app.disclaimer_prefix', 'Nyayavanta Indian Legal Intelligence:')}</strong> {t('app.disclaimer', 'Informational and research assistance only. Not formal legal advice.')}
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Light / Dark Mode Toggle Button (to the left of language combobox) */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex items-center justify-center p-1.5 rounded-lg bg-white/90 dark:bg-[#251F3D]/90 border border-[#D8D1EE] dark:border-[#3D3360] text-[#573EAE] dark:text-[#C4B5FD] hover:bg-[#EBE6F8] dark:hover:bg-[#312952] transition-colors press-feedback shadow-2xs cursor-pointer"
          >
            {isDark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-[#684EC9]" />}
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white/90 dark:bg-[#251F3D]/90 px-2 py-0.5 rounded-md border border-[#D8D1EE] dark:border-[#3D3360] shadow-2xs">
            <Globe size={12} className="text-[#684EC9] dark:text-[#C4B5FD]" />
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              aria-label="Language selection"
              className="bg-transparent text-xs text-[#46328D] dark:text-[#C4B5FD] font-bold focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-white dark:bg-[#1A152E] text-[#46328D] dark:text-[#C4B5FD]">EN</option>
              <option value="hi" className="bg-white dark:bg-[#1A152E] text-[#46328D] dark:text-[#C4B5FD]">HI</option>
              <option value="mr" className="bg-white dark:bg-[#1A152E] text-[#46328D] dark:text-[#C4B5FD]">MR</option>
            </select>
          </div>
        </div>
      </header>

      {/* 2. Mobile Header Bar (md:hidden) - Positioned properly above the main body */}
      <div className="md:hidden flex items-center justify-between px-3.5 py-2.5 bg-white/95 dark:bg-[#120F20]/95 backdrop-blur-md text-[#1E1B2E] dark:text-[#EAE5F8] border-b border-[#E8E3F5] dark:border-[#251F3D] sticky top-[33px] sm:top-[37px] z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 rounded-xl bg-[#F4F2FA] dark:bg-[#221D38] border border-[#E0D9F7] dark:border-[#382F5E] text-[#573EAE] dark:text-[#C4B5FD] press-feedback"
            aria-label="Open navigation menu"
          >
            <Menu size={19} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#7C66DC] to-[#573EAE] flex items-center justify-center text-white shadow-2xs">
              <Scale size={15} />
            </div>
            <span className="font-black text-xs tracking-wide text-[#241C48] dark:text-white">{t('app.title', 'NYAYAVANTA-AI')}</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-xl bg-[#F4F2FA] dark:bg-[#221D38] border border-[#E0D9F7] dark:border-[#382F5E] text-[#573EAE] dark:text-[#C4B5FD] press-feedback"
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>
          <Link
            to="/chat"
            className="flex items-center gap-1 text-xs bg-[#684EC9] hover:bg-[#573EAE] text-white px-3 py-1.5 rounded-xl font-bold shadow-xs press-feedback transition-colors"
          >
            <MessageSquare size={13} />
            <span>{t('nav.ask_ai', 'Ask AI')}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs md:hidden animate-fade-in">
          <div className="w-80 max-w-[85vw] bg-[#F8F7FC] dark:bg-[#120F20] text-[#1E1B2E] dark:text-[#EAE5F8] p-4 flex flex-col justify-between shadow-2xl h-full overflow-hidden border-r border-[#E8E3F5] dark:border-[#251F3D]">
            <div className="overflow-y-auto flex-1 pr-1 space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F5] dark:border-[#251F3D]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C66DC] to-[#573EAE] flex items-center justify-center text-white shadow-sm">
                    <Scale size={17} />
                  </div>
                  <div>
                    <h2 className="font-black text-xs text-[#241C48] dark:text-white leading-tight">NYAYAVANTA-AI</h2>
                    <p className="text-[10px] text-[#684EC9] dark:text-[#A78BFA] font-medium">{t('app.disclaimer_prefix')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-[#251F3D]"
                  aria-label="Close menu"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Main Navigation Links */}
              <div>
                <p className="text-[10px] font-bold text-[#7E779C] dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('nav.navigation')}</p>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? 'bg-white dark:bg-[#251F3D] text-[#684EC9] dark:text-[#DDD6FE] shadow-xs border border-[#E0D9F7] dark:border-[#382F5E]'
                            : 'text-[#544E6D] dark:text-slate-300 hover:bg-[#EBE6F8] dark:hover:bg-[#1F1934]'
                        }`}
                      >
                        <Icon size={17} className={active ? 'text-[#684EC9] dark:text-[#A78BFA]' : 'text-[#7E779C] dark:text-slate-400'} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Legal Domains in Mobile Drawer */}
              <div className="pt-2 border-t border-[#E8E3F5] dark:border-[#26213D]">
                <p className="text-[10px] font-bold text-[#7E779C] uppercase tracking-wider mb-2">
                  {t('nav.legal_domains', 'Legal Domains')}
                </p>
                <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-[#EBE6F8] dark:hover:bg-[#251F3D] text-[#544E6D] dark:text-[#C4B5FD] text-xs transition-colors"
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] bg-white dark:bg-[#1E1933] text-[#573EAE] dark:text-[#DDD6FE] border border-[#E8E3F5] dark:border-[#382F5E] font-mono px-1.5 py-0.5 rounded shrink-0">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Language Switcher */}
              <div className="pt-2 border-t border-[#E8E3F5] dark:border-[#26213D]">
                <p className="text-[10px] font-bold text-[#7E779C] uppercase tracking-wider mb-2">{t('settings.language', 'Language')}</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'mr', label: 'मराठी' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => i18n.changeLanguage(l.code)}
                      className={`py-1.5 text-xs rounded-lg font-bold border transition-colors ${
                        i18n.language === l.code
                          ? 'bg-[#684EC9] text-white border-[#684EC9] shadow-2xs'
                          : 'bg-white dark:bg-[#1E1933] text-[#544E6D] dark:text-[#DDD6FE] border-[#E8E3F5] dark:border-[#382F5E]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-3 border-t border-[#E8E3F5] dark:border-[#26213D] space-y-1 text-xs shrink-0">
              <Link
                to="/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#544E6D] dark:text-[#C4B5FD] hover:bg-[#EBE6F8] dark:hover:bg-[#251F3D]"
              >
                <User size={15} />
                <span>{t('nav.profile', 'Profile')}</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#544E6D] dark:text-[#C4B5FD] hover:bg-[#EBE6F8] dark:hover:bg-[#251F3D]"
              >
                <Settings size={15} />
                <span>{t('nav.settings', 'Settings')}</span>
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut size={15} />
                <span>{t('nav.logout', 'Logout')}</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* 3. Main App Body (Sidebar + Content Workspace + Context Panel) */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Desktop Sidebar (Left) */}
        <aside className="w-60 xl:w-64 bg-[#F8F7FC] dark:bg-[#110E1F] text-[#1E1B2E] dark:text-[#EAE5F8] hidden md:flex flex-col justify-between shrink-0 border-r border-[#E8E3F5] dark:border-[#251F3D] shadow-xs">
          <div className="flex flex-col overflow-y-auto">
            {/* Logo Banner */}
            <Link to="/dashboard" className="p-4 border-b border-[#E8E3F5] dark:border-[#251F3D] flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C66DC] to-[#573EAE] flex items-center justify-center text-white font-black shadow-sm">
                <Scale size={19} />
              </div>
              <div>
                <h1 className="font-extrabold text-[#241C48] dark:text-white tracking-wide text-sm leading-tight">
                  {t('app.title', 'NYAYAVANTA-AI')}
                </h1>
                <p className="text-[11px] text-[#684EC9] dark:text-[#A78BFA] font-medium">{t('app.subtitle', 'Indian Legal Assistant')}</p>
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
                        ? 'bg-white dark:bg-[#201A36] text-[#573EAE] dark:text-[#C4B5FD] shadow-xs border border-[#E0D9F7] dark:border-[#3D3360]'
                        : 'text-[#544E6D] dark:text-[#A59FC2] hover:bg-[#EBE6F8] dark:hover:bg-[#1E1833] hover:text-[#241C48] dark:hover:text-white'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-[#684EC9] dark:text-[#C4B5FD]' : 'text-[#7E779C]'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Legal Domains List */}
            <div className="px-4 pt-3 pb-2 border-t border-[#E8E3F5] dark:border-[#251F3D]">
              <p className="text-[10px] font-bold text-[#7E779C] uppercase tracking-wider mb-2">
                {t('nav.legal_domains', 'Legal Domains')}
              </p>
              <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#EBE6F8] dark:hover:bg-[#1E1833] text-[#544E6D] dark:text-[#A59FC2] hover:text-[#241C48] dark:hover:text-white text-xs transition-colors"
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] bg-[#E8E3F5] dark:bg-[#241D3B] text-[#573EAE] dark:text-[#C4B5FD] font-mono px-1.5 py-0.5 rounded shrink-0">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Settings / Profile */}
          <div className="p-3 border-t border-[#E8E3F5] dark:border-[#251F3D] space-y-1 text-xs font-medium">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#544E6D] dark:text-[#A59FC2] hover:bg-[#EBE6F8] dark:hover:bg-[#1E1833] hover:text-[#241C48] dark:hover:text-white"
            >
              <User size={15} />
              <span>{t('nav.profile', 'Profile')}</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#544E6D] dark:text-[#A59FC2] hover:bg-[#EBE6F8] dark:hover:bg-[#1E1833] hover:text-[#241C48] dark:hover:text-white"
            >
              <Settings size={15} />
              <span>{t('nav.settings', 'Settings')}</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <LogOut size={15} />
              <span>{t('nav.logout', 'Logout')}</span>
            </Link>
          </div>
        </aside>

        {/* 4. Main Workspace (Center) */}
        <main
          className={`flex-1 flex flex-col min-w-0 ${
            isChatPage
              ? 'h-full overflow-hidden pb-16 md:pb-0 bg-[#F8F7FC]'
              : 'overflow-y-auto bg-[#F8F7FC] pb-20 md:pb-0'
          }`}
        >
          {isChatPage ? (
            <div className="flex-1 h-full w-full min-w-0 flex flex-col overflow-hidden">
              {children || <Outlet />}
            </div>
          ) : (
            <>
              <div className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
                {children || <Outlet />}
              </div>
              <DisclaimerBanner />
            </>
          )}
        </main>

        {/* 5. Context / Evidence Panel (Right - Desktop) */}
        {showEvidencePanel && evidenceContent && (
          <aside className="w-80 lg:w-96 bg-white border-l border-[#E8E3F5] hidden xl:flex flex-col shrink-0 overflow-y-auto shadow-xs">
            {evidenceContent}
          </aside>
        )}
      </div>

      {/* 6. Mobile Bottom Navigation Bar (md:hidden) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#13101F]/95 backdrop-blur-md border-t border-[#E8E3F5] dark:border-[#26213D] shadow-lg flex items-center justify-around px-2 py-1.5 safe-bottom"
      >
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            location.pathname === '/dashboard' || location.pathname === '/'
              ? 'text-[#684EC9] dark:text-[#A78BFA] font-bold'
              : 'text-[#7E779C] hover:text-[#544E6D]'
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="text-[10px] mt-0.5">{t('nav.home', 'Home')}</span>
        </Link>

        <Link
          to="/chat"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            location.pathname.startsWith('/chat')
              ? 'text-[#684EC9] dark:text-[#A78BFA] font-bold'
              : 'text-[#7E779C] hover:text-[#544E6D]'
          }`}
        >
          <div className={`p-1 rounded-lg ${location.pathname.startsWith('/chat') ? 'bg-[#EDE9FE] dark:bg-[#251F3D]' : ''}`}>
            <MessageSquare size={18} />
          </div>
          <span className="text-[10px]">{t('nav.ask_ai', 'Ask AI')}</span>
        </Link>

        <Link
          to="/legal-search"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            location.pathname.startsWith('/legal-search')
              ? 'text-[#684EC9] dark:text-[#A78BFA] font-bold'
              : 'text-[#7E779C] hover:text-[#544E6D]'
          }`}
        >
          <Search size={18} />
          <span className="text-[10px] mt-0.5">{t('nav.laws', 'Laws')}</span>
        </Link>

        <Link
          to="/documents"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            location.pathname.startsWith('/documents')
              ? 'text-[#684EC9] dark:text-[#A78BFA] font-bold'
              : 'text-[#7E779C] hover:text-[#544E6D]'
          }`}
        >
          <FileText size={18} />
          <span className="text-[10px] mt-0.5">{t('nav.docs', 'Docs')}</span>
        </Link>

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#7E779C] hover:text-[#544E6D] transition-colors"
          aria-label="More options"
        >
          <Menu size={18} />
          <span className="text-[10px] mt-0.5">{t('nav.more', 'More')}</span>
        </button>
      </nav>
    </div>
  );
};

