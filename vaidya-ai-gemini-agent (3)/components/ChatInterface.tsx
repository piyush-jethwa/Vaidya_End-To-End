import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, User, Bot, Stethoscope, HeartHandshake, BrainCircuit, Siren, ClipboardCheck, Microscope, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../services/geminiService';
import { Message } from '../types';

type AgentStatus = 'IDLE' | 'INTERVIEWING' | 'ANALYZING' | 'IMAGING_REQ' | 'REPORT_READY' | 'EMERGENCY' | 'SUPPORT';

const ChatInterface: React.FC = () => {
  const [mode, setMode] = useState<'support' | 'clinical_agent'>('support');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('SUPPORT');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: "Hello, I'm Vaidya AI. I'm here to listen to your health concerns with care. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const switchMode = (newMode: 'support' | 'clinical_agent') => {
    setMode(newMode);
    setAgentStatus(newMode === 'support' ? 'SUPPORT' : 'IDLE');
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      content: newMode === 'support' 
        ? "Switched to **Support Mode**. I'm here to listen and help you cope."
        : "Switched to **Autonomous Clinical Agent Mode**.\n\nI am now initializing the clinical workflow. Please describe your main symptom to begin the triage process.",
      timestamp: new Date()
    }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (mode === 'clinical_agent' && agentStatus === 'IDLE') {
        setAgentStatus('INTERVIEWING');
    }

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const fullResponse = await sendChatMessage(history, userMsg.content, mode);
      
      // Parse Status Tag
      let displayContent = fullResponse;
      const statusMatch = fullResponse.match(/\[STATUS: (\w+)\]/);
      
      if (statusMatch) {
          const status = statusMatch[1] as AgentStatus;
          setAgentStatus(status);
          displayContent = fullResponse.replace(statusMatch[0], '').trim();
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: displayContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "Connection error. Please try again.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Status Badge Component
  const StatusBadge = () => {
    switch (agentStatus) {
        case 'INTERVIEWING':
            return <div className="flex items-center gap-2 text-teal-300 bg-teal-900/40 px-3 py-1 rounded-full text-xs font-bold border border-teal-700 animate-pulse"><BrainCircuit size={14}/> GATHERING CLINICAL DATA</div>;
        case 'ANALYZING':
            return <div className="flex items-center gap-2 text-blue-300 bg-blue-900/40 px-3 py-1 rounded-full text-xs font-bold border border-blue-700 animate-pulse"><Microscope size={14}/> ANALYZING PATTERNS</div>;
        case 'IMAGING_REQ':
            return <div className="flex items-center gap-2 text-purple-300 bg-purple-900/40 px-3 py-1 rounded-full text-xs font-bold border border-purple-700"><Stethoscope size={14}/> IMAGING REQUIRED</div>;
        case 'REPORT_READY':
            return <div className="flex items-center gap-2 text-green-300 bg-green-900/40 px-3 py-1 rounded-full text-xs font-bold border border-green-700"><ClipboardCheck size={14}/> DIAGNOSIS COMPLETE</div>;
        case 'EMERGENCY':
            return <div className="flex items-center gap-2 text-red-100 bg-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-500 animate-bounce"><Siren size={14}/> EMERGENCY PROTOCOL</div>;
        case 'SUPPORT':
            return <div className="flex items-center gap-2 text-slate-300 bg-slate-800 px-3 py-1 rounded-full text-xs font-bold"><HeartHandshake size={14}/> EMPATHY MODE</div>;
        default:
            return <div className="flex items-center gap-2 text-slate-400 bg-slate-800 px-3 py-1 rounded-full text-xs font-bold">STANDING BY</div>;
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-xl shadow-lg border overflow-hidden transition-all duration-500 ${
        agentStatus === 'EMERGENCY' ? 'bg-slate-950 border-red-600 shadow-red-900/50' : 
        mode === 'clinical_agent' ? 'bg-slate-950 border-teal-900' : 'bg-slate-900 border-slate-800'
    }`}>
      {/* Header with Mode Toggle & Status */}
      <div className={`p-4 flex flex-col gap-3 transition-colors duration-500 ${
          agentStatus === 'EMERGENCY' ? 'bg-red-900/30' :
          mode === 'clinical_agent' ? 'bg-gradient-to-r from-teal-900/80 to-slate-900' : 'bg-gradient-to-r from-blue-900/50 to-slate-900'
      }`}>
        <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-white">
            {mode === 'support' ? <HeartHandshake size={24} className="text-blue-400" /> : <Stethoscope size={24} className="text-teal-400" />}
            {mode === 'support' ? 'Empathetic Assistant' : 'Autonomous Clinical Agent'}
            </h2>
            
            <div className="flex bg-black/40 p-1 rounded-lg">
            <button
                onClick={() => switchMode('support')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                mode === 'support' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
            >
                Support
            </button>
            <button
                onClick={() => switchMode('clinical_agent')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                mode === 'clinical_agent' ? 'bg-teal-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
            >
                Clinical Agent
            </button>
            </div>
        </div>
        
        {/* Agent Workflow Status Bar */}
        <div className="border-t border-white/10 pt-3">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Live Status:</span>
                    <StatusBadge />
                </div>
            </div>

            {mode === 'clinical_agent' && (
                <div className="flex items-center justify-between gap-2 px-1">
                    {/* Step 1: History */}
                    <div className="flex flex-col items-center gap-1 w-full">
                        <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${['INTERVIEWING', 'ANALYZING', 'IMAGING_REQ', 'REPORT_READY', 'EMERGENCY'].includes(agentStatus) ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-slate-700'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${['INTERVIEWING', 'ANALYZING', 'IMAGING_REQ', 'REPORT_READY', 'EMERGENCY'].includes(agentStatus) ? 'text-teal-300' : 'text-slate-600'}`}>History</span>
                    </div>

                    {/* Step 2: Analysis */}
                    <div className="flex flex-col items-center gap-1 w-full">
                        <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${['ANALYZING', 'IMAGING_REQ', 'REPORT_READY', 'EMERGENCY'].includes(agentStatus) ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-slate-700'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${['ANALYZING', 'IMAGING_REQ', 'REPORT_READY', 'EMERGENCY'].includes(agentStatus) ? 'text-teal-300' : 'text-slate-600'}`}>Analysis</span>
                    </div>

                    {/* Step 3: Diagnosis */}
                    <div className="flex flex-col items-center gap-1 w-full">
                        <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${['REPORT_READY', 'EMERGENCY'].includes(agentStatus) ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-slate-700'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${['REPORT_READY', 'EMERGENCY'].includes(agentStatus) ? 'text-teal-300' : 'text-slate-600'}`}>Diagnosis</span>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : (mode === 'clinical_agent' ? 'bg-teal-600 text-white' : 'bg-indigo-600 text-white')
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none shadow-sm'
              }`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
                {msg.role === 'model' && (
                  <button onClick={() => speakText(msg.content)} className="mt-2 text-white/50 hover:text-white">
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
               <div className="text-xs text-slate-400 mr-2">{mode === 'clinical_agent' ? 'Reasoning...' : 'Typing...'}</div>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"/>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"/>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"/>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className={`flex items-center gap-2 bg-slate-950 p-2 rounded-xl border transition-colors ${agentStatus === 'EMERGENCY' ? 'border-red-500' : 'border-slate-700 focus-within:border-blue-500'}`}>
          <button onClick={handleVoiceInput} className={`p-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'text-slate-400 hover:text-white'}`}>
            <Mic size={20} />
          </button>
          <input
            className="flex-1 bg-transparent outline-none text-slate-200 placeholder-slate-500"
            placeholder={mode === 'support' ? "Tell me how you feel..." : "Describe symptoms..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()} className={`p-2 text-white rounded-lg transition-colors ${mode === 'clinical_agent' ? 'bg-teal-600 hover:bg-teal-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
