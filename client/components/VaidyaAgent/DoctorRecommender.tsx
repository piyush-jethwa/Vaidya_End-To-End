import React, { useState } from 'react';
import { UserPlus, BrainCircuit, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getDoctorRecommendation } from './services/geminiService';

const DoctorRecommender: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [riskFactors, setRiskFactors] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await getDoctorRecommendation(symptoms, riskFactors || "None");
      setResult(data);
    } catch (error) {
      setResult("Error generating recommendation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center justify-center gap-3">
          <BrainCircuit className="text-teal-500" size={32} />
          Specialist Recommendation
        </h2>
        <p className="text-slate-400 mt-2">
          Powered by Gemini 3 Pro Reasoning Engine. We analyze your symptoms to suggest the right specialist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Current Symptoms</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none h-32 resize-none text-slate-200 placeholder-slate-500"
              placeholder="e.g. Sharp chest pain, shortness of breath, left arm numbness..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Risk Factors / Medical History (Optional)</label>
            <textarea
              value={riskFactors}
              onChange={(e) => setRiskFactors(e.target.value)}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none h-24 resize-none text-slate-200 placeholder-slate-500"
              placeholder="e.g. Smoker, High Blood Pressure, Diabetes..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-900/20 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>Thinking <BrainCircuit className="animate-pulse" size={18}/></>
            ) : (
              <>Find Specialist <UserPlus size={18}/></>
            )}
          </button>
        </form>

        {/* Result */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 h-full min-h-[400px]">
           {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
               <div className="w-16 h-16 border-4 border-teal-900/50 border-t-teal-500 rounded-full animate-spin"></div>
               <p className="animate-pulse">Analyzing symptoms & risks...</p>
             </div>
           ) : result ? (
             <div className="prose prose-invert prose-slate max-w-none">
               <div className="flex items-center gap-2 text-sm text-teal-400 font-semibold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                 <BrainCircuit size={16} /> Reasoning Complete
               </div>
               <ReactMarkdown
                 components={{
                   h1: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-100 mb-2" {...props} />,
                   h2: ({node, ...props}) => <h4 className="text-lg font-semibold text-teal-400 mt-4 mb-2" {...props} />,
                   h3: ({node, ...props}) => <h5 className="font-semibold text-blue-400 mt-3" {...props} />,
                   ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 text-slate-300" {...props} />,
                   p: ({node, ...props}) => <p className="text-slate-300" {...props} />,
                 }}
               >
                 {result}
               </ReactMarkdown>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
               <UserPlus size={48} className="mb-4" />
               <p>Submit details to get a recommendation.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DoctorRecommender;