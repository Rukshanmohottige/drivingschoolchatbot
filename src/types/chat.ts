export type Language = 'en' | 'si';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: string[];
  suggestedQuestions?: string[];
  action?: 'booking' | 'enquiry' | 'courses' | 'medical' | 'exam';
  isTyping?: boolean;
}

export interface Course {
  id: string;
  name: string;
  nameSi: string;
  vehicleClass: string;
  vehicleClassCode: string; // e.g. "B", "A1", "A"
  transmission: 'Auto' | 'Manual' | 'Both' | 'N/A';
  fee: number;
  currency: string;
  duration: string;
  practicalLessons: number;
  theoryClasses: number;
  description: string;
  descriptionSi: string;
  includesMedicalAssistance: boolean;
  includesRmvFees: boolean;
  requirements: string[];
}

export interface BookingRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  nicNumber?: string;
  courseId: string;
  courseName: string;
  transmission: 'Auto' | 'Manual';
  branch: string;
  preferredDate: string;
  preferredTimeSlot: 'Morning (8:00 AM - 11:00 AM)' | 'Afternoon (1:00 PM - 4:00 PM)' | 'Evening (4:00 PM - 6:00 PM)' | 'Weekend Special';
  hasLearnerPermit: boolean;
  notes?: string;
  status: 'pending' | 'reviewed' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface CustomerEnquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  category: 'fees' | 'courses' | 'medical' | 'exam' | 'trial' | 'general';
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface DrivingSchoolInfo {
  schoolName: string;
  schoolNameSi: string;
  tagline: string;
  taglineSi: string;
  contact: {
    hotline: string;
    whatsapp: string;
    email: string;
    workingHours: string;
    workingHoursSi: string;
  };
  branches: Array<{
    id: string;
    name: string;
    nameSi: string;
    address: string;
    phone: string;
  }>;
  courses: Course[];
  paymentPlans: Array<{
    title: string;
    titleSi: string;
    description: string;
    descriptionSi: string;
  }>;
  licensingProcess: Array<{
    step: number;
    title: string;
    titleSi: string;
    description: string;
    descriptionSi: string;
    timeline: string;
  }>;
  faqs: Array<{
    id: string;
    category: string;
    questionEn: string;
    questionSi: string;
    answerEn: string;
    answerSi: string;
    tags: string[];
  }>;
}

export interface ChatSession {
  sessionId: string;
  messages: Message[];
  language: Language;
  createdAt: string;
  lastActiveAt: string;
}
