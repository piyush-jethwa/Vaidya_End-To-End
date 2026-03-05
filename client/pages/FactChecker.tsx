import React from 'react';
import FactChecker from '../components/VaidyaAgent/FactChecker';

const FactCheckerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto p-4">
        <FactChecker />
      </div>
    </div>
  );
};

export default FactCheckerPage;

