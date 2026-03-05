import React, { useState, useRef } from 'react';
import { Upload, X, Activity, Mic, Square, Play, FileText, Stethoscope, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeMedicalCase } from './services/geminiService';

const DiagnosisPanel: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        setAudioBlob(new Blob(audioChunksRef.current, { type: 'audio/webm' }));
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("Could not access microphone."); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleAnalyze = async () => {
    if (!symptoms && !imageFile && !audioBlob) {
      alert("Please provide at least symptoms, an image, or an audio description.");
      return;
    }
    setLoading(true);
    setAnalysis(''); 
    try {
      const result = await analyzeMedicalCase(
          symptoms, 
          imageFile || undefined, 
          audioBlob || undefined, 
          language,
          (streamedText) => setAnalysis(streamedText)
      );
      setAnalysis(result);
    } catch (error) { 
        console.error(error);
        alert("Analysis failed."); 
    } 
    finally { setLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 flex flex-col gap-6 overflow-y-auto">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
              <Activity className="text-teal-500" /> Multimodal Diagnosis
            </h2>
            <p className="text-slate-400 text-sm">AI-Powered Radiology Analysis, Triage & ICD-10 Coding.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
            <Globe size={16} className="text-blue-500" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-sm text-slate-200 outline-none"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-teal-500 transition-colors bg-slate-800/50">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="diagnosis-image-upload" />
          {!previewUrl ? (
            <label htmlFor="diagnosis-image-upload" className="cursor-pointer flex flex-col items-center gap-2 py-4">
              <Upload className="text-slate-500" size={32} />
              <span className="text-slate-300 font-medium">Upload X-Ray / MRI / Skin Image</span>
              <span className="text-xs text-slate-500">Gemini 3 Pro Vision</span>
            </label>
          ) : (
            <div className="relative inline-block">
              <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg shadow-md border border-slate-700" />
              <button onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={16} /></button>
            </div>
          )}
        </div>

        {/* Symptoms */}
        <div className="flex-1 min-h-[150px]">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Symptoms</label>
          <textarea 
            className="w-full h-full p-4 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none text-slate-200 placeholder-slate-500"
            placeholder="Describe symptoms..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          ></textarea>
        </div>

        {/* Voice */}
        <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
          <button onClick={isRecording ? stopRecording : startRecording} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${isRecording ? 'bg-red-900/30 text-red-500' : 'bg-slate-700 text-slate-200'}`}>
            {isRecording ? <><Square size={16} /> Stop</> : <><Mic size={16} /> Record</>}
          </button>
          {audioBlob && <div className="text-teal-400 text-sm flex items-center gap-2"><Play size={14} /> Audio Ready</div>}
        </div>

        <button onClick={handleAnalyze} disabled={loading && !analysis} className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-3 rounded-xl shadow-md disabled:opacity-50 hover:shadow-lg transition-all">
          {loading ? 'Analyzing Case...' : `Generate Clinical Report (${language})`}
        </button>
      </div>

      {/* Results Section */}
      <div className="bg-slate-50 text-slate-900 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Hospital Header Style */}
        <div className="bg-slate-200 p-4 border-b border-slate-300 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <FileText className="text-slate-600" />
                <span className="font-bold text-slate-700 uppercase tracking-widest text-sm">Clinical Report</span>
            </div>
            <div className="text-xs font-mono text-slate-500">
                ID: {Math.floor(Math.random() * 100000)} | {new Date().toLocaleDateString()}
            </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
            {loading && !analysis ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="space-y-2 text-center">
                        <p className="text-lg font-semibold text-slate-700">Gemini 3 Pro is Reasoning...</p>
                        <p className="text-sm text-slate-500">Analyzing medical imagery and symptom patterns.</p>
                    </div>
                </div>
            ) : analysis ? (
            <div className="prose prose-slate max-w-none">
                <ReactMarkdown components={{
                strong: ({node, ...props}) => <span className="font-bold text-blue-800" {...props} />,
                h1: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3 border-b pb-1 border-slate-200" {...props} />,
                li: ({node, ...props}) => <li className="my-1" {...props} />,
                }}>{analysis}</ReactMarkdown>
                
                {loading && (
                    <div className="flex items-center gap-2 mt-4 text-blue-600 animate-pulse text-sm font-semibold">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        Generating analysis...
                    </div>
                )}

                <div className="mt-8 pt-4 border-t border-slate-200 text-center">
                    <p className="text-xs text-slate-400 italic">Generated by AI. Not a substitute for professional medical advice.</p>
                </div>
            </div>
            ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Stethoscope size={64} className="mb-4 opacity-10" />
                <p>Ready to generate report.</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPanel;