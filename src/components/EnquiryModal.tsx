'use client';

import React, { useState } from 'react';
import { CustomerEnquiry, Language } from '@/types/chat';
import { X, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const isSi = language === 'si';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    category: 'general' as CustomerEnquiry['category'],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setError(isSi ? 'කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.' : 'Please enter your name.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 9) {
      setError(isSi ? 'වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න.' : 'Please enter a valid phone number.');
      return;
    }

    if (!formData.message.trim() || formData.message.length < 5) {
      setError(isSi ? 'කරුණාකර ඔබගේ ප්‍රශ්නය විස්තර කරන්න.' : 'Please describe your enquiry in detail.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError(null);
    setFormData({ fullName: '', phone: '', email: '', category: 'general', message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="w-5 h-5 text-brand-400" />
            <h2 className="text-base font-bold">
              {isSi ? 'විමසීමක් යොමු කරන්න' : 'Submit Student Enquiry'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {isSi ? 'විමසීම සාර්ථකව ලැබුණි!' : 'Enquiry Received!'}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {isSi
                  ? 'අපගේ ශිෂ්‍ය සේවා කණ්ඩායම ඔබගේ විමසීම පරීක්ෂා කර කඩිනමින් ඔබව අමතනු ඇත.'
                  : 'Our customer support officer has received your question and will reply via phone or WhatsApp shortly.'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
              >
                {isSi ? 'වසන්න' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isSi ? 'සම්පූර්ණ නම *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Kasun Perera"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isSi ? 'දුරකථන අංකය *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="077 123 4567"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isSi ? 'අංශය (Category)' : 'Category'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        category: e.target.value as CustomerEnquiry['category']
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="fees">{isSi ? 'පාඨමාලා ගාස්තු (Fees)' : 'Course Fees'}</option>
                    <option value="courses">{isSi ? 'පාඨමාලා විස්තර (Courses)' : 'Courses'}</option>
                    <option value="medical">{isSi ? 'වෛද්‍ය පරීක්ෂණය (Medical)' : 'NTMI Medical'}</option>
                    <option value="exam">{isSi ? 'ලිඛිත විභාගය (Theory Exam)' : 'Theory Exam'}</option>
                    <option value="trial">{isSi ? 'ට්‍රයල් පරීක්ෂණය (Trial Test)' : 'Practical Trial'}</option>
                    <option value="general">{isSi ? 'වෙනත් (General)' : 'General Enquiry'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isSi ? 'ඔබගේ ප්‍රශ්නය හෝ විමසීම *' : 'Your Question / Enquiry *'}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    isSi
                      ? 'ඔබට දැනගැනීමට අවශ්‍ය කරුණ මෙහි සටහන් කරන්න...'
                      : 'Please type your specific question or inquiry here...'
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
                >
                  {isSi ? 'අවලංගු කරන්න' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  {isSubmitting ? 'Submitting...' : isSi ? 'යොමු කරන්න' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
