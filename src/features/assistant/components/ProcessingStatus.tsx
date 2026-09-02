import React, { useState, useEffect } from 'react';

const STATUSES = [
  "Understanding case",
  "Identifying relevant information",
  "Searching sources",
  "Checking supporting authorities",
  "Preparing response"
];

export const ProcessingStatus: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev < STATUSES.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-sm text-gray-500 animate-pulse">
      {STATUSES[index]}...
    </div>
  );
};
