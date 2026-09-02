export type SupportedDomainId = 'consumer' | 'tenancy' | 'employment' | 'contract';

export type UnsupportedDomainId =
  | 'criminal'
  | 'murder'
  | 'sexual_offences'
  | 'constitutional'
  | 'tax'
  | 'property_title'
  | 'corporate'
  | 'family'
  | 'immigration'
  | 'regulatory';

export type VerificationStatus =
  | 'VERIFIED_STATUTORY'
  | 'ESTABLISHED_PRINCIPLE'
  | 'DOCUMENT_SUPPORTED'
  | 'REQUIRES_PRIMARY_VERIFICATION';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'CONDITIONAL';

export interface DomainMetadata {
  id: SupportedDomainId;
  title: string;
  shortTitle: string;
  tagline: string;
  primaryActs: string[];
  primaryForums: string[];
  typicalIssues: string[];
  icon: string;
  colorScheme: {
    badge: string;
    border: string;
    accent: string;
  };
}

export interface StatutorySection {
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

export interface ExtractedFact {
  category: 'PARTIES' | 'TIMELINE' | 'FINANCIALS' | 'OBLIGATION' | 'BREACH' | 'COMMUNICATION';
  label: string;
  value: string;
  sourceType: 'USER_INPUT' | 'DOCUMENT_EXCERPT';
  sourceSnippet?: string;
  confidence: number;
}

export interface AnalyzedClause {
  clauseTitle: string;
  extractedSnippet: string;
  legalImplication: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'POTENTIALLY_VOID';
  relevantStatuteSnippet?: string;
}

export interface VerificationClaim {
  id: string;
  claimStatement: string;
  evidenceSource: string;
  sourceType: 'STATUTE' | 'USER_DOCUMENT' | 'USER_TIMELINE' | 'PRECEDENT_DOCTRINE';
  statutoryCitation?: string;
  verificationStatus: VerificationStatus;
  statusJustification: string;
  confidenceRating: number; // 0-100
}

export interface JurisdictionalAuthority {
  forumName: string;
  hierarchyLevel: 'DISTRICT' | 'STATE' | 'NATIONAL' | 'TRIBUNAL' | 'CONCILIATION';
  pecuniaryLimit: string;
  territorialJurisdictionRule: string;
  eFilingPortalName?: string;
  eFilingPortalUrl?: string;
  limitationPeriod: string;
  statutoryFilingFee: string;
}

export interface NextInformationalStep {
  stepNumber: number;
  title: string;
  category: 'PRE_LITIGATION' | 'EVIDENCE_GATHERING' | 'FILING_PROCEDURE' | 'LEGAL_AID';
  description: string;
  actionableNotes: string[];
  recommendedTimeline: string;
}

export interface LegalAnalysisResponse {
  caseId: string;
  timestamp: string;
  domainId: SupportedDomainId;
  caseSummary: string;
  confidenceLevel: ConfidenceLevel;
  confidenceRationale: string;
  extractedFacts: ExtractedFact[];
  analyzedClauses?: AnalyzedClause[];
  statutorySections: StatutorySection[];
  jurisdiction: JurisdictionalAuthority;
  claimsVerification: VerificationClaim[];
  uncertaintiesAndGaps: {
    missingDocuments: string[];
    criticalAssumptions: string[];
    potentialOppositePartyDefenses: string[];
    stateSpecificVariations?: string;
  };
  plainEnglishAnalysis: {
    strengthOverview: string;
    keyLegalGrounds: string[];
    proceduralRoadblocks: string[];
  };
  nextSteps: NextInformationalStep[];
  noticeTemplateDraft?: {
    noticeTitle: string;
    senderDetails: string;
    recipientDetails: string;
    subject: string;
    factsChronology: string[];
    legalViolationsCited: string[];
    demandsList: string[];
    curePeriodDays: number;
    statutoryWarning: string;
  };
}

export interface DomainClassificationResult {
  isSupported: boolean;
  domainId?: SupportedDomainId;
  unsupportedDomain?: {
    category: UnsupportedDomainId;
    label: string;
    rejectionReason: string;
    safeRedirectionGuide: {
      appropriateForum: string;
      freeLegalAidAgency: string;
      helplineNumber: string;
      keyAdvice: string;
    };
  };
  confidence: number;
  detectedKeywords: string[];
}

export interface CaseIntakePayload {
  domainId: SupportedDomainId;
  stateOfIncident: string;
  disputeTitle: string;
  disputeDescription: string;
  complainantRole: string;
  oppositePartyName: string;
  oppositePartyType: string;
  disputedAmountINR?: number;
  incidentDate?: string;
  noticeAlreadySent: boolean;
  agreementExists: boolean;
  documentText?: string;
  domainSpecificAnswers: Record<string, string | boolean | number>;
}
