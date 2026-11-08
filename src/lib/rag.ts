import { DRIVING_SCHOOL_DATA } from '../data/driving-school';
import { analyzeSinglish } from './singlish';
import { SRI_LANKAN_DRIVING_SCHOOLS, SRI_LANKA_DRIVING_ECOSYSTEM } from '../data/sri-lankan-schools';

export interface KnowledgeChunk {
  id: string;
  title: string;
  category: 'course' | 'fee' | 'document' | 'process' | 'branch' | 'policy' | 'faq';
  content: string;
  contentSi: string;
  keywords: string[];
  citation: string;
}

// Build knowledge chunks from verified driving school information
export function buildKnowledgeBase(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  // 1. Courses chunks
  for (const course of DRIVING_SCHOOL_DATA.courses) {
    chunks.push({
      id: `course-${course.id}`,
      title: `${course.name} (${course.vehicleClassCode})`,
      category: 'course',
      content: `Course: ${course.name}. Vehicle Class: ${course.vehicleClass} (${course.vehicleClassCode}). Transmission: ${course.transmission}. Fee: LKR ${course.fee.toLocaleString()} (${course.currency}). Duration: ${course.duration}. Practical Lessons: ${course.practicalLessons} lessons. Theory classes: ${course.theoryClasses} classes. Description: ${course.description}. Requirements: ${course.requirements.join(', ')}. Includes Medical assistance: ${course.includesMedicalAssistance ? 'Yes' : 'No'}. Includes RMV government fees: ${course.includesRmvFees ? 'Yes' : 'No'}.`,
      contentSi: `පාඨමාලාව: ${course.nameSi}. වාහන පන්තිය: ${course.vehicleClassCode}. ගියර්: ${course.transmission}. ගාස්තුව: රු. ${course.fee.toLocaleString()}. කාලය: ${course.duration}. ප්‍රායෝගික පුහුණු සැසි: ${course.practicalLessons}. විස්තරය: ${course.descriptionSi}. අවශ්‍යතා: ${course.requirements.join(', ')}.`,
      keywords: [
        course.id,
        course.name.toLowerCase(),
        course.vehicleClassCode.toLowerCase(),
        course.transmission.toLowerCase(),
        'fee',
        'price',
        'cost',
        'garthuwa',
        'mila',
        'ganan',
        'gana',
        'keeyda',
        'kiyada',
        'keeyada',
        'gaasthu',
        'course',
        'duration',
        'lessons',
        'auto',
        'manual',
        'කාර්',
        'ගාස්තු',
        'මිල'
      ],
      citation: `Course Catalog: ${course.name}`
    });
  }

  // 2. Payment Plans chunks
  for (let i = 0; i < DRIVING_SCHOOL_DATA.paymentPlans.length; i++) {
    const plan = DRIVING_SCHOOL_DATA.paymentPlans[i];
    chunks.push({
      id: `payment-plan-${i}`,
      title: plan.title,
      category: 'fee',
      content: `${plan.title}: ${plan.description}`,
      contentSi: `${plan.titleSi}: ${plan.descriptionSi}`,
      keywords: ['installment', 'payment', 'plan', 'discount', 'half', 'advance', 'cheque', 'credit card', 'pay', 'warika', 'geweema', 'වාරික', 'ගෙවීම්', 'වට්ටම්'],
      citation: `Payment Policies: ${plan.title}`
    });
  }

  // 3. Licensing Process chunks
  for (const step of DRIVING_SCHOOL_DATA.licensingProcess) {
    chunks.push({
      id: `process-step-${step.step}`,
      title: `Step ${step.step}: ${step.title}`,
      category: 'process',
      content: `Licensing Step ${step.step}: ${step.title}. Description: ${step.description}. Timeline: ${step.timeline}.`,
      contentSi: `පියවර ${step.step}: ${step.titleSi}. විස්තරය: ${step.descriptionSi}. ගතවන කාලය: ${step.timeline}.`,
      keywords: [
        `step ${step.step}`,
        step.title.toLowerCase(),
        'process',
        'how to',
        'license',
        'procedure',
        'stages',
        'permit',
        'exam',
        'trial',
        'medical',
        'පියවර',
        'ක්‍රියාවලිය',
        'බලපත්‍රය'
      ],
      citation: `Official RMV Licensing Process Guide (Step ${step.step})`
    });
  }

  // 4. Branches & Contact chunks
  for (const branch of DRIVING_SCHOOL_DATA.branches) {
    chunks.push({
      id: `branch-${branch.id}`,
      title: `${branch.name} Branch`,
      category: 'branch',
      content: `DriveMate Branch: ${branch.name}. Address: ${branch.address}. Phone: ${branch.phone}. Working Hours: ${DRIVING_SCHOOL_DATA.contact.workingHours}. WhatsApp: ${DRIVING_SCHOOL_DATA.contact.whatsapp}. Email: ${DRIVING_SCHOOL_DATA.contact.email}.`,
      contentSi: `ශාඛාව: ${branch.nameSi}. ලිපිනය: ${branch.address}. දුරකථන: ${branch.phone}. වේලාව: ${DRIVING_SCHOOL_DATA.contact.workingHoursSi}.`,
      keywords: [branch.id, branch.name.toLowerCase(), 'branch', 'location', 'address', 'where', 'phone', 'contact', 'hours', 'office', 'ශාඛා', 'ලිපිනය', 'දුරකථන'],
      citation: `Branch Directory: ${branch.name}`
    });
  }

  // 5. FAQs chunks
  for (const faq of DRIVING_SCHOOL_DATA.faqs) {
    chunks.push({
      id: faq.id,
      title: faq.questionEn,
      category: 'faq',
      content: `Question: ${faq.questionEn}\nAnswer: ${faq.answerEn}`,
      contentSi: `ප්‍රශ්නය: ${faq.questionSi}\nපිළිතුර: ${faq.answerSi}`,
      keywords: [...faq.tags, ...faq.questionEn.toLowerCase().split(/\s+/), ...faq.questionSi.split(/\s+/)],
      citation: `FAQ Knowledge Base: ${faq.category}`
    });
  }

  // 6. Sri Lankan Driving Schools Directory chunks
  for (const school of SRI_LANKAN_DRIVING_SCHOOLS) {
    const packagesStr = school.popularPackages.map(p => `${p.name}: LKR ${p.fee.toLocaleString()} (${p.lessons} lessons)`).join('; ');
    chunks.push({
      id: `school-${school.id}`,
      title: `${school.name} (${school.district})`,
      category: 'branch',
      content: `${school.name} in ${school.district}. Main Branch: ${school.mainBranch}. Branches: ${school.branches.join(', ')}. Phone/WhatsApp: ${school.phone}. Experience: ${school.experienceYears} years. Rating: ${school.rating} (${school.reviewCount} reviews). Classes taught: ${school.vehicleClasses.join(', ')}. Key features: ${school.features.join(', ')}. Popular Packages: ${packagesStr}.`,
      contentSi: `${school.nameSi} (${school.district} දිස්ත්‍රික්කය). ප්‍රධාන ශාඛාව: ${school.mainBranch}. දුරකථන: ${school.phone}. විශේෂාංග: ${school.featuresSi.join(', ')}. පාඨමාලා: ${packagesStr}.`,
      keywords: [
        school.id,
        school.name.toLowerCase(),
        school.nameSi.toLowerCase(),
        school.district.toLowerCase(),
        'driving school',
        'learners',
        'school',
        'perera',
        'ama',
        'aravinda',
        'athula',
        'charika',
        'sarathi',
        'dasuni',
        'ruhunu',
        'auto driving school',
        'ලර්නර්ස්',
        'රියදුරු පාසල්'
      ],
      citation: `Sri Lanka Driving Schools Directory: ${school.name}`
    });
  }

  // 7. How Driving Schools Work in Sri Lanka chunks
  for (const step of SRI_LANKA_DRIVING_ECOSYSTEM.howSchoolsWork) {
    chunks.push({
      id: `how-schools-work-step-${step.step}`,
      title: `How Driving Schools Work (Step ${step.step}): ${step.title}`,
      category: 'process',
      content: `How Sri Lankan Driving Schools Work - Step ${step.step}: ${step.title}.\nDetailed Process: ${step.detail}\nPractical Candidate Tip: ${step.practicalTip}`,
      contentSi: `ශ්‍රී ලංකාවේ රියදුරු පාසල් ක්‍රියාත්මක වන ආකාරය (පියවර ${step.step}): ${step.titleSi}.\nවිස්තරය: ${step.detailSi}\nවැදගත් උපදෙස: ${step.practicalTip}`,
      keywords: [
        'how driving schools work',
        'how they work',
        'sri lankan driving schools',
        'process',
        'method',
        'dual control',
        'how to get license',
        'learners kohomada wada karanne',
        'ක්‍රියාත්මක වන ආකාරය'
      ],
      citation: `Sri Lanka Driving School Operating Framework (Step ${step.step})`
    });
  }

  // 8. RMV Official Government Fees chunk
  const feesText = SRI_LANKA_DRIVING_ECOSYSTEM.rmvFees.map(f => `• ${f.item}: Normal ${f.normalFee} | One-Day ${f.oneDayFee} (${f.notes})`).join('\n');
  chunks.push({
    id: 'dmt-official-fees',
    title: 'Official Department of Motor Traffic (DMT / RMV) Government Fees',
    category: 'fee',
    content: `Official Government Fees for Driving Licenses in Sri Lanka (payable to Department of Motor Traffic & NTMI):\n${feesText}`,
    contentSi: `ශ්‍රී ලංකා මෝටර් රථ ප්‍රවාහන දෙපාර්තමේන්තුවේ (DMT/RMV) සහ NTMI නිල රජයේ ගාස්තු:\n${feesText}`,
    keywords: ['government fee', 'rmv fee', 'dmt fee', 'official fee', 'stamp fee', 'medical fee', 'rajaye gaasthu', 'රජයේ ගාස්තු', 'rmv ගාස්තු'],
    citation: 'DMT Sri Lanka Official Fee Schedule'
  });

  // 9. RMV Practical Trial Day Rules, Dress Code & Maneuvers chunk
  chunks.push({
    id: 'trial-day-guidelines',
    title: 'RMV Practical Trial Day Guide: Dress Code, Required Documents & Maneuvers',
    category: 'process',
    content: `RMV Trial Day Rules & Instructions:\n• Mandatory Dress Code: ${SRI_LANKA_DRIVING_ECOSYSTEM.trialChecklist.dressCode.join('; ')}\n• Mandatory Documents: ${SRI_LANKA_DRIVING_ECOSYSTEM.trialChecklist.mandatoryDocuments.join('; ')}\n• Test Maneuvers: ${SRI_LANKA_DRIVING_ECOSYSTEM.trialChecklist.testManeuvers.join('; ')}\n• Top Reasons Candidates Fail: ${SRI_LANKA_DRIVING_ECOSYSTEM.trialChecklist.commonFailReasons.join('; ')}`,
    contentSi: `RMV ට්‍රයල් දිනයේ වැදගත් නීති:\n• අනිවාර්ය ඇඳුම් පැළඳුම් (Dress Code): සපත්තු පැළඳීම අනිවාර්යයි (සෙරෙප්පු/සැන්ඩල් තහනම්). විනීත ඇඳුම.\n• රැගෙන යා යුතු ලියකියවිලි: මුල් හැඳුනුම්පත, මුල් පුහුණු අවසරපත්‍රය (Learner Permit), ට්‍රයල් කාඩ්පත.\n• පරීක්ෂණ: රිවර්ස් L හැඩය පාක් කිරීම, කඳු නැගීම (Hill Start), පාරේ ධාවනය, යතුරුපැදි 8 හැඩය.\n• අසමත් වන ප්‍රධාන හේතු: එන්ජිම නතරවීම (stalling), කෝන් වල ගැටීම, යතුරුපැදියේ කකුල බිම තැබීම.`,
    keywords: [
      'trial day',
      'dress code',
      'shoes',
      'shoes mandatory',
      'slippers',
      'what to wear',
      'trial maneuvers',
      'reverse l',
      'hill start',
      'fail reasons',
      'ට්‍රයල් නීති',
      'සපත්තු'
    ],
    citation: 'RMV Practical Driving Test Examination Guide'
  });

  return chunks;
}

