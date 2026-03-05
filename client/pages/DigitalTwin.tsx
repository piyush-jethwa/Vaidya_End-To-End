import React from 'react';
import DigitalTwin from '../components/VaidyaAgent/DigitalTwin';

const DigitalTwinPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto p-4">
        <DigitalTwin />
      </div>
    </div>
  );
};

export default DigitalTwinPage;

