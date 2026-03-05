import React, { useState } from 'react';
import { Fingerprint, Activity, HeartPulse, Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeDigitalTwin } from '../services/geminiService';

const DigitalTwin: React.FC = () => {
  const [profile, setProfile] = useState({ age: '', gender: '', weight: '', conditions: '', vitals: '' });
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await analyzeDigitalTwin(profile);
      setData(result);
    } catch (e) { alert("Prediction failed. Try again."); }
    finally { setLoading(false); }
  };

  // Helper to determine color based on risk level
  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    }
  };

  // Helper for score color
  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-emerald-400 border-emerald-500';
    if (score > 50) return 'text-yellow-400 border-yellow-500';
    return 'text-red-400 border-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 h-full flex flex-col">
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-2xl text-white shadow-lg border border-emerald-800">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Fingerprint size={32} className="text-emerald-400" /> Patient Digital Twin
        </h2>
        <p className="opacity-80 mt-1 text-sm text-emerald-100">
          Gemini 3 Pro analyzes vitals to generate a real-time health score and 30-day risk forecast.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Profile Inputs */}
        <div className="lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 overflow-y-auto">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2">
            <Activity size={18} className="text-blue-500"/> Live Vitals Input
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <input 
              placeholder="Age" 
              className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-white focus:border-emerald-500 outline-none"
              onChange={e => setProfile({...profile, age: e.target.value})}
            />
            <select 
               className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-white focus:border-emerald-500 outline-none"
               onChange={e => setProfile({...profile, gender: e.target.value})}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <input 
            placeholder="Weight (kg) / Height (cm)" 
            className="w-full p-3 bg-slate-950 rounded-lg border border-slate-800 text-white focus:border-emerald-500 outline-none"
            onChange={e => setProfile({...profile, weight: e.target.value})}
          />
          <textarea 
            placeholder="Conditions (e.g. Diabetic, Smoker)" 
            className="w-full p-3 bg-slate-950 rounded-lg border border-slate-800 text-white h-20 focus:border-emerald-500 outline-none resize-none"
            onChange={e => setProfile({...profile, conditions: e.target.value})}
          />
          <textarea 
            placeholder="Recent Vitals (BP: 120/80, HR: 72, Glucose: 110)" 
            className="w-full p-3 bg-slate-950 rounded-lg border border-slate-800 text-white h-20 focus:border-emerald-500 outline-none resize-none"
            onChange={e => setProfile({...profile, vitals: e.target.value})}
          />
          
          <button onClick={handlePredict} disabled={loading} className="mt-auto w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating Twin...
              </span>
            ) : 'Update Digital Twin'}
          </button>
        </div>

        {/* Visualization Area */}
        <div className="lg:col-span-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-6 overflow-y-auto">
          {data ? (
             <div className="space-y-6 animate-fade-in">
               {/* Top Stats Row */}
               <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-6 bg-slate-950/50 rounded-xl border border-slate-800">
                  {/* Health Score Gauge */}
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className={`absolute inset-0 border-8 rounded-full opacity-20 ${getScoreColor(data.healthScore)}`}></div>
                    <div className={`absolute inset-0 border-8 border-t-transparent rounded-full animate-spin-slow ${getScoreColor(data.healthScore)}`}></div>
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-black text-white">{data.healthScore}</span>
                      <span className="text-xs text-slate-400 uppercase tracking-widest">Health Score</span>
                    </div>
                  </div>
                  
                  {/* Action Items */}
                  <div className="flex-1 space-y-3 w-full px-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Immediate Actions</h4>
                    {data.actions?.map((action: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-300">{action}</span>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Risk Cards */}
               <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">30-Day Risk Forecast</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.risks?.map((risk: any, i: number) => (
                      <div key={i} className={`p-4 rounded-xl border ${getRiskColor(risk.level)} flex flex-col gap-2`}>
                        <div className="flex justify-between items-start">
                          <span className="font-bold">{risk.condition}</span>
                          {risk.level === 'High' && <AlertTriangle size={16} />}
                        </div>
                        <div className="text-xs opacity-80 uppercase tracking-wide">{risk.level} Risk</div>
                        <div className="text-2xl font-black">{risk.probability}</div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Detailed Plan */}
               <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                 <div className="flex items-center gap-2 text-blue-400 font-bold mb-4 uppercase tracking-widest text-sm">
                   <TrendingUp size={16} /> Personalized Lifestyle Plan
                 </div>
                 <div className="prose prose-invert prose-sm max-w-none">
                   <ReactMarkdown>{data.plan}</ReactMarkdown>
                 </div>
               </div>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-6">
               <div className="relative">
                 <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                 <HeartPulse size={80} className="text-slate-700 relative z-10" />
               </div>
               <div className="text-center max-w-sm">
                 <h3 className="text-xl font-semibold text-slate-300 mb-2">Awaiting Vitals</h3>
                 <p>Enter patient data to generate a real-time Digital Twin simulation and predictive risk analysis.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
