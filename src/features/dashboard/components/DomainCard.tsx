import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const DomainCard: React.FC<{ domain: any }> = ({ domain }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-3">
      <h3 className="font-bold text-lg">{domain.title}</h3>
      <p className="text-sm text-gray-600 flex-grow">Start a new case for {domain.title.toLowerCase()}.</p>
      <Button onClick={() => navigate(`/cases/new/${domain.id}`)} variant="outline">
        Start Case
      </Button>
    </div>
  );
};
