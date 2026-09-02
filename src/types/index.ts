export type DomainId = 'consumer' | 'tenancy' | 'employment' | 'contract';

export interface CaseIntakePayload {
  domainId: DomainId;
  facts: Record<string, any>;
  documentContext?: string;
}

export interface LegalCase {
  id: string;
  domain: DomainId;
  status: 'DRAFT' | 'ANALYSIS_COMPLETE';
  createdAt: Date;
  facts: Record<string, any>;
  analysis?: any;
}
