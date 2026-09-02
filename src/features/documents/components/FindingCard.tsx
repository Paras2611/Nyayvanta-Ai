import React from 'react';
import { VerificationBadge } from '../../dashboard/components/CaseStatusBadge'; // Reusing badge pattern

export const FindingCard: React.FC<{ finding: any }> = ({ finding }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-2">
    <div className="flex justify-between">
      <h4 className="font-bold text-sm">{finding.title}</h4>
      <VerificationBadge status={finding.verificationStatus} />
    </div>
    <p className="text-xs text-gray-600">{finding.explanation}</p>
    <div className="text-xs bg-gray-50 p-2 rounded">
      <span className="font-semibold">Source:</span> {finding.source}
    </div>
  </div>
);
