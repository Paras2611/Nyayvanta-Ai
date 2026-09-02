import React from 'react';
import { RECENT_DOCUMENTS } from '../../../mock/dashboardData';
import { FileText } from 'lucide-react';

export const RecentDocuments: React.FC = () => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h2 className="text-lg font-bold mb-4">Recent Documents</h2>
    <div className="space-y-2">
      {RECENT_DOCUMENTS.map((doc, i) => (
        <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
          <FileText className="text-gray-400" size={18} />
          <div>
            <p className="text-sm font-medium">{doc.name}</p>
            <p className="text-xs text-gray-400">{doc.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
