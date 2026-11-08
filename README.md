# DriveMate AI — Sri Lankan Driving School Chatbot 🚗🇱🇰

> A full-stack, bilingual AI chatbot built for Sri Lankan driving schools, providing verified answers on licensing processes, NTMI medical exams, course fees, theory preparation, and automated lesson bookings.

Built directly in accordance with the **DriveMate AI Implementation Plan & Development Roadmap**.

---

## 🌟 Key Highlights & Features

- **🌐 Bilingual & Singlish Support**: Fluidly understands and replies in **English**, **Sinhala (සිංහල)**, and **Singlish**, with an instant language toggle.
- **📚 Grounded RAG (Retrieval-Augmented Generation)**: Answers are strictly derived from verified Sri Lankan Department of Motor Traffic (DMT/RMV) and driving school records.
- **🛡️ Anti-Hallucination & Scope Guard**: Strictly adheres to the reliability rule—never fabricates course prices or rules, and gracefully directs out-of-scope inquiries to official school contacts.
- **📅 Interactive Booking Workflow**: Allows prospective students to pick courses (Auto/Manual Car, Bike, Combo, Heavy), branches, dates, and times, saving requests to the database with staff verification notices.
- **📩 Student Enquiry System**: Direct inquiry ticketing for medical test guidance, theory exam questions, and custom requests.
- **📊 Staff Operations & Admin Portal**: Built-in dashboard to review bookings, verify instructor/vehicle availability, change status (`Pending` -> `Reviewed` -> `Confirmed`), and monitor conversation logs.
- **⚡ Dual-Engine AI Architecture**:
  - Works **out-of-the-box with 0 setup** using DriveMate's high-accuracy local grounded synthesis engine.
  - Optionally plug in **Google Gemini API** (`GEMINI_API_KEY`) or **OpenAI API** (`OPENAI_API_KEY`) via `.env.local`.

---

## 🏗️ Architecture & Project Structure

```
chatbot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/route.ts        # Staff overview, status updates & session logs
│   │   │   ├── booking/route.ts      # Lesson booking submission & listing
│   │   │   ├── chat/route.ts         # Chat endpoint with RAG context injection
│   │   │   └── enquiries/route.ts    # Student enquiry submissions
│   │   ├── globals.css               # Tailwind CSS & custom styling
│   │   ├── layout.tsx                # HTML layout & SEO metadata
│   │   └── page.tsx                  # Main entry point rendering ChatWindow
│   ├── components/
│   │   ├── AdminPanel.tsx            # Staff portal for booking & enquiry management
│   │   ├── BookingModal.tsx          # Lesson booking modal with course calculator
│   │   ├── ChatInput.tsx             # Input box, send button, chips & controls
│   │   ├── ChatWindow.tsx            # Main chat interface orchestrator
│   │   ├── EnquiryModal.tsx          # Support ticket & enquiry modal
│   │   ├── LanguageSwitcher.tsx      # English / Sinhala toggle
│   │   ├── MessageBubble.tsx         # Message cards with citation sources
│   │   └── SuggestedQuestions.tsx    # Categorized FAQ prompt cards
│   ├── data/
│   │   └── driving-school.ts         # Verified Sri Lankan driving school knowledge
│   ├── lib/
│   │   ├── ai.ts                     # AI gateway (Gemini, OpenAI, or Local Engine)
│   │   ├── database.ts               # Repository layer (Bookings, Enquiries, Sessions)
│   │   └── rag.ts                    # Semantic & lexical retrieval engine with citations
│   └── types/
│       └── chat.ts                   # TypeScript interfaces
├── data/
│   └── db.json                       # Local JSON/file database (persists bookings & chats)
├── scripts/
│   └── test-evaluation.mjs          # Automated 11-point evaluation suite
├── .env.example
├── .env.local
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Dependencies are already installed. If needed:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

### 3. Run Automated Evaluation Tests
An automated test suite covering bilingual retrieval, correctness, anti-hallucination, and booking workflows:
```bash
npm run test:eval
```
Expected output:
```
====================================================
EVALUATION COMPLETE: 11 / 11 TESTS PASSED (100%)
====================================================
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## ⚙️ Environment Configuration

Edit `.env.local` to customize:

```env
# Optional: Set a key for Gemini or OpenAI
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> Note: If no API key is provided, DriveMate AI automatically runs using its high-accuracy local grounded RAG engine without requiring external API credits!

---

## 📋 Verified Sri Lankan Driving School Curriculum

The assistant is grounded in verified regulations for Sri Lanka:
- **Vehicle Classes**:
  - Class B Auto (LKR 42,000)
  - Class B Manual (LKR 38,000)
  - Combo: Class B Car + Class A/A1 Motorcycle (LKR 48,000)
  - Class A/A1 Motorcycle only (LKR 18,000)
  - Class C/CE Commercial Heavy Vehicles (LKR 58,000)
- **Licensing Milestones**:
  1. NTMI (National Transport Medical Institute) fitness test (valid for 6 months)
  2. RMV Werahera / District Office registration & Learner Permit (L plate)
  3. Theory exam (40 questions, pass mark 30/40) in Sinhala, English, or Tamil
  4. Mandatory 3-month practical learning period on Learner Permit
  5. RMV Practical Trial test (road drive + reverse parking test)
- **Installment Plans**:
  - 1st Installment (50%): On registration
  - 2nd Installment (25%): When starting practical road lessons
  - 3rd Installment (25%): 2 weeks prior to trial test
- **Branches**: Nugegoda Main Campus, Werahera Branch, Kandy Branch, Gampaha Branch.
