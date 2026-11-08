'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Language } from '@/types/chat';
import { Send, Sparkles, Trash2, ArrowUp } from 'lucide-react';

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

  const quickChips = isSi
    ? ['ඔටෝ කාර් ගාස්තුව?', 'මැනුවල් කාර් ගාස්තුව?', 'NTMI මෙඩිකල් එක', 'වාරික ගෙවීම්', 'ශාඛා']
    : ['Car Auto Fee?', 'Car Manual Fee?', 'Documents needed?', 'Installment plan', 'Branches'];

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
              isSi
                ? 'ඔබේ ප්‍රශ්නය සිංහලෙන් හෝ ඉංග්‍රීසියෙන් මෙහි ටයිප් කරන්න...'
                : 'Ask about course fees, medicals, RMV exams, documents...'
            }
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 transition placeholder:text-slate-400"
          />

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
          💡 {isSi ? 'ඔබට සිංහල, Singlish, හෝ ඉංග්‍රීසි භාෂාවෙන් විමසිය හැක.' : 'Bilingual assistant: answers in English or Sinhala.'}
        </span>
        <span className="hidden sm:inline">Official Sri Lanka DMT/RMV verified curriculum</span>
      </div>
    </div>
  );
};
