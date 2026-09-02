import React from 'react';

const STATUS_MAP: Record<string, string> = {
  'Uploaded': 'bg-gray-100 text-gray-800',
  'Processing': 'bg-indigo-100 text-indigo-800',
  'Text Extracted': 'bg-blue-100 text-blue-800',
  'Analyzing': 'bg-purple-100 text-purple-800',
  'Review Required': 'bg-amber-100 text-amber-800',
  'Completed': 'bg-emerald-100 text-emerald-800',
  'Failed': 'bg-red-100 text-red-800',
};

export const DocumentStatus: React.FC<{ status: string }> = ({ status }) => (
  <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_MAP[status] || 'bg-gray-100'}`}>
    {status}
  </span>
);
