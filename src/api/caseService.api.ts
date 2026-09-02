import axios from 'axios';
import { ICaseService } from '../services/caseService.interface';
import { LegalCase, CaseIntakePayload } from '../types';

export class CaseServiceReal implements ICaseService {
  private api = axios.create({ baseURL: '/api' });

  async analyzeCase(payload: CaseIntakePayload): Promise<LegalCase> {
    const { data } = await this.api.post<LegalCase>('/legal/analyze', payload);
    return data;
  }
  
  async getHistory(): Promise<LegalCase[]> {
    const { data } = await this.api.get<LegalCase[]>('/cases');
    return data;
  }
  
  async saveCase(legalCase: LegalCase): Promise<void> {
    await this.api.post('/cases', legalCase);
  }
}
