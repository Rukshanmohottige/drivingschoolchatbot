import fs from 'fs';
import path from 'path';
import { BookingRequest, CustomerEnquiry, Message, ChatSession } from '../types/chat';

interface DatabaseSchema {
  bookings: BookingRequest[];
  enquiries: CustomerEnquiry[];
  sessions: Record<string, ChatSession>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure database directory and file exist
function ensureDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      bookings: [
        {
          id: 'BK-1001',
          fullName: 'Kasun Perera',
          phone: '+94 77 987 6543',
          email: 'kasun.p@gmail.com',
          nicNumber: '199512345678',
          courseId: 'car-auto',
          courseName: 'Light Vehicle Car (Auto Transmission)',
          transmission: 'Auto',
          branch: 'Nugegoda Main Campus',
          preferredDate: '2026-11-15',
          preferredTimeSlot: 'Morning (8:00 AM - 11:00 AM)',
          hasLearnerPermit: false,
          notes: 'Prefer weekend sessions if available.',
          status: 'reviewed',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'BK-1002',
          fullName: 'Sanduni Fernando',
          phone: '+94 71 234 5678',
          email: 'sanduni.f@outlook.com',
          nicNumber: '200087654321',
          courseId: 'combo-car-bike',
          courseName: 'Combo Package: Car + Motorcycle',
          transmission: 'Manual',
          branch: 'Werahera / Boralesgamuwa Branch',
          preferredDate: '2026-11-20',
          preferredTimeSlot: 'Weekend Special',
          hasLearnerPermit: true,
          notes: 'Already have medical certificate.',
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      enquiries: [
        {
          id: 'ENQ-501',
          fullName: 'Dilshan Silva',
          phone: '+94 76 555 4321',
          email: 'dilshan@hotmail.com',
          category: 'medical',
          message: 'Can I do my NTMI medical test on Saturday morning at Werahera?',
          status: 'open',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ],
      sessions: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning empty structure:', err);
    return { bookings: [], enquiries: [], sessions: {} };
  }
}

function writeDatabase(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Bookings Repository
export const bookingRepo = {
  getAll(): BookingRequest[] {
    const db = ensureDatabase();
    return db.bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById(id: string): BookingRequest | undefined {
    const db = ensureDatabase();
    return db.bookings.find(b => b.id === id);
  },

  create(booking: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>): BookingRequest {
    const db = ensureDatabase();
    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRequest = {
      ...booking,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.bookings.unshift(newBooking);
    writeDatabase(db);
    return newBooking;
  },

  updateStatus(id: string, status: BookingRequest['status']): BookingRequest | null {
    const db = ensureDatabase();
    const index = db.bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    db.bookings[index].status = status;
    writeDatabase(db);
    return db.bookings[index];
  }
};

// Enquiries Repository
export const enquiryRepo = {
  getAll(): CustomerEnquiry[] {
    const db = ensureDatabase();
    return db.enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  create(enquiry: Omit<CustomerEnquiry, 'id' | 'status' | 'createdAt'>): CustomerEnquiry {
    const db = ensureDatabase();
    const newId = `ENQ-${Math.floor(500 + Math.random() * 9000)}`;
    const newEnquiry: CustomerEnquiry = {
      ...enquiry,
      id: newId,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    db.enquiries.unshift(newEnquiry);
    writeDatabase(db);
    return newEnquiry;
  },

  updateStatus(id: string, status: CustomerEnquiry['status']): CustomerEnquiry | null {
    const db = ensureDatabase();
    const index = db.enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;
    db.enquiries[index].status = status;
    writeDatabase(db);
    return db.enquiries[index];
  }
};

// Conversations Repository
export const conversationRepo = {
  getSession(sessionId: string): ChatSession {
    const db = ensureDatabase();
    if (!db.sessions[sessionId]) {
      db.sessions[sessionId] = {
        sessionId,
        messages: [],
        language: 'en',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
      };
      writeDatabase(db);
    }
    return db.sessions[sessionId];
  },

  addMessage(sessionId: string, message: Message): void {
    const db = ensureDatabase();
    if (!db.sessions[sessionId]) {
      db.sessions[sessionId] = {
        sessionId,
        messages: [],
        language: 'en',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
      };
    }
    db.sessions[sessionId].messages.push(message);
    db.sessions[sessionId].lastActiveAt = new Date().toISOString();
    writeDatabase(db);
  },

  listAll(): ChatSession[] {
    const db = ensureDatabase();
    return Object.values(db.sessions).sort(
      (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
    );
  }
};

// Overview Statistics
export const statsRepo = {
  getStats() {
    const db = ensureDatabase();
    return {
      totalBookings: db.bookings.length,
      pendingBookings: db.bookings.filter(b => b.status === 'pending').length,
      reviewedBookings: db.bookings.filter(b => b.status === 'reviewed').length,
      confirmedBookings: db.bookings.filter(b => b.status === 'confirmed').length,
      totalEnquiries: db.enquiries.length,
      openEnquiries: db.enquiries.filter(e => e.status === 'open').length,
      totalSessions: Object.keys(db.sessions).length
    };
  }
};
