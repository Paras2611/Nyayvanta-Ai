import React from 'react';
import { DomainCard } from './components/DomainCard';
import { RecentCases } from './components/RecentCases';
import { RecentDocuments } from './components/RecentDocuments';
import { DOMAIN_REGISTRY } from '../../domain/registry';
import { Button } from '../../components/ui/Button';
import { MessageSquare, FileText, Search } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
            <Button variant="outline"><MessageSquare className="mr-2" size={16}/>Ask LawLink</Button>
            <Button variant="outline"><FileText className="mr-2" size={16}/>Analyze Doc</Button>
            <Button variant="outline"><Search className="mr-2" size={16}/>Search</Button>
        </div>
      </div>
      
      {/* Domains */}
      <section>
        <h2 className="text-lg font-bold mb-4">Start New Case</h2>
        <div className="mb-4">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">LawLink — Supported Domains</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(DOMAIN_REGISTRY).map(d => <DomainCard key={d.id} domain={d} />)}
        </div>
      </section>

      {/* Cases & Docs */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <RecentCases />
        </div>
        <RecentDocuments />
      </div>
    </div>
  );
};
