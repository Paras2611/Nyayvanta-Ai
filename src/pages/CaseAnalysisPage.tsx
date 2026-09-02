import React from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_ANALYSIS_DATA } from '../mock/analysisData';
import { CaseStatusBadge } from '../features/dashboard/components/CaseStatusBadge';
import { VerificationBadge } from '../features/dashboard/components/CaseStatusBadge'; // Assuming reuse
import { Card } from '../components/ui/Card';

const AnalysisSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="text-lg font-bold mb-2 text-slate-800">{title}</h2>
    <div className="text-slate-700 text-sm">{children}</div>
  </section>
);

export const CaseAnalysisPage: React.FC = () => {
  const { id } = useParams();
  const data = MOCK_ANALYSIS_DATA;

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      <div className="lg:col-span-2 space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="border-b pb-4">
          <h1 className="text-xl sm:text-2xl font-bold">{data.type}</h1>
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-2">
            <CaseStatusBadge status={data.status} />
            <span className="text-sm text-slate-500">Last Updated: {data.lastUpdated}</span>
          </div>
        </header>

        {/* Sections */}
        <AnalysisSection title="1. Case Summary">{data.summary}</AnalysisSection>
        <AnalysisSection title="2. Key Facts">{data.keyFacts.join(', ')}</AnalysisSection>
        <AnalysisSection title="3. Documents Reviewed">{data.documentsReviewed.join(', ')}</AnalysisSection>
        <AnalysisSection title="4. Relevant Legal Information">{data.legalInfo}</AnalysisSection>
        <AnalysisSection title="5. Relevant Authorities">{data.authorities}</AnalysisSection>
        <AnalysisSection title="6. Potential Issues">
            {data.issues.map(i => <div key={i.title} className="flex justify-between">{i.title} <VerificationBadge status={i.status} /></div>)}
        </AnalysisSection>
        <AnalysisSection title="7. Claim Verification">Verification states indicate confidence levels.</AnalysisSection>
        <AnalysisSection title="8. Uncertainty">{data.uncertainty}</AnalysisSection>
        <AnalysisSection title="9. Possible Informational Next Steps">{data.nextSteps.join(', ')}</AnalysisSection>
        <AnalysisSection title="10. Sources">{data.sources}</AnalysisSection>
        <div className="bg-slate-100 p-4 rounded text-xs text-slate-600">{data.disclaimer}</div>
      </div>

      {/* Evidence Panel */}
      <aside className="lg:border-l lg:pl-8 space-y-4">
        <h2 className="font-bold">Evidence & Sources</h2>
        <Card className="p-4 space-y-4">
            <p className="text-sm">Connect claims to supporting evidence here.</p>
        </Card>
      </aside>
    </div>
  );
};
