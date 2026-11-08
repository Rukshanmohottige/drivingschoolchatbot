'use client';

import React from 'react';
import { Language } from '@/types/chat';
import { Languages } from 'lucide-react';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  language,
  onLanguageChange
}) => {
  return (
    <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
          language === 'en'
            ? 'bg-white text-brand-700 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <span>English</span>
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange('si')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
          language === 'si'
            ? 'bg-brand-600 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <span>සිංහල</span>
      </button>
    </div>
  );
};
