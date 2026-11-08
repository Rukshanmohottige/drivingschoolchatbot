'use client';

import React from 'react';
import { Language } from '@/types/chat';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Car, Phone, Calendar, ShieldCheck, HelpCircle, LayoutDashboard, Sparkles } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenBooking: () => void;
  onOpenEnquiry: () => void;
  onOpenAdmin: () => void;
  onOpenAiSettings: () => void;
  onOpenSchools: () => void;
  onOpenRoadmap: () => void;
  onOpenCalculator: () => void;
  isAdminOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onOpenBooking,
  onOpenEnquiry,
  onOpenAdmin,
  onOpenAiSettings,
  onOpenSchools,
  onOpenRoadmap,
  onOpenCalculator,
  isAdminOpen
}) => {
  const isSi = language === 'si';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Car className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  DriveMate <span className="text-brand-600 font-extrabold">AI</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {isSi ? 'ශ්‍රී ලංකා රියදුරු පාසල් AI සහායකයා' : 'Sri Lankan Driving School AI Assistant'}
              </p>
            </div>
          </div>

          {/* Quick Center Nav for Desktop */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={onOpenSchools}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-white rounded-lg transition flex items-center gap-1"
            >
              <span>🏫 {isSi ? 'රියදුරු පාසල්' : 'Schools'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenRoadmap}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-white rounded-lg transition flex items-center gap-1"
            >
              <span>🗺️ {isSi ? 'බලපත්‍ර මගපෙන්වීම' : 'License Guide'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenCalculator}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-white rounded-lg transition flex items-center gap-1"
            >
              <span>🧮 {isSi ? 'ගාස්තු ගණනය' : 'Calculator'}</span>
            </button>
          </div>

          {/* Quick Hotline Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
            <Phone className="w-3.5 h-3.5 text-brand-600" />
            <span className="font-medium">Hotline:</span>
            <a href="tel:+94112345678" className="font-semibold text-slate-800 hover:text-brand-600">
              011 234 5678
            </a>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />

            <button
              type="button"
              onClick={onOpenEnquiry}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isSi ? 'විමසීම්' : 'Enquiry'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-lg shadow-sm transition"
            >
              <Calendar className="w-4 h-4" />
              <span>{isSi ? 'වෙන්කරවා ගන්න' : 'Book Lesson'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenAiSettings}
              title="Configure AI Model & API Keys"
              className="p-2 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline font-semibold text-[11px]">AI Model</span>
            </button>

            <button
              type="button"
              onClick={onOpenAdmin}
              title="Staff Admin Dashboard"
              className={`p-2 rounded-lg text-xs font-medium border transition ${
                isAdminOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
