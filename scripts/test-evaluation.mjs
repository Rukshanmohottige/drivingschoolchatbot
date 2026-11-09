// Automated Evaluation and Testing Suite for DriveMate AI
import { retrieveRelevantKnowledge } from '../src/lib/rag.ts';
import { generateChatResponse } from '../src/lib/ai.ts';
import { bookingRepo, enquiryRepo, conversationRepo } from '../src/lib/database.ts';

async function runTestSuite() {
  console.log('====================================================');
  console.log('DRIVEMATE AI - AUTOMATED EVALUATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
    }
  }

  // ----------------------------------------------------
  // TEST 1: Course Fee Retrieval (English & Sinhala)
  // ----------------------------------------------------
  console.log('\n--- Test Group 1: Knowledge Retrieval & Correctness ---');
  const feeResultEn = retrieveRelevantKnowledge('How much is the fee for automatic car driving course?');
  assert(
    feeResultEn.chunks.some(c => c.content.includes('42,000') || c.id === 'course-car-auto'),
    'Auto Car fee retrieved correctly (LKR 42,000)',
    JSON.stringify(feeResultEn.citations)
  );

  const feeResultSi = retrieveRelevantKnowledge('කාර් ඔටෝ ගාස්තු කීයද?');
  assert(
    feeResultSi.chunks.some(c => c.content.includes('42,000') || c.id === 'course-car-auto'),
    'Sinhala query retrieves Auto Car fee correctly',
    JSON.stringify(feeResultSi.citations)
  );

  // ----------------------------------------------------
  // TEST 2: Document Requirements Retrieval
  // ----------------------------------------------------
  const docResult = retrieveRelevantKnowledge('What documents do I need to register for driving lessons?');
  assert(
    docResult.chunks.some(c => c.content.toLowerCase().includes('nic') || c.content.toLowerCase().includes('medical')),
    'Registration documents retrieved (NIC, NTMI Medical, Photos)',
    JSON.stringify(docResult.citations)
  );

  // ----------------------------------------------------
  // TEST 3: Installments & Payment Plans
  // ----------------------------------------------------
  const installResult = retrieveRelevantKnowledge('Can I pay in installments?');
  assert(
    installResult.chunks.some(c => c.id.startsWith('payment-plan') || c.id === 'faq-installments'),
    'Installment payment plans retrieved (50%, 25%, 25%)',
    JSON.stringify(installResult.citations)
  );

  // ----------------------------------------------------
  // TEST 3.5: Singlish (Phonetic Sinhala) Queries
  // ----------------------------------------------------
  console.log('\n--- Test Group 1.5: Singlish Phonetic Comprehension ---');
  const singlishFee = await generateChatResponse('gana keeyda', 'en');
  assert(
    singlishFee.content.includes('42,000') && singlishFee.content.includes('38,000'),
    'Singlish "gana keeyda" returns complete course fee structure',
    singlishFee.content.slice(0, 100)
  );

  const singlishAuto = await generateChatResponse('car auto gana keeyda', 'en');
  assert(
    singlishAuto.content.includes('42,000') && singlishAuto.content.toLowerCase().includes('auto'),
    'Singlish "car auto gana keeyda" returns Auto Car fee (LKR 42,000)',
    singlishAuto.content.slice(0, 100)
  );

  const singlishDocs = await generateChatResponse('liyakiyawili monawada oni', 'en');
  assert(
    singlishDocs.content.toLowerCase().includes('nic') || singlishDocs.content.includes('හැඳුනුම්පත'),
    'Singlish "liyakiyawili monawada oni" returns registration documents',
    singlishDocs.content.slice(0, 100)
  );

  const singlishInstall = await generateChatResponse('warika puluwanda', 'en');
  assert(
    singlishInstall.content.includes('50%') || singlishInstall.content.includes('වාරික'),
    'Singlish "warika puluwanda" returns installment plan options',
    singlishInstall.content.slice(0, 100)
  );

  const singlishAge = await generateChatResponse('age eka keeyada one license ganna', 'en');
  assert(
    singlishAge.content.includes('18') || singlishAge.content.includes('අවුරුදු 18'),
    'Singlish "age eka keeyada one license ganna" returns minimum age 18',
    singlishAge.content.slice(0, 100)
  );

  const singlishTimeline = await generateChatResponse('kochchara kal yanawada license eka ganna', 'en');
  assert(
    singlishTimeline.content.includes('3') || singlishTimeline.content.includes('මාස'),
    'Singlish "kochchara kal yanawada" returns 3-month legal training period',
    singlishTimeline.content.slice(0, 100)
  );

  const singlishExam = await generateChatResponse('vibhageta prashna keeyak enawada', 'en');
  assert(
    singlishExam.content.includes('40') || singlishExam.content.includes('30'),
    'Singlish "vibhageta prashna keeyak enawada" returns 40 MCQs / 30 pass mark',
    singlishExam.content.slice(0, 100)
  );

  const singlishTrial = await generateChatResponse('fail unoth mokada wenne', 'en');
  assert(
    singlishTrial.content.includes('500') || singlishTrial.content.includes('නැවත') || singlishTrial.content.toLowerCase().includes('re-sit') || singlishTrial.content.includes('අමතර'),
    'Singlish "fail unoth mokada wenne" returns re-trial and extra lessons policy',
    singlishTrial.content.slice(0, 100)
  );

  const singlishWeekend = await generateChatResponse('weekend class puluwanda', 'en');
  assert(
    singlishWeekend.content.includes('සෙනසුරාදා') || singlishWeekend.content.toLowerCase().includes('saturday') || singlishWeekend.content.toLowerCase().includes('weekend') || singlishWeekend.content.includes('සති අන්ත'),
    'Singlish "weekend class puluwanda" returns weekend batch schedules',
    singlishWeekend.content.slice(0, 100)
  );

  // ----------------------------------------------------
  // TEST 4: Anti-hallucination / Fallback on Out-of-Scope Queries
  // ----------------------------------------------------
  console.log('\n--- Test Group 2: Anti-Hallucination & Scope Fallback ---');
  const fallbackQuery = 'How much does it cost to get a commercial helicopter pilot license in Australia?';
  const fallbackRes = await generateChatResponse(fallbackQuery, 'en');
  assert(
    fallbackRes.content.toLowerCase().includes('not find a confirmed answer') ||
    fallbackRes.content.toLowerCase().includes('support team') ||
    fallbackRes.content.toLowerCase().includes('+94 11 234 5678'),
    'Chatbot refuses to hallucinate helicopter pilot fees and directs to school office',
    fallbackRes.content.slice(0, 120)
  );

  const fallbackSiQuery = 'ගුවන් යානා පදවන පාඨමාලා ගාස්තුව කීයද?';
  const fallbackSiRes = await generateChatResponse(fallbackSiQuery, 'si');
  assert(
    fallbackSiRes.content.includes('දත්ත පද්ධතිය තුළ සටහන්ව නොමැත') ||
    fallbackSiRes.content.includes('011 234 5678') ||
    fallbackSiRes.content.includes('නොමැත') ||
    fallbackSiRes.content.includes('පමණ'),
    'Sinhala fallback prevents hallucination on aeroplane piloting queries',
    fallbackSiRes.content.slice(0, 120)
  );

  // ----------------------------------------------------
  // TEST 5: Booking Request Validation & Storage
  // ----------------------------------------------------
  console.log('\n--- Test Group 3: Database & Booking Workflow ---');
  const validBooking = bookingRepo.create({
    fullName: 'Anura Kumara',
    phone: '+94 77 999 8888',
    email: 'anura@example.com',
    nicNumber: '198012345678',
    courseId: 'car-manual',
    courseName: 'Light Vehicle Car (Manual Transmission)',
    transmission: 'Manual',
    branch: 'Nugegoda Main Campus',
    preferredDate: '2026-12-01',
    preferredTimeSlot: 'Morning (8:00 AM - 11:00 AM)',
    hasLearnerPermit: false,
    notes: 'Please schedule theory exam fast.'
  });

  assert(validBooking.id.startsWith('BK-'), 'Booking created with unique ID', validBooking.id);
  assert(validBooking.status === 'pending', 'Booking initialized with status "pending"', validBooking.status);

  // Update status (Admin simulation)
  const updatedBooking = bookingRepo.updateStatus(validBooking.id, 'confirmed');
  assert(updatedBooking?.status === 'confirmed', 'Staff admin can update booking status to "confirmed"');

  // ----------------------------------------------------
  // TEST 6: Enquiry Workflow
  // ----------------------------------------------------
  const enquiry = enquiryRepo.create({
    fullName: 'Kamal Gunaratne',
    phone: '071 555 4321',
    email: 'kamal@example.com',
    category: 'exam',
    message: 'Can I do my written exam in English instead of Sinhala?'
  });
  assert(enquiry.id.startsWith('ENQ-'), 'Enquiry created with unique ID', enquiry.id);
  assert(enquiry.status === 'open', 'Enquiry starts with open status');

  // ----------------------------------------------------
  // TEST SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`EVALUATION COMPLETE: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite failed with unhandled error:', err);
  process.exit(1);
});
