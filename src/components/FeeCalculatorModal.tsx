'use client';

import React, { useState } from 'react';
import { DRIVING_SCHOOL_DATA } from '@/data/driving-school';
import { Language } from '@/types/chat';
import { X, Calculator, CheckCircle2, Sparkles, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

interface FeeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenBookingWithCourse?: (courseId: string) => void;
}

export const FeeCalculatorModal: React.FC<FeeCalculatorModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenBookingWithCourse
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('car-auto');
  const [paymentMode, setPaymentMode] = useState<'installments' | 'full'>('installments');
  const isSi = language === 'si';

  if (!isOpen) return null;

  const course = DRIVING_SCHOOL_DATA.courses.find(c => c.id === selectedCourseId) || DRIVING_SCHOOL_DATA.courses[0];

  const fullFee = course.fee;
  const discount = paymentMode === 'full' && course.fee > 10000 ? 2000 : 0;
  const netFee = fullFee - discount;

  const installment1 = Math.round(fullFee * 0.5);
  const installment2 = Math.round(fullFee * 0.25);
  const installment3 = Math.round(fullFee * 0.25);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isSi ? 'පාඨමාලා ගාස්තු සහ වාරික ගණනය' : 'Course Fee & Installment Calculator'}
              </h2>
              <p className="text-xs text-brand-100">
                {isSi ? 'විනිවිදභාවයෙන් යුතු නිල ගාස්තු සැසඳීම' : 'Calculate 3-stage installments & upfront discounts'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Step 1: Select Course */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. {isSi ? 'පාඨමාලාව තෝරන්න (Select Course)' : 'Select Driving Course'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DRIVING_SCHOOL_DATA.courses.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedCourseId === c.id
                      ? 'border-brand-600 bg-brand-50/60 text-brand-900 shadow-2xs font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{isSi ? c.nameSi : c.name}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">LKR {c.fee.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Payment Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. {isSi ? 'ගෙවීමේ ක්‍රමය (Payment Option)' : 'Payment Method'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('installments')}
                className={`py-2 px-3 rounded-xl border text-center transition font-semibold ${
                  paymentMode === 'installments'
                    ? 'border-brand-600 bg-brand-600 text-white shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isSi ? 'වාරික 3කින් (3 Installments)' : '3-Stage Installments'}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('full')}
                className={`py-2 px-3 rounded-xl border text-center transition font-semibold ${
                  paymentMode === 'full'
                    ? 'border-brand-600 bg-brand-600 text-white shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isSi ? 'එකවර ගෙවීම (LKR 2,000 Off)' : 'Full Payment (LKR 2,000 Off)'}
              </button>
            </div>
          </div>

          {/* Calculator Output Display Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div>
                <span className="text-[11px] text-slate-300 block">{isSi ? 'තෝරාගත් පාඨමාලාව:' : 'Selected Course:'}</span>
                <span className="font-bold text-sm text-white">{isSi ? course.nameSi : course.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-300 block">{isSi ? 'සම්පූර්ණ මුදල:' : 'Net Total:'}</span>
                <span className="text-lg font-black text-amber-400">LKR {netFee.toLocaleString()}</span>
              </div>
            </div>

            {paymentMode === 'installments' ? (
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-300 block uppercase font-bold">1st Installment (50%)</span>
                  <span className="font-bold text-sm text-white mt-0.5 block">LKR {installment1.toLocaleString()}</span>
                  <span className="text-[9px] text-brand-200 block mt-0.5">On Registration</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-300 block uppercase font-bold">2nd Installment (25%)</span>
                  <span className="font-bold text-sm text-white mt-0.5 block">LKR {installment2.toLocaleString()}</span>
                  <span className="text-[9px] text-brand-200 block mt-0.5">On Road Lessons Start</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-300 block uppercase font-bold">3rd Installment (25%)</span>
                  <span className="font-bold text-sm text-white mt-0.5 block">LKR {installment3.toLocaleString()}</span>
                  <span className="text-[9px] text-brand-200 block mt-0.5">2 Weeks Before Trial</span>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-500/20 border border-emerald-400/30 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white text-xs block">LKR 2,000 Upfront Cash Discount Applied!</span>
                    <span className="text-[11px] text-emerald-200">Or opt for 2 extra free practical road driving hours.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded-lg">
                  Saved LKR 2,000
                </span>
              </div>
            )}
          </div>

          {/* Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              {isSi ? 'වසන්න' : 'Close'}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenBookingWithCourse) {
                  onOpenBookingWithCourse(course.id);
                }
              }}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{isSi ? 'මෙම පාඨමාලාව වෙන්කරගන්න' : 'Book This Course Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
