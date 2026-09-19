import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, MessageSquare, Share2, FileText, Scale } from 'lucide-react';
import { fetchSavedItems, deleteSavedItem } from '../services/api';

export const SavedResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'Answers' | 'Sections' | 'Cases' | 'Documents' | 'Sources'>('All');
  const [items, setItems] = useState<any[]>([]);

  const tabs: Array<'All' | 'Answers' | 'Sections' | 'Cases' | 'Documents' | 'Sources'> = [
    'All',
    'Answers',
    'Sections',
    'Cases',
    'Documents',
    'Sources'
  ];

  const loadItems = async (tab?: string) => {
    try {
      const data = await fetchSavedItems(tab === 'All' ? undefined : tab);
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadItems(activeTab);
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="text-indigo-600" size={24} />
          <span>Saved Legal Research</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Bookmarked statutory provisions, landmark judgments, extracted clauses, and grounded answers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <Bookmark size={28} className="mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No saved items in this category.
            </p>
            <p className="text-xs text-slate-500">
              Bookmark legal sections or cases during search or chat to reference them here.
            </p>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {item.itemType}
                </span>
                <span className="text-[11px] text-slate-400">{item.dateSaved}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => navigate(`/chat?q=${encodeURIComponent(item.title)}`)}
                className="flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
              >
                <MessageSquare size={13} />
                <span>Open in Research</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + `/legal-search?q=${encodeURIComponent(item.title)}`);
                    alert('Link copied to clipboard');
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  title="Share"
                >
                  <Share2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
