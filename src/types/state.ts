export type AppStatus = 
  | 'idle'
  | 'loading'
  | 'processing'
  | 'success'
  | 'empty'
  | 'error'
  | 'partial'
  | 'unauthorized'
  | 'unavailable';

export interface StateConfig {
  status: AppStatus;
  message?: string;
  onRetry?: () => void;
  onAction?: () => void;
  actionLabel?: string;
}
