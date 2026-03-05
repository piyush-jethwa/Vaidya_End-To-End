import React from 'react';
import MedicationManager from '../components/VaidyaAgent/MedicationManager';

const DrugInteractions: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto p-4">
        <MedicationManager />
      </div>
    </div>
  );
};

export default DrugInteractions;

