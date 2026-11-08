'use client';

import React, { useState } from 'react';
import { Message } from '@/types/chat';
import { Bot, User, Copy, Check, Calendar, HelpCircle, BookOpen, Volume2, VolumeX } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  onSelectQuestion?: (question: string) => void;
  onOpenBooking?: () => void;
  onOpenEnquiry?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onSelectQuestion,
  onOpenBooking,
  onOpenEnquiry
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown stars and bullets for speech
    const cleanText = message.content.replace(/[*#•_-]/g, ' ').replace(/\s+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // If Sinhala characters detected, try Sinhala or default voice
    if (/[\u0D80-\u0DFF]/.test(cleanText)) {
      utterance.lang = 'si-LK';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Simple markdown-style rendering for bold and bullets
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold replacement
      const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-800 my-0.5">
            {formattedLine}
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="leading-relaxed">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className={`flex w-full my-3 gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Main Content Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-xs text-sm ${
            isUser
              ? 'bg-brand-600 text-white rounded-tr-none'
              : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
          }`}
        >
          {/* User / Bot label + Speak & Copy icons */}
          {!isUser && (
            <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-slate-100 text-[11px] text-slate-400 font-medium">
              <span className="text-brand-600 font-semibold flex items-center gap-1">
                DriveMate Assistant
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSpeak}
                  className={`p-1 rounded transition ${
                    isSpeaking ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="hover:text-slate-700 p-0.5 transition"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          <div className={`space-y-1 ${isUser ? 'text-white' : 'text-slate-800'}`}>
            {renderFormattedText(message.content)}
          </div>

          {/* Citations & Sources (Page 4 RAG requirement) */}
          {!isUser && message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-brand-600" />
                Verified Reference Sources:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {message.citations.map((cite, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium border border-slate-200"
                  >
                    <span>{cite}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Trigger Buttons inside Bubble */}
          {!isUser && message.action === 'booking' && onOpenBooking && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700 shadow-xs transition"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Open Booking Form</span>
              </button>
            </div>
          )}

          {!isUser && message.action === 'enquiry' && onOpenEnquiry && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={onOpenEnquiry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 shadow-xs transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Submit Student Enquiry</span>
              </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* Suggested Questions below Bot reply */}
        {!isUser && message.suggestedQuestions && message.suggestedQuestions.length > 0 && onSelectQuestion && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectQuestion(q)}
                className="text-xs bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 hover:border-brand-300 rounded-full px-3 py-1 transition text-left shadow-2xs"
              >
                💬 {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