// In-memory knowledge base
export const KNOWLEDGE_BASE = buildKnowledgeBase();

export interface RetrievalResult {
  chunks: KnowledgeChunk[];
  contextText: string;
  citations: string[];
  isHighConfidence: boolean;
}

// Tokenize and clean text for lexical retrieval (supports English, alphanumeric, and Sinhala unicode)
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0D80-\u0DFF]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1);
}

// Words strictly out of scope for a Sri Lankan motor traffic driving school
const OUT_OF_SCOPE_WORDS = [
  'helicopter', 'plane', 'airplane', 'aircraft', 'pilot', 'flight', 'aviation',
  'boat', 'ship', 'submarine', 'yacht', 'diving', 'swimming', 'cooking', 'recipe',
  'programming', 'python', 'javascript', 'bitcoin', 'crypto', 'forex',
  'australia', 'uk', 'canada', 'usa', 'dubai', 'germany', 'japan', 'england',
  'ගුවන්', 'යානා', 'නැව්', 'පිහිනුම්', 'නියමුවා'
];

// Semantic and lexical search across English and Sinhala
export function retrieveRelevantKnowledge(query: string, maxResults = 3): RetrievalResult {
  const qLower = query.toLowerCase();

  // Out of scope domain detection (Anti-hallucination guard)
  const isOutOfScope = OUT_OF_SCOPE_WORDS.some(word => qLower.includes(word));
  if (isOutOfScope) {
    return {
      chunks: [],
      contextText: '',
      citations: [],
      isHighConfidence: false
    };
  }

  const singlishAnalysis = analyzeSinglish(query);
  const rawTokens = tokenize(query);
  const queryTokens = Array.from(new Set([...rawTokens, ...singlishAnalysis.expandedTokens]));

  if (queryTokens.length === 0) {
    return {
      chunks: [],
      contextText: '',
      citations: [],
      isHighConfidence: false
    };
  }

  const scoredChunks = KNOWLEDGE_BASE.map(chunk => {
    let score = 0;
    const combinedContent = `${chunk.title} ${chunk.content} ${chunk.contentSi} ${chunk.keywords.join(' ')}`.toLowerCase();

    for (const token of queryTokens) {
      // Exact title match gets highest boost
      if (chunk.title.toLowerCase().includes(token)) {
        score += 8;
      }
      // Keyword match
      if (chunk.keywords.some(k => k.toLowerCase() === token)) {
        score += 6;
      } else if (chunk.keywords.some(k => k.toLowerCase().includes(token))) {
        score += 3;
      }
      // Content match
      if (combinedContent.includes(token)) {
        score += 2;
      }
    }

    // Direct Singlish intent boost
    if (singlishAnalysis.intent === 'fees') {
      if (singlishAnalysis.vehicleType === 'auto' && chunk.id === 'course-car-auto') {
        score += 30;
      } else if (singlishAnalysis.vehicleType === 'manual' && chunk.id === 'course-car-manual') {
        score += 30;
      } else if (singlishAnalysis.vehicleType === 'bike' && chunk.id === 'course-bike-only') {
        score += 30;
      } else if (singlishAnalysis.vehicleType === 'combo' && chunk.id === 'course-combo-car-bike') {
        score += 30;
      } else if (singlishAnalysis.vehicleType === 'heavy' && chunk.id === 'course-heavy-vehicle') {
        score += 30;
      } else if (chunk.category === 'course') {
        score += 20;
      }
    } else if (singlishAnalysis.intent === 'documents') {
      if (chunk.id === 'faq-docs' || chunk.id === 'process-step-2') {
        score += 30;
      }
    } else if (singlishAnalysis.intent === 'installments') {
      if (chunk.category === 'fee' || chunk.id === 'faq-installments') {
        score += 30;
      }
    } else if (singlishAnalysis.intent === 'medical') {
      if (chunk.id === 'faq-medical' || chunk.id === 'process-step-1') {
        score += 30;
      }
    } else if (singlishAnalysis.intent === 'exam') {
      if (chunk.id === 'faq-theory-exam' || chunk.id === 'process-step-3') {
        score += 30;
      }
    } else if (singlishAnalysis.intent === 'trial') {
      if (chunk.id.includes('trial') || chunk.id === 'process-step-5') {
        score += 30;
      }
    } else if (singlishAnalysis.intent === 'female_instructor') {
      if (chunk.id === 'faq-female-instructors') {
        score += 30;
      }
    } else if (singlishAnalysis.intent === 'branches') {
      if (chunk.category === 'branch') {
        score += 30;
      }
    } else if (singlishAnalysis.intent === 'schools_directory') {
      if (chunk.id.startsWith('school-') || chunk.citation.includes('Driving Schools Directory')) {
        score += 35;
      }
    } else if (singlishAnalysis.intent === 'how_schools_work') {
      if (chunk.id.startsWith('how-schools-work') || chunk.id === 'trial-day-guidelines' || chunk.id === 'dmt-official-fees') {
        score += 35;
      }
    }

    // Boost common intent queries
    const qLower = query.toLowerCase();
    if ((qLower.includes('fee') || qLower.includes('price') || qLower.includes('cost') || qLower.includes('මිල') || qLower.includes('ගාස්තු') || qLower.includes('gana')) && chunk.category === 'course') {
      score += 5;
    }
    if ((qLower.includes('medical') || qLower.includes('doctor') || qLower.includes('ntmi') || qLower.includes('වෛද්‍ය')) && (chunk.title.includes('Medical') || chunk.keywords.includes('medical'))) {
      score += 7;
    }
    if ((qLower.includes('install') || qLower.includes('part') || qLower.includes('වාරික')) && chunk.category === 'fee') {
      score += 7;
    }
    if ((qLower.includes('trial') || qLower.includes('fail') || qLower.includes('ට්‍රයල්')) && chunk.title.toLowerCase().includes('trial')) {
      score += 6;
    }
    if ((qLower.includes('doc') || qLower.includes('nic') || qLower.includes('photo') || qLower.includes('ලියකියවිලි')) && chunk.id === 'faq-docs') {
      score += 8;
    }

    return { chunk, score };
  });

  // Sort descending by relevance score
  scoredChunks.sort((a, b) => b.score - a.score);

  const topScored = scoredChunks.filter(item => item.score > 2).slice(0, maxResults);
  const selectedChunks = topScored.map(item => item.chunk);

  const citations = Array.from(new Set(selectedChunks.map(c => c.citation)));

  const contextText = selectedChunks
    .map((c, index) => `[Source ${index + 1}: ${c.citation}]\n${c.content}\n${c.contentSi}`)
    .join('\n\n');

  const topScore = scoredChunks[0]?.score || 0;
  const isHighConfidence = topScore >= 4;

  return {
    chunks: selectedChunks,
    contextText,
    citations,
    isHighConfidence
  };
}
