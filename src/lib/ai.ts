import fs from 'fs';
import path from 'path';
import { Language, Message } from '../types/chat';
import { retrieveRelevantKnowledge, RetrievalResult } from './rag';
import { DRIVING_SCHOOL_DATA } from '../data/driving-school';
import { analyzeSinglish } from './singlish';

export interface AIResponse {
  content: string;
  citations: string[];
  suggestedQuestions: string[];
  action?: 'booking' | 'enquiry' | 'courses' | 'medical' | 'exam';
}

// Executive Curriculum Summary directly available to the AI for complete factual comprehension
const EXECUTIVE_CURRICULUM_SUMMARY = `
=== OFFICIAL SRI LANKAN DRIVING SCHOOL CURRICULUM & REGULATIONS ===

1. COURSE PACKAGES & FEES (DriveMate Academy):
- Light Vehicle Car (Auto Transmission, Class B Auto): LKR 42,000 (18 road lessons, dual-control car, trial car included).
- Light Vehicle Car (Manual Transmission, Class B Manual): LKR 38,000 (20 road lessons, clutch control, hill starts, trial car included). Allows driving BOTH manual and automatic cars in Sri Lanka.
- Combo Package (Car + Motorcycle, Class B + Class A/A1): LKR 48,000 (Save LKR 12,000 vs individual).
- Motorcycle / Scooter (Class A/A1): LKR 18,000 (12 road & cone lessons, figure-8 test, trial bike provided).
- Commercial Heavy Vehicle (Bus & Lorry, Class C/CE): LKR 58,000 (24 lessons, requires age 21+ and 2 years light vehicle license).
- License-Holder Refresher Lessons: LKR 2,500 per hour.

2. PAYMENT & INSTALLMENT POLICIES:
- Easy 3-Stage Installments: 1st Installment (50%) on registration day; 2nd Installment (25%) before practical road driving starts; 3rd Installment (25%) 2 weeks prior to practical trial test.
- Upfront Full Payment Discount: Instant LKR 2,000 cash discount or 2 extra free practical road hours.

3. AGE & ELIGIBILITY:
- Light vehicles (Cars Class B, Motorcycles Class A/A1): Minimum legal age is 18 years old. Candidates can register and start theory at 17 years 10 months.
- Heavy vehicles (Buses, Lorries Class C/CE): Minimum age is 21 years old + must have held a light vehicle license for at least 2 years.

4. REQUIRED DOCUMENTS FOR REGISTRATION:
- Original National Identity Card (NIC) or valid Sri Lankan Passport.
- NTMI Medical Fitness Certificate (from National Transport Medical Institute, valid for 6 months).
- 4 passport-size color photographs (white background, ears visible).
- Copy of Birth Certificate.

5. OFFICIAL 5-STEP LICENSING ROADMAP & TIMELINE:
- Step 1: NTMI Medical Test (Day 1): National Transport Medical Institute (Nugegoda, Werahera, or regional centers). Checks vision, color blindness, blood pressure, fasting blood sugar. LKR 1,500.
- Step 2: RMV Registration & Learner Permit (L-Plate) (Week 1-2): Biometric thumbprint, photo, and official L-plate permit issued by Department of Motor Traffic.
- Step 3: Theory Classes & Written Exam (Week 2-4): 40 multiple-choice questions (MCQs). Pass mark is 30/40. Available in Sinhala, English, and Tamil.
- Step 4: Practical In-Car Training (Month 1-3): One-on-one training with certified instructors in dual-control vehicles. MANDATORY 3-MONTH WAITING PERIOD between learner permit and practical trial as required by the Sri Lanka Motor Traffic Act.
- Step 5: RMV Practical Trial Test (Month 3-4): Tested by government RMV examiner. Road test, hill start, reverse L-shape box parking, and motorcycle figure-8. Temporary license issued immediately on passing; Smart Card arrives by mail.

6. TRIAL DAY RULES & DRESS CODE:
- Mandatory Footwear: Candidates MUST wear fully covered shoes or sneakers. Wearing slippers, flip-flops, or open sandals results in IMMEDIATE disqualification by RMV examiners.
- Trial Failure Policy: If a candidate fails the practical trial, RMV allows re-sitting after 2 to 4 weeks with repeat test fee (LKR 500). DriveMate provides 2 free extra practice lessons before re-trial.

7. AUTO VS MANUAL LICENSE:
- Manual License (Class B Manual): Legally permits driving BOTH manual and automatic transmission vehicles.
- Automatic License (Class B Auto): Restricted to automatic vehicles only (endorsed with restriction code 'Auto Only').

8. SCHEDULES & SPECIAL FEATURES:
- Weekend Batches: Special Saturday and Sunday classes for working professionals and university students.
- Weekday Slots: Morning (7:30 AM - 9:00 AM) and Evening (4:30 PM - 6:30 PM) sessions.
- Female Instructors: Experienced female instructors available for female students upon request.
- Official Hotline: +94 11 234 5678 / WhatsApp: +94 77 123 4567. Branches in Nugegoda, Werahera, Kandy, and Gampaha.
`;

const SYSTEM_PROMPT = `
You are DriveMate AI, the official and intelligent virtual assistant for DriveMate Academy Sri Lanka, a premier government-registered driving school.

Core Guidelines & Boundaries:
1. Singlish & Sinhala Native Fluency: Sri Lankan users frequently type in Singlish (phonetic Sinhala typed in English letters, such as "gana keeyda", "mila kiyada", "monada oni", "kohomada karanne", "warika puluwanda", "age eka keeyada", "fail unoth mokada wenne", "vibhageta prashna keeyak enawada", "weekend class puluwanda"). ALWAYS understand Singlish perfectly and respond in warm, natural, fluent Sinhala (or clear bilingual Sinhala/English format) with exact LKR prices and verified procedures.
2. Grounded Authority: Use the Executive Curriculum Summary and Verified Knowledge Context provided. NEVER hallucinate wrong prices or regulations.
3. Be Helpful & Comprehensive: Answer the user's specific question fully with friendly bullet points and clear numbers.
4. Contact & Booking: When helpful, encourage the user to click "Book a Lesson" or contact the hotline: +94 11 234 5678 (WhatsApp: +94 77 123 4567).

${EXECUTIVE_CURRICULUM_SUMMARY}
`;

