import { DomainId } from '../types';

export interface DomainConfig {
  id: DomainId;
  title: string;
  factDefinitions: Array<{ key: string; label: string; type: string }>;
}

export const DOMAIN_REGISTRY: Record<DomainId, DomainConfig> = {
  consumer: { 
    id: 'consumer', 
    title: 'Consumer Complaints',
    factDefinitions: [{ key: 'product', label: 'Product Name', type: 'text' }] 
  },
  tenancy: { 
    id: 'tenancy', 
    title: 'Tenancy Disputes',
    factDefinitions: [{ key: 'landlord', label: 'Landlord Name', type: 'text' }] 
  },
  employment: { 
    id: 'employment', 
    title: 'Employment Disputes',
    factDefinitions: [{ key: 'employer', label: 'Employer Name', type: 'text' }] 
  },
  contract: { 
    id: 'contract', 
    title: 'Contract Disputes',
    factDefinitions: [{ key: 'contractType', label: 'Contract Type', type: 'text' }] 
  },
};
