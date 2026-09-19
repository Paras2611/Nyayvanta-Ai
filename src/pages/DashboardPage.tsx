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
  FileSpreadsheet
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
      desc: 'Defective merchandise, deficiency in service, unfair trade practices, E-Daakhil filing procedure.',
      icon: Building,
      color: 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300'
    },
    {
      id: 'tenancy',
      title: 'Rental / Tenancy Disputes',
      act: 'Transfer of Property Act, 1882',
      desc: 'Security deposit withholding, eviction notices, lease agreements, Rent Authority summary jurisdiction.',
      icon: Home,
      color: 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
    },
    {
      id: 'employment',
      title: 'Employment Disputes',
      act: 'Payment of Gratuity Act & ICA Sec 27',
      desc: 'Unpaid wages, statutory gratuity delays, post-employment non-compete validity, SAMADHAAN portal.',
      icon: Users,
      color: 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300'
    },
    {
      id: 'contract',
      title: 'Contract Disputes',
      act: 'Indian Contract Act & MSMED Act',
      desc: 'Commercial breach of contract, Section 73/74 liquidated damages, MSME Samadhaan 45-day clearance.',
      icon: FileSpreadsheet,
      color: 'border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 dark:from-[#111827] dark:to-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-4 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <ShieldCheck size={14} />
          <span>Nyayavanta Indian Legal Intelligence Platform</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Understand the Law. Find the Authority.
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          AI-powered Indian legal information and research assistance grounded in authentic Bare Acts, statutory sections, and landmark Supreme Court precedents.
        </p>

        {/* Big Search Input */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask Nyayavanta a legal question (e.g. Can landlord forfeit full security deposit?)..."
              className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-900 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Research
            </button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium hover:border-indigo-500 transition-colors"
          >
            <MessageSquare size={14} className="text-indigo-600" />
            <span>Ask Nyayavanta</span>
          </button>
          <button
            onClick={() => navigate('/legal-search')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium hover:border-indigo-500 transition-colors"
          >
            <BookOpen size={14} className="text-blue-600" />
            <span>Search Laws</span>
          </button>
          <button
            onClick={() => navigate('/case-search')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium hover:border-indigo-500 transition-colors"
          >
            <Briefcase size={14} className="text-emerald-600" />
            <span>Search Cases</span>
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium hover:border-indigo-500 transition-colors"
          >
            <FileText size={14} className="text-purple-600" />
            <span>Analyze Document</span>
          </button>
        </div>
      </section>

      {/* V1 Supported Legal Domains */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              V1 Supported Legal Domains
            </h2>
            <p className="text-xs text-slate-500">
              Specialized statutory retrieval and claim grounding for 4 core domains.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded">
            Scope Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainCards.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.id}
                onClick={() => navigate(`/chat?domain=${d.id}`)}
                className={`p-5 rounded-xl border ${d.color} bg-white dark:bg-[#111827] cursor-pointer legal-card-hover flex flex-col justify-between space-y-3`}
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 shadow-xs">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{d.title}</h3>
                  <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">{d.act}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Start Research</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two Column Grid: Recent Research & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Research */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark size={16} className="text-indigo-600" />
              <span>Recent Research</span>
            </h3>
            <button onClick={() => navigate('/saved')} className="text-xs text-indigo-600 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div
              onClick={() => navigate('/chat')}
              className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer space-y-1"
            >
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Tenancy Deposit Withholding in Bengaluru</span>
                <span className="text-[10px] text-slate-400">Today</span>
              </div>
              <p className="text-slate-500 line-clamp-1">
                Section 108(B)(q) Transfer of Property Act & Kailash Nath precedent.
              </p>
            </div>
            <div
              onClick={() => navigate('/chat')}
              className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer space-y-1"
            >
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Non-compete validity under Sec 27 ICA</span>
                <span className="text-[10px] text-slate-400">Yesterday</span>
              </div>
              <p className="text-slate-500 line-clamp-1">
                Post-service non-compete restraint is void under Supreme Court Golikari precedent.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-purple-600" />
              <span>Recent Documents</span>
            </h3>
            <button onClick={() => navigate('/documents')} className="text-xs text-indigo-600 hover:underline">
              Analyze New
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div
              onClick={() => navigate('/documents')}
              className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer space-y-1"
            >
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Residential_Lease_Agreement_2025.pdf</span>
                <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                  Risk: High
                </span>
              </div>
              <p className="text-slate-500 line-clamp-1">
                Arbitration Clause 14 & Liquidated Damages Clause 8 flagged.
              </p>
            </div>
            <div
              onClick={() => navigate('/documents')}
              className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer space-y-1"
            >
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Vendor_Service_Contract.pdf</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  Risk: Low
                </span>
              </div>
              <p className="text-slate-500 line-clamp-1">
                MSMED Act 45-day payment statutory provisions compliant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
