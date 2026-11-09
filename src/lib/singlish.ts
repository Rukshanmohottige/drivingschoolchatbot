/**
 * Comprehensive Sri Lankan Singlish (Phonetic Sinhala in Latin Alphabet) Engine
 * Designed to understand any way Sri Lankan users type inquiries.
 */

export type SinglishIntent =
  | 'fees'
  | 'documents'
  | 'installments'
  | 'medical'
  | 'exam'
  | 'trial'
  | 'process'
  | 'duration'
  | 'age_requirement'
  | 'auto_vs_manual'
  | 'trial_rules'
  | 'schedules'
  | 'heavy_vehicle'
  | 'bike'
  | 'booking'
  | 'female_instructor'
  | 'branches'
  | 'schools_directory'
  | 'how_schools_work'
  | 'general';

export interface SinglishAnalysis {
  isSinglish: boolean;
  intent: SinglishIntent;
  vehicleType: 'auto' | 'manual' | 'bike' | 'combo' | 'heavy' | 'all' | null;
  expandedTokens: string[];
  englishTranslationSummary?: string;
}

// Common Singlish markers and phonetic spellings
const SINGLISH_INDICATORS = [
  'keeyda', 'kiyada', 'keeyada', 'koida', 'koheda', 'monada', 'monawada', 'kohomada',
  'puluwanda', 'thiyenawada', 'innawada', 'wenawada', 'epada', 'karanna', 'karanneda',
  'gewanna', 'gewanne', 'oni', 'oneda', 'one', 'awashyada', 'wenasa', 'mokakda', 'mokadda',
  'gana', 'ganan', 'gaana', 'mila', 'warika', 'kotas', 'liyakiyawili', 'lekiwili', 'vibage',
  'vibagaya', 'wibhagaya', 'trayal', 'traiyal', 'dosthara', 'ayubowan', 'suba', 'mata',
  'mama', 'apita', 'oyaata', 'oyalata', 'thiyenne', 'danna', 'yanne', 'yanna', 'ganna',
  'gannada', 'wayasa', 'aurudu', 'awurudu', 'sathi', 'sathiya', 'dawas', 'masa', 'masayak',
  'parakku', 'fail', 'pass', 'sapathu', 'adi', 'amaruda', 'lesida', 'hawasata', 'udeta',
  'senasurada', 'irida', 'nathiunoth', 'aluth', 'parana', 'clach', 'klach', 'thaniyama'
];

export function isSinglishText(text: string): boolean {
  const lower = text.toLowerCase().trim();
  if (/[\u0D80-\u0DFF]/.test(text)) {
    return false; // Native Sinhala Unicode script
  }
  return SINGLISH_INDICATORS.some(marker => {
    const regex = new RegExp(`(^|\\s|[^a-zA-Z])${marker}($|\\s|[^a-zA-Z])`, 'i');
    return regex.test(lower);
  });
}

