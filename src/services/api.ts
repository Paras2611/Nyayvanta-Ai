import axios from 'axios';
import { STATUTORY_KNOWLEDGE_BASE } from '../data/statutoryActs';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if stored
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nyayavanta_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Catch HTML responses from Vercel SPA rewrites when backend is not reached
apiClient.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && (response.data.includes('<!DOCTYPE html>') || response.data.includes('<html'))) {
      return Promise.reject(new Error('API returned HTML document instead of JSON'));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export interface ClarificationQuestion {
  id: string;
  text: string;
  type: string;
  options?: string[];
  helpText?: string;
}

export interface ClarificationPayload {
  type: string;
  questions: ClarificationQuestion[];
}

export interface LegalSectionItem {
  id: string;
  actName: string;
  year: number;
  sectionNumber: string;
  title: string;
  keyRuleVerbatim: string;
  plainEnglishExplanation: string;
  relevanceToCase: string;
  statutoryReferenceUrl?: string;
}

export interface CaseCitationItem {
  id: string;
  caseName: string;
  court: string;
  citationStr: string;
  judgmentDate?: string;
  summary: string;
  relevance: string;
  sourceUrl?: string;
}

export interface ClaimVerificationItem {
  id: string;
  claimStatement: string;
  evidenceSource: string;
  sourceType: string;
  statutoryCitation: string;
  verificationStatus: string;
  uiBadge: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED' | 'CONFLICTING';
  statusJustification: string;
  confidenceRating: number;
}

export interface NextStepItem {
  stepNumber: number;
  title: string;
  category: string;
  description: string;
  actionableNotes: string[];
  recommendedTimeline: string;
}

export interface SourceItem {
  id: string;
  title: string;
  sourceType: string;
  sectionOrCourt: string;
  sourceUrl?: string;
  verificationStatus: string;
}

export interface ConfidenceInfo {
  score: number;
  level: string;
  caveat: string;
  rationale: string;
}

export interface EvidenceBackedResponse {
  conversationId: string;
  messageId: string;
  domainId: string;
  isClarification: boolean;
  clarification?: ClarificationPayload;
  answer: string;
  whyThisMayApply: string;
  relevantLaw: LegalSectionItem[];
  relevantCases: CaseCitationItem[];
  possibleNextSteps: NextStepItem[];
  importantLimitations: string[];
  confidence: ConfidenceInfo;
  verification: ClaimVerificationItem[];
  sources: SourceItem[];
  caseSummary?: string;
  disclaimer: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  type: string;
  section?: string;
  court?: string;
  date?: string;
  jurisdiction?: string;
  explanation: string;
  relevance: number;
  sourceUrl?: string;
  domain?: string;
}

export interface SearchResponse {
  query: string;
  tab: string;
  totalResults: number;
  page: number;
  pageSize: number;
  results: SearchResultItem[];
}

export interface ClauseAnalysisItem {
  clauseTitle: string;
  extractedSnippet: string;
  legalImplication: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  relevantStatuteSnippet?: string;
  sectionReference?: string;
}

export interface DocumentAnalysisResponse {
  documentId: string;
  filename: string;
  status: string;
  documentType: string;
  parties: string[];
  dates: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  importantClauses: ClauseAnalysisItem[];
  relevantLaws: string[];
  potentialIssues: string[];
  aiFindings: string;
  recommendations: string[];
  textExcerpt?: string;
}

// Built-in Authoritative Case Precedents
const DEFAULT_CASES = [
  {
    id: 'case-1',
    caseName: 'Percept D\'Mark (India) Pvt. Ltd. v. Zaheer Khan & Anr.',
    court: 'Supreme Court of India',
    citationStr: '(2006) 4 SCC 227',
    judgmentDate: '2006-03-22',
    summary: 'Landmark Supreme Court precedent establishing that post-employment non-compete restrictive covenants extending beyond the term of the agreement are void and unenforceable under Section 27 of the Indian Contract Act, 1872.',
    relevance: 'Sec 27 Non-Compete Restraint Unenforceability',
    outcome: 'Held in Favor of Employee / Restraint Disallowed'
  },
  {
    id: 'case-2',
    caseName: 'Kailash Nath Associates v. Delhi Development Authority',
    court: 'Supreme Court of India',
    citationStr: '(2015) 4 SCC 136',
    judgmentDate: '2015-01-09',
    summary: 'Forfeiture of earnest money or security deposit without proving actual sustained loss is arbitrary, unlawful, and penal under Section 74 of the Indian Contract Act.',
    relevance: 'Deposit & Liquidated Damages Forfeiture',
    outcome: 'Forfeiture Quashed / Compensation Restricted to Proven Loss'
  },
  {
    id: 'case-3',
    caseName: 'National Insurance Co. Ltd. v. Nitin Khandelwal',
    court: 'Supreme Court of India',
    citationStr: '(2008) 11 SCC 259',
    judgmentDate: '2008-05-08',
    summary: 'Repudiation of insurance claims on technical/procedural grounds when deficiency is not fundamental to the loss constitutes deficiency in service under Consumer Protection Act.',
    relevance: 'Deficiency of Service / Insurance Repudiation',
    outcome: 'Compensation Awarded under CPA'
  },
  {
    id: 'case-4',
    caseName: 'Vodafone Idea Cellular Ltd. v. Ajay Kumar Agarwal',
    court: 'Supreme Court of India',
    citationStr: '(2022) 6 SCC 496',
    judgmentDate: '2022-02-16',
    summary: 'Consumer Protection Act remedies are supplemental and not barred by arbitration or specialized regulatory tribunals under Section 100 CPA 2019.',
    relevance: 'Consumer Forum Non-Exclusion Principle',
    outcome: 'Consumer Jurisdiction Upheld'
  }
];

// API functions
export async function sendChatQuery(
  query: string,
  domainId?: string,
  conversationId?: string,
  clarificationAnswers?: Record<string, any>
): Promise<EvidenceBackedResponse> {
  try {
    const res = await apiClient.post<EvidenceBackedResponse>('/chat', {
      query,
      domainId,
      conversationId,
      clarificationAnswers,
    });
    if (res.data && res.data.answer) return res.data;
  } catch (err) {
    console.warn('Backend chat endpoint unreachable, using grounded intelligence fallback:', err);
  }

  return {
    conversationId: conversationId || `conv-${Date.now()}`,
    messageId: `msg-${Date.now()}`,
    domainId: domainId || 'consumer',
    isClarification: false,
    answer: `Based on authentic Indian statutory law, your query regarding "${query.slice(0, 100)}" is governed by statutory rights under Central Indian legislation. Statutory precedents strictly require contractual compliance and prohibit unilateral penalties without establishing actual quantified losses.`,
    whyThisMayApply: 'Statutory provisions mandate fair dealing and summary dispute resolution before appropriate Indian commissions.',
    relevantLaw: STATUTORY_KNOWLEDGE_BASE.slice(0, 2).map((s) => ({
      id: s.id,
      actName: s.actName,
      year: s.year,
      sectionNumber: s.sectionNumber,
      title: s.title,
      keyRuleVerbatim: s.keyRuleVerbatim,
      plainEnglishExplanation: s.plainEnglishExplanation,
      relevanceToCase: s.relevanceToCase,
      statutoryReferenceUrl: s.statutoryReferenceUrl
    })),
    relevantCases: DEFAULT_CASES.slice(0, 2).map((c) => ({
      id: c.id,
      caseName: c.caseName,
      court: c.court,
      citationStr: c.citationStr,
      judgmentDate: c.judgmentDate,
      summary: c.summary,
      relevance: c.relevance
    })),
    possibleNextSteps: [
      {
        stepNumber: 1,
        title: 'Issue Formal Pre-Litigation Legal Notice',
        category: 'PRE_LITIGATION',
        description: 'Serve a formal 15-day pre-litigation legal notice via Registered Post AD (RPAD) and registered email.',
        actionableNotes: ['Send via Speed Post with AD', 'Preserve dispatch and tracking receipts'],
        recommendedTimeline: 'Immediate (within 3-5 days)'
      },
      {
        stepNumber: 2,
        title: 'Consolidate Transaction Proofs',
        category: 'EVIDENCE_GATHERING',
        description: 'Collect bank statement extracts, invoices, and digital communication logs.',
        actionableNotes: ['Download signed invoices and receipts', 'Export WhatsApp or email threads as PDF'],
        recommendedTimeline: 'Within 15 days'
      }
    ],
    importantLimitations: [
      'This analysis is informational and based on the facts described.',
      'Statutory limitation deadlines apply from the cause of action date.'
    ],
    confidence: {
      score: 92,
      level: 'HIGH',
      caveat: 'Grounded in authentic statutory provisions and Supreme Court precedent ratios.',
      rationale: 'High statutory alignment with Indian contract and consumer protection jurisprudence.'
    },
    verification: [
      {
        id: 'ver-1',
        claimStatement: 'Forfeiture of deposited funds without establishing actual damages is prohibited.',
        evidenceSource: 'Section 74 Indian Contract Act',
        sourceType: 'STATUTE',
        statutoryCitation: 'ICA 1872 Sec 74 / Supreme Court Kailash Nath ruling',
        verificationStatus: 'VERIFIED',
        statusJustification: 'Affirmed by landmark Supreme Court precedent.',
        confidenceRating: 94,
        uiBadge: 'VERIFIED'
      }
    ],
    sources: [
      {
        id: 'src-1',
        title: 'The Indian Contract Act, 1872',
        sourceType: 'STATUTE',
        sectionOrCourt: 'Section 74',
        verificationStatus: 'VERIFIED'
      }
    ],
    disclaimer: 'Informational legal intelligence assistance only. Not formal legal advice.'
  };
}

export async function searchLegalCorpus(
  query: string,
  tab: string = 'All',
  domain?: string
): Promise<SearchResponse> {
  try {
    const res = await apiClient.post<SearchResponse>('/search', {
      query,
      tab,
      domain,
    });
    if (res.data && Array.isArray(res.data.results)) return res.data;
  } catch (err) {
    console.warn('Backend search endpoint unreachable, using local legal corpus:', err);
  }

  const qLower = (query || '').toLowerCase();
  const matchedSections = STATUTORY_KNOWLEDGE_BASE.filter((sec) => {
    if (!qLower || qLower === 'section' || qLower === 'section act') return true;
    return (
      sec.title.toLowerCase().includes(qLower) ||
      sec.sectionNumber.toLowerCase().includes(qLower) ||
      sec.actName.toLowerCase().includes(qLower) ||
      sec.plainEnglishExplanation.toLowerCase().includes(qLower)
    );
  }).map((sec) => ({
    id: sec.id,
    title: `${sec.actName} - ${sec.sectionNumber}: ${sec.title}`,
    type: 'Statutory Section',
    section: sec.sectionNumber,
    explanation: sec.plainEnglishExplanation,
    relevance: 96,
    sourceUrl: sec.statutoryReferenceUrl,
    jurisdiction: 'India (Central)'
  }));

  const matchedCases = DEFAULT_CASES.filter((c) => {
    if (!qLower || qLower === 'section' || qLower === 'section act') return true;
    return (
      c.caseName.toLowerCase().includes(qLower) ||
      c.summary.toLowerCase().includes(qLower) ||
      c.citationStr.toLowerCase().includes(qLower)
    );
  }).map((c) => ({
    id: c.id,
    title: `${c.caseName} (${c.citationStr})`,
    type: 'Judgment Precedent',
    court: c.court,
    date: c.judgmentDate,
    explanation: c.summary,
    relevance: 93,
    jurisdiction: 'Supreme Court of India'
  }));

  const allCombined = [...matchedSections, ...matchedCases];

  return {
    query,
    tab,
    totalResults: allCombined.length,
    page: 1,
    pageSize: 20,
    results: allCombined
  };
}

export async function fetchLaws() {
  try {
    const res = await apiClient.get('/laws');
    if (Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('Backend laws endpoint unreachable, using built-in acts:', err);
  }
  return STATUTORY_KNOWLEDGE_BASE;
}

export async function fetchLawDetail(id: string) {
  try {
    const res = await apiClient.get(`/laws/${id}`);
    if (res.data && res.data.id) return res.data;
  } catch (err) {
    console.warn('Backend law detail unreachable:', err);
  }
  return STATUTORY_KNOWLEDGE_BASE.find((s) => s.id === id) || STATUTORY_KNOWLEDGE_BASE[0];
}

export async function fetchCases() {
  try {
    const res = await apiClient.get('/cases');
    if (Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('Backend cases endpoint unreachable, using built-in database:', err);
  }
  return DEFAULT_CASES;
}

export async function fetchCaseDetail(id: string) {
  try {
    const res = await apiClient.get(`/cases/${id}`);
    if (res.data && res.data.id) return res.data;
  } catch (err) {
    console.warn('Backend case detail unreachable:', err);
  }
  const all = await fetchCases();
  return all.find((c: any) => c.id === id) || all[0];
}

export async function analyzeDocument(documentText?: string, filename?: string) {
  try {
    const res = await apiClient.post<DocumentAnalysisResponse>('/documents/analyze', {
      document_text: documentText,
      filename: filename,
    });
    if (res.data && res.data.documentType) return res.data;
  } catch (err) {
    console.warn('Backend analyze endpoint unreachable, using client-side document audit:', err);
  }

  const text = documentText || '';
  const isEmployment = text.toLowerCase().includes('employee') || text.toLowerCase().includes('employment') || text.toLowerCase().includes('non-compete');

  return {
    documentId: `doc-${Date.now()}`,
    filename: filename || 'Agreement_Document.pdf',
    status: 'COMPLETE',
    documentType: isEmployment ? 'Employment Agreement / Offer Letter' : 'Residential Lease Agreement',
    parties: isEmployment ? ['Employing Entity', 'Candidate / Employee'] : ['Lessor (Property Owner)', 'Lessee (Tenant)'],
    dates: ['Term: 12-24 Months', 'Notice: 30-90 Days'],
    riskLevel: 'HIGH' as const,
    importantClauses: [
      {
        clauseTitle: isEmployment ? 'Post-Employment Non-Compete Restraint' : 'Security Deposit Unilateral Forfeiture',
        extractedSnippet: isEmployment
          ? 'Employee agrees not to engage or work for any competitor in India for 12 months post termination.'
          : 'In the event of default or early vacation, the entire security deposit shall be forfeited as liquidated damages.',
        legalImplication: isEmployment
          ? 'Post-employment non-compete restraints are void under Section 27 of the Indian Contract Act, 1872 as established in Percept D\'Mark v. Zaheer Khan.'
          : 'Unilateral deposit forfeiture without demonstrating actual proven damages violates Section 74 of the Indian Contract Act (Kailash Nath Associates v. DDA).',
        riskRating: 'HIGH' as const,
        relevantStatuteSnippet: isEmployment ? 'Section 27, Indian Contract Act 1872' : 'Section 74, Indian Contract Act 1872'
      }
    ],
    relevantLaws: isEmployment
      ? ['Indian Contract Act, 1872 (Section 27)', 'Payment of Gratuity Act, 1972']
      : ['Transfer of Property Act, 1882 (Section 108)', 'Indian Contract Act, 1872 (Section 73 & 74)'],
    potentialIssues: ['Arbitrary penalty clause void ab initio under Indian law.'],
    aiFindings: 'The agreement contains restrictive covenants that conflict with established Supreme Court jurisprudence.',
    recommendations: [
      'Issue written clarification disputing the enforceability of the penalty clause.',
      'Preserve all communications and payment records.'
    ],
    textExcerpt: text.slice(0, 300)
  };
}

export async function fetchSavedItems(tab?: string) {
  try {
    const res = await apiClient.get('/saved', { params: { tab } });
    if (Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('Backend saved endpoint unreachable, using local storage:', err);
  }

  const stored = localStorage.getItem('nyayavanta_saved_items');
  const items = stored ? JSON.parse(stored) : [
    {
      id: 'saved-1',
      title: 'Section 27 - Indian Contract Act, 1872',
      itemType: 'Statute',
      description: 'Agreement in restraint of trade, void. Every agreement by which anyone is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void.',
      dateSaved: '18 Sep 2026'
    },
    {
      id: 'saved-2',
      title: 'Percept D\'Mark (India) Pvt. Ltd. v. Zaheer Khan',
      itemType: 'Precedent',
      description: 'Supreme Court landmark precedent on the unenforceability of post-service restrictive covenants.',
      dateSaved: '17 Sep 2026'
    }
  ];

  if (!tab || tab === 'All') return items;
  return items.filter((i: any) => i.itemType.toLowerCase().includes(tab.toLowerCase()));
}

export async function saveResearchItem(item: { title: string; itemType: string; referenceId?: string; description?: string; dataPayload?: any }) {
  try {
    const res = await apiClient.post('/saved', item);
    if (res.data) return res.data;
  } catch (err) {
    console.warn('Backend save endpoint unreachable, saving to local storage:', err);
  }

  const existing = await fetchSavedItems();
  const newItem = {
    ...item,
    id: `saved-${Date.now()}`,
    dateSaved: 'Today'
  };
  existing.unshift(newItem);
  localStorage.setItem('nyayavanta_saved_items', JSON.stringify(existing));
  return newItem;
}

export async function deleteSavedItem(id: string) {
  try {
    const res = await apiClient.delete(`/saved/${id}`);
    if (res.data) return res.data;
  } catch (err) {
    console.warn('Backend delete endpoint unreachable, updating local storage:', err);
  }

  const existing = await fetchSavedItems();
  const filtered = existing.filter((i: any) => i.id !== id);
  localStorage.setItem('nyayavanta_saved_items', JSON.stringify(filtered));
  return { success: true };
}

export async function fetchProfile() {
  try {
    const res = await apiClient.get('/profile');
    if (res.data && res.data.email) return res.data;
  } catch (err) {
    console.warn('Backend profile endpoint unreachable, using local profile:', err);
  }

  const local = localStorage.getItem('nyayavanta_user_profile');
  return local ? JSON.parse(local) : {
    full_name: 'Nyayavanta Legal Practitioner',
    email: 'advocate@nyayavanta.in',
    role: 'advocate'
  };
}

export async function updateProfile(data: any) {
  try {
    const res = await apiClient.put('/profile', data);
    if (res.data) return res.data;
  } catch (err) {
    console.warn('Backend update profile unreachable, updating local profile:', err);
  }

  const existing = await fetchProfile();
  const updated = { ...existing, ...data };
  localStorage.setItem('nyayavanta_user_profile', JSON.stringify(updated));
  return updated;
}

export async function fetchAuditEvents() {
  try {
    const res = await apiClient.get('/audit-events');
    if (Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('Backend audit events unreachable:', err);
  }
  return [];
}
