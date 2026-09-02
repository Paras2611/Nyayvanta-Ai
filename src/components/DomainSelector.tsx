import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Home,
  Briefcase,
  FileText,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';
import { SUPPORTED_DOMAINS, UNSUPPORTED_DOMAINS_MAP } from '../data/legalDomains';
import { SupportedDomainId } from '../types/legal';

interface DomainSelectorProps {
  onSelectDomain: (domainId: SupportedDomainId) => void;
  onQuerySubmit: (query: string) => void;
  isClassifying: boolean;
}

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  consumer: <ShieldAlert className="w-6 h-6 text-emerald-400" />,
  tenancy: <Home className="w-6 h-6 text-blue-400" />,
  employment: <Briefcase className="w-6 h-6 text-purple-400" />,
  contract: <FileText className="w-6 h-6 text-amber-400" />
};

export const DomainSelector: React.FC<DomainSelectorProps> = ({
  onSelectDomain,
  onQuerySubmit,
  isClassifying
}) => {
  const [naturalQuery, setNaturalQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (naturalQuery.trim()) {
      onQuerySubmit(naturalQuery.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Title & Value Proposition */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>India-Specific Legal Information & Case Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-serif-legal mb-4">
          Evidence-First Intelligence for Indian Legal Disputes
        </h1>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          Structured case intake, document analysis, bare act statutory citations, and claim verification for select civil & commercial matters under Indian law.
        </p>
      </div>

      {/* Natural Language Query & Scope Check Bar */}
      <div className="max-w-3xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder="Describe your legal issue (e.g., 'Landlord refusing ₹1.5L deposit', 'Employer withheld salary', 'Defective laptop warranty denial')..."
              className="w-full pl-12 pr-32 py-4 bg-white border border-gray-300 hover:border-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-2xl text-gray-900 placeholder:text-gray-400 text-sm shadow-sm transition"
            />
            <motion.button
              type="submit"
              disabled={!naturalQuery.trim() || isClassifying}
              whileTap={{ scale: 0.98 }}
              className="absolute right-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              {isClassifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <span>Analyze Scope</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <span>Queries are instantly classified to enforce LawLink&apos;s strict 4-domain boundaries.</span>
        </div>
      </div>

      {/* 4 Supported Domains Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-serif-legal">
              Supported Legal Domains
            </h2>
            <p className="text-xs text-gray-500">
              Select one of the four verified legal practice areas to initiate intake.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            4 Supported Domains
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.values(SUPPORTED_DOMAINS).map((domain) => (
            <motion.div
              key={domain.id}
              onClick={() => onSelectDomain(domain.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 hover:border-accent/50 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-accent/30 transition">
                    {DOMAIN_ICONS[domain.id]}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${domain.colorScheme.badge}`}>
                    {domain.shortTitle}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-accent transition mb-2">
                  {domain.title}
                </h3>

                <p className="text-gray-600 text-xs leading-relaxed mb-4">
                  {domain.tagline}
                </p>

                {/* Primary Acts */}
                <div className="mb-4">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Governing Acts & Statutes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.primaryActs.map((act, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 font-mono"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Typical Issues Bullet Points */}
                <div className="space-y-1.5 mb-6">
                  {domain.typicalIssues.slice(0, 3).map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-accent group-hover:text-accent/80">
                <span>Start Case Intake</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scope Restriction Transparency & Unsupported Domains List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Scope Restriction Notice: Unsupported Domains
          </h3>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          To prevent misleading legal advice and maintain high-fidelity evidence standards, LawLink strictly excludes the following matters in the current system:
        </p>

        <div className="flex flex-wrap gap-2">
          {Object.values(UNSUPPORTED_DOMAINS_MAP).map((unsupported) => (
            <motion.button
              key={unsupported.category}
              onClick={() => onQuerySubmit(unsupported.keywords[0])}
              whileTap={{ scale: 0.95 }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white border border-rose-700 transition flex items-center gap-1.5 cursor-pointer"
              title="Click to test guardrail redirect"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{unsupported.label.split('&')[0].trim()}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
