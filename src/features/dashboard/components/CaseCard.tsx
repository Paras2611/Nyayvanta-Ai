import React from 'react';
import { CaseStatusBadge } from './CaseStatusBadge';
import { CaseProgress } from './CaseProgress';

export const CaseCard: React.FC<{ caseItem: any }> = ({ caseItem }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
    <div className="flex justify-between items-start">
      <h4 className="font-semibold">{caseItem.id}</h4>
      <CaseStatusBadge status={caseItem.status} />
    </div>
    <p className="text-sm text-gray-500 capitalize">{caseItem.domain}</p>
    <div className="text-xs text-gray-400">
      Last Updated: {caseItem.updatedAt}
    </div>
    <CaseProgress progress={caseItem.progress} />
  </div>
);
