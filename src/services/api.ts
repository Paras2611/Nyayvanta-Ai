import axios from 'axios';

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

// API functions
export async function sendChatQuery(
  query: string,
  domainId?: string,
  conversationId?: string,
  clarificationAnswers?: Record<string, any>
): Promise<EvidenceBackedResponse> {
  const res = await apiClient.post<EvidenceBackedResponse>('/chat', {
    query,
    domainId,
    conversationId,
    clarificationAnswers,
  });
  return res.data;
}

export async function searchLegalCorpus(
  query: string,
  tab: string = 'All',
  domain?: string
): Promise<SearchResponse> {
  const res = await apiClient.post<SearchResponse>('/search', {
    query,
    tab,
    domain,
  });
  return res.data;
}

export async function fetchLaws() {
  const res = await apiClient.get('/laws');
  return res.data;
}

export async function fetchLawDetail(id: string) {
  const res = await apiClient.get(`/laws/${id}`);
  return res.data;
}

export async function fetchCases() {
  const res = await apiClient.get('/cases');
  return res.data;
}

export async function fetchCaseDetail(id: string) {
  const res = await apiClient.get(`/cases/${id}`);
  return res.data;
}

export async function analyzeDocument(documentText?: string, filename?: string) {
  const res = await apiClient.post<DocumentAnalysisResponse>('/documents/analyze', {
    document_text: documentText,
    filename: filename,
  });
  return res.data;
}

export async function fetchSavedItems(tab?: string) {
  const res = await apiClient.get('/saved', { params: { tab } });
  return res.data;
}

export async function saveResearchItem(item: { title: string; itemType: string; referenceId?: string; description?: string; dataPayload?: any }) {
  const res = await apiClient.post('/saved', item);
  return res.data;
}

export async function deleteSavedItem(id: string) {
  const res = await apiClient.delete(`/saved/${id}`);
  return res.data;
}

export async function fetchProfile() {
  const res = await apiClient.get('/profile');
  return res.data;
}

export async function updateProfile(data: any) {
  const res = await apiClient.put('/profile', data);
  return res.data;
}

export async function fetchAuditEvents() {
  const res = await apiClient.get('/audit-events');
  return res.data;
}
