import React, { useState } from 'react';
import { ShieldCheck, Search, Globe, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { verifyMedicalClaims } from '../services/geminiService';

const FactChecker: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await verifyMedicalClaims(query);
      setResult(data);
    } catch (e) { setResult("Verification error."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col gap-8">
      <div className="text-center space-y-4 pt-8">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center justify-center gap-3">
          <ShieldCheck size={36} className="text-blue-500" /> Multi-Database Medical Fact Checker
        </h2>
        <p className="text-slate-400">
          Verify medical myths, home remedies, or news articles against trusted global databases (PubMed, WHO, CDC) using Google Search Grounding.
        </p>
      </div>

      <div className="relative">
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'Does drinking hot water cure cancer?' or 'Is Turmeric effective for arthritis?'"
          className="w-full p-4 pl-12 bg-slate-900 border border-slate-700 rounded-full text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-lg shadow-blue-900/10"
          onKeyDown={e => e.key === 'Enter' && handleCheck()}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <button 
          onClick={handleCheck}
          disabled={loading || !query}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Fact Check'}
        </button>
      </div>

      {result && (
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
             <BookOpen className="text-blue-400" size={20} />
             <h3 className="font-bold text-slate-200">Verification Verdict</h3>
          </div>
          <div className="prose prose-invert prose-blue max-w-none">
            <ReactMarkdown components={{
              a: ({node, ...props}) => <a className="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer" {...props} />
            }}>{result}</ReactMarkdown>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 justify-end">
            <Globe size={12} /> Powered by Gemini Search Grounding
          </div>
        </div>
      )}
    </div>
  );
};

export default FactChecker;
