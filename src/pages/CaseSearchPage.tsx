import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, ExternalLink, ArrowRight, Scale, Filter } from 'lucide-react';
import { fetchCases } from '../services/api';

export const CaseSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<any[]>([]);
  const [courtFilter, setCourtFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCases().then(setCases).catch(console.error);
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesCourt = courtFilter ? c.court.includes(courtFilter) : true;
    const matchesQuery = searchQuery
      ? c.caseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.citationStr.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCourt && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-black text-[#1E1B2E] dark:text-white flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#684EC9] dark:text-purple-300 flex items-center justify-center shrink-0">
            <Briefcase size={20} />
          </div>
          <span>Landmark Judicial Decisions</span>
        </h1>
        <p className="text-xs md:text-sm text-[#544E6D] dark:text-slate-400">
          Authoritative Supreme Court and High Court precedents establishing binding legal doctrine across India.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 text-[#7E779C]" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by case name, citation, or legal holding..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8E3F5] dark:border-slate-700 bg-white dark:bg-[#111827] text-sm text-[#1E1B2E] dark:text-white placeholder-[#7E779C] focus:outline-none focus:ring-2 focus:ring-[#684EC9]/20 focus:border-[#684EC9] shadow-xs"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-[#7E779C] shrink-0" />
          <select
            value={courtFilter}
            onChange={(e) => setCourtFilter(e.target.value)}
            className="w-full sm:w-auto p-3 rounded-2xl border border-[#E8E3F5] dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-bold text-[#1E1B2E] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#684EC9]/20 shadow-xs cursor-pointer"
          >
            <option value="">All Courts</option>
            <option value="Supreme Court">Supreme Court of India</option>
            <option value="High Court">High Courts</option>
          </select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((c) => (
          <div
            key={c.id}
            className="p-4 sm:p-5 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-3 shadow-xs hover:border-[#684EC9] dark:hover:border-purple-600 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#684EC9] dark:text-purple-400 bg-[#EDE9FE] dark:bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-[#DDD6FE] dark:border-purple-800">
                  {c.citationStr}
                </span>
                <span className="text-[11px] text-[#7E779C]">{c.judgmentDate}</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1E1B2E] dark:text-white leading-snug">
                {c.caseName}
              </h3>
              <p className="text-[11px] text-[#544E6D] dark:text-slate-400 font-semibold">{c.court}</p>
              <p className="text-xs sm:text-sm text-[#544E6D] dark:text-slate-300 line-clamp-3 leading-relaxed">
                {c.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E8E3F5] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold max-w-[200px] sm:max-w-xs truncate">
                Outcome: {c.outcome}
              </span>
              <button
                onClick={() => navigate(`/cases/${c.id}`)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#684EC9] dark:text-purple-400 hover:text-[#573EB0] hover:underline press-feedback"
              >
                <span>Full Case & Timeline</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
