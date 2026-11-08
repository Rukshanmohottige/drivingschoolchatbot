'use client';

import React, { useState } from 'react';
import { SRI_LANKA_DRIVING_ECOSYSTEM } from '@/data/sri-lankan-schools';
import { Language } from '@/types/chat';
import {
  X,
  Compass,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Footprints,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface LicenseRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const LicenseRoadmapModal: React.FC<LicenseRoadmapModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'trial_rules' | 'fees'>('steps');
  const [activeStep, setActiveStep] = useState<number>(0);
  const isSi = language === 'si';

  if (!isOpen) return null;

  const steps = SRI_LANKA_DRIVING_ECOSYSTEM.howSchoolsWork;
  const currentStep = steps[activeStep];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-500/20 rounded-xl text-brand-300">
              <Compass className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                {isSi ? 'ශ්‍රී ලංකා රියදුරු බලපත්‍ර ලබාගැනීමේ නිල මාර්ගෝපදේශය' : 'Official Sri Lankan Driving License Guide'}
              </h2>
              <p className="text-xs text-brand-100">
                {isSi
                  ? 'NTMI වෛද්‍ය පරීක්ෂණයේ සිට RMV ට්‍රයල් විභාගය දක්වා පියවරෙන් පියවර'
                  : 'How Driving Schools Work: From NTMI Medical to the RMV Practical Trial'}
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

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'steps'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{isSi ? 'පියවර 5ක ගමන (5-Step Journey)' : '5-Step Licensing Journey'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trial_rules')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'trial_rules'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>{isSi ? 'ට්‍රයල් නීති සහ සපත්තු රීතිය' : 'Trial Day Rules & Dress Code'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'fees'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{isSi ? 'RMV රජයේ ගාස්තු' : 'Official DMT Government Fees'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: 5-STEP JOURNEY */}
          {activeTab === 'steps' && (
            <div className="space-y-6">
              {/* Stepper pills */}
              <div className="grid grid-cols-5 gap-2">
                {steps.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`p-2.5 rounded-xl text-left border transition ${
                      activeStep === idx
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold block opacity-75">
                      Step {s.step}
                    </span>
                    <span className="text-xs font-bold truncate block">
                      {isSi ? s.titleSi.split(' ')[0] : s.title.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Step Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                      {currentStep.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {isSi ? currentStep.titleSi : currentStep.title}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Official Procedure under Motor Traffic Act (Sri Lanka)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {isSi ? currentStep.detailSi : currentStep.detail}
                </p>

                {/* Practical Tip */}
                <div className="bg-brand-50/70 border border-brand-200 rounded-xl p-3 text-xs flex items-start gap-2.5 text-brand-900">
                  <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">
                      {isSi ? 'ප්‍රායෝගික උපදෙස (Candidate Tip):' : 'Expert Candidate Advice:'}
                    </strong>
                    <span className="text-brand-800 text-[11px]">{currentStep.practicalTip}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRIAL DAY RULES & DRESS CODE */}
          {activeTab === 'trial_rules' && (
            <div className="space-y-4 text-xs">
              {/* Mandatory Covered Shoes Alert */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
                  <Footprints className="w-5 h-5 text-rose-600" />
                  <span>
                    {isSi ? 'සපත්තු පැළඳීම අනිවාර්යයි (Strict Shoes Rule)' : 'Mandatory Footwear Rule on Trial Day'}
                  </span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed">
                  {isSi
                    ? 'ශ්‍රී ලංකා මෝටර් රථ පරීක්ෂකවරුන්ගේ (MVE) දැඩි නියෝගයකට අනුව, ට්‍රයල් දිනයේදී සෙරෙප්පු (slippers), සැන්ඩල්ස් (sandals), හෝ විලුඹ උස් පාවහන් (high heels) පැළඳ පැමිණියහොත් කිසිදු සාකච්ඡාවකින් තොරව විභාගය අසමත් කරනු ලැබේ! සම්පූර්ණයෙන්ම ආවරණය වූ සපත්තු හෝ ස්නීකර්ස් (Sneakers) පැළඳීම අනිවාර්ය වේ.'
                    : 'According to Department of Motor Traffic regulations, candidates wearing slippers, flip-flops, sandals, or high heels are STRICTLY DISQUALIFIED on the spot by examiners! Fully enclosed shoes or sneakers are 100% compulsory.'}
                </p>
              </div>

              {/* Trial Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Documents & Attire */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-brand-600" />
                    {isSi ? 'අනිවාර්ය ලියකියවිලි' : 'Mandatory Documents to Carry'}
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    {SRI_LANKA_DRIVING_ECOSYSTEM.trialChecklist.mandatoryDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Maneuvers Tested */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {isSi ? 'පරීක්ෂා කරන ප්‍රායෝගික අංග' : 'Test Maneuvers Evaluated'}
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    {SRI_LANKA_DRIVING_ECOSYSTEM.trialChecklist.testManeuvers.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-brand-600 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Common Reasons People Fail */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  {isSi ? 'අයදුම්කරුවන් බහුලව අසමත් වන වැරදි (Common Fail Traps):' : 'Top Reasons Candidates Fail:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-800">
                  {SRI_LANKA_DRIVING_ECOSYSTEM.trialChecklist.commonFailReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">⚠️</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DMT OFFICIAL GOVERNMENT FEES */}
          {activeTab === 'fees' && (
            <div className="space-y-4 text-xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-left border-b border-slate-200">
                      <th className="p-3 font-semibold">Service / License Category</th>
                      <th className="p-3 font-semibold">Standard Fee</th>
                      <th className="p-3 font-semibold">Same-Day Service</th>
                      <th className="p-3 font-semibold">Official Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SRI_LANKA_DRIVING_ECOSYSTEM.rmvFees.map((fee, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-medium text-slate-800">{fee.item}</td>
                        <td className="p-3 font-bold text-slate-900">{fee.normalFee}</td>
                        <td className="p-3 text-slate-600">{fee.oneDayFee}</td>
                        <td className="p-3 text-slate-500 text-[11px]">{fee.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
                ℹ️ <em>Note:</em> When registering with DriveMate Academy or leading learners, these official government stamp, trial processing, and medical certificate assistance fees are already included in our all-inclusive course package!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
