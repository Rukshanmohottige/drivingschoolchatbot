/**
 * Singlish (Sinhala written in Latin / English alphabet) Phonetic & Semantic Engine
 * Sri Lankan users commonly type phonetically:
 * e.g., "gana keeyda", "mila kiyada", "monada oni", "kohomada karanne"
 */

export interface SinglishAnalysis {
  isSinglish: boolean;
  intent: 'fees' | 'documents' | 'installments' | 'medical' | 'exam' | 'trial' | 'booking' | 'female_instructor' | 'branches' | 'schools_directory' | 'how_schools_work' | 'general';
  vehicleType: 'auto' | 'manual' | 'bike' | 'combo' | 'heavy' | 'all' | null;
  expandedTokens: string[];
}

const SINGLISH_MARKERS = [
  'keeyda', 'kiyada', 'keeyada', 'koida', 'koheda', 'monada', 'monawada', 'kohomada',
  'puluwanda', 'thiyenawada', 'innawada', 'wenawada', 'epada', 'karanna', 'karanneda',
  'gewanna', 'gewanne', 'oni', 'oneda', 'awashyada', 'wenasa', 'mokakda', 'gana', 'ganan',
  'gaana', 'mila', 'warika', 'kotas', 'liyakiyawili', 'lekiwili', 'vibage', 'vibagaya',
  'wibhagaya', 'trayal', 'traiyal', 'dosthara', 'ayubowan', 'suba'
];

export function isSinglishText(text: string): boolean {
  const lower = text.toLowerCase();
  return SINGLISH_MARKERS.some(marker => new RegExp(`\\b${marker}\\b`, 'i').test(lower) || lower.includes(marker));
}

export function analyzeSinglish(text: string): SinglishAnalysis {
  const lower = text.toLowerCase().trim();
  const isSinglish = isSinglishText(lower);

  const expandedTokens: string[] = [];
  let intent: SinglishAnalysis['intent'] = 'general';
  let vehicleType: SinglishAnalysis['vehicleType'] = null;

  // 1. Detect Vehicle Mention
  if (lower.includes('auto') || lower.includes('ooto') || lower.includes('otomatic')) {
    vehicleType = 'auto';
    expandedTokens.push('auto', 'car-auto', 'car', 'automatic');
  } else if (lower.includes('manual') || lower.includes('menual') || lower.includes('klach') || lower.includes('clutch')) {
    vehicleType = 'manual';
    expandedTokens.push('manual', 'car-manual', 'car');
  } else if (lower.includes('combo') || (lower.includes('car') && lower.includes('bike'))) {
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

  // 2. Detect Intent
  // Fee / Price questions: e.g. "gana keeyda", "mila kiyada", "ganan kohomada", "fees"
  if (
    lower.includes('gana') ||
    lower.includes('ganan') ||
    lower.includes('gaana') ||
    lower.includes('mila') ||
    lower.includes('keeyda') ||
    lower.includes('kiyada') ||
    lower.includes('keeyada') ||
    lower.includes('gaasthu') ||
    lower.includes('fee') ||
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('charges')
  ) {
    intent = 'fees';
    expandedTokens.push('fee', 'price', 'cost', 'rates', 'charges');
  }

  // Documents: e.g. "liyakiyawili monawada", "monada oni", "documents monada"
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
    expandedTokens.push('documents', 'registration', 'nic', 'photos', 'requirements');
  }

  // Installments: e.g. "warika puluwanda", "installment gewanna", "kotas washayen"
  else if (
    lower.includes('warika') ||
    lower.includes('kotas') ||
    lower.includes('installment') ||
    lower.includes('gewanna puluwanda') ||
    lower.includes('gewim') ||
    lower.includes('half')
  ) {
    intent = 'installments';
    expandedTokens.push('installment', 'payment plan', '50%', '25%');
  }

  // Medical: e.g. "medical eka kohomada", "ntmi medical", "medikal"
  else if (
    lower.includes('medical') ||
    lower.includes('medikal') ||
    lower.includes('ntmi') ||
    lower.includes('dosthara') ||
    lower.includes('eyesight')
  ) {
    intent = 'medical';
    expandedTokens.push('medical', 'ntmi', 'fitness', 'eyesight');
  }

  // Theory Exam: e.g. "theory exam eka", "vibage kohomada", "wibhagaya"
  else if (
    lower.includes('theory') ||
    lower.includes('theary') ||
    lower.includes('exam') ||
    lower.includes('vibage') ||
    lower.includes('vibagaya') ||
    lower.includes('wibhagaya') ||
    lower.includes('paper') ||
    lower.includes('prashna')
  ) {
    intent = 'exam';
    expandedTokens.push('theory', 'written exam', '40 questions', 'pass mark');
  }

  // Trial test: e.g. "trial eka", "trayal eka", "fail unoth"
  else if (
    lower.includes('trial') ||
    lower.includes('trayal') ||
    lower.includes('traiyal') ||
    lower.includes('fail')
  ) {
    intent = 'trial';
    expandedTokens.push('trial', 'practical test', '3 months', 'learner permit');
  }

  // Female instructor: e.g. "female instructors innawada", "missla innawada", "lady instructors"
  else if (
    lower.includes('female') ||
    lower.includes('lady') ||
    lower.includes('missla') ||
    lower.includes('kellanta') ||
    lower.includes('girls')
  ) {
    intent = 'female_instructor';
    expandedTokens.push('female instructor', 'ladies', 'women');
  }

  // Booking: e.g. "book karanne kohomada", "register wenne kohomada", "daaganna oni"
  else if (
    lower.includes('book') ||
    lower.includes('register') ||
    lower.includes('enroll') ||
    lower.includes('daaganna') ||
    lower.includes('liyapadinchi')
  ) {
    intent = 'booking';
    expandedTokens.push('booking', 'register', 'enroll');
  }

  // How schools work in Sri Lanka
  else if (
    lower.includes('how they work') ||
    lower.includes('how driving schools work') ||
    lower.includes('wada karanne kohomada') ||
    lower.includes('kohomada wada karanne') ||
    lower.includes('ecosystem')
  ) {
    intent = 'how_schools_work';
    expandedTokens.push('how driving schools work', 'dual control', 'process', 'operating framework');
  }

  // Driving schools directory
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
    expandedTokens.push('driving school', 'learners', 'directory', 'colombo', 'kandy', 'gampaha');
  }

  // Branches: e.g. "branches koheda", "koheda thiyenne", "nugegoda", "kandy", "gampaha", "werahera"
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
    expandedTokens.push('branches', 'location', 'nugegoda', 'werahera', 'kandy', 'gampaha');
  }

  return {
    isSinglish,
    intent,
    vehicleType,
    expandedTokens
  };
}
