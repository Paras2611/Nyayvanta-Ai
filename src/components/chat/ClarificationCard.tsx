import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ClarificationPayload, ClarificationQuestion } from '../../services/api';

interface ClarificationCardProps {
  payload: ClarificationPayload;
  onSubmitAnswers: (answers: Record<string, any>) => void;
}

export const ClarificationCard: React.FC<ClarificationCardProps> = ({
  payload,
  onSubmitAnswers,
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleOptionSelect = (qId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const isComplete = payload.questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAnswers(answers);
  };

  return (
    <div className="bg-[#F6F4FD] dark:bg-purple-950/20 border border-[#DDD6FE] dark:border-purple-900/50 rounded-2xl p-4 sm:p-5 my-4 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 text-[#46328D] dark:text-purple-300">
        <HelpCircle size={18} className="text-[#684EC9] dark:text-purple-400 shrink-0" />
        <h3 className="font-bold text-sm">Factual Clarification Needed</h3>
      </div>
      <p className="text-xs text-[#544E6D] dark:text-slate-400">
        To ensure accurate statutory grounding and jurisdictional determination, please provide these details rather than making assumptions:
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {payload.questions.map((q, idx) => (
          <div key={q.id} className="bg-white dark:bg-[#111827] border border-[#E8E3F5] dark:border-slate-800 rounded-xl p-3.5 space-y-2 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <label className="text-xs font-bold text-[#1E1B2E] dark:text-slate-200">
                {idx + 1}. {q.text}
              </label>
              {answers[q.id] !== undefined && (
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              )}
            </div>

            {q.helpText && (
              <p className="text-[11px] text-[#7E779C] dark:text-slate-400">{q.helpText}</p>
            )}

            {/* Render input based on question type */}
            {q.type === 'yes_no' && (
              <div className="flex flex-wrap gap-2.5 pt-1">
                {['yes', 'no'].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleOptionSelect(q.id, val)}
                    className={`px-4 py-2 min-h-[40px] text-xs rounded-xl font-bold capitalize border transition-all ${
                      answers[q.id] === val
                        ? 'bg-[#684EC9] text-white border-[#684EC9] shadow-xs'
                        : 'bg-[#F8F7FC] dark:bg-slate-800 text-[#544E6D] dark:text-slate-300 border-[#E8E3F5] dark:border-slate-700 hover:bg-[#EDE9FE]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'single_choice' && q.options && (
              <div className="space-y-1.5 pt-1">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs cursor-pointer border transition-all ${
                      answers[q.id] === opt
                        ? 'bg-[#EDE9FE] dark:bg-purple-950/40 border-[#684EC9] text-[#46328D] dark:text-purple-200 font-bold'
                        : 'bg-[#F8F7FC] dark:bg-slate-800/60 border-[#E8E3F5] dark:border-slate-700 text-[#544E6D] dark:text-slate-300 hover:bg-[#EDE9FE]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionSelect(q.id, opt)}
                      className="accent-[#684EC9] w-4 h-4"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === 'dropdown' && q.options && (
              <select
                value={answers[q.id] || ''}
                onChange={(e) => handleOptionSelect(q.id, e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E8E3F5] dark:border-slate-700 bg-[#F8F7FC] dark:bg-slate-800 text-[#1E1B2E] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#684EC9]/20"
              >
                <option value="">-- Select an option --</option>
                {q.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {(q.type === 'text' || q.type === 'number') && (
              <input
                type={q.type}
                value={answers[q.id] || ''}
                onChange={(e) => handleOptionSelect(q.id, e.target.value)}
                placeholder="Enter details..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#E8E3F5] dark:border-slate-700 bg-[#F8F7FC] dark:bg-slate-800 text-[#1E1B2E] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#684EC9]/20"
              />
            )}
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!isComplete}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold shadow-xs transition-all press-feedback ${
              isComplete
                ? 'bg-[#684EC9] hover:bg-[#573EB0] text-white cursor-pointer'
                : 'bg-[#E8E3F5] dark:bg-slate-800 text-[#7E779C] dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Proceed with Grounded Legal Analysis</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </form>
    </div>
  );
};
