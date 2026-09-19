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
    <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-5 my-4 space-y-4">
      <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
        <HelpCircle size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
        <h3 className="font-bold text-sm">Factual Clarification Needed</h3>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        To ensure accurate statutory grounding and jurisdictional determination, please provide these details rather than making assumptions:
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {payload.questions.map((q, idx) => (
          <div key={q.id} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {idx + 1}. {q.text}
              </label>
              {answers[q.id] !== undefined && (
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              )}
            </div>

            {q.helpText && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{q.helpText}</p>
            )}

            {/* Render input based on question type */}
            {q.type === 'yes_no' && (
              <div className="flex gap-3 pt-1">
                {['yes', 'no'].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleOptionSelect(q.id, val)}
                    className={`px-4 py-1.5 text-xs rounded font-medium capitalize border transition-colors ${
                      answers[q.id] === val
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
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
                    className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer border transition-colors ${
                      answers[q.id] === opt
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-medium'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionSelect(q.id, opt)}
                      className="text-indigo-600"
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
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
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
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
            )}
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!isComplete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              isComplete
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
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
