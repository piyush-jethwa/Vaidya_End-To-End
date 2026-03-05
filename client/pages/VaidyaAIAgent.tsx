import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Stethoscope, UserPlus, FileText, Menu, X, Pill, Fingerprint, ShieldCheck, Camera } from 'lucide-react';
import ChatInterface from '../components/VaidyaAgent/ChatInterface';
import DiagnosisPanel from '../components/VaidyaAgent/DiagnosisPanel';
import DoctorRecommender from '../components/VaidyaAgent/DoctorRecommender';
import ReportAnalyzer from '../components/VaidyaAgent/ReportAnalyzer';
import MedicationManager from '../components/VaidyaAgent/MedicationManager';
import DigitalTwin from '../components/VaidyaAgent/DigitalTwin';
import FactChecker from '../components/VaidyaAgent/FactChecker';
import ThumbnailPreview from '../components/VaidyaAgent/ThumbnailPreview';

type View = 'chat' | 'diagnosis' | 'report' | 'recommendation' | 'medication' | 'digital-twin' | 'fact-check' | 'thumbnail';

const VaidyaAIAgent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const viewToMode = useMemo(() => {
    const map: Record<View, string> = {
      'chat': 'chat',
      'diagnosis': 'triage-radiology',
      'report': 'report-auditor',
      'recommendation': 'doctor-recommender',
      'medication': 'drug-interactions',
      'digital-twin': 'digital-twin',
      'fact-check': 'fact-checker',
      'thumbnail': 'thumbnail',
    };
    return map;
  }, []);

  const modeToView = useMemo(() => {
    const map: Record<string, View> = {
      'chat': 'chat',
      'triage-radiology': 'diagnosis',
      'report-auditor': 'report',
      'doctor-recommender': 'recommendation',
      'drug-interactions': 'medication',
      'digital-twin': 'digital-twin',
      'fact-checker': 'fact-check',
      'thumbnail': 'thumbnail',
      'diagnosis': 'diagnosis',
      'report': 'report',
      'recommendation': 'recommendation',
      'medication': 'medication',
      'fact-check': 'fact-check',
    };
    return map;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode') || 'chat';
    const nextView = modeToView[mode];
    if (nextView) setCurrentView(nextView);
  }, [modeToView]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const desired = viewToMode[currentView] ?? 'chat';
    if (params.get('mode') === desired) return;
    params.set('mode', desired);
    const next = `${window.location.pathname}?${params.toString()}${window.location.hash || ''}`;
    window.history.replaceState(null, '', next);
  }, [currentView, viewToMode]);

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return (
          <div className="h-full">
            <ChatInterface />
            <div className="pointer-events-none">
              <section className="pointer-events-auto mt-6 md:mt-8">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Core</h3>
                      <ul className="space-y-2 text-sm text-slate-200">
                        <li>
                          <button onClick={() => setCurrentView('chat')} className="text-left hover:text-white transition-colors">
                            Chat Assistant
                          </button>
                        </li>
                        <li>
                          <button onClick={() => setCurrentView('diagnosis')} className="text-left hover:text-white transition-colors">
                            Triage &amp; Radiology
                          </button>
                        </li>
                        <li>
                          <button onClick={() => setCurrentView('report')} className="text-left hover:text-white transition-colors">
                            Report Auditor
                          </button>
                        </li>
                        <li>
                          <button onClick={() => setCurrentView('recommendation')} className="text-left hover:text-white transition-colors">
                            Doctor Recommender
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Next-Gen</h3>
                      <ul className="space-y-2 text-sm text-slate-200">
                        <li>
                          <button onClick={() => setCurrentView('medication')} className="text-left hover:text-white transition-colors">
                            Drug Interactions
                          </button>
                        </li>
                        <li>
                          <button onClick={() => setCurrentView('digital-twin')} className="text-left hover:text-white transition-colors">
                            Digital Twin
                          </button>
                        </li>
                        <li>
                          <button onClick={() => setCurrentView('fact-check')} className="text-left hover:text-white transition-colors">
                            Fact Checker
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );
      case 'diagnosis': return <DiagnosisPanel />;
      case 'recommendation': return <DoctorRecommender />;
      case 'report': return <ReportAnalyzer />;
      case 'medication': return <MedicationManager />;
      case 'digital-twin': return <DigitalTwin />;
      case 'fact-check': return <FactChecker />;
      case 'thumbnail': return <ThumbnailPreview />;
      default: return <ChatInterface />;
    }
  };

  const NavItem = ({ view, label, icon: Icon }: { view: View; label: string; icon: any }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
        currentView === view
          ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md shadow-blue-900/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col p-4 shadow-sm z-10 overflow-y-auto ${currentView === 'thumbnail' ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between gap-2 px-2 mb-8 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              V
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Vaidya AI
            </span>
          </div>
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-slate-100 transition-colors"
            title="Back to main site"
          >
            Back
          </a>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Core</p>
          <NavItem view="chat" label="Chat Assistant" icon={MessageSquare} />
          <NavItem view="diagnosis" label="Triage & Radiology" icon={Stethoscope} />
          <NavItem view="report" label="Report Auditor" icon={FileText} />
          <NavItem view="recommendation" label="Doctor Recommender" icon={UserPlus} />
          
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Next-Gen</p>
          <NavItem view="medication" label="Drug Interactions" icon={Pill} />
          <NavItem view="digital-twin" label="Digital Twin" icon={Fingerprint} />
          <NavItem view="fact-check" label="Fact Checker" icon={ShieldCheck} />
        </nav>

        <div className="mt-4 pt-4 border-t border-slate-800">
           <button 
             onClick={() => setCurrentView('thumbnail')}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-teal-400 hover:bg-teal-950 border border-transparent hover:border-teal-900"
           >
              <Camera size={18} />
              <span>Project Thumbnail</span>
           </button>
        </div>

        <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-800 text-xs text-slate-500 flex-shrink-0">
          <p className="font-semibold mb-1 text-slate-400">Powered by Gemini AI</p>
          <p>Medical assistance demo. Not for emergency use.</p>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className={`md:hidden fixed inset-0 bg-black/80 z-20 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)} />
      
      <aside className={`md:hidden fixed inset-y-0 left-0 w-[80%] max-w-xs bg-slate-900 border-r border-slate-800 z-30 transform transition-transform duration-300 p-4 overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">Vaidya AI</span>
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-slate-100 transition-colors"
              title="Back to main site"
              onClick={() => setMobileMenuOpen(false)}
            >
              Back
            </a>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={24}/></button>
        </div>
        <nav className="space-y-1">
          <NavItem view="chat" label="Chat Assistant" icon={MessageSquare} />
          <NavItem view="diagnosis" label="Triage & Radiology" icon={Stethoscope} />
          <NavItem view="report" label="Report Auditor" icon={FileText} />
          <NavItem view="recommendation" label="Doctor Recommender" icon={UserPlus} />
          <div className="h-4"></div>
          <NavItem view="medication" label="Drug Interactions" icon={Pill} />
          <NavItem view="digital-twin" label="Digital Twin" icon={Fingerprint} />
          <NavItem view="fact-check" label="Fact Checker" icon={ShieldCheck} />
          <div className="h-4"></div>
          <NavItem view="thumbnail" label="Project Thumbnail" icon={Camera} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative w-full">
        {/* Mobile Header */}
        <header className={`${currentView === 'thumbnail' ? 'hidden' : 'md:hidden'} h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between flex-shrink-0`}>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-100 truncate max-w-[200px]">
            {currentView === 'chat' && 'Chat Assistant'}
            {currentView === 'diagnosis' && 'Triage & Radiology'}
            {currentView === 'recommendation' && 'Recommendation'}
            {currentView === 'report' && 'Report Auditor'}
            {currentView === 'medication' && 'Drug Interactions'}
            {currentView === 'digital-twin' && 'Patient Digital Twin'}
            {currentView === 'fact-check' && 'Fact Checker'}
          </span>
          <div className="w-8" /> 
        </header>

        {/* Content Area */}
        <div className={`${currentView === 'thumbnail' ? 'p-0' : 'p-4 md:p-6'} flex-1 overflow-hidden relative`}>
          {renderView()}
          {currentView === 'thumbnail' && (
             <button 
               onClick={() => setCurrentView('chat')} 
               className="absolute top-6 left-6 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 backdrop-blur-md border border-white/10"
               title="Close Thumbnail Mode"
             >
               <X size={24} />
             </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default VaidyaAIAgent;

