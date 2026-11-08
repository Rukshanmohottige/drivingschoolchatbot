import { Language, Message } from '../types/chat';
import { retrieveRelevantKnowledge, RetrievalResult } from './rag';
import { DRIVING_SCHOOL_DATA } from '../data/driving-school';

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
3. Language Support: Fluidly communicate in English, Sinhala (සිංහල), or Singlish based on the user's input.
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
  const isSi = language === 'si' || /[\u0D80-\u0DFF]/.test(query);

  // 1. Detect Greeting
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|ayubowan|ආයුබෝවන්|හෙලෝ)/i.test(q)) {
    if (isSi) {
      return {
        content: `ආයුබෝවන්! මම **ඩ්‍රයිව්මේට් AI (DriveMate AI)** රියදුරු සහායකයා. \n\nඔබට ශ්‍රී ලංකාවේ රියදුරු බලපත්‍රයක් ලබාගැනීම, පාඨමාලා ගාස්තු, ලිඛිත විභාගය, හෝ ප්‍රායෝගික පුහුණුව පිළිබඳ ඕනෑම ප්‍රශ්නයක් විමසිය හැක. අද ඔබට මගෙන් කුමන තොරතුරුද අවශ්‍ය?`,
        citations: ['DriveMate Academy Sri Lanka'],
        suggestedQuestions: [
          'කාර් ඔටෝ/මැනුවල් ගාස්තු කීයද?',
          'ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?',
          'වාරික වශයෙන් ගෙවිය හැකිද?',
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

  // 2. Booking Intent
  if (
    q.includes('book') ||
    q.includes('register') ||
    q.includes('enroll') ||
    q.includes('apply') ||
    q.includes('reserve') ||
    q.includes('වෙන්කර') ||
    q.includes('ලියාපදිංචි')
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

  // 3. If Retrieval Found Relevant High-Confidence Grounded Content
  if (retrieval.isHighConfidence && retrieval.chunks.length > 0) {
    const topChunk = retrieval.chunks[0];

    // Language tailored reply
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

  // 4. Fallback when not found in driving school knowledge base (Reliability rule from Implementation Plan)
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

// Main AI Generation Entry Point
export async function generateChatResponse(
  userMessage: string,
  language: Language,
  conversationHistory: Message[] = []
): Promise<AIResponse> {
  // 1. RAG retrieval step
  const retrieval = retrieveRelevantKnowledge(userMessage);

  // 2. Check for external Gemini API Key
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey) {
    try {
      const prompt = `
${SYSTEM_PROMPT}

User Language Preference: ${language === 'si' ? 'Sinhala' : 'English'}

Verified Driving School Knowledge Context:
"""
${retrieval.contextText || 'No specific document matched.'}
"""

User Question: ${userMessage}

Instructions for output:
1. Ground your answer strictly in the provided verified knowledge context.
2. If the answer cannot be determined from the context, politely state that this information is not in the school records and provide the hotline (+94 11 234 5678).
3. Provide response in ${language === 'si' ? 'Sinhala' : 'English'}.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
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

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            content: text,
            citations: retrieval.citations.length > 0 ? retrieval.citations : ['DriveMate Academy Sri Lanka'],
            suggestedQuestions: [
              language === 'si' ? 'ගාස්තු විස්තර බලන්න' : 'View Course Fees',
              language === 'si' ? 'පාඨමාලාවක් වෙන්කරගන්න (Book Lesson)' : 'Book a Lesson',
              language === 'si' ? 'ලිඛිත විභාගය ගැන' : 'RMV Theory Exam Info'
            ]
          };
        }
      }
    } catch (err) {
      console.error('Gemini API call error, falling back to local grounded engine:', err);
    }
  }

  // 3. Check for external OpenAI API Key
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (openaiApiKey) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'system',
          content: `Verified Knowledge Context:\n${retrieval.contextText}\n\nLanguage: ${language}`
        },
        ...conversationHistory.slice(-4).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`
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
            citations: retrieval.citations.length > 0 ? retrieval.citations : ['DriveMate Academy Sri Lanka'],
            suggestedQuestions: [
              language === 'si' ? 'ගාස්තු විස්තර' : 'Course Fees',
              language === 'si' ? 'පාඨමාලාවක් වෙන්කරගන්න' : 'Book a Lesson',
              language === 'si' ? 'වෛද්‍ය පරීක්ෂණය' : 'Medical Test Info'
            ]
          };
        }
      }
    } catch (err) {
      console.error('OpenAI API call error, falling back to local grounded engine:', err);
    }
  }

  // 4. Default: Highly optimized local grounded synthesis engine (reliable, zero API cost, instant response)
  return generateLocalGroundedResponse(userMessage, language, retrieval, conversationHistory);
}
