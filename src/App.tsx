/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DomainSelector } from './components/DomainSelector';
import { CaseIntakeForm } from './components/CaseIntakeForm';
import { CaseReportView } from './components/CaseReportView';
import { UnsupportedScopeBanner } from './components/UnsupportedScopeBanner';
import { SampleCasesModal } from './components/SampleCasesModal';
import { StatutoryLibraryModal } from './components/StatutoryLibraryModal';
import { LegalNoticeDraftModal } from './components/LegalNoticeDraftModal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { SUPPORTED_DOMAINS } from './data/legalDomains';
import { PrebuiltSampleCase } from './data/sampleCases';
import {
  CaseIntakePayload,
  LegalAnalysisResponse,
  SupportedDomainId
} from './types/legal';
import { analyzeLegalCase, classifyLegalQuery } from './services/legalApi';

type AppStep = 'DOMAIN_SELECT' | 'CASE_INTAKE' | 'CASE_REPORT' | 'UNSUPPORTED_GUARDRAIL';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('DOMAIN_SELECT');
  const [selectedDomainId, setSelectedDomainId] = useState<SupportedDomainId | null>(null);
  const [intakeFormData, setIntakeFormData] = useState<Partial<CaseIntakePayload> | undefined>(undefined);
  const [analysisResult, setAnalysisResult] = useState<LegalAnalysisResponse | null>(null);

  // Guardrail state
  const [unsupportedDetails, setUnsupportedDetails] = useState<any>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  // Modals state
  const [isSamplesModalOpen, setIsSamplesModalOpen] = useState(false);
  const [isStatutesModalOpen, setIsStatutesModalOpen] = useState(false);
  const [isNoticeStudioOpen, setIsNoticeStudioOpen] = useState(false);

  // Loading states
  const [isClassifying, setIsClassifying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Handle Domain selection
  const handleSelectDomain = (domainId: SupportedDomainId) => {
    setSelectedDomainId(domainId);
    setIntakeFormData({ domainId });
    setCurrentStep('CASE_INTAKE');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Handle Natural language query search
  const handleQuerySubmit = async (queryText: string) => {
    setIsClassifying(true);
    setErrorMessage(null);
    setLastQuery(queryText);

    try {
      const result = await classifyLegalQuery(queryText);

      if (!result.isSupported && result.unsupportedDomain) {
        setUnsupportedDetails(result.unsupportedDomain);
        setCurrentStep('UNSUPPORTED_GUARDRAIL');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (result.domainId) {
        setSelectedDomainId(result.domainId);
        setIntakeFormData({
          domainId: result.domainId,
          disputeTitle: queryText.slice(0, 80),
          disputeDescription: queryText
        });
        setCurrentStep('CASE_INTAKE');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Classification error:', err);
      // Fallback to consumer domain
      setSelectedDomainId('consumer');
      setIntakeFormData({
        domainId: 'consumer',
        disputeDescription: queryText
      });
      setCurrentStep('CASE_INTAKE');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsClassifying(false);
    }
  };

  // 3. Handle Case Intake Submission -> Run Analysis
  const handleIntakeSubmit = async (payload: CaseIntakePayload) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const report = await analyzeLegalCase(payload);
      setAnalysisResult(report);
      setCurrentStep('CASE_REPORT');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Failed to generate legal analysis. Please check inputs and retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 4. Navigate to a specific step
  const handleStepNavigate = (step: AppStep) => {
    setCurrentStep(step);
    if (step === 'DOMAIN_SELECT') {
      setSelectedDomainId(null);
      setIntakeFormData(undefined);
      setAnalysisResult(null);
      setUnsupportedDetails(null);
      setErrorMessage(null);
    }
  };

  // 5. Handle Quick Loading of Prebuilt Sample Cases
  const handleSelectSampleCase = (sample: PrebuiltSampleCase) => {
    setIsSamplesModalOpen(false);

    if (sample.isUnsupported) {
      setLastQuery(sample.intakeData.disputeDescription);
      setUnsupportedDetails({
        category: sample.unsupportedCategory || 'criminal',
        label: sample.badgeLabel,
        rejectionReason: `Matters involving ${sample.badgeLabel} fall outside LawLink's 4 supported domains.`,
        safeRedirectionGuide: {
          appropriateForum: 'Nearest Police Station / Judicial Magistrate / Family Court',
          freeLegalAidAgency: 'National Legal Services Authority (NALSA) - Helpline 15100',
          helplineNumber: '15100 (Free Legal Aid) / 112 (Emergency Police)',
          keyAdvice: 'You have a constitutional right to legal aid under Article 39A. Contact DLSA or an enrolled advocate.',
          officialPortal: 'https://nalsa.gov.in'
        }
      });
      setCurrentStep('UNSUPPORTED_GUARDRAIL');
      return;
    }

    setSelectedDomainId(sample.domainId as SupportedDomainId);
    setIntakeFormData(sample.intakeData);
    setCurrentStep('CASE_INTAKE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to Home
  const handleReset = () => {
    setCurrentStep('DOMAIN_SELECT');
    setSelectedDomainId(null);
    setIntakeFormData(undefined);
    setAnalysisResult(null);
    setUnsupportedDetails(null);
    setErrorMessage(null);
  };

  return (
    <div className="h-screen flex flex-col bg-page-bg text-text-primary font-sans selection:bg-accent/20 selection:text-accent overflow-hidden">
      {/* Universal Header */}
      <Header
        onOpenSamples={() => setIsSamplesModalOpen(true)}
        onOpenStatutes={() => setIsStatutesModalOpen(true)}
        onReset={handleReset}
        onStepNavigate={handleStepNavigate}
        activeDomainTitle={selectedDomainId ? SUPPORTED_DOMAINS[selectedDomainId]?.shortTitle : undefined}
        currentStep={currentStep}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6">
        <div className="max-w-[1700px] mx-auto w-full">
        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-2xl text-xs text-rose-200 flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white font-bold ml-4"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: DOMAIN SELECTOR */}
        {currentStep === 'DOMAIN_SELECT' && (
          <DomainSelector
            onSelectDomain={handleSelectDomain}
            onQuerySubmit={handleQuerySubmit}
            isClassifying={isClassifying}
          />
        )}

        {/* STEP 2: CASE INTAKE */}
        {currentStep === 'CASE_INTAKE' && selectedDomainId && (
          <CaseIntakeForm
            domainId={selectedDomainId}
            initialData={intakeFormData}
            onBack={() => setCurrentStep('DOMAIN_SELECT')}
            onSubmit={handleIntakeSubmit}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* STEP 3: CASE REPORT */}
        {currentStep === 'CASE_REPORT' && analysisResult && (
          <CaseReportView
            analysis={analysisResult}
            onBack={() => setCurrentStep('CASE_INTAKE')}
            onOpenNoticeStudio={() => setIsNoticeStudioOpen(true)}
          />
        )}

        {/* STEP 4: UNSUPPORTED SCOPE GUARDRAIL BANNER */}
        {currentStep === 'UNSUPPORTED_GUARDRAIL' && unsupportedDetails && (
          <UnsupportedScopeBanner
            unsupportedData={unsupportedDetails}
            onBackToSupported={() => setCurrentStep('DOMAIN_SELECT')}
            detectedQuery={lastQuery}
          />
        )}
        </div>
      </main>

      {/* Modals */}
      {isSamplesModalOpen && (
        <SampleCasesModal
          onSelectCase={handleSelectSampleCase}
          onClose={() => setIsSamplesModalOpen(false)}
        />
      )}

      {isStatutesModalOpen && (
        <StatutoryLibraryModal
          onClose={() => setIsStatutesModalOpen(false)}
        />
      )}

      {isNoticeStudioOpen && analysisResult && (
        <LegalNoticeDraftModal
          analysis={analysisResult}
          onClose={() => setIsNoticeStudioOpen(false)}
        />
      )}

      {/* Universal Legal Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
}
