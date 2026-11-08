'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Message, Language, BookingRequest } from '@/types/chat';
import { Navbar } from './Navbar';
import { MessageBubble } from './MessageBubble';
import { SuggestedQuestions } from './SuggestedQuestions';
import { ChatInput } from './ChatInput';
import { BookingModal } from './BookingModal';
import { EnquiryModal } from './EnquiryModal';
import { AdminPanel } from './AdminPanel';
import { AiSettingsModal } from './AiSettingsModal';
import {
  Car,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  Calendar,
  HelpCircle,
  Phone,
  FileText
} from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('session-1');

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSi = language === 'si';

  // Initialize session and greeting
  useEffect(() => {
    const existingId = localStorage.getItem('drivemate_session_id');
    const sid = existingId || `dm-${Date.now().toString(36)}`;
    if (!existingId) {
      localStorage.setItem('drivemate_session_id', sid);
    }
    setSessionId(sid);

    // Initial welcome message
    const initialGreeting: Message = {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        language === 'si'
          ? `ආයුබෝවන්! මම **ඩ්‍රයිව්මේට් AI (DriveMate AI)** රියදුරු සහායකයා.\n\nඔබට ශ්‍රී ලංකාවේ රජයේ රියදුරු බලපත්‍රය ලබාගැනීම, පාඨමාලා ගාස්තු (කාර්, යතුරුපැදි, වෑන්, බර වාහන), NTMI වෛද්‍ය පරීක්ෂණය, හෝ ප්‍රායෝගික පුහුණු සැසි පිළිබඳ ඕනෑම තොරතුරක් මෙහිදී විමසිය හැක. අද ඔබට උපකාර කළ හැක්කේ කෙසේද?`
          : `Hello and welcome to **DriveMate Academy Sri Lanka**! 🚗\n\nI am your official AI driving assistant. Ask me anything about our driving courses (Auto, Manual, Bike, Heavy), current package fees, NTMI medical appointments, RMV theory exams, and practical trial preparations.\n\nHow can I help you get on the road today?`,
      timestamp: new Date().toISOString(),
      citations: ['DriveMate Academy Sri Lanka', 'RMV Sri Lanka Regulations'],
      suggestedQuestions:
        language === 'si'
          ? [
              'කාර් ඔටෝ සහ මැනුවල් ගාස්තු කීයද?',
              'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?',
              'වාරික වශයෙන් ගෙවිය හැකිද?',
              'පාඨමාලාවක් වෙන්කරගන්න (Book Lesson)'
            ]
          : [
              'What are the course fees?',
              'What documents are needed to register?',
              'Can I pay in installments?',
              'Book a Driving Lesson'
            ]
    };

    setMessages([initialGreeting]);
  }, [language]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const savedKey = localStorage.getItem('drivemate_ai_key');
      const savedProvider = localStorage.getItem('drivemate_ai_provider');

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId,
          language,
          apiKey: savedKey || undefined,
          provider: savedProvider || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [...prev, data.message]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'si'
            ? 'සමාවන්න, සම්බන්ධතා දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.'
            : 'Sorry, I encountered a temporary connection issue. Please try asking again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear conversation handler
  const handleClearChat = () => {
    const freshSession = `dm-${Date.now().toString(36)}`;
    localStorage.setItem('drivemate_session_id', freshSession);
    setSessionId(freshSession);

    const initialGreeting: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content:
        language === 'si'
          ? `කතාබහ අලුතින් ආරම්භ කරන ලදී. ඔබට දැනගැනීමට අවශ්‍ය කරුණ විමසන්න.`
          : `Conversation cleared. How can I help you today?`,
      timestamp: new Date().toISOString(),
      citations: ['DriveMate Academy Sri Lanka']
    };
    setMessages([initialGreeting]);
  };

  const handleBookingSuccess = (booking: BookingRequest) => {
    const confirmationMsg: Message = {
      id: `book-confirm-${Date.now()}`,
      role: 'assistant',
      content:
        language === 'si'
          ? `✅ **පාඨමාලා වෙන්කරවා ගැනීමේ ඉල්ලුම්පත (#${booking.id}) සාර්ථකව ලැබුණි!**\n\n• අයදුම්කරු: **${booking.fullName}**\n• පාඨමාලාව: **${booking.courseName} (${booking.transmission})**\n• ශාඛාව: **${booking.branch}**\n• දිනය සහ වේලාව: **${booking.preferredDate} (${booking.preferredTimeSlot})**\n\n*(කරුණාකර සලකන්න: උපදේශකවරුන් සහ වාහන වල වේලාවන් පරීක්ෂා කිරීමෙන් පසු අපගේ කාර්ය මණ්ඩලය විනාඩි කිහිපයකින් ඔබ අමතා වේලාව තහවුරු කරනු ඇත.)*`
          : `✅ **Lesson Booking Request (#${booking.id}) Received!**\n\n• Student: **${booking.fullName}**\n• Course: **${booking.courseName} (${booking.transmission})**\n• Branch: **${booking.branch}**\n• Date & Slot: **${booking.preferredDate} (${booking.preferredTimeSlot})**\n\n*(Notice: This booking is pending instructor and dual-control vehicle verification. Our team will contact you via phone/WhatsApp to confirm.)*`,
      timestamp: new Date().toISOString(),
      citations: ['DriveMate Booking Workflow']
    };
    setMessages(prev => [...prev, confirmationMsg]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAiSettings={() => setIsAiSettingsOpen(true)}
        isAdminOpen={isAdminOpen}
      />

      {/* Main Container */}
      <main className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto p-2 sm:p-4">
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 space-y-4">
          {/* Welcome Feature Card */}
          <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/30 text-brand-200 border border-brand-400/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-300" />
                  Government DMT/RMV Certified
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/10">
                  🇱🇰 Sri Lanka
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1.5">
                {isSi ? 'ඩ්‍රයිව්මේට් රියදුරු පුහුණු AI සහායකයා' : 'DriveMate Driving School Virtual Assistant'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {isSi
                  ? 'නිල රියදුරු පාඨමාලා ගාස්තු, වාරික ගෙවීම් ක්‍රම, ලිඛිත විභාග සූදානම, NTMI වෛද්‍ය පරීක්ෂණ සහ ට්‍රයල් පුහුණුව පිළිබඳ සත්‍යාපිත තොරතුරු ලබාගන්න.'
                  : 'Grounded in official Sri Lankan driving school guidelines. Ask about course packages, installment plans, NTMI medical fitness exams, and RMV trial test requirements.'}
              </p>

              {/* Quick Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <div className="p-1.5 rounded-lg bg-white/10">
                    <Car className="w-3.5 h-3.5 text-brand-300" />
                  </div>
                  <span>{isSi ? 'ද්විත්ව පාලක වාහන' : 'Dual-Control Cars'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <div className="p-1.5 rounded-lg bg-white/10">
                    <Award className="w-3.5 h-3.5 text-brand-300" />
                  </div>
                  <span>{isSi ? '100% සමත් වීමේ මගපෙන්වීම' : '100% Pass Coaching'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <div className="p-1.5 rounded-lg bg-white/10">
                    <Clock className="w-3.5 h-3.5 text-brand-300" />
                  </div>
                  <span>{isSi ? 'පහසු වාරික ක්‍රම' : '3-Stage Installments'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <div className="p-1.5 rounded-lg bg-white/10">
                    <FileText className="w-3.5 h-3.5 text-brand-300" />
                  </div>
                  <span>{isSi ? 'NTMI මෙඩිකල් සහය' : 'NTMI Medical Guidance'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Timeline */}
          <div className="space-y-1">
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onSelectQuestion={handleSendMessage}
                onOpenBooking={() => setIsBookingOpen(true)}
                onOpenEnquiry={() => setIsEnquiryOpen(true)}
              />
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-3 bg-white rounded-2xl border border-slate-200 w-fit shadow-2xs animate-pulse">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-medium text-slate-500">
                  {isSi ? 'පිළිතුර සකසමින් පවතී...' : 'Retrieving verified school knowledge...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested FAQs Accordion / Cards if messages are few */}
          {messages.length <= 2 && (
            <SuggestedQuestions language={language} onSelect={handleSendMessage} />
          )}
        </div>

        {/* Bottom Input Field */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          language={language}
          onClearChat={handleClearChat}
        />
      </main>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        language={language}
        onBookingSuccess={handleBookingSuccess}
      />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        language={language}
      />

      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      <AiSettingsModal
        isOpen={isAiSettingsOpen}
        onClose={() => setIsAiSettingsOpen(false)}
      />
    </div>
  );
};
