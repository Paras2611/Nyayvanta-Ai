import React from 'react';

export const AIResponseCard: React.FC<{ response: any }> = ({ response }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
    <div>
      <h3 className="text-lg font-bold">Summary</h3>
      <p className="text-sm text-gray-700">{response.summary}</p>
    </div>
    
    <div>
      <h3 className="font-bold">Relevant Facts</h3>
      <ul className="list-disc pl-5 text-sm text-gray-700">
        {response.relevantFacts.map((f: string, i: number) => <li key={i}>{f}</li>)}
      </ul>
    </div>

    <div>
      <h3 className="font-bold">Potentially Relevant Legal Information</h3>
      <ul className="list-disc pl-5 text-sm text-gray-700">
        {response.legalInfo.map((l: string, i: number) => <li key={i}>{l}</li>)}
      </ul>
    </div>

    <div>
      <h3 className="font-bold">Supporting Authorities</h3>
      <ul className="list-disc pl-5 text-sm text-gray-700">
        {response.authorities.map((a: string, i: number) => <li key={i}>{a}</li>)}
      </ul>
    </div>

    <div className="bg-amber-50 p-4 rounded text-sm text-amber-800">
      <h3 className="font-bold">Uncertainty</h3>
      {response.uncertainty}
    </div>

    <div>
      <h3 className="font-bold">Possible Informational Next Steps</h3>
      <ul className="list-decimal pl-5 text-sm text-gray-700">
        {response.nextSteps.map((n: string, i: number) => <li key={i}>{n}</li>)}
      </ul>
    </div>

    <div className="text-xs text-gray-400">
      Sources: {response.sources.join(', ')}
    </div>
  </div>
);
