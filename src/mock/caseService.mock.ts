import { ICaseService } from '../services/caseService.interface';
import { LegalCase, CaseIntakePayload } from '../types';

export class CaseServiceMock implements ICaseService {
  async analyzeCase(payload: CaseIntakePayload): Promise<LegalCase> {
    return Promise.resolve({
      id: 'mock-id',
      domain: payload.domainId,
      status: 'ANALYSIS_COMPLETE',
      createdAt: new Date(),
      facts: payload.facts,
      analysis: { summary: 'Mock analysis completed' }
    });
  }
  
  async getHistory(): Promise<LegalCase[]> {
    return Promise.resolve([]);
  }
  
  async saveCase(_: LegalCase): Promise<void> {
    return Promise.resolve();
  }
}
