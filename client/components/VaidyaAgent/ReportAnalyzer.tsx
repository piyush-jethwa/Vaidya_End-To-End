import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, FileSearch } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { summarizeMedicalReport } from './services/geminiService';

const ReportAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setSummary(null);
    }
  };

  const handleSummarize = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await summarizeMedicalReport(file);
      setSummary(result);
    } catch (error) {
      setSummary("Error processing report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-6">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg shadow-indigo-900/30">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FileSearch size={28} /> Medical Report Summarizer
        </h2>
        <p className="text-indigo-100 opacity-90">
          Upload a photo of your lab report, prescription, or discharge summary. 
          Gemini 3 Pro will extract the text and explain it in simple terms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Upload Column */}
        <div className="md:col-span-1 bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
          <input 
            type="file" 
            accept="image/*" 
            id="report-upload" 
            className="hidden" 
            onChange={handleFileChange}
          />
          
          {preview ? (
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-slate-700">
              <img src={preview} alt="Report" className="w-full h-full object-cover" />
              <button 
                onClick={() => { setFile(null); setPreview(null); setSummary(null); }}
                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ) : (
            <label 
              htmlFor="report-upload" 
              className="w-full aspect-[3/4] border-2 border-dashed border-indigo-500/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/60 hover:bg-indigo-500/5 transition-all group"
            >
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <span className="font-semibold text-slate-300 group-hover:text-indigo-400">Upload Report</span>
              <span className="text-xs text-slate-500 mt-1">Images (JPG, PNG)</span>
            </label>
          )}

          <button
            onClick={handleSummarize}
            disabled={!file || loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-900/30"
          >
            {loading ? 'Processing...' : 'Summarize Report'}
          </button>
        </div>

        {/* Output Column */}
        <div className="md:col-span-2 bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 overflow-y-auto">
          {summary ? (
            <div className="prose prose-invert prose-indigo max-w-none">
              <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4 border-b border-indigo-900/50 pb-2">
                <CheckCircle size={20} /> Report Analysis
              </div>
              <ReactMarkdown
                 components={{
                  h1: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-100 mb-2" {...props} />,
                  h2: ({node, ...props}) => <h4 className="text-lg font-semibold text-indigo-400 mt-4 mb-2" {...props} />,
                  strong: ({node, ...props}) => <span className="font-bold text-slate-100 bg-indigo-900/30 px-1 rounded" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 text-slate-300" {...props} />,
                  p: ({node, ...props}) => <p className="text-slate-300" {...props} />,
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
              <FileText size={48} className="mb-4" />
              <p>Summary will appear here after analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalyzer;