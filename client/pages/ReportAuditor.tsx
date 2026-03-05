import React from 'react';
import ReportAnalyzer from '../components/VaidyaAgent/ReportAnalyzer';

const ReportAuditor: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto p-4">
        <ReportAnalyzer />
      </div>
    </div>
  );
};

export default ReportAuditor;

