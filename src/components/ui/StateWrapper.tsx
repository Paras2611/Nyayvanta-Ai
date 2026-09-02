import React from 'react';
import { StateConfig } from '../../types/state';
import { AlertTriangle, Loader2, Search, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export const StateWrapper: React.FC<StateConfig & { children: React.ReactNode }> = ({ 
  status, message, onRetry, onAction, actionLabel, children 
}) => {
  if (status === 'loading' || status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p className="text-sm text-gray-500">{message || (status === 'loading' ? 'Loading...' : 'Processing...')}</p>
      </div>
    );
  }

  if (status === 'error' || status === 'unavailable' || status === 'unauthorized') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <AlertTriangle className="text-amber-500" size={48} />
        <h3 className="font-bold text-lg">{status === 'unauthorized' ? 'Unauthorized' : 'Something went wrong'}</h3>
        <p className="text-sm text-gray-600">{message || 'An unexpected error occurred.'}</p>
        <div className="flex gap-2">
          {onRetry && <Button onClick={onRetry}><RefreshCw className="mr-2" size={16}/>Retry</Button>}
          {onAction && <Button variant="outline" onClick={onAction}>{actionLabel || 'Go Back'}</Button>}
        </div>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <Search className="text-gray-400" size={48} />
        <p className="text-gray-500">{message || 'No results found.'}</p>
      </div>
    );
  }

  return <>{children}</>;
};
