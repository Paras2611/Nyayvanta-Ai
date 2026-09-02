import React from 'react';

const STATUS_MAP: Record<string, string> = {
  'Draft': 'bg-gray-100 text-gray-800',
  'Collecting Facts': 'bg-blue-100 text-blue-800',
  'Analyzing': 'bg-indigo-100 text-indigo-800',
  'Review Required': 'bg-amber-100 text-amber-800',
  'Completed': 'bg-emerald-100 text-emerald-800',
  'Error': 'bg-red-100 text-red-800',
};

export const CaseStatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_MAP[status] || 'bg-gray-100'}`}>
    {status}
  </span>
);

export const VerificationBadge = CaseStatusBadge;
