import React, { useState } from 'react';
import { Pill, AlertOctagon, CheckCircle, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { checkDrugInteractions } from './services/geminiService';

const MedicationManager: React.FC = () => {
  const [meds, setMeds] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!meds && !file) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await checkDrugInteractions(meds, file || undefined);
      setAnalysis(result);
    } catch (e) { setAnalysis("Error checking interactions."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-6">
      <div className="bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Pill size={28} /> Drug Interaction & Contraindication AI
        </h2>
        <p className="text-pink-100 opacity-90">
          Check interactions between medicines, food, and conditions. Upload a photo of your medicines or type them below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Medicine List / Conditions</label>
            <textarea
              className="w-full h-32 p-4 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-pink-500 outline-none text-slate-200"
              placeholder="e.g. Aspirin, Warfarin, Metformin. I am 65 years old with hypertension."
              value={meds}
              onChange={(e) => setMeds(e.target.value)}
            />
          </div>
          
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-pink-500 transition-colors">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="med-upload" />
            <label htmlFor="med-upload" className="cursor-pointer block">
               <Upload className="mx-auto text-slate-500 mb-2" />
               <span className="text-sm text-slate-400">{file ? file.name : "Scan Blister Pack / Prescription"}</span>
            </label>
          </div>

          <button onClick={handleCheck} disabled={loading} className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-colors">
            {loading ? 'Checking Interactions...' : 'Check Safety'}
          </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 overflow-y-auto">
          {analysis ? (
             <div className="prose prose-invert prose-pink max-w-none">
               <ReactMarkdown>{analysis}</ReactMarkdown>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <AlertOctagon size={48} className="mb-4 opacity-20" />
              <p>Results will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationManager;
