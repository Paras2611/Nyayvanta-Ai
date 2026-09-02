import React from 'react';
import { MOCK_CASES } from '../../../mock/dashboardData';
import { CaseCard } from './CaseCard';

export const RecentCases: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold">Recent Cases</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {MOCK_CASES.map(c => <CaseCard key={c.id} caseItem={c} />)}
    </div>
  </div>
);
