'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Language } from '@/types/chat';
import { Send, Sparkles, Trash2, ArrowUp, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  language: Language;
  onClearChat?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  language,
  onClearChat
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSi = language === 'si';

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isSi ? 'ඔබගේ බ්‍රවුසරය හඬ ආදානය (Voice input) සඳහා සහය නොදක්වයි. කරුණාකර Google Chrome හෝ Microsoft Edge භාවිතා කරන්න.' : 'Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isSi ? 'si-LK' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const quickChips = isSi
    ? [
        'ගාන කීයද (Course Fees)?',
        'කාර් ඔටෝ vs මැනුවල්',
        'ලියාපදිංචියට ලියකියවිලි',
        'NTMI මෙඩිකල් එක',
        'ට්‍රයල් සපත්තු රීතිය',
        'ප්‍රමුඛ රියදුරු පාසල්'
      ]
    : [
        'Course Fees (ගාන කීයද)?',
        'Car Auto vs Manual',
        'Documents Needed',
        'NTMI Medical Info',
        'RMV Trial Dress Code',
        'Top Driving Schools'
      ];

  return (
    <div className="w-full bg-white border-t border-slate-200/90 p-3 sm:p-4 shadow-lg">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-600" />
          {isSi ? 'ඉක්මන් විමසුම්:' : 'Quick ask:'}
        </span>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(chip)}
            className="text-xs bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200/80 hover:border-brand-300 rounded-full px-2.5 py-0.5 whitespace-nowrap transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Field and Action Buttons */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {onClearChat && (
          <button
            type="button"
            onClick={onClearChat}
            title={isSi ? 'කතාබහ අලුතින් අරඹන්න (Clear)' : 'Clear conversation'}
            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={
              isListening
                ? isSi
                  ? '🎙️ දැන් කතා කරන්න (Listening)...'
                  : '🎙️ Speak now (Listening)...'
                : isSi
                ? 'ඔබේ ප්‍රශ්නය මෙහි ටයිප් කරන්න හෝ 🎙️ මයික්‍රෆෝනය ඔබන්න...'
                : 'Ask about course fees, medicals, RMV exams, or tap 🎙️...'
            }
            className={`w-full pl-4 pr-20 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900 transition placeholder:text-slate-400 ${
              isListening ? 'border-rose-400 ring-2 ring-rose-300 animate-pulse bg-rose-50/30' : 'border-slate-200 focus:border-brand-500'
            }`}
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            title={isListening ? 'Listening...' : 'Voice Input (Speech-to-Text)'}
            className={`absolute right-11 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
              isListening
                ? 'text-rose-600 bg-rose-100 animate-bounce'
                : 'text-slate-400 hover:text-brand-600 hover:bg-slate-100'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition active:scale-95 shadow-2xs"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </form>

      {/* Helpful Hint */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
        <span>
          💡 {isSi ? 'ඔබට සිංහල, Singlish (gana keeyda), හෝ ඉංග්‍රීසි භාෂාවෙන් විමසිය හැක.' : 'Bilingual & Singlish: understands Sinhala, Singlish, and English.'}
        </span>
        <span className="hidden sm:inline">Official Sri Lanka DMT/RMV verified curriculum</span>
      </div>
    </div>
  );
};
