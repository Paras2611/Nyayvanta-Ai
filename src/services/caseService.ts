import { ICaseService } from './caseService.interface';
import { CaseServiceMock } from '../mock/caseService.mock';
import { CaseServiceReal } from '../api/caseService.api';

export const getCaseService = (): ICaseService => {
  return (import.meta as any).env.VITE_USE_MOCKS === 'true' 
    ? new CaseServiceMock() 
    : new CaseServiceReal();
};
