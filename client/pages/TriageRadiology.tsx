import React from 'react';
import DiagnosisPanel from '../components/VaidyaAgent/DiagnosisPanel';

const TriageRadiology: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto p-4">
        <DiagnosisPanel />
      </div>
    </div>
  );
};

export default TriageRadiology;