export function analyzeSinglish(text: string): SinglishAnalysis {
  const lower = text.toLowerCase().trim();
  const isSinglish = isSinglishText(lower);

  const expandedTokens: string[] = [];
  let intent: SinglishIntent = 'general';
  let vehicleType: SinglishAnalysis['vehicleType'] = null;

  // 1. Vehicle Mention Detection
  if (lower.includes('auto') || lower.includes('ooto') || lower.includes('otomatic') || lower.includes('otamatic')) {
    vehicleType = 'auto';
    expandedTokens.push('auto', 'car-auto', 'car', 'automatic');
  } else if (lower.includes('manual') || lower.includes('menual') || lower.includes('klach') || lower.includes('clutch')) {
    vehicleType = 'manual';
    expandedTokens.push('manual', 'car-manual', 'car');
  } else if (lower.includes('combo') || (lower.includes('car') && lower.includes('bike')) || (lower.includes('car') && lower.includes('motorcycle'))) {
    vehicleType = 'combo';
    expandedTokens.push('combo', 'combo-car-bike');
  } else if (lower.includes('bike') || lower.includes('motorcycle') || lower.includes('motar') || lower.includes('scooter') || lower.includes('skutar')) {
    vehicleType = 'bike';
    expandedTokens.push('bike', 'bike-only', 'motorcycle');
  } else if (lower.includes('heavy') || lower.includes('lorry') || lower.includes('bus') || lower.includes('bara wahana') || lower.includes('bara')) {
    vehicleType = 'heavy';
    expandedTokens.push('heavy', 'heavy-vehicle', 'lorry', 'bus');
  } else if (lower.includes('car') || lower.includes('kaar')) {
    vehicleType = 'all';
    expandedTokens.push('car', 'car-auto', 'car-manual');
  }

  // 2. High Priority Intent Disambiguation
  // NOTE: Avoid checking broad words like "keeyada" alone, which can mean age, days, questions, or fees.

  // A. Age & Eligibility: "wayasa keeyada", "age eka", "aurudu keeyada", "awurudu 18"
  if (
    lower.includes('wayasa') ||
    /\bage\b/i.test(lower) ||
    lower.includes('age eka') ||
    lower.includes('aurudu') ||
    lower.includes('awurudu') ||
    lower.includes('eligible') ||
    lower.includes('sudusukam') ||
    lower.includes('sudusukama')
  ) {
    intent = 'age_requirement';
    expandedTokens.push('age', 'minimum age', '18 years', 'requirements', 'eligibility', 'nic');
  }

  // B. Time & Duration: "kochchara kal", "dawas keeyak", "sathi keeyak", "masa keeyak", "kal yanawada", "how long"
  else if (
    lower.includes('kochchara kal') ||
    lower.includes('kal yanawa') ||
    lower.includes('kalayak') ||
    lower.includes('dawas keeyak') ||
    lower.includes('sathi keeyak') ||
    lower.includes('masa keeyak') ||
    lower.includes('duration') ||
    lower.includes('how long') ||
    lower.includes('how many days') ||
    lower.includes('time period')
  ) {
    intent = 'duration';
    expandedTokens.push('duration', 'timeline', '3 months', 'learner permit', 'how long');
  }

  // C. Full Process & Steps: "kohomada karanne", "process eka", "mulina mokada karanna one", "patanganna widiya", "steps", "how to get"
  else if (
    lower.includes('process') ||
    lower.includes('kohomada karanne') ||
    lower.includes('karanna one kohomada') ||
    lower.includes('mulinma') ||
    lower.includes('patanganna') ||
    lower.includes('steps') ||
    lower.includes('procedure') ||
    lower.includes('how to get') ||
    lower.includes('license ganna widiya') ||
    lower.includes('license ganne kohomada')
  ) {
    intent = 'process';
    expandedTokens.push('licensing process', 'step 1', 'step 2', 'step 3', 'step 4', 'step 5', 'medical', 'theory exam', 'trial');
  }

  // D. Theory Exam & Marks: "vibhageta prashna", "exam eka", "pass mark", "lakunu keeyak", "paper eka", "theory"
  else if (
    lower.includes('prashna keeyak') ||
    lower.includes('lakunu keeyak') ||
    lower.includes('pass mark') ||
    lower.includes('theory') ||
    lower.includes('theary') ||
    lower.includes('vibage') ||
    lower.includes('vibagaya') ||
    lower.includes('wibhagaya') ||
    lower.includes('written exam') ||
    lower.includes('paper eka')
  ) {
    intent = 'exam';
    expandedTokens.push('theory exam', '40 questions', 'pass mark 30', 'written exam', 'computer exam');
  }

  // E. Trial Failure & Rules & Footwear: "fail unoth", "second trial", "sapathu", "shoes", "trial eka", "trayal"
  else if (
    lower.includes('fail') ||
    lower.includes('asamath') ||
    lower.includes('sapathu') ||
    lower.includes('shoes') ||
    lower.includes('slippers') ||
    lower.includes('dress code') ||
    lower.includes('cone') ||
    lower.includes('reverse box') ||
    lower.includes('hill start') ||
    lower.includes('trayal') ||
    lower.includes('traiyal') ||
    (lower.includes('trial') && !lower.includes('fee'))
  ) {
    intent = 'trial';
    expandedTokens.push('practical trial', 'trial failure', 'covered shoes', 'rmv examiner', 'repeat attempt');
  }

  // F. Auto vs Manual: "auto manual wenasa", "auto ekata manual puluwanda", "clutch", "restriction"
  else if (
    (lower.includes('auto') && lower.includes('manual')) ||
    lower.includes('wenasa') ||
    lower.includes('difference') ||
    lower.includes('restriction')
  ) {
    intent = 'auto_vs_manual';
    expandedTokens.push('auto vs manual', 'clutch control', 'auto only restriction', 'class b');
  }

  // G. Schedules: "weekend", "senasurada", "irida", "hawasata", "udeta", "night class", "welaawan", "time slots"
  else if (
    lower.includes('weekend') ||
    lower.includes('senasurada') ||
    lower.includes('irida') ||
    lower.includes('hawasata') ||
    lower.includes('udeta') ||
    lower.includes('time slots') ||
    lower.includes('schedule') ||
    lower.includes('velawa') ||
    lower.includes('welaawa')
  ) {
    intent = 'schedules';
    expandedTokens.push('schedules', 'weekend batches', 'flexible hours', 'morning', 'evening');
  }

  // H. Installments: "warika", "kotas", "installment", "gewanna puluwanda", "half"
  else if (
    lower.includes('warika') ||
    lower.includes('kotas') ||
    lower.includes('installment') ||
    lower.includes('gewanna puluwanda') ||
    lower.includes('gewim') ||
    lower.includes('half') ||
    lower.includes('advance')
  ) {
    intent = 'installments';
    expandedTokens.push('installment plan', '3 installments', '50%', '25%', 'payment policy');
  }

  // I. Documents: "liyakiyawili", "lekiwili", "documents", "monada oni", "monawada oni", "nic", "photos"
  else if (
    lower.includes('liyakiyawili') ||
    lower.includes('lekiwili') ||
    lower.includes('document') ||
    lower.includes('monada oni') ||
    lower.includes('monawada oni') ||
    lower.includes('ona monada') ||
    lower.includes('nic') ||
    lower.includes('photos')
  ) {
    intent = 'documents';
    expandedTokens.push('documents', 'registration requirements', 'nic', 'photos', 'birth certificate');
  }

  // J. Medical: "medical", "ntmi", "dosthara", "eyesight", "blood sugar", "as penima"
  else if (
    lower.includes('medical') ||
    lower.includes('medikal') ||
    lower.includes('ntmi') ||
    lower.includes('dosthara') ||
    lower.includes('eyesight') ||
    lower.includes('blood sugar') ||
    lower.includes('as penima')
  ) {
    intent = 'medical';
    expandedTokens.push('ntmi medical test', 'medical fitness', 'eyesight test', 'nugegoda ntmi', 'werahera');
  }

  // K. Pricing & Fees: "gana keeyda", "mila kiyada", "fees", "cost", "ganan"
  else if (
    lower.includes('gana') ||
    lower.includes('ganan') ||
    lower.includes('gaana') ||
    lower.includes('mila') ||
    lower.includes('keeyda') ||
    lower.includes('kiyada') ||
    lower.includes('keeyada') ||
    lower.includes('fee') ||
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('charges') ||
    lower.includes('gaasthu')
  ) {
    intent = 'fees';
    expandedTokens.push('course fees', 'price', 'lkr', 'package rates', 'cost');
  }

  // L. Booking: "book", "register", "enroll", "daaganna oni"
  else if (
    lower.includes('book') ||
    lower.includes('register') ||
    lower.includes('enroll') ||
    lower.includes('daaganna') ||
    lower.includes('liyapadinchi')
  ) {
    intent = 'booking';
    expandedTokens.push('book a lesson', 'register', 'enroll');
  }

  // M. Female instructors: "female", "lady", "missla", "kellanta", "ladies"
  else if (
    lower.includes('female') ||
    lower.includes('lady') ||
    lower.includes('missla') ||
    lower.includes('kellanta') ||
    lower.includes('ladies') ||
    lower.includes('girls')
  ) {
    intent = 'female_instructor';
    expandedTokens.push('female instructors', 'lady instructor', 'ladies driving lessons');
  }

  // N. How schools work in Sri Lanka
  else if (
    lower.includes('how they work') ||
    lower.includes('how driving schools work') ||
    lower.includes('wada karanne kohomada') ||
    lower.includes('kohomada wada karanne') ||
    lower.includes('ecosystem')
  ) {
    intent = 'how_schools_work';
    expandedTokens.push('how driving schools work', 'dual control', 'dmt registered learners', 'operating framework');
  }

  // O. Schools Directory
  else if (
    lower.includes('driving school') ||
    lower.includes('learners') ||
    lower.includes('perera') ||
    lower.includes('ama') ||
    lower.includes('aravinda') ||
    lower.includes('athula') ||
    lower.includes('charika') ||
    lower.includes('dasuni') ||
    lower.includes('sarathi') ||
    lower.includes('ruhunu')
  ) {
    intent = 'schools_directory';
    expandedTokens.push('driving schools directory', 'registered learners', 'colombo', 'kandy', 'galle', 'gampaha');
  }

  // P. Branches
  else if (
    lower.includes('branch') ||
    lower.includes('koheda') ||
    lower.includes('thiyenne') ||
    lower.includes('nugegoda') ||
    lower.includes('werahera') ||
    lower.includes('kandy') ||
    lower.includes('gampaha')
  ) {
    intent = 'branches';
    expandedTokens.push('branch locations', 'nugegoda', 'werahera', 'kandy', 'gampaha');
  }

  return {
    isSinglish,
    intent,
    vehicleType,
    expandedTokens
  };
}
