'use client';

import React, { useState, useEffect } from 'react';
import { BookingRequest, CustomerEnquiry, ChatSession } from '@/types/chat';
import {
  LayoutDashboard,
  Calendar,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  UserCheck,
  ChevronRight,
  Phone,
  ShieldAlert
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'enquiries' | 'sessions'>('bookings');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setEnquiries(data.enquiries || []);
        setSessions(data.sessions || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const updateBookingStatus = async (id: string, newStatus: BookingRequest['status']) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'booking', id, status: newStatus })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: newStatus } : b)));
        fetchData();
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  const updateEnquiryStatus = async (id: string, newStatus: CustomerEnquiry['status']) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'enquiry', id, status: newStatus })
      });
      if (res.ok) {
        setEnquiries(prev => prev.map(e => (e.id === id ? { ...e, status: newStatus } : e)));
        fetchData();
      }
    } catch (err) {
      console.error('Error updating enquiry status:', err);
    }
  };

  if (!isOpen) return null;

  const filteredBookings = bookings.filter(b => (filterStatus === 'all' ? true : b.status === filterStatus));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-600 rounded-xl">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                DriveMate Staff Operations
                <span className="text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full font-semibold">
                  School Admin
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Verify lesson availability, manage student bookings & monitor inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Refresh records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-200 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-medium">Total Bookings</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{stats.totalBookings}</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs">
              <span className="text-amber-800 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Staff Verification
              </span>
              <div className="text-xl font-bold text-amber-700 mt-1">{stats.pendingBookings}</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Confirmed Lessons
              </span>
              <div className="text-xl font-bold text-emerald-700 mt-1">{stats.confirmedBookings}</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-600" /> Open Enquiries
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">{stats.openEnquiries}</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Booking Requests ({bookings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Customer Enquiries ({enquiries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'sessions'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chatbot Logs ({sessions.length})</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">Filter Status:</span>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-medium"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending Review</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <span className="text-xs text-slate-400">
                  Showing {filteredBookings.length} requests
                </span>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                  No booking requests found for this filter.
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredBookings.map(item => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{item.fullName}</h4>
                            <span className="text-[11px] font-mono text-slate-400">#{item.id}</span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                item.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'reviewed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.status === 'cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800 animate-pulse'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Phone className="w-3 h-3 text-brand-600" /> {item.phone}
                            </span>
                            {item.email && <span>• {item.email}</span>}
                            {item.nicNumber && <span>• NIC: {item.nicNumber}</span>}
                          </div>
                        </div>

                        {/* Status Change Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(item.id, 'reviewed')}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(item.id, 'confirmed')}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                          >
                            Confirm Lesson
                          </button>
                        </div>
                      </div>

                      {/* Course details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Course</span>
                          <span className="font-semibold text-slate-800">{item.courseName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Transmission</span>
                          <span className="font-medium text-slate-700">{item.transmission}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Branch</span>
                          <span className="font-medium text-slate-700">{item.branch}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date & Slot</span>
                          <span className="font-medium text-slate-700">
                            {item.preferredDate} ({item.preferredTimeSlot.split(' ')[0]})
                          </span>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-600 mt-2 italic bg-amber-50/50 p-2 rounded-md border border-amber-100">
                          Student Note: "{item.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-3">
              {enquiries.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                  No student enquiries submitted yet.
                </div>
              ) : (
                enquiries.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{item.fullName}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium uppercase">
                            {item.category}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              item.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Phone: <span className="font-medium text-slate-700">{item.phone}</span>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => updateEnquiryStatus(item.id, 'in_progress')}
                          className="px-2 py-1 text-[11px] font-medium rounded bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          In Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => updateEnquiryStatus(item.id, 'resolved')}
                          className="px-2 py-1 text-[11px] font-medium rounded bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{item.message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: CHATBOT SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                  No chat conversations logged yet.
                </div>
              ) : (
                sessions.map(s => (
                  <div key={s.sessionId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-slate-700">Session #{s.sessionId}</span>
                      <span className="text-slate-400">
                        {s.messages.length} messages • Last active: {new Date(s.lastActiveAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                      {s.messages.map((m, mIdx) => (
                        <div key={mIdx} className="flex gap-2">
                          <span
                            className={`font-semibold shrink-0 uppercase text-[10px] px-1 rounded ${
                              m.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {m.role}:
                          </span>
                          <span className="text-slate-700 truncate">{m.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
