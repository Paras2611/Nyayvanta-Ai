import React from 'react';
import { Upload } from 'lucide-react';
import { StateWrapper } from '../../../components/ui/StateWrapper';
import { AppStatus } from '../../../types/state';

export const DocumentUploader: React.FC<{ 
  onUpload: (file: File) => void, 
  status: AppStatus,
  message?: string,
  onRetry?: () => void
}> = ({ onUpload, status, message, onRetry }) => (
  <StateWrapper status={status} message={message} onRetry={onRetry}>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 cursor-pointer transition-colors">
      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
      <p className="text-sm font-medium">Drag & drop or click to upload</p>
      <p className="text-xs text-gray-500">Supported documents for selected domain</p>
      <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
    </div>
  </StateWrapper>
);
