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
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={24} />
          <span>Indian Legal Corpus Search</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Directly query authentic Bare Acts, Sections, Gazette Regulations, and Supreme Court rulings.
        </p>
      </div>

      {/* Big Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Section (e.g. Section 27), Act name, or phrase (e.g. liquidated damages penalty)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          Search Law
        </button>
      </form>

      {/* Tabs and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-1.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter size={14} className="text-slate-400" />
          <span className="text-slate-500">Domain:</span>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 text-xs"
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
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>{totalResults} authoritative legal records found</span>
          <span>Ranked by BM25 + Semantic Hybrid Relevance</span>
        </div>

        {results.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <Scale size={28} className="mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No legal provisions found matching your search.
            </p>
            <p className="text-xs text-slate-500">
              Try searching by exact Section number like "Section 108" or "Section 74".
            </p>
          </div>
        )}

        {results.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {item.type}
                  </span>
                  {item.court && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.court}
                    </span>
                  )}
                  {item.date && (
                    <span className="text-[11px] text-slate-400">({item.date})</span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.title}
                </h3>
              </div>

              <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                Score: {item.relevance}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.explanation}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400">
                Jurisdiction: {item.jurisdiction || 'India (Central)'}
              </span>

              <div className="flex items-center gap-2">
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-500 hover:text-indigo-600"
                  >
                    <span>Official Source</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                <button
                  onClick={() => handleSave(item)}
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {savedSuccessId === item.id ? (
                    <>
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">Saved!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus size={13} />
                      <span>Save</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate(`/chat?q=${encodeURIComponent(`Analyze ${item.title}`)}`)}
                  className="flex items-center gap-1 text-indigo-600 font-semibold hover:underline px-2 py-1"
                >
                  <MessageSquare size={13} />
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
