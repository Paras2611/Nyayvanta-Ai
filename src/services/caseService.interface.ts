import { LegalCase, CaseIntakePayload } from '../types';

export interface ICaseService {
  analyzeCase(payload: CaseIntakePayload): Promise<LegalCase>;
  getHistory(): Promise<LegalCase[]>;
  saveCase(legalCase: LegalCase): Promise<void>;
}
