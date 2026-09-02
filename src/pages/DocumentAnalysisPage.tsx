import React from 'react';
import { DocumentUploader } from '../features/documents/components/DocumentUploader';
import { DocumentStatus } from '../features/documents/components/DocumentStatus';
import { FindingCard } from '../features/documents/components/FindingCard';

export const DocumentAnalysisPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Document Analysis</h1>
        <DocumentUploader onUpload={() => {}} />
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="font-bold mb-2">Uploaded Documents</h2>
            <div className="flex items-center justify-between p-2 border-b">
                <span>Lease_Agreement.pdf</span>
                <DocumentStatus status="Completed" />
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold">Analysis Findings</h2>
        <FindingCard finding={{ title: "Arbitration Clause", explanation: "Clause 14 mandates binding arbitration.", source: "Lease Clause 14", verificationStatus: "Verified" }} />
      </div>
    </div>
  );
};
