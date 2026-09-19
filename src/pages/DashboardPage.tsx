import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  MessageSquare,
  BookOpen,
  Briefcase,
  FileText,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Building,
  Home,
  Users,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/chat?q=${encodeURIComponent(searchQuery)}`);
  };

  const domainCards = [
    {
      id: 'consumer',
      title: 'Consumer Complaints',
      act: 'Consumer Protection Act, 2019',
      desc: 'Defective goods, deficiency in service, unfair trade practices, E-Daakhil filing procedure.',
      icon: Building,
      badgeColor: 'bg-[#EDE9FE] text-[#573EAE] border-[#DDD6FE]',
      iconColor: 'bg-[#F4F2FA] text-[#684EC9]'
    },
    {
      id: 'tenancy',
      title: 'Rental / Tenancy Disputes',
      act: 'Transfer of Property Act, 1882',
      desc: 'Security deposit withholding, eviction notices, lease deeds, Rent Court summary jurisdiction.',
      icon: Home,
      badgeColor: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
      iconColor: 'bg-[#F0FDF4] text-[#059669]'
    },
    {
      id: 'employment',
      title: 'Employment Disputes',
      act: 'Payment of Gratuity Act & ICA Sec 27',
      desc: 'Unpaid salary, statutory gratuity delays, non-compete restraint unenforceability, SAMADHAAN portal.',
      icon: Users,
      badgeColor: 'bg-[#EDE9FE] text-[#573EAE] border-[#DDD6FE]',
      iconColor: 'bg-[#F4F2FA] text-[#684EC9]'
    },
    {
      id: 'contract',
      title: 'Contract Disputes',
      act: 'Indian Contract Act & MSMED Act',
      desc: 'Commercial breach, Section 73/74 damages, MSME Samadhaan 45-day statutory payment recovery.',
      icon: FileSpreadsheet,
      badgeColor: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
      iconColor: 'bg-[#FFFBEB] text-[#D97706]'
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-7xl mx-auto">
      {/* Hero Section - Light Lavender & White Glow */}
      <section className="bg-gradient-to-b from-white to-[#F8F6FD] dark:from-[#171424] dark:to-[#120F1F] border border-[#E8E3F5] dark:border-[#2D2745] rounded-3xl p-5 sm:p-8 md:p-10 text-center space-y-4 lavender-shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE9FE] dark:bg-[#251F3D] border border-[#D8D1EE] dark:border-[#3D3360] text-[#573EAE] dark:text-[#C4B5FD] text-xs font-semibold">
          <Sparkles size={13} className="text-[#684EC9] dark:text-[#A78BFA]" />
          <span>Evidence-First Legal Intelligence Platform</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1B2E] dark:text-white tracking-tight leading-tight">
          Understand the Law. Find the Authority.
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#544E6D] dark:text-[#A59FC2] max-w-2xl mx-auto leading-relaxed">
          AI-powered Indian legal information and research assistance grounded in authentic Bare Acts, statutory sections, and landmark Supreme Court precedents.
        </p>

        {/* Big Search Input */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center shadow-xs">
            <Search className="absolute left-3.5 sm:left-4 text-[#7E779C]" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask a legal question (e.g. Can landlord forfeit deposit?)..."
              className="w-full pl-10 sm:pl-12 pr-22 sm:pr-28 py-3 sm:py-3.5 rounded-2xl border border-[#D8D1EE] dark:border-[#382F5E] bg-white dark:bg-[#1E1836] text-[#1E1B2E] dark:text-white text-xs sm:text-sm placeholder:text-[#958EB3] focus:outline-none focus:ring-2 focus:ring-[#7C66DC] transition-all shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 sm:right-2 px-3 sm:px-5 py-2 bg-[#684EC9] hover:bg-[#573EAE] text-white rounded-xl text-xs font-bold shadow-xs transition-colors press-feedback"
            >
              Research
            </button>
          </div>
        </form>

        {/* Quick Actions Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 max-w-2xl mx-auto pt-2">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2.5 rounded-xl border border-[#E8E3F5] dark:border-[#2D2745] bg-white dark:bg-[#171424] text-xs font-semibold text-[#544E6D] dark:text-[#DDD6FE] hover:border-[#7C66DC] hover:text-[#684EC9] press-feedback transition-all shadow-2xs"
          >
            <MessageSquare size={14} className="text-[#684EC9] shrink-0" />
            <span className="truncate">Ask Nyayavanta</span>
          </button>
          <button
            onClick={() => navigate('/legal-search')}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2.5 rounded-xl border border-[#E8E3F5] dark:border-[#2D2745] bg-white dark:bg-[#171424] text-xs font-semibold text-[#544E6D] dark:text-[#DDD6FE] hover:border-[#7C66DC] hover:text-[#684EC9] press-feedback transition-all shadow-2xs"
          >
            <BookOpen size={14} className="text-[#684EC9] shrink-0" />
            <span className="truncate">Search Laws</span>
          </button>
          <button
            onClick={() => navigate('/case-search')}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2.5 rounded-xl border border-[#E8E3F5] dark:border-[#2D2745] bg-white dark:bg-[#171424] text-xs font-semibold text-[#544E6D] dark:text-[#DDD6FE] hover:border-[#7C66DC] hover:text-[#684EC9] press-feedback transition-all shadow-2xs"
          >
            <Briefcase size={14} className="text-[#684EC9] shrink-0" />
            <span className="truncate">Search Cases</span>
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2.5 rounded-xl border border-[#E8E3F5] dark:border-[#2D2745] bg-white dark:bg-[#171424] text-xs font-semibold text-[#544E6D] dark:text-[#DDD6FE] hover:border-[#7C66DC] hover:text-[#684EC9] press-feedback transition-all shadow-2xs"
          >
            <FileText size={14} className="text-[#684EC9] shrink-0" />
            <span className="truncate">Analyze Docs</span>
          </button>
        </div>
      </section>

      {/* V1 Supported Legal Domains */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1E1B2E] dark:text-white">
              V1 Supported Legal Domains
            </h2>
            <p className="text-xs text-[#7E779C]">
              Specialized statutory retrieval and claim grounding for 4 core domains.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#573EAE] dark:text-[#C4B5FD] bg-[#EDE9FE] dark:bg-[#251F3D] px-2.5 py-1 rounded-lg">
            Scope Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {domainCards.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.id}
                onClick={() => navigate(`/chat?domain=${d.id}`)}
                className="p-4 sm:p-5 rounded-2xl border border-[#E8E3F5] dark:border-[#2D2745] bg-white dark:bg-[#171424] cursor-pointer lavender-card-hover press-feedback flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div className="space-y-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${d.iconColor} shadow-2xs`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-sm text-[#1E1B2E] dark:text-white">{d.title}</h3>
                  <span className={`inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${d.badgeColor}`}>
                    {d.act}
                  </span>
                  <p className="text-xs text-[#544E6D] dark:text-[#A59FC2] line-clamp-2 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#F1EEFA] dark:border-[#26213D] flex items-center justify-between text-xs font-bold text-[#684EC9] dark:text-[#A78BFA]">
                  <span>Start Research</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two Column Grid: Recent Research & Recent Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Recent Research */}
        <div className="p-5 bg-white dark:bg-[#171424] border border-[#E8E3F5] dark:border-[#2D2745] rounded-2xl space-y-3.5 lavender-shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1E1B2E] dark:text-white flex items-center gap-2">
              <Bookmark size={16} className="text-[#684EC9]" />
              <span>Recent Research</span>
            </h3>
            <button onClick={() => navigate('/saved')} className="text-xs text-[#684EC9] dark:text-[#A78BFA] font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            <div
              onClick={() => navigate('/chat')}
              className="p-3 rounded-xl border border-[#E8E3F5] dark:border-[#26213D] bg-[#FBFBFE] dark:bg-[#1C182B] hover:bg-[#F4F2FA] dark:hover:bg-[#231E36] cursor-pointer space-y-1 transition-colors"
            >
              <div className="flex justify-between font-semibold text-[#1E1B2E] dark:text-slate-200">
                <span>Tenancy Deposit Withholding in Bengaluru</span>
                <span className="text-[10px] text-[#7E779C]">Today</span>
              </div>
              <p className="text-[#544E6D] dark:text-[#958EB3] line-clamp-1">
                Section 108(B)(q) Transfer of Property Act & Kailash Nath precedent.
              </p>
            </div>
            <div
              onClick={() => navigate('/chat')}
              className="p-3 rounded-xl border border-[#E8E3F5] dark:border-[#26213D] bg-[#FBFBFE] dark:bg-[#1C182B] hover:bg-[#F4F2FA] dark:hover:bg-[#231E36] cursor-pointer space-y-1 transition-colors"
            >
              <div className="flex justify-between font-semibold text-[#1E1B2E] dark:text-slate-200">
                <span>Non-compete validity under Sec 27 ICA</span>
                <span className="text-[10px] text-[#7E779C]">Yesterday</span>
              </div>
              <p className="text-[#544E6D] dark:text-[#958EB3] line-clamp-1">
                Post-service non-compete restraint is void under Supreme Court Golikari precedent.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="p-5 bg-white dark:bg-[#171424] border border-[#E8E3F5] dark:border-[#2D2745] rounded-2xl space-y-3.5 lavender-shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1E1B2E] dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-[#684EC9]" />
              <span>Recent Documents</span>
            </h3>
            <button onClick={() => navigate('/documents')} className="text-xs text-[#684EC9] dark:text-[#A78BFA] font-semibold hover:underline">
              Analyze New
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            <div
              onClick={() => navigate('/documents')}
              className="p-3 rounded-xl border border-[#E8E3F5] dark:border-[#26213D] bg-[#FBFBFE] dark:bg-[#1C182B] hover:bg-[#F4F2FA] dark:hover:bg-[#231E36] cursor-pointer space-y-1 transition-colors"
            >
              <div className="flex justify-between font-semibold text-[#1E1B2E] dark:text-slate-200">
                <span>Residential_Lease_Agreement_2025.pdf</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                  Risk: High
                </span>
              </div>
              <p className="text-[#544E6D] dark:text-[#958EB3] line-clamp-1">
                Arbitration Clause 14 & Liquidated Damages Clause 8 flagged.
              </p>
            </div>
            <div
              onClick={() => navigate('/documents')}
              className="p-3 rounded-xl border border-[#E8E3F5] dark:border-[#26213D] bg-[#FBFBFE] dark:bg-[#1C182B] hover:bg-[#F4F2FA] dark:hover:bg-[#231E36] cursor-pointer space-y-1 transition-colors"
            >
              <div className="flex justify-between font-semibold text-[#1E1B2E] dark:text-slate-200">
                <span>Vendor_Service_Contract.pdf</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  Risk: Low
                </span>
              </div>
              <p className="text-[#544E6D] dark:text-[#958EB3] line-clamp-1">
                MSMED Act 45-day payment statutory provisions compliant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
