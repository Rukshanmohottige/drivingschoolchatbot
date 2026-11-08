'use client';

import React, { useState } from 'react';
import { DRIVING_SCHOOL_DATA } from '@/data/driving-school';
import { BookingRequest, Language } from '@/types/chat';
import { X, Calendar, CheckCircle2, AlertCircle, Clock, MapPin, Car, Shield, Phone, User, Mail, CreditCard } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onBookingSuccess?: (booking: BookingRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  language,
  onBookingSuccess
}) => {
  const isSi = language === 'si';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    nicNumber: '',
    courseId: 'car-auto',
    transmission: 'Auto' as 'Auto' | 'Manual',
    branch: 'Nugegoda Main Campus',
    preferredDate: '',
    preferredTimeSlot: 'Morning (8:00 AM - 11:00 AM)' as BookingRequest['preferredTimeSlot'],
    hasLearnerPermit: false,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<BookingRequest | null>(null);

  if (!isOpen) return null;

  const selectedCourse = DRIVING_SCHOOL_DATA.courses.find(c => c.id === formData.courseId) || DRIVING_SCHOOL_DATA.courses[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setError(isSi ? 'කරුණාකර ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න.' : 'Please enter your full name.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 9) {
      setError(isSi ? 'වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න (උදා: 077 123 4567).' : 'Please enter a valid phone number (e.g., 077 123 4567).');
      return;
    }

    if (!formData.preferredDate) {
      setError(isSi ? 'කරුණාකර ආරම්භ කිරීමට කැමති දිනයක් තෝරන්න.' : 'Please select your preferred starting date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setSuccessBooking(data.booking);
      if (onBookingSuccess) {
        onBookingSuccess(data.booking);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessBooking(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isSi ? 'රියදුරු පාඨමාලා / පුහුණු වෙන්කරවා ගැනීම' : 'Book a Driving Lesson / Course'}
              </h2>
              <p className="text-xs text-brand-100">
                {isSi ? 'DriveMate නිල පුහුණු කාලසටහන' : 'Official DriveMate Academy Registration'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {successBooking ? (
            /* Success State - strictly communicates Phase 6 requirement: request submitted, not guaranteed until staff verifies */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {isSi ? 'වෙන්කරවා ගැනීමේ ඉල්ලීම සාර්ථකව යොමු විය!' : 'Booking Request Submitted!'}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {isSi
                  ? `ස්තූතියි ${successBooking.fullName}! ඔබගේ ඉල්ලුම්පත්‍ර අංකය: #${successBooking.id} වේ.`
                  : `Thank you, ${successBooking.fullName}! Your reference request ID is: #${successBooking.id}.`}
              </p>

              {/* Crucial Notice Required by Implementation Plan Page 4 */}
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-4 rounded-xl text-left max-w-lg mx-auto flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">
                    {isSi ? 'වැදගත් නිවේදනය (Important Notice):' : 'Important Availability Notice:'}
                  </strong>
                  <span>
                    {isSi
                      ? 'මෙය පාඨමාලා ඉල්ලුම්පතක් පමණි. උපදේශකවරුන් සහ වාහන වල පවතින වේලාවන් පරීක්ෂා කිරීමෙන් අනතුරුව අපගේ ශිෂ්‍ය සම්බන්ධීකාරකවරයෙකු පැය 2ක් ඇතුළත ඔබව අමතා වේලාව තහවුරු කරනු ඇත.'
                      : 'This confirms receipt of your booking request. Your lesson slot is not confirmed until staff verify instructor and dual-control vehicle availability. Our team will contact you via phone or WhatsApp within 2 hours.'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-lg mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isSi ? 'පාඨමාලාව:' : 'Course:'}</span>
                  <span className="font-semibold text-slate-800">{successBooking.courseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isSi ? 'ශාඛාව:' : 'Branch:'}</span>
                  <span className="font-semibold text-slate-800">{successBooking.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isSi ? 'දිනය සහ වේලාව:' : 'Preferred Date & Time:'}</span>
                  <span className="font-semibold text-slate-800">
                    {successBooking.preferredDate} ({successBooking.preferredTimeSlot})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
              >
                {isSi ? 'සංවාදයට ආපසු යන්න' : 'Return to Chat'}
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Course Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. {isSi ? 'පාඨමාලාව තෝරන්න (Select Course)' : 'Select Driving Course'}
                </label>
                <select
                  value={formData.courseId}
                  onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {DRIVING_SCHOOL_DATA.courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {isSi ? course.nameSi : course.name} — LKR {course.fee.toLocaleString()}
                    </option>
                  ))}
                </select>

                {/* Course preview badge */}
                <div className="mt-2 p-3 bg-brand-50/70 border border-brand-100 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-900 block">
                      {isSi ? selectedCourse.nameSi : selectedCourse.name}
                    </span>
                    <span className="text-brand-700 text-[11px]">
                      {selectedCourse.practicalLessons} {isSi ? 'ප්‍රායෝගික පුහුණු සැසි' : 'practical sessions'} • {selectedCourse.duration}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-brand-700 bg-white px-2.5 py-1 rounded-lg border border-brand-200">
                    LKR {selectedCourse.fee.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Step 2: Transmission and Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. {isSi ? 'ගියර් පද්ධතිය (Transmission)' : 'Transmission Type'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, transmission: 'Auto' })}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                        formData.transmission === 'Auto'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Automatic (ඔටෝ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, transmission: 'Manual' })}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                        formData.transmission === 'Manual'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Manual (මැනුවල්)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. {isSi ? 'කැමති ශාඛාව (Branch)' : 'Preferred Branch'}
                  </label>
                  <select
                    value={formData.branch}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {DRIVING_SCHOOL_DATA.branches.map(b => (
                      <option key={b.id} value={b.name}>
                        {isSi ? b.nameSi : b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: Date and Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    4. {isSi ? 'ආරම්භ කිරීමට කැමති දිනය' : 'Preferred Start Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    5. {isSi ? 'කැමති වේලාව (Time Slot)' : 'Preferred Time Slot'}
                  </label>
                  <select
                    value={formData.preferredTimeSlot}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        preferredTimeSlot: e.target.value as BookingRequest['preferredTimeSlot']
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Morning (8:00 AM - 11:00 AM)">Morning (8:00 AM - 11:00 AM)</option>
                    <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                    <option value="Evening (4:00 PM - 6:00 PM)">Evening (4:00 PM - 6:00 PM)</option>
                    <option value="Weekend Special">Weekend Special (Sat / Sun)</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Contact Information */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  6. {isSi ? 'අයදුම්කරුගේ විස්තර (Contact Info)' : 'Applicant Details'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder={isSi ? 'සම්පූර්ණ නම (Full Name) *' : 'Full Name *'}
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder={isSi ? 'දුරකථන අංකය (WhatsApp Phone) *' : 'Phone / WhatsApp *'}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      placeholder={isSi ? 'විද්‍යුත් තැපෑල (Email - Optional)' : 'Email address (Optional)'}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={isSi ? 'හැඳුනුම්පත් අංකය (NIC Number - Optional)' : 'NIC Number (Optional)'}
                      value={formData.nicNumber}
                      onChange={e => setFormData({ ...formData, nicNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Learner permit checkbox */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.hasLearnerPermit}
                    onChange={e => setFormData({ ...formData, hasLearnerPermit: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="text-xs text-slate-700">
                    {isSi
                      ? 'මා සතුව දැනටමත් වලංගු RMV පුහුණු අවසරපත්‍රය (Learner Permit) ඇත.'
                      : 'I already hold an active RMV Learner Permit (L Plate).'}
                  </span>
                </label>

                {/* Notes */}
                <div>
                  <textarea
                    rows={2}
                    placeholder={
                      isSi
                        ? 'අමතර සටහන් (උදා: කාන්තා උපදේශකවරියක් අවශ්‍යද, සති අන්ත පමණක්ද)...'
                        : 'Any special requests (e.g., female instructor preferred, weekend lessons only)...'
                    }
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition"
                >
                  {isSi ? 'අවලංගු කරන්න' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2"
                >
                  {isSubmitting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>{isSi ? 'ඉල්ලුම්පත යොමු කරන්න' : 'Submit Booking Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
