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

const SYSTEM_PROMPT = `
You are DriveMate AI, the official and intelligent virtual assistant for DriveMate Academy Sri Lanka, a premier government-registered driving school.

Core Guidelines & Boundaries:
1. Always be polite, professional, encouraging, and clear.
2. Target Audience: Sri Lankan driving license applicants, learners, and students.
3. Singlish & Sinhala Fluency: Understand Singlish (Sinhala written phonetically in English letters, such as "gana keeyda", "mila kiyada", "monada oni", "kohomada karanne", "warika puluwanda"). When the user types Singlish, respond in natural, friendly Sinhala or clear bilingual format with exact LKR prices.
4. Strict Groundedness: Only answer using the verified Driving School Knowledge Base provided in the context. NEVER invent or hallucinate course fees, discount amounts, government DMT/RMV regulations, or exam rules.
5. If the required information is NOT in the knowledge base, honestly state that you do not have verified records and invite the user to contact the office hotline (+94 11 234 5678 / WhatsApp +94 77 123 4567) or click "Book Lesson" / "Submit Enquiry".
6. Format answers with clean bullet points, bold highlights, and clear formatting for high readability.
`;

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

  // 0. Out of scope guard (Reliability rule from plan: never hallucinate on unsupported topics)
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

  // 1. Detect Greeting (English, Sinhala Unicode, and Singlish)
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

  // 2. Fee / Price Queries ("gana keeyda", "mila kiyada", "course fees")
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
      // General "gana keeyda" - Full Comprehensive Fee Breakdown
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

  // 3. Booking Intent
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

  // 4. If Retrieval Found Relevant High-Confidence Grounded Content
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

  // 5. Fallback when not found in driving school knowledge base
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

  // 2. Check for Gemini API Key (custom passed from UI or from .env.local)
  const geminiApiKey = customApiKey?.geminiKey || process.env.GEMINI_API_KEY;
  if (geminiApiKey && geminiApiKey.trim().length > 10) {
    try {
      const userLang = singlish.isSinglish ? 'Singlish / Sinhala' : language === 'si' ? 'Sinhala' : 'English';
      const prompt = `
${SYSTEM_PROMPT}

User Language Context: ${userLang}
User Query: "${userMessage}"

Verified Driving School Knowledge Context:
"""
${retrieval.contextText || 'No specific document matched.'}
"""

Instructions for response:
1. Ground your answer strictly in the provided verified knowledge context.
2. If the user asked in Singlish (e.g. "gana keeyda"), reply in clean, friendly Sinhala or clear bilingual format with exact LKR prices.
3. If the answer cannot be determined from the context, politely state that this information is not in the school records and provide the hotline (+94 11 234 5678).
`;

      const modelEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey.trim()}`;
      let response = await fetch(modelEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800
          }
        })
      });

      // Fallback to gemini-flash-latest if 2.5 is unavailable
      if (!response.ok && response.status === 404) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 800
              }
            })
          }
        );
      }

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            content: text,
            citations: retrieval.citations.length > 0 ? retrieval.citations : ['DriveMate Academy Sri Lanka (Gemini AI)'],
            suggestedQuestions: [
              language === 'si' || singlish.isSinglish ? 'ගාස්තු විස්තර බලන්න' : 'View Course Fees',
              language === 'si' || singlish.isSinglish ? 'පාඨමාලාවක් වෙන්කරගන්න (Book Lesson)' : 'Book a Lesson',
              language === 'si' || singlish.isSinglish ? 'වාරික ගෙවීම් ගැන' : 'Installment Plans'
            ]
          };
        }
      }
    } catch (err) {
      console.error('Gemini API call error, falling back to local grounded engine:', err);
    }
  }

  // 3. Check for OpenAI API Key (custom passed from UI or from .env.local)
  const openaiApiKey = customApiKey?.openaiKey || process.env.OPENAI_API_KEY;
  if (openaiApiKey && openaiApiKey.trim().length > 10) {
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
