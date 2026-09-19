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
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="text-indigo-600" size={24} />
          <span>Landmark Judicial Decisions</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Authoritative Supreme Court and High Court precedents establishing binding legal doctrine across V1 domains.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by case name, citation, or legal holding..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={courtFilter}
            onChange={(e) => setCourtFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium"
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
            className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                  {c.citationStr}
                </span>
                <span className="text-[11px] text-slate-400">{c.judgmentDate}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {c.caseName}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">{c.court}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {c.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                Outcome: {c.outcome?.slice(0, 35)}...
              </span>
              <button
                onClick={() => navigate(`/cases/${c.id}`)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                <span>Full Case & Timeline</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
