'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Key, CheckCircle, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('drivemate_ai_key') || '';
    const savedProvider = (localStorage.getItem('drivemate_ai_provider') as 'gemini' | 'openai') || 'gemini';
    setApiKey(savedKey);
    setProvider(savedProvider);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('drivemate_ai_key', apiKey.trim());
      localStorage.setItem('drivemate_ai_provider', provider);
    } else {
      localStorage.removeItem('drivemate_ai_key');
      localStorage.removeItem('drivemate_ai_provider');
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleRemove = () => {
    localStorage.removeItem('drivemate_ai_key');
    localStorage.removeItem('drivemate_ai_provider');
    setApiKey('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-brand-500/20 rounded-xl text-brand-300">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Connect External AI Model
              </h2>
              <p className="text-xs text-slate-400">
                Google Gemini API or OpenAI API Integration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Choose AI Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-3 rounded-xl border text-left transition ${
                  provider === 'gemini'
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-2xs font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Google Gemini</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    FREE
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Recommended • Free in Google AI Studio</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`p-3 rounded-xl border text-left transition ${
                  provider === 'openai'
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-2xs font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold">OpenAI</div>
                <div className="text-[11px] text-slate-500 mt-1">GPT-4o mini • Requires credit</div>
              </button>
            </div>
          </div>

          {/* Guide to get free Gemini key */}
          {provider === 'gemini' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                How to get a 100% Free Gemini API Key:
              </div>
              <ol className="list-decimal ml-4 space-y-1 text-slate-700 text-[11px]">
                <li>
                  Go to{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-brand-700 underline inline-flex items-center gap-0.5"
                  >
                    Google AI Studio (aistudio.google.com) <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Sign in with any standard Google account (no credit card required).</li>
                <li>Click <strong>"Create API Key"</strong> and copy it.</li>
                <li>Paste it below or add it to your <code>.env.local</code> file!</li>
              </ol>
            </div>
          )}

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Enter API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-proj-...'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Your key is saved in your browser's private local storage. It is never stored on external servers.
            </p>
          </div>

          {/* Note on Zero-Setup Local Fallback */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 text-[11px]">
            <strong>💡 No API Key? No problem!</strong> If left blank, DriveMate automatically runs on its built-in Sri Lankan driving school RAG engine, providing 100% accurate, verified answers with zero external dependencies.
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            {apiKey && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
              >
                Remove Key
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save AI Configuration</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
