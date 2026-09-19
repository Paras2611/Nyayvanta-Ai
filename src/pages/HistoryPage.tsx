import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, MessageSquare, Trash2, ArrowRight, Archive, Edit3 } from 'lucide-react';

interface HistoryEntry {
  id: string;
  title: string;
  domain: string;
  dateGroup: 'Today' | 'Yesterday' | 'Previous 7 Days' | 'Older';
  timestamp: string;
  excerpt: string;
}

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<HistoryEntry[]>([
    {
      id: 'hist-1',
      title: 'Landlord withholding deposit of Rs 80,000 in Bengaluru',
      domain: 'tenancy',
      dateGroup: 'Today',
      timestamp: '10:45 AM',
      excerpt: 'Section 108(B)(q) Transfer of Property Act and Model Tenancy Act refund rules.'
    },
    {
      id: 'hist-2',
      title: 'Defective laptop e-commerce replacement refusal',
      domain: 'consumer',
      dateGroup: 'Today',
      timestamp: '08:20 AM',
      excerpt: 'Consumer Protection Act 2019 Section 2(7) consumer definition and Section 2(11) service deficiency.'
    },
    {
      id: 'hist-3',
      title: 'Post-employment non-compete restraint in software contract',
      domain: 'employment',
      dateGroup: 'Yesterday',
      timestamp: 'Yesterday, 4:15 PM',
      excerpt: 'Section 27 Indian Contract Act 1872 and Niranjan Shankar Golikari landmark Supreme Court precedent.'
    },
    {
      id: 'hist-4',
      title: 'MSME invoice clearance overdue beyond 45 days',
      domain: 'contract',
      dateGroup: 'Previous 7 Days',
      timestamp: 'Sep 15, 2026',
      excerpt: 'MSMED Act Section 15 & 16 compound interest at 3x bank rate via MSME Samadhaan.'
    },
    {
      id: 'hist-5',
      title: 'Earnest money forfeiture legality under Section 74',
      domain: 'contract',
      dateGroup: 'Older',
      timestamp: 'Sep 02, 2026',
      excerpt: 'Kailash Nath Associates v. DDA ruling on necessity of establishing actual proven loss.'
    }
  ]);

  const handleDelete = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const groups: Array<'Today' | 'Yesterday' | 'Previous 7 Days' | 'Older'> = [
    'Today',
    'Yesterday',
    'Previous 7 Days',
    'Older'
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="text-indigo-600" size={24} />
          <span>Research History</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Chronological audit trail of your past legal inquiries, questions, and retrieved evidence.
        </p>
      </div>

      <div className="space-y-6">
        {groups.map((grp) => {
          const groupItems = historyItems.filter((i) => i.dateGroup === grp);
          if (groupItems.length === 0) return null;

          return (
            <div key={grp} className="space-y-3">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {grp}
              </h2>
              <div className="space-y-2">
                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {item.domain}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{item.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/chat?q=${encodeURIComponent(item.title)}&domain=${item.domain}`)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                      >
                        <span>Continue</span>
                        <ArrowRight size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
