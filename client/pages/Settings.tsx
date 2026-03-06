import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Database, Shield, Info } from 'lucide-react';
import { ApiKeyInput, useApiKey } from '../components/ApiKeyInput';

export default function Settings() {
  const [groqKey, setGroqKey] = useState<string | null>(null);
  const [geminiKey, setGeminiKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'api-keys' | 'about'>('api-keys');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`px-4 py-2 rounded-t-lg flex items-center gap-2 ${
              activeTab === 'api-keys'
                ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-t-lg flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            About
          </button>
        </div>

        {activeTab === 'api-keys' && (
          <div className="space-y-6">
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-300">Your Keys Stay Local</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    API keys are stored securely in your browser's local storage and are only sent directly to the AI providers when making requests. They are never stored on our servers.
                  </p>
                </div>
              </div>
            </div>

            <ApiKeyInput
              provider="groq"
              storedKey={groqKey}
              onKeyValid={setGroqKey}
            />

            <ApiKeyInput
              provider="gemini"
              storedKey={geminiKey}
              onKeyValid={setGeminiKey}
            />

            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                How to get API keys:
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <span className="text-purple-400 font-medium">Groq (Recommended):</span>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">console.groq.com</a></li>
                    <li>Click "API Keys" in the sidebar</li>
                    <li>Create a new key and copy it</li>
                  </ul>
                </div>
                <div>
                  <span className="text-blue-400 font-medium">Google Gemini:</span>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">aistudio.google.com</a></li>
                    <li>Create a new API key</li>
                    <li>Copy the key</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Vaidya AI Platform</h2>
              <p className="text-gray-300 mb-4">
                Vaidya AI is an autonomous clinical agent platform designed to assist with healthcare tasks including symptom analysis, doctor recommendations, medical report summarization, and drug interaction checking.
              </p>
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="font-medium mb-2">Important Disclaimer</h3>
                <p className="text-sm text-gray This platform-400">
                  is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

