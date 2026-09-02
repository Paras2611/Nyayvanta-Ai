import React, { useState } from 'react';
import { X, Search, BookOpen, ExternalLink, ShieldCheck, Scale } from 'lucide-react';
import { STATUTORY_KNOWLEDGE_BASE } from '../data/statutoryActs';

interface StatutoryLibraryModalProps {
  onClose: () => void;
}

export const StatutoryLibraryModal: React.FC<StatutoryLibraryModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActFilter, setSelectedActFilter] = useState<string>('ALL');

  const filteredStatutes = STATUTORY_KNOWLEDGE_BASE.filter((statute) => {
    const matchesQuery =
      searchQuery === '' ||
      statute.actName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statute.sectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statute.plainEnglishExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statute.keyRuleVerbatim.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAct =
      selectedActFilter === 'ALL' ||
      statute.actName.toLowerCase().includes(selectedActFilter.toLowerCase());

    return matchesQuery && matchesAct;
  });

  const acts = [
    { label: 'All Bare Acts', value: 'ALL' },
    { label: 'Consumer Protection Act (2019)', value: 'Consumer' },
    { label: 'Transfer of Property Act (1882)', value: 'Transfer' },
    { label: 'Indian Contract Act (1872)', value: 'Contract' },
    { label: 'Gratuity & Labour Acts', value: 'Gratuity' },
    { label: 'MSMED Act (2006)', value: 'MSME' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white font-serif-legal">
                Indian Bare Acts & Statutory Library
              </h3>
              <p className="text-xs text-slate-400">
                Verified, authentic statutory sections governing LawLink&apos;s 4 supported domains
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Act, Section (e.g., 'Section 27', 'Section 35'), or keyword (e.g., 'non-compete', 'deposit', 'deficiency')..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {acts.map((act) => (
              <button
                key={act.value}
                onClick={() => setSelectedActFilter(act.value)}
                className={`text-[11px] px-3 py-1 rounded-lg font-medium transition ${
                  selectedActFilter === act.value
                    ? 'bg-blue-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of statutes */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {filteredStatutes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No statutory provisions found matching your query.
            </div>
          ) : (
            filteredStatutes.map((statute) => (
              <div
                key={statute.id}
                className="p-5 bg-slate-800/60 border border-slate-700/80 rounded-xl space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
                      {statute.sectionNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {statute.actName}, {statute.year} — {statute.title}
                    </h4>
                  </div>

                  {statute.statutoryReferenceUrl && (
                    <a
                      href={statute.statutoryReferenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-300"
                    >
                      <span>Official Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="p-3 bg-slate-900/90 border-l-2 border-blue-500 rounded-r-lg text-xs font-mono text-slate-300 leading-relaxed">
                  &ldquo;{statute.keyRuleVerbatim}&rdquo;
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-slate-200">Plain English Meaning: </strong>
                  <span>{statute.plainEnglishExplanation}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
