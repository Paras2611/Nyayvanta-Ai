import React from 'react';
import { X, Sparkles, ArrowRight, ShieldAlert, Home, Briefcase, FileText, AlertOctagon } from 'lucide-react';
import { PREBUILT_SAMPLE_CASES, PrebuiltSampleCase } from '../data/sampleCases';

interface SampleCasesModalProps {
  onSelectCase: (sample: PrebuiltSampleCase) => void;
  onClose: () => void;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  consumer: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
  tenancy: <Home className="w-5 h-5 text-blue-400" />,
  employment: <Briefcase className="w-5 h-5 text-purple-400" />,
  contract: <FileText className="w-5 h-5 text-amber-400" />,
  unsupported_criminal: <AlertOctagon className="w-5 h-5 text-rose-400" />,
  unsupported_family: <AlertOctagon className="w-5 h-5 text-rose-400" />
};

export const SampleCasesModal: React.FC<SampleCasesModalProps> = ({
  onSelectCase,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white font-serif-legal">
                Explore Realistic Indian Case Scenarios
              </h3>
              <p className="text-xs text-slate-400">
                Test LawLink with supported disputes or verify strict scope guardrails
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

        {/* List of cases */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREBUILT_SAMPLE_CASES.map((sample) => (
              <div
                key={sample.id}
                onClick={() => onSelectCase(sample)}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  sample.isUnsupported
                    ? 'bg-rose-950/20 hover:bg-rose-950/40 border-rose-900/40 hover:border-rose-500/50'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-amber-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      {ICONS_MAP[sample.domainId] || <FileText className="w-5 h-5 text-slate-400" />}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        sample.isUnsupported
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {sample.badgeLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                    {sample.name}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {sample.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs font-semibold">
                  <span className={sample.isUnsupported ? 'text-rose-400' : 'text-amber-400'}>
                    {sample.isUnsupported ? 'Test Guardrail Refusal' : 'Load Structured Case'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
