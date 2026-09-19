import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Filter,
  ExternalLink,
  BookmarkPlus,
  MessageSquare,
  Scale,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { searchLegalCorpus, saveResearchItem, SearchResultItem } from '../services/api';

export const LegalSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || '';

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Acts' | 'Sections' | 'Regulations' | 'Judgments'>('All');
  const [domainFilter, setDomainFilter] = useState(initialCategory);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const tabs: Array<'All' | 'Acts' | 'Sections' | 'Regulations' | 'Judgments'> = [
    'All',
    'Acts',
    'Sections',
    'Regulations',
    'Judgments'
  ];

  const handleSearch = async (searchQuery?: string, tabOverride?: string) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    setIsLoading(true);
    try {
      const data = await searchLegalCorpus(q || 'Section Act', tabOverride || activeTab, domainFilter || undefined);
      setResults(data.results);
      setTotalResults(data.totalResults);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('Section');
  }, [domainFilter]);

  const handleTabClick = (tab: 'All' | 'Acts' | 'Sections' | 'Regulations' | 'Judgments') => {
    setActiveTab(tab);
    handleSearch(query, tab);
  };

  const handleSave = async (item: SearchResultItem) => {
    try {
      await saveResearchItem({
        title: item.title,
        itemType: item.type,
        description: item.explanation,
        dataPayload: item
      });
      setSavedSuccessId(item.id);
      setTimeout(() => setSavedSuccessId(null), 2500);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-black text-[#1E1B2E] dark:text-white flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#684EC9] dark:text-purple-300 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <span>Indian Legal Corpus Search</span>
        </h1>
        <p className="text-xs md:text-sm text-[#544E6D] dark:text-slate-400">
          Directly query authentic Bare Acts, Sections, Gazette Regulations, and Supreme Court rulings across India.
        </p>
      </div>

      {/* Big Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row gap-2.5"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 text-[#7E779C]" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Section (e.g. Section 27), Act name, or topic (e.g. liquidated damages)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8E3F5] dark:border-slate-700 bg-white dark:bg-[#111827] text-sm text-[#1E1B2E] dark:text-white placeholder-[#7E779C] focus:outline-none focus:ring-2 focus:ring-[#684EC9]/20 focus:border-[#684EC9] shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#684EC9] hover:bg-[#573EB0] text-white rounded-2xl text-xs font-bold shadow-xs transition-colors shrink-0 min-h-[44px] cursor-pointer"
        >
          Search Law
        </button>
      </form>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E3F5] dark:border-slate-800">
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab
                  ? 'bg-[#684EC9] text-white shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-[#544E6D] dark:text-slate-400 border border-[#E8E3F5] dark:border-slate-700 hover:bg-[#EDE9FE]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0 self-end sm:self-auto">
          <Filter size={14} className="text-[#7E779C]" />
          <span className="text-[#544E6D] dark:text-slate-400 font-medium">Domain:</span>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-[#E8E3F5] dark:border-slate-700 bg-white dark:bg-[#111827] text-[#1E1B2E] dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#684EC9]/20"
          >
            <option value="">All Domains</option>
            <option value="consumer">Consumer Protection</option>
            <option value="tenancy">Tenancy / Rent</option>
            <option value="employment">Employment / Labour</option>
            <option value="contract">Contract Law</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs text-[#7E779C]">
          <span>{totalResults} authoritative legal records found</span>
          <span className="text-[11px]">Ranked by BM25 + Semantic Hybrid Relevance</span>
        </div>

        {results.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-2 p-6 shadow-xs">
            <Scale size={32} className="mx-auto text-[#7E779C]" />
            <p className="text-sm font-bold text-[#1E1B2E] dark:text-slate-300">
              No legal provisions found matching your search.
            </p>
            <p className="text-xs text-[#7E779C]">
              Try searching by exact Section number like "Section 108" or "Section 74".
            </p>
          </div>
        )}

        {results.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-2.5 shadow-xs hover:border-[#684EC9] dark:hover:border-purple-600 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#EDE9FE] dark:bg-purple-950 text-[#573EAE] dark:text-purple-300 border border-[#DDD6FE] dark:border-purple-800">
                    {item.type}
                  </span>
                  {item.court && (
                    <span className="text-[11px] text-[#544E6D] dark:text-slate-400 font-medium">
                      {item.court}
                    </span>
                  )}
                  {item.date && (
                    <span className="text-[11px] text-[#7E779C]">({item.date})</span>
                  )}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#1E1B2E] dark:text-white leading-snug">
                  {item.title}
                </h3>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900 self-start">
                Score: {item.relevance}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#544E6D] dark:text-slate-300 leading-relaxed">
              {item.explanation}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 border-t border-[#E8E3F5] dark:border-slate-800 text-xs gap-2">
              <span className="text-[11px] text-[#7E779C]">
                Jurisdiction: {item.jurisdiction || 'India (Central)'}
              </span>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#7E779C] hover:text-[#684EC9] transition-colors"
                  >
                    <span>Official Source</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                <button
                  onClick={() => handleSave(item)}
                  className="flex items-center gap-1 text-[#544E6D] dark:text-slate-300 hover:text-[#684EC9] px-2.5 py-1.5 rounded-lg hover:bg-[#EDE9FE] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {savedSuccessId === item.id ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Saved!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus size={14} />
                      <span>Save</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate(`/chat?q=${encodeURIComponent(`Analyze ${item.title}`)}`)}
                  className="flex items-center gap-1 text-[#684EC9] dark:text-purple-400 font-bold hover:underline px-2.5 py-1.5 rounded-lg hover:bg-[#EDE9FE] dark:hover:bg-purple-950/40 transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
