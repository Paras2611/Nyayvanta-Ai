import React, { useState } from 'react';
import { AIResponseCard } from '../features/assistant/components/AIResponse';
import { ProcessingStatus } from '../features/assistant/components/ProcessingStatus';
import { MOCK_AI_RESPONSE } from '../mock/assistantData';
import { Button } from '../components/ui/Button';

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setMessages([...messages, { type: 'user', content: input }, { type: 'ai', content: MOCK_AI_RESPONSE }]);
      setIsProcessing(false);
    }, 4000);
    setInput('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Conversation */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4 h-[600px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {messages.map((m, i) => (
            <div key={i} className={m.type === 'user' ? 'text-right' : ''}>
              {m.type === 'ai' ? <AIResponseCard response={m.content} /> : <div className="bg-indigo-100 p-3 rounded inline-block">{m.content}</div>}
            </div>
          ))}
          {isProcessing && <ProcessingStatus />}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 p-2 border rounded" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your situation..." />
          <Button onClick={handleSend}>Ask</Button>
        </div>
      </div>

      {/* Context & Evidence */}
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="font-bold">Case: Rental / Tenancy Dispute</h2>
          <p className="text-sm text-gray-500">Status: Information Collection</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="font-bold">Evidence Panel</h2>
          <p className="text-sm text-gray-500">Relevant documents and verified facts will appear here.</p>
        </div>
      </div>
    </div>
  );
};
