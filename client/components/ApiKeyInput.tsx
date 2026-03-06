import { useState, useEffect } from 'react';
import { Key, Check, X, Loader2 } from 'lucide-react';

interface ApiKeyInputProps {
  provider: 'groq' | 'gemini';
  onKeyValid: (key: string) => void;
  storedKey?: string | null;
}

export function ApiKeyInput({ provider, onKeyValid, storedKey }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState(storedKey || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [isSaved, setIsSaved] = useState(!!storedKey);

  useEffect(() => {
    if (storedKey) {
      setApiKey(storedKey);
      setIsSaved(true);
    }
  }, [storedKey]);

  const validateAndSave = async () => {
    if (!apiKey.trim()) return;
    
    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim(), provider })
      });

      const data = await response.json();
      
      if (data.valid) {
        setValidationResult({ valid: true, message: data.message });
        setIsSaved(true);
        // Save to localStorage
        localStorage.setItem(`${provider}_api_key`, apiKey.trim());
        onKeyValid(apiKey.trim());
      } else {
        setValidationResult({ valid: false, message: data.error || 'Invalid API key' });
      }
    } catch (error: any) {
      setValidationResult({ valid: false, message: error.message || 'Failed to validate API key' });
    } finally {
      setIsValidating(false);
    }
  };

  const clearKey = () => {
    setApiKey('');
    setIsSaved(false);
    setValidationResult(null);
    localStorage.removeItem(`${provider}_api_key`);
  };

  const providerName = provider === 'groq' ? 'Groq' : 'Gemini';
  const providerColor = provider === 'groq' ? 'bg-purple-600' : 'bg-blue-600';

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <Key className="w-5 h-5 text-gray-400" />
        <span className="text-white font-medium">{providerName} API Key</span>
        {isSaved && (
          <span className="ml-auto flex items-center gap-1 text-green-400 text-sm">
            <Check className="w-4 h-4" /> Saved
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setIsSaved(false);
            setValidationResult(null);
          }}
          placeholder={`Enter your ${providerName} API key...`}
          className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
        />
        
        {isSaved ? (
          <button
            onClick={clearKey}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white flex items-center gap-1"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={validateAndSave}
            disabled={!apiKey.trim() || isValidating}
            className={`px-4 py-2 ${providerColor} hover:opacity-90 rounded text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isValidating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Save'
            )}
          </button>
        )}
      </div>

      {validationResult && (
        <div className={`mt-2 text-sm ${validationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
          {validationResult.message}
        </div>
      )}

      {!isSaved && (
        <p className="mt-2 text-xs text-gray-500">
          Get your free API key from {provider === 'groq' ? 'https://console.groq.com' : 'https://aistudio.google.com/app/apikey'}
        </p>
      )}
    </div>
  );
}

// Hook to get API key from localStorage or state
export function useApiKey(provider: 'groq' | 'gemini') {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage first
    const stored = localStorage.getItem(`${provider}_api_key`);
    if (stored) {
      setApiKey(stored);
    }
  }, [provider]);

  const saveKey = (key: string) => {
    setApiKey(key);
  };

  return { apiKey, saveKey };
}