// Helper to reliably find a valid Gemini API Key
function resolveGeminiApiKey(customKey?: string): string | undefined {
  if (customKey && customKey.trim().length > 10 && !customKey.includes('YOUR_API_KEY')) {
    return customKey.trim();
  }

  const envKey = process.env.GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 10 && !envKey.includes('YOUR_API_KEY')) {
    return envKey.trim();
  }

  // Fallback to reading .env.local file directly
  try {
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, 'utf8');
      const match = content.match(/GEMINI_API_KEY=([^\r\n]+)/);
      if (match && match[1].trim().length > 10 && !match[1].includes('YOUR_API_KEY')) {
        return match[1].trim();
      }
    }
  } catch {
    // Ignore in edge runtime
  }

  return undefined;
}

// Local high-fidelity synthesis engine for zero-config offline or fallback usage
function generateLocalGroundedResponse(
  query: string,
  language: Language,
  retrieval: RetrievalResult,
  _history: Message[]
): AIResponse {
  const q = query.toLowerCase().trim();
  const singlish = analyzeSinglish(query);
  const isSi = language === 'si' || /[\u0D80-\u0DFF]/.test(query) || singlish.isSinglish;

  // 0. Out of scope guard (Anti-hallucination guard)
  if (retrieval.chunks.length === 0 && !retrieval.isHighConfidence && !/^(hi|hello|hey|ayubowan|ආයුබෝවන්)/i.test(q)) {
    if (isSi) {
      return {
        content: `සමාවන්න, ඔබ විමසූ කරුණ පිළිබඳ නිශ්චිත තොරතුරක් ඩ්‍රයිව්මේට් රියදුරු පාසලේ දත්ත පද්ධතිය තුළ සටහන්ව නොමැත.\n\nරියදුරු පාසලේ නීති සහ ගාස්තු පිළිබඳ වැරදි තොරතුරු ලබානොදීම අපගේ ප්‍රතිපත්තියයි. කරුණාකර වැඩිදුර තොරතුරු සඳහා අපගේ නිල දුරකථන අංකය (+94 11 234 5678 / WhatsApp +94 77 123 4567) අමතන්න හෝ අප වෙත විමසීමක් (Enquiry) යොමු කරන්න.`,
        citations: ['DriveMate Customer Support Policy'],
        suggestedQuestions: ['කාර් ඔටෝ සහ මැනුවල් පාඨමාලා ගාස්තු', 'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?', 'ශාඛා පිහිටි ස්ථාන සහ දුරකථන අංක'],
        action: 'enquiry'
      };
    } else {
      return {
        content: `I am DriveMate AI, specialized in verified information for DriveMate Academy Sri Lanka.\n\nI could not find a confirmed answer to that specific question in our approved driving school knowledge base. To ensure you receive 100% accurate information, please contact our student support team directly at **+94 11 234 5678** (WhatsApp: **+94 77 123 4567**) or submit an enquiry!`,
        citations: ['DriveMate Customer Support Policy'],
        suggestedQuestions: ['What are the course fees?', 'What documents are required to register?', 'Our branch locations & hours'],
        action: 'enquiry'
      };
    }
  }

  // 1. Detect Greeting
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|ayubowan|ආයුබෝවන්|හෙලෝ|kohomada|halo|ela)/i.test(q)) {
    if (isSi) {
      return {
        content: `ආයුබෝවන්! මම **ඩ්‍රයිව්මේට් AI (DriveMate AI)** රියදුරු සහායකයා. \n\nඔබට ශ්‍රී ලංකාවේ රියදුරු බලපත්‍රයක් ලබාගැනීම, පාඨමාලා ගාස්තු ("ගාන කීයද / gana keeyda"), ලිඛිත විභාගය, NTMI මෙඩිකල්, හෝ ප්‍රායෝගික පුහුණුව පිළිබඳ ඕනෑම දෙයක් සිංහලෙන් හෝ Singlish වලින් විමසිය හැක. අද ඔබට කුමන තොරතුරුද අවශ්‍ය?`,
        citations: ['DriveMate Academy Sri Lanka'],
        suggestedQuestions: [
          'කාර් ඔටෝ/මැනුවල් ගාස්තු කීයද?',
          'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?',
          'වාරික වශයෙන් ගෙවිය හැකිද? (Installments)',
          'පුහුණු සැසියක් වෙන්කරවා ගැනීමට (Book Lesson)'
        ]
      };
    } else {
      return {
        content: `Hello and welcome to **DriveMate Academy Sri Lanka**! 🚗\n\nI am your AI assistant, ready to help you with our driving courses, official RMV licensing procedures, NTMI medical tests, and lesson bookings. How can I assist your driving journey today?`,
        citations: ['DriveMate Academy Sri Lanka'],
        suggestedQuestions: [
          'What are the course fees?',
          'What documents are needed to register?',
          'Can I pay in installments?',
          'Book a Driving Lesson'
        ]
      };
    }
  }

  // 2. Age Requirement Intent
  if (singlish.intent === 'age_requirement' || /\bage\b/i.test(q) || q.includes('age eka') || q.includes('wayasa') || q.includes('aurudu') || q.includes('awurudu')) {
    return {
      content: isSi
        ? `🎂 **රියදුරු බලපත්‍රයක් ලබාගැනීමට අවශ්‍ය වයස් සීමාවන්:**\n\n• 🚗 **සැහැල්ලු වාහන (කාර් / වෑන් - Class B):** අවම වයස **අවුරුදු 18** කි. (ඔබට අවුරුදු 17යි මාස 10දී ලියාපදිංචි වී න්‍යායාත්මක පන්ති ආරම්භ කළ හැක).\n• 🏍️ **යතුරුපැදි (Class A / A1):** අවම වයස **අවුරුදු 18** කි.\n• 🚚 **බර වාහන (ලොරි / බස් - Class C/CE):** අවම වයස **අවුරුදු 21** ක් විය යුතු අතර, සැහැල්ලු වාහන බලපත්‍රය වසර 2ක් සතුව තිබිය යුතුය.\n\n📌 **අවශ්‍ය ලියකියවිලි:** ජාතික හැඳුනුම්පත (NIC) හෝ පාස්පෝට්, NTMI වෛද්‍ය සහතිකය, ඡායාරූප 4ක්, සහ උප්පැන්න සහතිකයේ පිටපතක්.`
        : `🎂 **Minimum Age Requirements for Sri Lankan Driving License:**\n\n• 🚗 **Light Vehicles (Car / Dual-Purpose Class B):** Minimum age is **18 years old**. (You may enroll at 17 years and 10 months to start theory preparation).\n• 🏍️ **Motorcycles (Class A / A1):** Minimum age is **18 years old**.\n• 🚚 **Heavy Commercial Vehicles (Bus / Lorry Class C/CE):** Minimum age is **21 years old**, and you must have held a light vehicle license for at least 2 years.`,
      citations: ['FAQ Knowledge Base: requirements', 'Official RMV Licensing Process Guide'],
      suggestedQuestions: ['ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?', 'කාර් ඔටෝ/මැනුවල් ගාස්තු කීයද?', 'Book a Lesson'],
      action: 'courses'
    };
  }

  // 3. Process & Roadmap Intent: "kohomada karanne", "process eka", "steps"
  if (singlish.intent === 'process') {
    return {
      content: isSi
        ? `🗺️ **ශ්‍රී ලංකාවේ රියදුරු බලපත්‍රයක් ලබාගැනීමේ නිල පියවර 5:**\n\n1. 🩺 **පියවර 1 - NTMI වෛද්‍ය පරීක්ෂණය:** ජාතික ප්‍රවාහන වෛද්‍ය ආයතනයෙන් ඇස් පෙනීම හා රුධිර පරීක්ෂාව කර සහතිකය ලබාගැනීම (වලංගු කාලය මාස 6කි).\n2. 📝 **පියවර 2 - RMV ලියාපදිංචිය හා L-Plate:** ඇඟිලි සලකුණු ලබාදී නිල පුහුණු අවසරපත්‍රය (Learner Permit) ලබාගැනීම.\n3. 📚 **පියවර 3 - ලිඛිත විභාගය (Theory Exam):** බහුවරණ ප්‍රශ්න 40න් 30ක් නිවැරදිව පිළිතුරු සපයා සමත්වීම.\n4. 🚗 **පියවර 4 - ප්‍රායෝගික පුහුණුව (මාස 3ක කාලය):** නීත්‍යානුකූලව ට්‍රයල් එකට පෙර මාස 3ක් L ප්ලේට් පුහුණුව ලබාගත යුතුය. ද්විත්ව පාලක වාහන මගින් පාරේ ධාවනය හා රිවර්ස් පුහුණුව ලබාදෙයි.\n5. 🏁 **පියවර 5 - ප්‍රායෝගික ට්‍රයල් පරීක්ෂණය:** RMV පරීක්ෂක ඉදිරියේ රිවර්ස් L පාක් කිරීම, කඳු නැගීම හා පාරේ ධාවනය. සමත් වූ විගස තාවකාලික බලපත්‍රය හිමිවේ!`
        : `🗺️ **5-Step Official Roadmap to Get a Driving License in Sri Lanka:**\n\n1. 🩺 **Step 1 - NTMI Medical Examination:** Vision, color blindness, and physical fitness test at NTMI (valid for 6 months).\n2. 📝 **Step 2 - RMV Registration & Learner's Permit (L-Plate):** Biometric registration and permit issuance.\n3. 📚 **Step 3 - Theory Examination:** 40 multiple-choice questions (Pass mark 30/40).\n4. 🚗 **Step 4 - Practical Driving Training (Mandatory 3 Months):** One-on-one road lessons in dual-control cars during the legal 3-month learner permit period.\n5. 🏁 **Step 5 - RMV Practical Trial Day:** Reverse box parking, hill start, and road driving before the examiner. Temporary license issued on the spot!`,
      citations: ['Official RMV Licensing Process Guide', 'Sri Lanka Driving School Operating Framework'],
      suggestedQuestions: ['කාර් ඔටෝ/මැනුවල් ගාස්තු කීයද?', 'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි', 'Book a Lesson'],
      action: 'courses'
    };
  }

  // 4. Duration & Timeline Intent: "kochchara kal yanawada", "how long"
  if (singlish.intent === 'duration') {
    return {
      content: isSi
        ? `⏱️ **රියදුරු බලපත්‍රය ලබාගැනීමට ගතවන කාලය (Timeline):**\n\n• **සම්පූර්ණ කාලය:** සාමාන්‍යයෙන් **මාස 3 සිට 4 දක්වා** කාලයක් ගතවේ.\n• **නීත්‍යානුකූල හේතුව:** ශ්‍රී ලංකා මෝටර් රථ ප්‍රවාහන පනත අනුව, පුහුණු අවසරපත්‍රය (Learner Permit) ලබාගත් දින සිට ප්‍රායෝගික ට්‍රයල් පරීක්ෂණයට පෙනී සිටීමට **අවම වශයෙන් මාස 3ක අනිවාර්ය පුහුණු කාලයක්** තිබිය යුතුය.\n• මෙම මාස 3 ඇතුළත ඔබගේ සියලු ප්‍රායෝගික සැසි, රිවර්ස් L පාක් කිරීම් සහ මහාමාර්ග ධාවන පුහුණුව සම්පූර්ණ කෙරේ.\n• ට්‍රයල් එක සමත් වූ විගස එදිනම **තාවකාලික බලපත්‍රය (Temporary Driving Permit)** ලබාදෙන අතර ස්මාර්ට් කාඩ්පත තැපෑලෙන් ලැබේ.`
        : `⏱️ **How Long Does it Take to Get a Driving License?**\n\n• **Total Duration:** Approximately **3 to 4 months**.\n• **Legal Reason:** Under the Sri Lanka Motor Traffic Act, a candidate must hold a valid Learner's Permit (L Plate) for a **mandatory minimum of 3 months** before being permitted to sit for the practical trial test.\n• During these 3 months, DriveMate completes all practical in-car sessions, parking drills, and mock trials.\n• Upon passing the trial test, you receive a **Temporary Driving Permit on the same day**, and your official Smart Card is mailed to you.`,
      citations: ['FAQ Knowledge Base: trial', 'Official RMV Licensing Process Guide (Step 4 & 5)'],
      suggestedQuestions: ['කාර් ඔටෝ/මැනුවල් ගාස්තු කීයද?', 'ට්‍රයල් එකේදී අසමත් වුවහොත් මොකද වෙන්නේ?', 'Book a Lesson']
    };
  }

  // 5. Theory Exam & Marks Intent: "prashna keeyak", "pass mark", "exam"
  if (singlish.intent === 'exam') {
    return {
      content: isSi
        ? `📚 **RMV ලිඛිත විභාගය (Theory Exam) පිළිබඳ විස්තර:**\n\n• **ප්‍රශ්න ගණන:** බහුවරණ ප්‍රශ්න **40ක්** (Multiple Choice Questions).\n• **සමත් වීමේ ලකුණු (Pass Mark):** ප්‍රශ්න 40න් **30ක්** නිවැරදි විය යුතුය (75%).\n• **විභාග මාධ්‍යය:** සිංහල, ඉංග්‍රීසි, හෝ දෙමළ භාෂාවෙන් පිළිතුරු ලිවිය හැක.\n• **පරිගණක හෝ ලිඛිත ක්‍රමය:** වේරහැර සහ ප්‍රධාන දිස්ත්‍රික් කාර්යාලවලදී Touch Screen පරිගණක මගින් ක්ෂණික ප්‍රතිඵල ලැබේ.\n• ඩ්‍රයිව්මේට් ආයතනය මගින් පසුගිය ප්‍රශ්න පත්‍ර හා ආදර්ශ ප්‍රශ්නෝත්තර සහිත පුහුණු දේශන නොමිලේ පවත්වනු ලැබේ.`
        : `📚 **RMV Theory Exam Details & Pass Marks:**\n\n• **Number of Questions:** **40 multiple-choice questions**.\n• **Pass Mark:** **30 out of 40** correct answers required (75%).\n• **Languages:** Available in Sinhala, English, and Tamil.\n• **Format:** Computerized touchscreen exam at Werahera and major district offices (instant result).\n• DriveMate provides complete past-paper drilling and practice question sets to ensure a 100% pass rate.`,
      citations: ['FAQ Knowledge Base: exam', 'Official RMV Licensing Process Guide (Step 3)'],
      suggestedQuestions: ['ප්‍රායෝගික ට්‍රයල් එක ගැන විස්තර', 'පාඨමාලා ගාස්තු කීයද?', 'Book a Lesson'],
      action: 'exam'
    };
  }

  // 6. Trial Day Rules, Failures & Footwear: "fail unoth", "sapathu", "trial eka"
  if (singlish.intent === 'trial') {
    return {
      content: isSi
        ? `🏁 **RMV ප්‍රායෝගික ට්‍රයල් පරීක්ෂණය සහ නීති (Trial Day Guidelines):**\n\n• 👟 **අනිවාර්ය ඇඳුම් පැළඳුම් (Strict Dress Code):** සම්පූර්ණයෙන්ම ආවරණය වූ **සපත්තු (Covered Shoes / Sneakers)** පැළඳීම අනිවාර්යයි! සෙරෙප්පු හෝ සැන්ඩල් පැළඳ පැමිණියහොත් RMV පරීක්ෂකවරුන් පරීක්ෂණයට පෙරම ඔබව **අසමත් (Disqualify)** කරනු ඇත.\n• 🚗 **පරීක්ෂා කෙරෙන දෑ:** රිවර්ස් L හැඩය හෝ පෙට්ටියට පාක් කිරීම, කඳු නැගීම (Hill Start), සහ මහමග ධාවනය. යතුරුපැදි සඳහා 8 හැඩය සහ සමබරතාවය.\n• 🔄 **ට්‍රයල් එක අසමත් වුවහොත් (If You Fail):** කලබල විය යුතු නැත! සති 2 සිට 4 දක්වා කාලයකදී නැවත පෙනී සිටිය හැක (RMV නැවත පෙනී සිටීමේ ගාස්තුව රු. 500කි). ඩ්‍රයිව්මේට් ආයතනය මගින් **නොමිලේ අමතර ප්‍රායෝගික සැසි 2ක්** ලබාදී නැවත දිනයක් වෙන්කර දෙනු ලැබේ.`
        : `🏁 **RMV Practical Trial Test Rules & Failure Policies:**\n\n• 👟 **Strict Footwear Rule:** Candidates **MUST wear fully covered shoes or sneakers**. Open sandals, slippers, or flip-flops lead to **IMMEDIATE DISQUALIFICATION** by RMV examiners.\n• 🚗 **Test Maneuvers:** Reverse L-shape box parking, hill start (clutch control / handbrake stop), and road driving.\n• 🔄 **What Happens If You Fail?** Don't worry! You can re-sit the trial after 2 to 4 weeks with a nominal RMV repeat fee (LKR 500). DriveMate provides **2 free extra road sessions** to sharpen your skills before your next attempt.`,
      citations: ['RMV Practical Driving Test Examination Guide', 'FAQ Knowledge Base: trial'],
      suggestedQuestions: ['ට්‍රයල් එකට කොපමණ කාලයක් ගතවේද?', 'කාර් ඔටෝ/මැනුවල් ගාස්තු කීයද?', 'Book a Lesson']
    };
  }

  // 7. Auto vs Manual Comparison: "auto manual wenasa"
  if (singlish.intent === 'auto_vs_manual') {
    return {
      content: isSi
        ? `⚖️ **ඔටෝ සහ මැනුවල් රියදුරු බලපත්‍ර අතර වෙනස (Auto vs Manual):**\n\n• 🚗 **මැනුවල් බලපත්‍රය (Manual - Class B):** ඔබ මැනුවල් බලපත්‍රයක් ලබාගතහොත් ශ්‍රී ලංකාවේ **මැනුවල් සහ ඔටෝ වාහන දෙකම** නීත්‍යානුකූලව ධාවනය කළ හැක. ක්ලච් පාලනය හා ගියර් මාරුකිරීම පුහුණු කෙරේ. (ගාස්තුව: LKR 38,000).\n• 🚗 **ඔටෝ බලපත්‍රය (Auto - Class B Auto):** ධාවනය ඉගෙනීම ඉතා පහසුය. නමුත් ඔබගේ රියදුරු බලපත්‍රයේ **'Auto Only'** යනුවෙන් සීමා සටහනක් (restriction) යෙදෙන අතර, මැනුවල් වාහන ධාවනය කළ නොහැක. (ගාස්තුව: LKR 42,000).`
        : `⚖️ **Difference Between Manual and Automatic Driving License in Sri Lanka:**\n\n• 🚗 **Manual License (Class B Manual):** If you pass in a manual vehicle, you are legally permitted to drive **BOTH manual and automatic vehicles**. (Fee: LKR 38,000).\n• 🚗 **Automatic License (Class B Auto):** Easier to learn with 2 pedals. However, your official driving license will carry a permanent **'Auto Only'** restriction code, meaning you cannot legally drive manual cars. (Fee: LKR 42,000).`,
      citations: ['FAQ Knowledge Base: courses', 'Course Catalog: Light Vehicle Car'],
      suggestedQuestions: ['කාර් ඔටෝ ගාස්තුව කීයද?', 'වාරික වශයෙන් ගෙවිය හැකිද?', 'Book a Lesson'],
      action: 'courses'
    };
  }

  // 8. Schedules & Weekend Classes: "weekend class", "hawasata"
  if (singlish.intent === 'schedules') {
    return {
      content: isSi
        ? `📅 **ඩ්‍රයිව්මේට් පුහුණු කාලසටහන් සහ සති අන්ත පන්ති (Flexible Schedules):**\n\n• 🌟 **සති අන්ත විශේෂ කණ්ඩායම් (Weekend Batches):** රැකියාවල නියුතු අය සහ සිසුන් සඳහා සෙනසුරාදා සහ ඉරිදා දිනවල විශේෂ ප්‍රායෝගික සැසි පැවැත්වේ.\n• ⏰ **දිනපතා පුහුණු වේලාවන්:**\n  - උදෑසන සැසිය: පෙ.ව. 7:30 - පෙ.ව. 9:00\n  - දිවා සැසි: පෙ.ව. 9:30 - ප.ව. 4:00 (පැයක කාල කොටස්)\n  - සවස සැසිය: ප.ව. 4:30 - ප.ව. 6:30\n• ඔබගේ පහසු වේලාව අනුව සැසි වෙන්කරවා ගත හැක.`
        : `📅 **DriveMate Training Schedules & Weekend Classes:**\n\n• 🌟 **Weekend Batches:** Special Saturday and Sunday sessions designed for busy working professionals and university students.\n• ⏰ **Daily Available Slots:**\n  - Morning Slot: 7:30 AM – 9:00 AM\n  - Daytime Slots: 9:30 AM – 4:00 PM (1-hour flexible blocks)\n  - Evening Slot: 4:30 PM – 6:30 PM\n• You can schedule sessions around your personal calendar.`,
      citations: ['FAQ Knowledge Base: schedules', 'DriveMate Academy Operating Hours'],
      suggestedQuestions: ['පාඨමාලාවක් වෙන්කරවා ගැනීමට (Book Lesson)', 'පාඨමාලා ගාස්තු කීයද?', 'ශාඛා පිහිටි ස්ථාන'],
      action: 'booking'
    };
  }

  // 9. Fee / Price Queries ("gana keeyda", "mila kiyada", "course fees")
  if (
    singlish.intent === 'fees' ||
    q.includes('fee') ||
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('මිල') ||
    q.includes('ගාස්තු') ||
    q.includes('gana') ||
    q.includes('ganan')
  ) {
    if (singlish.vehicleType === 'auto') {
      const autoCourse = DRIVING_SCHOOL_DATA.courses.find(c => c.id === 'car-auto')!;
      return {
        content: isSi
          ? `🚗 **ඔටෝ කාර් පාඨමාලා ගාස්තු (Car Auto Course Fee):**\n\n• **සම්පූර්ණ ගාස්තුව:** LKR ${autoCourse.fee.toLocaleString()} (${autoCourse.currency})\n• **ප්‍රායෝගික පුහුණු සැසි:** ${autoCourse.practicalLessons}ක් (Dual-control වාහන මගින්)\n• **න්‍යායාත්මක (Theory) දේශන:** ${autoCourse.theoryClasses}ක්\n• **ඇතුළත් දෑ:** NTMI වෛද්‍ය සහය, රජයේ RMV ගාස්තු, සහ ට්‍රයල් එක සඳහා වාහනය නොමිලේ ලබාදීම.\n• **වාරික ගෙවීම්:** 50%ක් ලියාපදිංචියේදී, 25%ක් පුහුණුව අරඹද්දී, ඉතිරි 25% ට්‍රයල් එකට සති 2කට පෙර ගෙවිය හැක.`
          : `🚗 **Light Vehicle Car (Auto Transmission) Fees:**\n\n• **Total Course Fee:** LKR ${autoCourse.fee.toLocaleString()}\n• **Practical Road Lessons:** ${autoCourse.practicalLessons} lessons\n• **Theory Classes:** ${autoCourse.theoryClasses} classes\n• **Includes:** NTMI Medical assistance, RMV permit processing fees, and vehicle provided on trial day.\n• **Installments:** 50% on registration, 25% on lesson start, 25% before trial test.`,
        citations: ['Course Catalog: Light Vehicle Car (Auto Transmission)'],
        suggestedQuestions: ['වාරික වශයෙන් ගෙවිය හැකිද?', 'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි', 'පාඨමාලාවක් වෙන්කරවා ගැනීමට (Book Lesson)'],
        action: 'booking'
      };
    } else if (singlish.vehicleType === 'manual') {
      const manualCourse = DRIVING_SCHOOL_DATA.courses.find(c => c.id === 'car-manual')!;
      return {
        content: isSi
          ? `🚗 **මැනුවල් කාර් පාඨමාලා ගාස්තු (Car Manual Course Fee):**\n\n• **සම්පූර්ණ ගාස්තුව:** LKR ${manualCourse.fee.toLocaleString()} (${manualCourse.currency})\n• **ප්‍රායෝගික පුහුණු සැසි:** ${manualCourse.practicalLessons}ක් (Clutch control, Hill start & Reverse parking)\n• **න්‍යායාත්මක දේශන:** ${manualCourse.theoryClasses}ක්\n• **විශේෂ වාසිය:** මැනුවල් බලපත්‍රය ලබාගත් විට ඔටෝ සහ මැනුවල් වාහන දෙකම ධාවනය කළ හැක.\n• **වාරික ගෙවීම්:** පහසු වාරික 3කින් ගෙවිය හැක.`
          : `🚗 **Light Vehicle Car / Dual Purpose (Manual) Fees:**\n\n• **Total Course Fee:** LKR ${manualCourse.fee.toLocaleString()}\n• **Practical Lessons:** ${manualCourse.practicalLessons} road lessons\n• **Advantage:** Manual license allows driving both manual and auto vehicles in Sri Lanka.\n• **Installments:** Flexible 3-installment payment plan available.`,
        citations: ['Course Catalog: Light Vehicle Car (Manual Transmission)'],
        suggestedQuestions: ['ඔටෝ කාර් ගාස්තුව කීයද?', 'වාරික වශයෙන් ගෙවීම්', 'Book a Lesson'],
        action: 'booking'
      };
    } else if (singlish.vehicleType === 'bike') {
      const bikeCourse = DRIVING_SCHOOL_DATA.courses.find(c => c.id === 'bike-only')!;
      return {
        content: isSi
          ? `🏍️ **යතුරුපැදි පාඨමාලා ගාස්තු (Motorcycle Course Fee):**\n\n• **සම්පූර්ණ ගාස්තුව:** LKR ${bikeCourse.fee.toLocaleString()}\n• **පුහුණු සැසි:** ${bikeCourse.practicalLessons}ක් (8 හැඩය, කෝන් පුහුණුව සහ සමබරතාවය)\n• **ඇතුළත් දෑ:** RMV ලියාපදිංචිය සහ ට්‍රයල් එක සඳහා යතුරුපැදිය ලබාදීම.`
          : `🏍️ **Motorcycle / Scooter Training (Class A & A1) Fees:**\n\n• **Total Fee:** LKR ${bikeCourse.fee.toLocaleString()}\n• **Practical Sessions:** ${bikeCourse.practicalLessons} sessions (Balance, Figure-8 test training)\n• **Includes:** RMV fees and motorbike provided on trial day.`,
        citations: ['Course Catalog: Motorcycle / Scooter Training'],
        suggestedQuestions: ['කාර් + බයික් Combi ගාස්තුව', 'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි', 'Book a Lesson'],
        action: 'booking'
      };
    } else {
      // General full course fees
      return {
        content: isSi
          ? `📋 **ඩ්‍රයිව්මේට් රියදුරු පාසලේ පාඨමාලා ගාස්තු විස්තර (DriveMate Course Fees):**\n\n• 🚗 **කාර් ඔටෝ (Auto Car):** LKR **42,000** *(ප්‍රායෝගික සැසි 18ක් + ට්‍රයල් වාහනය)*\n• 🚗 **කාර් මැනුවල් (Manual Car):** LKR **38,000** *(ප්‍රායෝගික සැසි 20ක් + ට්‍රයල් වාහනය)*\n• 🏍️ **කාර් + බයික් Combi පැකේජය:** LKR **48,000** *(රු. 12,000ක් ඉතිරි කරගත හැක)*\n• 🏍️ **යතුරුපැදි පමණක් (Bike Only):** LKR **18,000** *(ප්‍රායෝගික සැසි 12ක්)*\n• 🚚 **බර වාහන (Heavy Lorry/Bus):** LKR **58,000** *(අවුරුදු 21+ විය යුතුය)*\n• ⏱️ **බලපත්‍රලාභීන්ට පැයක පුහුණුව (Hourly):** LKR **2,500/පැය**\n\n💳 **පහසු වාරික 3කින් ගෙවීමේ ක්‍රමය (Installments):**\n1. ලියාපදිංචි වන දින: 50%\n2. ප්‍රායෝගික පුහුණුව අරඹද්දී: 25%\n3. ට්‍රයල් පරීක්ෂණයට සති 2කට පෙර: 25%\n*(එකවර සම්පූර්ණ මුදල ගෙවීමේදී රු. 2,000ක ක්ෂණික වට්ටමක් ලැබේ!)*`
          : `📋 **DriveMate Academy Complete Course Fee Structure:**\n\n• 🚗 **Car Automatic (Class B Auto):** LKR **42,000** *(18 road sessions + trial car)*\n• 🚗 **Car Manual (Class B Manual):** LKR **38,000** *(20 road sessions + trial car)*\n• 🏍️ **Combo Package (Car + Motorcycle):** LKR **48,000** *(Best value — save LKR 12,000)*\n• 🏍️ **Motorcycle / Scooter (Class A/A1):** LKR **18,000** *(12 sessions)*\n• 🚚 **Commercial Heavy Vehicle (Class C/CE):** LKR **58,000** *(Age 21+)*\n• ⏱️ **License Holder Refresher:** LKR **2,500/hour**\n\n💳 **Easy 3-Stage Installments:**\n1. 50% on registration day\n2. 25% when practical road driving begins\n3. 25% two weeks before trial test\n*(Paying in full gives you an instant LKR 2,000 discount!)*`,
        citations: ['DriveMate Course Fee Catalog', 'Installment Policy'],
        suggestedQuestions: [
          'වාරික වශයෙන් ගෙවිය හැකිද? (Installment Plan)',
          'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?',
          'පාඨමාලාවක් වෙන්කරවා ගැනීමට (Book Lesson)'
        ],
        action: 'booking'
      };
    }
  }

  // 10. Documents Intent
  if (singlish.intent === 'documents') {
    return {
      content: isSi
        ? `📄 **රියදුරු පාඨමාලාවකට ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි:**\n\n1. **ජාතික හැඳුනුම්පත (NIC):** මුල් හැඳුනුම්පත සහ එහි පැහැදිලි ඡායාපිටපතක් (හෝ වලංගු විදේශ ගමන් බලපත්‍රය).\n2. **NTMI වෛද්‍ය සහතිකය:** ජාතික ප්‍රවාහන වෛද්‍ය ආයතනයෙන් ලබාගත් වෛද්‍ය යෝග්‍යතා සහතිකය (මාස 6ක් වලංගුයි).\n3. **ඡායාරූප:** සුදු පසුබිමැති පාස්පෝට් ප්‍රමාණයේ (35mm x 45mm) වර්ණ ඡායාරූප **4ක්** (දෙකන් පැහැදිලිව පෙනෙන).\n4. **උප්පැන්න සහතිකය:** උප්පැන්න සහතිකයේ පැහැදිලි ඡායාපිටපතක්.\n\n*(ඔබට NTMI වෛද්‍ය පරීක්ෂණය සඳහා මගපෙන්වීම සහ RMV ලියාපදිංචි පෝරම සම්පූර්ණ කිරීමට අප ආයතනය සම්පූර්ණ සහය ලබාදෙයි.)*`
        : `📄 **Documents Required to Register for Driving Lessons:**\n\n1. **National Identity Card (NIC):** Original NIC or valid Sri Lankan Passport with clear copy.\n2. **NTMI Medical Fitness Certificate:** Issued by the National Transport Medical Institute (valid for 6 months).\n3. **Photographs:** 4 passport-size color photographs (white background, standard ears visible).\n4. **Birth Certificate:** Copy for official date of birth verification.`,
      citations: ['FAQ Knowledge Base: registration', 'Official RMV Licensing Process Guide (Step 1 & 2)'],
      suggestedQuestions: ['කාර් ඔටෝ/මැනුවල් ගාස්තු කීයද?', 'වාරික වශයෙන් ගෙවිය හැකිද?', 'Book a Lesson']
    };
  }

  // 11. Installments Intent
  if (singlish.intent === 'installments') {
    return {
      content: isSi
        ? `💳 **පහසු වාරික 3කින් ගෙවීමේ ක්‍රමය (Installment Payment Plan):**\n\n• **1 වන වාරිකය (50%):** ලියාපදිංචි වන දින. (RMV ලියාපදිංචිය, ඇඟිලි සලකුණු හා න්‍යායාත්මක පොත්පත් ඇතුළත්).\n• **2 වන වාරිකය (25%):** ප්‍රායෝගික රියදුරු පුහුණුව (පාරේ ධාවනය) ආරම්භ කරන දින.\n• **3 වන වාරිකය (25%):** RMV ප්‍රායෝගික ට්‍රයල් පරීක්ෂණයට සති 2කට පෙර.\n\n💰 **විශේෂ වට්ටමක්:** සම්පූර්ණ මුදල ලියාපදිංචි වන අවස්ථාවේදීම එකවර ගෙවන්නේ නම් **රු. 2,000ක ක්ෂණික වට්ටමක්** හෝ නොමිලේ අමතර ප්‍රායෝගික පැය 2ක් හිමිවේ!`
        : `💳 **DriveMate Easy 3-Stage Installment Plan:**\n\n• **1st Installment (50%):** Payable on registration day. Covers RMV registration, biometric processing, and theory course material.\n• **2nd Installment (25%):** Payable when in-car practical driving sessions begin.\n• **3rd Installment (25%):** Payable 2 weeks prior to your official RMV trial exam.\n\n💰 **Full Payment Bonus:** Paying 100% upfront grants an instant **LKR 2,000 cash discount** or 2 extra free road hours!`,
      citations: ['Payment Policies: Easy 3-Stage Installment Plan', 'DriveMate Course Fee Catalog'],
      suggestedQuestions: ['කාර් ඔටෝ/මැනුවල් ගාස්තු කීයද?', 'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි', 'Book a Lesson'],
      action: 'booking'
    };
  }

  // 12. Booking Intent
  if (
    q.includes('book') ||
    q.includes('register') ||
    q.includes('enroll') ||
    q.includes('apply') ||
    q.includes('reserve') ||
    q.includes('වෙන්කර') ||
    q.includes('ලියාපදිංචි') ||
    singlish.intent === 'booking'
  ) {
    if (isSi) {
      return {
        content: `ඔබට අපගේ රියදුරු පුහුණු සැසියක් හෝ පාඨමාලාවක් වෙන්කරවා ගැනීමට (Book Lesson) පහසුවෙන්ම ඉල්ලීමක් ඉදිරිපත් කළ හැක!\n\nපහත ඇති **"පාඨමාලාවක් වෙන්කරවා ගන්න" (Book Lesson)** බොත්තම ක්ලික් කර ඔබේ නම, දුරකථන අංකය සහ කැමති ශාඛාව (නුගේගොඩ, වේරහැර, මහනුවර, ගම්පහ) තෝරන්න. අපගේ කාර්ය මණ්ඩලය විනාඩි කිහිපයකින් ඔබ අමතා වේලාව තහවුරු කරනු ඇත.`,
        citations: ['DriveMate Booking Workflow'],
        suggestedQuestions: ['කාර් ඔටෝ/මැනුවල් ගාස්තු කීයද?', 'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?'],
        action: 'booking'
      };
    } else {
      return {
        content: `You can submit a lesson booking or course registration request right here!\n\nClick the **"Book a Lesson"** button to choose your preferred course (Auto, Manual, Bike, Combo), branch (Nugegoda, Werahera, Kandy, Gampaha), and convenient time slot. Our team will verify instructor availability and contact you promptly.`,
        citations: ['DriveMate Booking Workflow'],
        suggestedQuestions: ['What are the course fees?', 'What documents are needed to register?', 'Payment installment plans'],
        action: 'booking'
      };
    }
  }

  // 13. If Retrieval Found Relevant High-Confidence Grounded Content
  if (retrieval.isHighConfidence && retrieval.chunks.length > 0) {
    const topChunk = retrieval.chunks[0];

    if (isSi) {
      let responseText = `**${topChunk.title} පිළිබඳ තොරතුරු:**\n\n${topChunk.contentSi}\n\n`;

      if (retrieval.chunks.length > 1) {
        responseText += `📌 **අමතර තොරතුරු:**\n`;
        for (let i = 1; i < retrieval.chunks.length; i++) {
          responseText += `• ${retrieval.chunks[i].title}: ${retrieval.chunks[i].contentSi}\n`;
        }
      }

      responseText += `\nඔබට වැඩිදුර විස්තර අවශ්‍ය නම් හෝ පුහුණු සැසියක් වෙන්කරවා ගැනීමට කැමති නම් අපව අමතන්න (+94 11 234 5678) හෝ ඉහත බොත්තම භාවිතා කරන්න.`;

      return {
        content: responseText,
        citations: retrieval.citations,
        suggestedQuestions: ['වාරික වශයෙන් ගෙවිය හැකිද?', 'NTMI වෛද්‍ය පරීක්ෂණය කරන්නේ කොහොමද?', 'පාඨමාලාවක් වෙන්කරවා ගැනීමට (Book Lesson)']
      };
    } else {
      let responseText = `Here is the verified information regarding **${topChunk.title}**:\n\n${topChunk.content}\n\n`;

      if (retrieval.chunks.length > 1) {
        responseText += `📌 **Related Details:**\n`;
        for (let i = 1; i < retrieval.chunks.length; i++) {
          responseText += `• **${retrieval.chunks[i].title}**: ${retrieval.chunks[i].content}\n`;
        }
      }

      responseText += `\nFeel free to ask any follow-up questions or click **Book a Lesson** to get started!`;

      return {
        content: responseText,
        citations: retrieval.citations,
        suggestedQuestions: ['Can I pay in installments?', 'How does the RMV Theory Exam work?', 'Book a Lesson']
      };
    }
  }

  // 14. Fallback when not found
  if (isSi) {
    return {
      content: `සමාවන්න, ඔබ විමසූ කරුණ පිළිබඳ නිශ්චිත තොරතුරක් ඩ්‍රයිව්මේට් රියදුරු පාසලේ දත්ත පද්ධතිය තුළ සටහන්ව නොමැත.\n\nරියදුරු පාසලේ නීති සහ ගාස්තු පිළිබඳ වැරදි තොරතුරු ලබානොදීම අපගේ ප්‍රතිපත්තියයි. කරුණාකර වැඩිදුර තොරතුරු සඳහා අපගේ නිල දුරකථන අංකය (+94 11 234 5678 / WhatsApp +94 77 123 4567) අමතන්න හෝ අප වෙත විමසීමක් (Enquiry) යොමු කරන්න.`,
      citations: ['DriveMate Customer Support Policy'],
      suggestedQuestions: ['කාර් ඔටෝ සහ මැනුවල් පාඨමාලා ගාස්තු', 'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?', 'ශාඛා පිහිටි ස්ථාන සහ දුරකථන අංක'],
      action: 'enquiry'
    };
  } else {
    return {
      content: `I am DriveMate AI, specialized in verified information for DriveMate Academy Sri Lanka.\n\nI could not find a confirmed answer to that specific question in our approved driving school knowledge base. To ensure you receive 100% accurate information, please contact our student support team directly at **+94 11 234 5678** (WhatsApp: **+94 77 123 4567**) or submit an enquiry!`,
      citations: ['DriveMate Customer Support Policy'],
      suggestedQuestions: ['What are the course fees?', 'What documents are required to register?', 'Our branch locations & hours'],
      action: 'enquiry'
    };
  }
}

