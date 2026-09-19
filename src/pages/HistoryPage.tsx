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
        <h1 className="text-xl md:text-2xl font-black text-[#1E1B2E] dark:text-white flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#684EC9] dark:text-purple-300 flex items-center justify-center shrink-0">
            <History size={20} />
          </div>
          <span>Research History</span>
        </h1>
        <p className="text-xs md:text-sm text-[#544E6D] dark:text-slate-400">
          Chronological audit trail of your past legal inquiries, questions, and retrieved evidence.
        </p>
      </div>

      <div className="space-y-6">
        {groups.map((grp) => {
          const groupItems = historyItems.filter((i) => i.dateGroup === grp);
          if (groupItems.length === 0) return null;

          return (
            <div key={grp} className="space-y-3">
              <h2 className="text-xs font-bold text-[#573EAE] dark:text-purple-400 uppercase tracking-wider">
                {grp}
              </h2>
              <div className="space-y-2.5">
                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-[#684EC9] dark:hover:border-purple-600 transition-colors"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-[#EDE9FE] dark:bg-purple-950 text-[#573EAE] dark:text-purple-300 border border-[#DDD6FE] dark:border-purple-800">
                          {item.domain}
                        </span>
                        <span className="text-[11px] text-[#7E779C]">{item.timestamp}</span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-[#1E1B2E] dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#544E6D] dark:text-slate-300 line-clamp-1 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => navigate(`/chat?q=${encodeURIComponent(item.title)}&domain=${item.domain}`)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#684EC9] hover:bg-[#573EB0] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Continue</span>
                        <ArrowRight size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-[#7E779C] hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
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
