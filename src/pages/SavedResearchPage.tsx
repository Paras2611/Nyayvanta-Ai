import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bookmark, Trash2, ExternalLink, MessageSquare, Share2, FileText, Scale } from 'lucide-react';
import { fetchSavedItems, deleteSavedItem } from '../services/api';

export const SavedResearchPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'Answers' | 'Sections' | 'Cases' | 'Documents' | 'Sources'>('All');
  const [items, setItems] = useState<any[]>([]);

  const tabs: Array<{ id: 'All' | 'Answers' | 'Sections' | 'Cases' | 'Documents' | 'Sources'; labelKey: string }> = [
    { id: 'All', labelKey: 'saved.tabs.all' },
    { id: 'Answers', labelKey: 'saved.open_chat' },
    { id: 'Sections', labelKey: 'saved.tabs.statutes' },
    { id: 'Cases', labelKey: 'saved.tabs.cases' },
    { id: 'Documents', labelKey: 'saved.tabs.clauses' },
    { id: 'Sources', labelKey: 'search.tabs.all' }
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
        <h1 className="text-xl md:text-2xl font-black text-[#1E1B2E] dark:text-white flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#684EC9] dark:text-purple-300 flex items-center justify-center shrink-0">
            <Bookmark size={20} />
          </div>
          <span>{t('saved.title')}</span>
        </h1>
        <p className="text-xs md:text-sm text-[#544E6D] dark:text-slate-400">
          {t('saved.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 pb-2 border-b border-[#E8E3F5] dark:border-slate-800 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 press-feedback ${
              activeTab === tab.id
                ? 'bg-[#684EC9] text-white shadow-xs'
                : 'bg-white dark:bg-[#111827] text-[#544E6D] dark:text-slate-400 border border-[#E8E3F5] dark:border-slate-700 hover:bg-[#EDE9FE]'
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-2 p-6 shadow-xs">
            <Bookmark size={32} className="mx-auto text-[#7E779C]" />
            <p className="text-sm font-bold text-[#1E1B2E] dark:text-slate-300">
              {t('saved.empty_title')}
            </p>
            <p className="text-xs text-[#7E779C]">
              {t('saved.empty_desc')}
            </p>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl space-y-3 shadow-xs hover:border-[#684EC9] dark:hover:border-purple-600 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#EDE9FE] dark:bg-purple-950 text-[#573EAE] dark:text-purple-300 border border-[#DDD6FE] dark:border-purple-800">
                  {item.itemType}
                </span>
                <span className="text-[11px] text-[#7E779C]">{item.dateSaved}</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1E1B2E] dark:text-white leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#544E6D] dark:text-slate-300 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E8E3F5] dark:border-slate-800 flex items-center justify-between text-xs gap-2">
              <button
                onClick={() => navigate(`/chat?q=${encodeURIComponent(item.title)}`)}
                className="flex items-center gap-1.5 font-bold text-[#684EC9] dark:text-purple-400 hover:underline cursor-pointer press-feedback"
              >
                <MessageSquare size={14} />
                <span>{t('saved.open_chat')}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + `/legal-search?q=${encodeURIComponent(item.title)}`);
                    alert('Link copied to clipboard');
                  }}
                  className="p-2 text-[#7E779C] hover:text-[#684EC9] rounded-lg hover:bg-[#EDE9FE] dark:hover:bg-purple-950/30 transition-colors cursor-pointer press-feedback"
                  title="Share"
                >
                  <Share2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-[#7E779C] hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer press-feedback"
                  title={t('saved.remove')}
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