// Main AI Generation Entry Point with optional API key overrides from client
export async function generateChatResponse(
  userMessage: string,
  language: Language,
  conversationHistory: Message[] = [],
  customApiKey?: { geminiKey?: string; openaiKey?: string }
): Promise<AIResponse> {
  // 1. RAG retrieval step
  const retrieval = retrieveRelevantKnowledge(userMessage);
  const singlish = analyzeSinglish(userMessage);

  // 2. Resolve Gemini API Key (custom passed from UI or from .env.local)
  const geminiApiKey = resolveGeminiApiKey(customApiKey?.geminiKey);
  if (geminiApiKey) {
    try {
      const userLang = singlish.isSinglish ? 'Singlish / Sinhala' : language === 'si' ? 'Sinhala' : 'English';
      const prompt = `
${SYSTEM_PROMPT}

User Language Context: ${userLang}
User Query: "${userMessage}"

Retrieved Specific Grounding Chunks:
"""
${retrieval.contextText || 'Core driving curriculum provided above.'}
"""

Instructions for response:
1. Answer the user's inquiry thoroughly and factually using the verified information above.
2. If the user asks in Singlish (e.g. "gana keeyda", "age eka keeyada", "fail unoth mokada wenne", "kochchara kal yanawada", "vibhageta prashna keeyak enawada"), respond in warm, natural Sinhala with clear bullet points and accurate Sri Lankan driving rules and exact LKR fees.
3. If the user asks in English, reply in English.
4. Keep the tone helpful, reassuring, and professional.
`;

      // Try high-availability Gemini models with quota
      const candidateModels = [
        'gemini-flash-lite-latest',
        'gemini-3.5-flash-lite',
        'gemini-2.5-flash'
      ];

      for (const modelName of candidateModels) {
        try {
          const modelEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;
          const response = await fetch(modelEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(4500),
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 600
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const parts = data.candidates?.[0]?.content?.parts || [];
            const answerPart = parts.find((p: any) => !p.thought && p.text) || parts[0];
            const text = answerPart?.text;
            if (text && text.trim().length > 0) {
              return {
                content: text.trim(),
                citations: retrieval.citations.length > 0 ? retrieval.citations : ['DriveMate Academy Sri Lanka (Gemini AI)'],
                suggestedQuestions: [
                  language === 'si' || singlish.isSinglish ? 'පාඨමාලා ගාස්තු විස්තර' : 'View Course Fees',
                  language === 'si' || singlish.isSinglish ? 'පාඨමාලාවක් වෙන්කරගන්න (Book Lesson)' : 'Book a Lesson',
                  language === 'si' || singlish.isSinglish ? 'වාරික ගෙවීම් ක්‍රමය' : 'Installment Plans'
                ]
              };
            }
          }
        } catch {
          // Continue to next candidate model or fallback
        }
      }
    } catch (err) {
      console.error('Gemini API call error, falling back to local grounded engine:', err);
    }
  }

  // 3. Check for OpenAI API Key (if provided)
  const openaiApiKey = customApiKey?.openaiKey || process.env.OPENAI_API_KEY;
  if (openaiApiKey && openaiApiKey.trim().length > 10 && !openaiApiKey.includes('YOUR_API_KEY')) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'system',
          content: `Verified Knowledge Context:\n${retrieval.contextText}\n\nUser Language: ${singlish.isSinglish ? 'Singlish' : language}`
        },
        ...conversationHistory.slice(-4).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.2,
          max_tokens: 600
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return {
            content: text,
            citations: retrieval.citations.length > 0 ? retrieval.citations : ['DriveMate Academy Sri Lanka (OpenAI)'],
            suggestedQuestions: [
              language === 'si' || singlish.isSinglish ? 'ගාස්තු විස්තර' : 'Course Fees',
              language === 'si' || singlish.isSinglish ? 'පාඨමාලාවක් වෙන්කරගන්න' : 'Book a Lesson',
              language === 'si' || singlish.isSinglish ? 'වෛද්‍ය පරීක්ෂණය' : 'Medical Test Info'
            ]
          };
        }
      }
    } catch (err) {
      console.error('OpenAI call error, falling back to local grounded engine:', err);
    }
  }

  // 4. Default: Highly optimized local grounded synthesis engine
  return generateLocalGroundedResponse(userMessage, language, retrieval, conversationHistory);
}
