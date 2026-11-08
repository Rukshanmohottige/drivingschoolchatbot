'use client';

import React from 'react';
import { Language } from '@/types/chat';
import { Sparkles, DollarSign, FileText, Activity, Award, HelpCircle } from 'lucide-react';

interface SuggestedQuestionsProps {
  language: Language;
  onSelect: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  language,
  onSelect
}) => {
  const isSi = language === 'si';

  const categories = isSi
    ? [
        {
          title: 'පාඨමාලා හා ගාස්තු',
          icon: DollarSign,
          questions: [
            'කාර් ඔටෝ සහ මැනුවල් පාඨමාලා ගාස්තු කීයද?',
            'වාරික වශයෙන් ගෙවිය හැකිද? (Installment plans)',
            'කාර් + යතුරුපැදි Combi පැකේජයේ වාසි මොනවාද?'
          ]
        },
        {
          title: 'ලියාපදිංචිය හා විභාග',
          icon: FileText,
          questions: [
            'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?',
            'NTMI වෛද්‍ය පරීක්ෂණය (Medical) කරගන්නේ කෙසේද?',
            'ලිඛිත විභාගය (Theory Exam) සහ ට්‍රයල් එක ගැන විස්තර'
          ]
        }
      ]
    : [
        {
          title: 'Fees & Packages',
          icon: DollarSign,
          questions: [
            'What are the course fees for Auto and Manual cars?',
            'Can I pay the driving course fee in installments?',
            'What is included in the Car + Motorcycle combo package?'
          ]
        },
        {
          title: 'Licensing & Requirements',
          icon: FileText,
          questions: [
            'What documents are required to register?',
            'Where do I do the NTMI medical fitness test?',
            'How long after learner permit can I sit for the practical trial?'
          ]
        }
      ];

  return (
    <div className="p-4 bg-gradient-to-br from-slate-50 to-brand-50/40 rounded-2xl border border-slate-200/80 my-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-brand-600" />
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {isSi ? 'නිතර අසන ප්‍රශ්න (Quick FAQs)' : 'Frequently Asked Questions'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="bg-white/90 p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Icon className="w-3.5 h-3.5 text-brand-600" />
                <span>{cat.title}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {cat.questions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => onSelect(q)}
                    className="text-left text-xs text-slate-600 hover:text-brand-700 hover:bg-brand-50/70 px-2.5 py-1.5 rounded-lg transition border border-transparent hover:border-brand-200 flex items-center justify-between group"
                  >
                    <span>{q}</span>
                    <span className="text-slate-300 group-hover:text-brand-500 text-xs">→</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
