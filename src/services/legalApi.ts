import {
  CaseIntakePayload,
  DomainClassificationResult,
  LegalAnalysisResponse,
  SupportedDomainId
} from '../types/legal';

export async function classifyLegalQuery(
  queryText: string,
  domainHint?: SupportedDomainId
): Promise<DomainClassificationResult> {
  try {
    const response = await fetch('/api/legal/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryText, domainHint })
    });

    if (!response.ok) {
      throw new Error(`Classification failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('API classification fetch failed, using local safety heuristic:', error);
    // Local fallback check
    const lower = queryText.toLowerCase();
    const unsupportedKeywords = [
      'fir', 'police', 'arrest', 'bail', 'murder', 'rape', 'assault', 'custody',
      'divorce', 'child custody', 'alimony', 'income tax', 'gst', 'nclt', 'writ'
    ];
    const match = unsupportedKeywords.find(k => lower.includes(k));
    if (match) {
      return {
        isSupported: false,
        unsupportedDomain: {
          category: 'criminal',
          label: 'Matter Outside Supported Scope',
          rejectionReason: 'This case type is currently outside LawLink’s supported MVP scope.',
          safeRedirectionGuide: {
            appropriateForum: 'Nearest Judicial Magistrate / Family Court / Relevant Authority',
            freeLegalAidAgency: 'National Legal Services Authority (NALSA) - Helpline 15100',
            helplineNumber: '15100',
            keyAdvice: 'Please consult an enrolled legal practitioner or contact NALSA for free legal assistance.'
          }
        },
        confidence: 90,
        detectedKeywords: [match]
      };
    }

    return {
      isSupported: true,
      domainId: domainHint || 'consumer',
      confidence: 85,
      detectedKeywords: []
    };
  }
}

export async function analyzeLegalCase(
  payload: CaseIntakePayload
): Promise<LegalAnalysisResponse> {
  const response = await fetch('/api/legal/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Analysis request failed with status ${response.status}`);
  }

  return await response.json();
}

export async function generateNoticeDraft(
  casePayload: Partial<CaseIntakePayload>,
  customDemands?: string,
  customDays: number = 15
): Promise<{ noticeText: string; statutoryActsCited: string[]; deliveryInstructions: string }> {
  const response = await fetch('/api/legal/draft-notice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ casePayload, customDemands, customDays })
  });

  if (!response.ok) {
    throw new Error('Failed to generate notice draft');
  }

  return await response.json();
}
