import React from 'react';
import DoctorRecommender from '../components/VaidyaAgent/DoctorRecommender';

const DoctorRecommenderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto p-4">
        <DoctorRecommender />
      </div>
    </div>
  );
};

export default DoctorRecommenderPage;

