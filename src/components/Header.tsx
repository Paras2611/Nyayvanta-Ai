import React from 'react';
import { motion } from 'motion/react';
import { Scale, ShieldCheck, BookOpen, Sparkles, AlertCircle, FileText, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onOpenSamples: () => void;
  onOpenStatutes: () => void;
  onReset: () => void;
  onStepNavigate: (step: 'DOMAIN_SELECT' | 'CASE_INTAKE' | 'CASE_REPORT' | 'UNSUPPORTED_GUARDRAIL') => void;
  activeDomainTitle?: string;
  currentStep: 'DOMAIN_SELECT' | 'CASE_INTAKE' | 'CASE_REPORT' | 'UNSUPPORTED_GUARDRAIL';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSamples,
  onOpenStatutes,
  onReset,
  onStepNavigate,
  activeDomainTitle,
  currentStep
}) => {
  const getBreadcrumbs = () => {
    switch (currentStep) {
      case 'DOMAIN_SELECT':
        return [{ name: 'Home', step: 'DOMAIN_SELECT' }];
      case 'CASE_INTAKE':
        return [{ name: 'Home', step: 'DOMAIN_SELECT' }, { name: 'Domain Selection', step: 'DOMAIN_SELECT' }, { name: 'Intake', step: 'CASE_INTAKE' }];
      case 'CASE_REPORT':
        return [{ name: 'Home', step: 'DOMAIN_SELECT' }, { name: 'Domain Selection', step: 'DOMAIN_SELECT' }, { name: 'Intake', step: 'CASE_INTAKE' }, { name: 'Report', step: 'CASE_REPORT' }];
      case 'UNSUPPORTED_GUARDRAIL':
        return [{ name: 'Home', step: 'DOMAIN_SELECT' }, { name: 'Scope Notice', step: 'UNSUPPORTED_GUARDRAIL' }];
      default:
        return [{ name: 'Home', step: 'DOMAIN_SELECT' }];
    }
  };

  const breadcrumbs = getBreadcrumbs();
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 ring-1 ring-accent/30">
            <Scale className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-gray-900 font-serif-legal">LAWLINK</span>
              <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/30">
                INDIA
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">
              AI Legal Case & Document Intelligence Platform
            </p>
          </div>
        </div>

        {/* Center Active Domain Tag (if active) */}
        {activeDomainTitle && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-gray-500">Active Domain:</span>
            <span className="font-semibold text-gray-800">{activeDomainTitle}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSamples}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-xs font-medium border border-gray-300 transition"
            title="Load realistic Indian dispute scenarios"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Sample Cases</span>
            <span className="sm:hidden">Samples</span>
          </button>

          <button
            onClick={onOpenStatutes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-xs font-medium border border-gray-300 transition"
            title="Browse Indian Bare Acts & Sections"
          >
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Bare Acts Library</span>
            <span className="sm:hidden">Statutes</span>
          </button>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          {/* Evidence Visible Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Evidence-Visible AI</span>
          </div>
        </div>
      </div>
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.name}>
            {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />}
            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onStepNavigate(crumb.step as any)}
              className={`shrink-0 ${index === breadcrumbs.length - 1 ? 'font-semibold text-gray-900 cursor-default' : 'hover:text-accent cursor-pointer'}`}
              disabled={index === breadcrumbs.length - 1}
            >
              {crumb.name}
            </motion.button>
          </React.Fragment>
        ))}
      </div>
    </header>
  );
};
