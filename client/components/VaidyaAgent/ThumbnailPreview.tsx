import React from 'react';
import { Stethoscope, BrainCircuit, Activity, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

const ThumbnailPreview: React.FC = () => {
  return (
    <div className="h-full w-full bg-[#020617] relative overflow-hidden flex items-center justify-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-purple-500/10 rounded-full blur-[80px]"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
      
      <div className="z-10 w-full max-w-6xl px-8 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left: Typography & Branding */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/30 backdrop-blur-md">
            <Sparkles size={16} className="text-teal-400" />
            <span className="text-sm font-semibold text-teal-300 tracking-wider uppercase">Powered by Gemini 3 Pro</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight leading-none drop-shadow-2xl">
            VAIDYA<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">AI</span>
          </h1>
          
          <p className="text-2xl text-slate-400 font-light max-w-lg leading-relaxed">
            The Future of <span className="text-white font-medium">Autonomous Clinical Agents</span>. 
            Multimodal diagnosis, real-time triage, and digital twin simulation.
          </p>

          <div className="flex gap-4 pt-4">
             <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-md border border-slate-700 px-5 py-3 rounded-xl">
                <BrainCircuit className="text-blue-400" size={24} />
                <span className="font-bold text-slate-200">Reasoning Engine</span>
             </div>
             <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-md border border-slate-700 px-5 py-3 rounded-xl">
                <Globe className="text-teal-400" size={24} />
                <span className="font-bold text-slate-200">Live Knowledge</span>
             </div>
          </div>
        </div>

        {/* Right: Feature Showcase (Glass Cards) */}
        <div className="flex-1 relative h-[500px] w-full hidden md:block">
          {/* Card 1: Diagnosis */}
          <div className="absolute top-0 right-10 w-72 p-5 rounded-2xl glass-card border-l-4 border-l-teal-500 animate-float z-20 shadow-2xl shadow-teal-900/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-teal-400 font-bold">
                <Stethoscope size={20} /> Diagnosis
              </div>
              <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">Vision</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-700/50 rounded"></div>
              <div className="h-2 w-3/4 bg-slate-700/50 rounded"></div>
              <div className="h-2 w-5/6 bg-slate-700/50 rounded"></div>
            </div>
          </div>

          {/* Card 2: Digital Twin */}
          <div className="absolute top-28 left-0 w-80 p-6 rounded-2xl glass-card border-l-4 border-l-blue-500 animate-float z-30 shadow-2xl shadow-blue-900/30" style={{animationDelay: '1s'}}>
             <div className="flex items-center gap-3 mb-4">
               <Activity size={24} className="text-blue-400" />
               <h3 className="text-lg font-bold text-white">Digital Twin</h3>
             </div>
             <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black text-white">92</span>
                <span className="text-sm text-emerald-400 font-bold mb-1">Excellent</span>
             </div>
             <p className="text-xs text-slate-400">Real-time health score analysis based on vital signs.</p>
          </div>

          {/* Card 3: Fact Check */}
          <div className="absolute bottom-10 right-20 w-64 p-4 rounded-2xl glass-card border-l-4 border-l-purple-500 animate-float z-10 shadow-2xl shadow-purple-900/20" style={{animationDelay: '2s'}}>
             <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                <ShieldCheck size={18} /> Fact Verified
             </div>
             <p className="text-xs text-slate-300">"Turmeric has anti-inflammatory properties."</p>
             <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
               <div className="w-3 h-3 bg-green-500 rounded-full"></div> Source: PubMed
             </div>
          </div>

          {/* Connecting Lines (Decorative) */}
          <svg className="absolute inset-0 pointer-events-none z-0 opacity-30" width="100%" height="100%">
            <line x1="20%" y1="30%" x2="60%" y2="20%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="60%" y1="20%" x2="70%" y2="70%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailPreview;