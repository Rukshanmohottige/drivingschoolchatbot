import { DrivingSchoolInfo } from '@/types/chat';

export const DRIVING_SCHOOL_DATA: DrivingSchoolInfo = {
  schoolName: "DriveMate Academy Sri Lanka",
  schoolNameSi: "ඩ්‍රයිව්මේට් රියදුරු පුහුණු ආයතනය",
  tagline: "Your trusted gateway to safe driving & government driving licenses",
  taglineSi: "රජයේ රියදුරු බලපත්‍රය සහ ආරක්ෂිත රිය පැදවීමේ විශ්වාසනීය සහකරු",
  contact: {
    hotline: "+94 11 234 5678 / +94 77 123 4567",
    whatsapp: "+94 77 123 4567",
    email: "info@drivemate.lk",
    workingHours: "Monday to Sunday: 7:30 AM – 6:30 PM",
    workingHoursSi: "සඳුදා සිට ඉරිදා දක්වා: පෙ.ව. 7:30 සිට ප.ව. 6:30 දක්වා"
  },
  branches: [
    {
      id: "nugegoda",
      name: "Nugegoda Main Campus",
      nameSi: "නුගේගොඩ ප්‍රධාන ශාඛාව",
      address: "142 High Level Road, Nugegoda (Near Supermarket junction)",
      phone: "+94 11 282 1234"
    },
    {
      id: "werahera",
      name: "Werahera / Boralesgamuwa Branch",
      nameSi: "වේරහැර / බොරලැස්ගමුව ශාඛාව",
      address: "88 RMV Access Road, Werahera (5 mins from DMT Head Office)",
      phone: "+94 11 250 9876"
    },
    {
      id: "kandy",
      name: "Kandy Branch",
      nameSi: "මහනුවර ශාඛාව",
      address: "45 William Gopallawa Mawatha, Kandy",
      phone: "+94 81 223 4567"
    },
    {
      id: "gampaha",
      name: "Gampaha Branch",
      nameSi: "ගම්පහ ශාඛාව",
      address: "22 Colombo Road, Gampaha",
      phone: "+94 33 222 3456"
    }
  ],
  courses: [
    {
      id: "car-auto",
      name: "Light Vehicle Car (Auto Transmission)",
      nameSi: "සැහැල්ලු වාහන කාර් (ඔටෝ ගියර්)",
      vehicleClass: "Dual Purpose / Light Vehicle Car (Auto)",
      vehicleClassCode: "B (Auto)",
      transmission: "Auto",
      fee: 42000,
      currency: "LKR",
      duration: "6 - 12 Weeks (Flexible scheduling)",
      practicalLessons: 18,
      theoryClasses: 4,
      description: "Complete driving course for modern automatic cars. Ideal for urban commuting and quick mastery. Includes mock trial sessions and vehicle provided for RMV trial day.",
      descriptionSi: "නවීන ඔටෝ ගියර් කාර් සඳහා වන සම්පූර්ණ රියදුරු පාඨමාලාව. නගරයේ පහසුවෙන් රිය ධාවනයට සුදුසුයි. ප්‍රායෝගික පුහුණුවීම් 18ක් සහ ට්‍රයල් එක සඳහා වාහනය ලබාදීම ඇතුළත් වේ.",
      includesMedicalAssistance: true,
      includesRmvFees: true,
      requirements: ["Age 18+", "Valid National Identity Card (NIC) or Passport", "NTMI Medical Certificate"]
    },
    {
      id: "car-manual",
      name: "Light Vehicle Car / Dual Purpose (Manual Transmission)",
      nameSi: "සැහැල්ලු වාහන කාර් / වෑන් (මැනුවල් ගියර්)",
      vehicleClass: "Light Motor Vehicle Car & Van (Class B Manual)",
      vehicleClassCode: "B (Manual)",
      transmission: "Manual",
      fee: 38000,
      currency: "LKR",
      duration: "8 - 14 Weeks (Flexible scheduling)",
      practicalLessons: 20,
      theoryClasses: 4,
      description: "Comprehensive manual transmission training covering clutch control, hill starts, heavy traffic navigation, and reverse parking. Manual license allows driving both manual and auto vehicles in Sri Lanka.",
      descriptionSi: "ක්ලච් පාලනය, කඳු නැගීම, සහ රිවර්ස් පාක් කිරීම ඇතුළු සම්පූර්ණ මැනුවල් පුහුණුව. මැනුවල් බලපත්‍රය ලබාගත් විට ඔටෝ සහ මැනුවල් වාහන දෙකම ධාවනය කළ හැක.",
      includesMedicalAssistance: true,
      includesRmvFees: true,
      requirements: ["Age 18+", "Valid National Identity Card (NIC) or Passport", "NTMI Medical Certificate"]
    },
    {
      id: "combo-car-bike",
      name: "Combo Package: Car (Manual/Auto) + Motorcycle",
      nameSi: "කාර් (ඔටෝ/මැනුවල්) + යතුරුපැදි Combi පාඨමාලාව",
      vehicleClass: "Class B (Car) + Class A/A1 (Motorcycle)",
      vehicleClassCode: "B + A/A1",
      transmission: "Both",
      fee: 48000,
      currency: "LKR",
      duration: "8 - 14 Weeks",
      practicalLessons: 25,
      theoryClasses: 6,
      description: "Our most popular package! Get certified for both light vehicle car and motorcycle in a single RMV registration, saving over LKR 12,000 in government processing fees.",
      descriptionSi: "අපගේ ජනප්‍රියම පාඨමාලාව! කාර් සහ යතුරුපැදි දෙකටම එකම ලියාපදිංචියෙන් පුහුණුව ලබාගෙන රජයේ ගාස්තු වලින් රු. 12,000කට වැඩි මුදලක් ඉතිරි කරගන්න.",
      includesMedicalAssistance: true,
      includesRmvFees: true,
      requirements: ["Age 18+", "Valid NIC or Passport", "NTMI Medical Fitness Certificate"]
    },
    {
      id: "bike-only",
      name: "Motorcycle / Scooter Training (Class A & A1)",
      nameSi: "යතුරුපැදි හා ස්කූටර් පුහුණුව (Class A & A1)",
      vehicleClass: "Motorcycles > 100cc & Light Motorcycles < 100cc",
      vehicleClassCode: "A / A1",
      transmission: "Manual",
      fee: 18000,
      currency: "LKR",
      duration: "4 - 6 Weeks",
      practicalLessons: 12,
      theoryClasses: 3,
      description: "Dedicated motorcycle handling, cone maneuvering, figure-8 balance test training, and defensive city riding on clutch bikes and scooters.",
      descriptionSi: "යතුරුපැදි සමබරතාවය, 8 හැඩයේ ධාවනය, කෝන් පුහුණුව සහ ආරක්ෂිත නගර ධාවනය සඳහා වන විශේෂ පාඨමාලාව.",
      includesMedicalAssistance: true,
      includesRmvFees: true,
      requirements: ["Age 18+", "Valid NIC or Passport", "NTMI Medical Certificate"]
    },
    {
      id: "heavy-vehicle",
      name: "Commercial & Heavy Vehicle Training (Lorry / Bus)",
      nameSi: "බර වාහන පුහුණුව (ලොරි සහ බස් රථ)",
      vehicleClass: "Heavy Motor Vehicle (Class C & CE)",
      vehicleClassCode: "C / CE",
      transmission: "Manual",
      fee: 58000,
      currency: "LKR",
      duration: "10 - 16 Weeks",
      practicalLessons: 24,
      theoryClasses: 6,
      description: "Professional heavy vehicle training for commercial drivers and transport operators. Requires candidate to be at least 21 years old and hold a light vehicle license for at least 2 years.",
      descriptionSi: "වෘත්තීය බර වාහන රියදුරු පුහුණුව. අයදුම්කරු අවුරුදු 21 සම්පූර්ණ විය යුතු අතර සැහැල්ලු වාහන බලපත්‍රය වසර 2ක් හෝ ඊට වැඩි කාලයක් සතුව තිබිය යුතුය.",
      includesMedicalAssistance: true,
      includesRmvFees: true,
      requirements: ["Age 21+", "Light vehicle license held for minimum 2 years", "Commercial Grade NTMI Medical"]
    },
    {
      id: "refresher-hourly",
      name: "Refresher & License-Holder Individual Lessons",
      nameSi: "බලපත්‍රලාභීන් සඳහා විශේෂ පුහුණු පැය",
      vehicleClass: "Any Car (Auto or Manual)",
      vehicleClassCode: "B",
      transmission: "Both",
      fee: 2500,
      currency: "LKR per hour",
      duration: "Flexible (1 hour blocks)",
      practicalLessons: 1,
      theoryClasses: 0,
      description: "Designed for individuals who already hold a driving license but lack road confidence, highway driving experience, or want parking mastery.",
      descriptionSi: "දැනටමත් රියදුරු බලපත්‍රය ඇති නමුත් මහමග ධාවනයේදී බියක් දක්වන හෝ නැවත හුරු වීමට කැමති අය සඳහා වන පැයක පුහුණු සැසි.",
      includesMedicalAssistance: false,
      includesRmvFees: false,
      requirements: ["Valid Sri Lankan Driving License or valid Learner Permit"]
    }
  ],
  paymentPlans: [
    {
      title: "Easy 3-Stage Installment Plan",
      titleSi: "පහසු වාරික 3කින් ගෙවීමේ ක්‍රමය",
      description: "1st Installment (50%): Payable on registration day. Covers RMV registration, theory materials, and medical guidance.\n2nd Installment (25%): Payable before starting practical road lessons.\n3rd Installment (25%): Payable 2 weeks prior to RMV practical trial test.",
      descriptionSi: "1 වන වාරිකය (50%): ලියාපදිංචි වන දින ගෙවිය යුතුය (RMV ගාස්තු සහ පොත්පත් ඇතුළත්).\n2 වන වාරිකය (25%): ප්‍රායෝගික පුහුණුව ආරම්භ කිරීමට පෙර.\n3 වන වාරිකය (25%): ට්‍රයල් එකට සති 2කට පෙර."
    },
    {
      title: "Full Payment Discount",
      titleSi: "එකවර ගෙවීමේදී විශේෂ වට්ටම්",
      description: "Pay the full course fee upfront and receive an instant LKR 2,000 cash discount or 2 extra free practical road hours.",
      descriptionSi: "සම්පූර්ණ පාඨමාලා ගාස්තුව එකවර ගෙවීමේදී රු. 2,000ක ක්ෂණික වට්ටමක් හෝ නොමිලේ අමතර ප්‍රායෝගික පුහුණු පැය 2ක් ලැබේ."
    }
  ],
  licensingProcess: [
    {
      step: 1,
      title: "NTMI Medical Fitness Test",
      titleSi: "ජාතික ප්‍රවාහන වෛද්‍ය සහතිකය (NTMI Medical)",
      description: "Visit the National Transport Medical Institute (Werahera, Nugegoda, or nearest center). Bring original NIC and fasting blood sugar test if applicable. The certificate is valid for 6 months.",
      descriptionSi: "ජාතික ප්‍රවාහන වෛද්‍ය ආයතනයෙන් (NTMI) වෛද්‍ය පරීක්ෂණය සමත්වීම. මුල් හැඳුනුම්පත රැගෙන යා යුතුය. සහතිකය මාස 6ක් වලංගු වේ.",
      timeline: "Day 1 (1 - 2 hours)"
    },
    {
      step: 2,
      title: "RMV Registration & Learner Permit (L Plate)",
      titleSi: "RMV ලියාපදිංචිය සහ පුහුණු අවසරපත්‍රය (L ප්ලේට්)",
      description: "DriveMate submits your application to the Department of Motor Traffic (DMT/RMV). Your biometric thumbprint and photograph are taken, and your official Learner Permit is issued.",
      descriptionSi: "ඩ්‍රයිව්මේට් ආයතනය මගින් ඔබව RMV ලියාපදිංචි කර ඇඟිලි සලකුණු හා ඡායාරූප ලබාදී පුහුණු අවසරපත්‍රය ලබාදෙයි.",
      timeline: "Week 1 - 2"
    },
    {
      step: 3,
      title: "Theory Classes & Written Examination",
      titleSi: "ලිඛිත විභාගය (Theory Exam)",
      description: "Attend our theory lectures covering road signs, road rules, and vehicle mechanics. Take the RMV 40-question multiple-choice computer/paper test (Available in Sinhala, English, and Tamil). Pass mark is 30/40.",
      descriptionSi: "මාර්ග නීති හා සංඥා පිළිබඳ දේශන. ප්‍රශ්න 40කින් 30ක් නිවැරදිව පිළිතුරු සපයා විභාගය සමත්වීම (සිංහල, ඉංග්‍රීසි හෝ දෙමළ භාෂාවෙන් ලිවිය හැක).",
      timeline: "Week 2 - 4"
    },
    {
      step: 4,
      title: "Practical Road Driving Lessons",
      titleSi: "ප්‍රායෝගික රියදුරු පුහුණුව",
      description: "Complete your one-on-one practical lessons with certified instructors in dual-control vehicles. Practice parallel parking, 3-point turns, and highway driving. Minimum 3-month mandatory learning period as per Sri Lankan law.",
      descriptionSi: "ද්විත්ව පාලක (dual-control) සහිත නවීන වාහන මගින් පළපුරුදු උපදේශකවරුන් යටතේ ප්‍රායෝගික පුහුණුව. නීත්‍යානුකූලව මාස 3ක පුහුණු කාලයක් තිබිය යුතුය.",
      timeline: "Month 1 - 3"
    },
    {
      step: 5,
      title: "RMV Practical Trial Test & License Issuance",
      titleSi: "RMV ප්‍රායෝගික පරීක්ෂණය (Trial) සහ බලපත්‍රය ලබාගැනීම",
      description: "Appear for the practical driving test before an RMV motor traffic examiner. Perform road test and reverse parking test. Upon passing, a temporary license sheet is issued immediately, and your permanent Smart Card License arrives by post.",
      descriptionSi: "මෝටර් රථ පරීක්ෂකවරයා ඉදිරියේ ට්‍රයල් පරීක්ෂණයට පෙනී සිටීම. සමත් වූ විගස තාවකාලික බලපත්‍රය හිමිවන අතර නිල ස්මාර්ට් කාඩ්පත තැපෑලෙන් ලැබේ.",
      timeline: "Month 3 - 4"
    }
  ],
  faqs: [
    {
      id: "faq-docs",
      category: "registration",
      questionEn: "What documents are required to register for driving lessons?",
      questionSi: "රියදුරු පාඨමාලාවකට ලියාපදිංචි වීමට අවශ්‍ය ලියකියවිලි මොනවාද?",
      answerEn: "To register at DriveMate, you need: 1) Original National Identity Card (NIC) or valid Sri Lankan Passport, 2) NTMI Medical Fitness Certificate, 3) 4 passport-size color photographs (white background, standard ears visible), 4) Birth certificate copy (for age verification).",
      answerSi: "ලියාපදිංචිය සඳහා අවශ්‍ය වන්නේ: 1) ජාතික හැඳුනුම්පත (NIC) හෝ වලංගු විදේශ ගමන් බලපත්‍රය, 2) NTMI වෛද්‍ය සහතිකය, 3) සුදු පසුබිමැති පාස්පෝට් ප්‍රමාණයේ ඡායාරූප 4ක්, 4) උප්පැන්න සහතිකයේ පිටපතක්.",
      tags: ["documents", "registration", "requirements", "nic", "photos"]
    },
    {
      id: "faq-installments",
      category: "fees",
      questionEn: "Can I pay the course fee in installments?",
      questionSi: "පාඨමාලා ගාස්තුව වාරික වශයෙන් ගෙවිය හැකිද?",
      answerEn: "Yes! We offer a very convenient 3-installment payment plan: 50% on registration day, 25% when starting practical driving lessons, and the remaining 25% two weeks before your RMV trial test. Alternatively, paying in full gives you a LKR 2,000 instant discount.",
      answerSi: "ඔව්! ඉතා පහසු වාරික 3කින් ගෙවිය හැක: ලියාපදිංචි වන විට 50%ක්, ප්‍රායෝගික පුහුණුව ආරම්භ කරන විට 25%ක්, සහ ට්‍රයල් එකට සති 2කට පෙර ඉතිරි 25%ක්. සම්පූර්ණ මුදල එකවර ගෙවන්නේ නම් රු. 2,000ක වට්ටමක් ලැබේ.",
      tags: ["fee", "installments", "payment", "discount", "price"]
    },
    {
      id: "faq-age-limit",
      category: "requirements",
      questionEn: "What is the minimum age to obtain a driving license in Sri Lanka?",
      questionSi: "ශ්‍රී ලංකාවේ රියදුරු බලපත්‍රයක් ලබාගැනීමට අවම වයස් සීමාව කීයද?",
      answerEn: "For light vehicles (Cars, Vans, and Motorcycles Class A/B), the minimum legal age is 18 years old. You may register and start theory classes when you are 17 years and 10 months old. For heavy commercial vehicles (Buses, Lorries Class C/CE), the minimum age is 21 years old with at least 2 years of holding a light vehicle license.",
      answerSi: "සැහැල්ලු වාහන (කාර්, වෑන්, යතුරුපැදි) සඳහා අවම වයස අවුරුදු 18කි. (අවුරුදු 17 මාස 10දී ලියාපදිංචි විය හැක). බර වාහන (බස්, ලොරි) සඳහා අවුරුදු 21 සම්පූර්ණ විය යුතු අතර සැහැල්ලු බලපත්‍රය අවුරුදු 2ක් තිබිය යුතුය.",
      tags: ["age", "minimum age", "heavy vehicle", "qualifications"]
    },
    {
      id: "faq-trial-waiting",
      category: "trial",
      questionEn: "How long after getting the learner's permit can I sit for the practical trial test?",
      questionSi: "පුහුණු අවසරපත්‍රය (Learner Permit) ලබාගෙන කොපමණ කාලයකට පසු ට්‍රයල් එක කළ හැකිද?",
      answerEn: "By Sri Lankan Motor Traffic law, a candidate must hold a valid Learner's Permit for a mandatory minimum period of 3 months before taking the RMV practical trial test. During these 3 months, DriveMate provides regular practical road lessons and mock trial drills.",
      answerSi: "ශ්‍රී ලංකා මෝටර් රථ ප්‍රවාහන නීතියට අනුව පුහුණු අවසරපත්‍රය (Learner Permit) ලබාගෙන අවම වශයෙන් මාස 3ක කාලයක් ගතවිය යුතුය. මෙම මාස 3 ඇතුළත සම්පූර්ණ ප්‍රායෝගික පුහුණුව අපි ලබාදෙන්නෙමු.",
      tags: ["trial", "learner permit", "waiting time", "duration", "timeline"]
    },
    {
      id: "faq-theory-exam",
      category: "exam",
      questionEn: "How does the RMV theory exam work and what is the pass mark?",
      questionSi: "RMV ලිඛිත විභාගය පැවැත්වෙන්නේ කෙසේද සහ සමත්වීමට ලකුණු කීයක් අවශ්‍යද?",
      answerEn: "The RMV theory examination consists of 40 multiple-choice questions covering road signs, lane discipline, traffic signals, and safe driving rules. You need to answer at least 30 out of 40 questions correctly (75%) to pass. The exam can be written in Sinhala, English, or Tamil.",
      answerSi: "ප්‍රශ්න 40කින් සමන්විත බහුවරණ ලිඛිත විභාගයකි. සමත්වීම සඳහා ලකුණු 30ක් (75%) ලබාගත යුතුය. සිංහල, ඉංග්‍රීසි හෝ දෙමළ භාෂාවෙන් විභාගයට පෙනී සිටිය හැක. අප ආයතනයෙන් පසුගිය ප්‍රශ්න පත්‍ර සහ පෙරහුරු පුහුණුව නොමිලේ ලබාදෙයි.",
      tags: ["theory exam", "pass mark", "written test", "languages", "exam"]
    },
    {
      id: "faq-medical",
      category: "medical",
      questionEn: "Where do I do the medical test and what does it check?",
      questionSi: "වෛද්‍ය පරීක්ෂණය (Medical) කරගන්නේ කොහෙන්ද සහ එහිදී පරීක්ෂා කරන්නේ මොනවාද?",
      answerEn: "The medical fitness examination must be completed at the National Transport Medical Institute (NTMI). Main centers include Werahera (near RMV), Nugegoda, and district branch offices. It checks your eyesight (visual acuity and color blindness), hearing, blood pressure, blood group, and urine/fasting blood sugar. DriveMate assists you in booking and preparing for this appointment.",
      answerSi: "වෛද්‍ය පරීක්ෂණය ජාතික ප්‍රවාහන වෛද්‍ය ආයතනයෙන් (NTMI - වේරහැර හෝ නුගේගොඩ) සිදුකළ යුතුය. එහිදී ඇස් පෙනීම, වර්ණ අන්ධතාවය, ශ්‍රවණය, රුධිර පීඩනය සහ සීනි මට්ටම පරීක්ෂා කරයි. අප ආයතනය මගින් මේ සඳහා අවශ්‍ය මගපෙන්වීම ලබාදේ.",
      tags: ["medical", "ntmi", "werahera", "eyesight", "doctor"]
    },
    {
      id: "faq-female-instructors",
      category: "courses",
      questionEn: "Do you have female instructors for ladies?",
      questionSi: "කාන්තාවන් සඳහා කාන්තා උපදේශකවරියන් (Female Instructors) සිටිනවාද?",
      answerEn: "Yes! DriveMate has certified and highly experienced female instructors for women who prefer learning with a female teacher. Please request this during your booking or registration, and we will schedule your lessons accordingly.",
      answerSi: "ඔව්! අප ආයතනයේ පළපුරුදු කාන්තා උපදේශකවරියන් සේවය කරයි. ලියාපදිංචි වන අවස්ථාවේදී හෝ පාඨමාලාව වෙන්කරවා ගැනීමේදී ඒ බව සඳහන් කළ හැක.",
      tags: ["female instructor", "ladies", "instructor", "safe"]
    },
    {
      id: "faq-trial-failure",
      category: "trial",
      questionEn: "What happens if someone fails the RMV practical driving trial?",
      questionSi: "ප්‍රායෝගික ට්‍රයල් පරීක්ෂණය අසමත් වුවහොත් කුමක් සිදුවේද?",
      answerEn: "If you do not pass on your first attempt, do not worry! The RMV allows you to re-sit the trial test after a short re-application period (usually 2 to 4 weeks). DriveMate provides 2 additional correction practice sessions free of charge and re-schedules your trial with the department.",
      answerSi: "පළමු වර අසමත් වුවහොත් කරදර විය යුතු නැත. සති කිහිපයකින් නැවත පෙනී සිටිය හැක. අප ආයතනය මගින් නොමිලේ අමතර පුහුණු සැසි 2ක් ලබාදී නැවත ට්‍රයල් දිනයක් ලබාදීමට කටයුතු කරයි.",
      tags: ["fail trial", "resit", "retry", "repeat", "second attempt"]
    },
    {
      id: "faq-auto-vs-manual",
      category: "courses",
      questionEn: "What is the difference between Manual and Auto driving license in Sri Lanka?",
      questionSi: "මැනුවල් සහ ඔටෝ රියදුරු බලපත්‍ර අතර වෙනස කුමක්ද?",
      answerEn: "In Sri Lanka, if you obtain a Manual transmission license (Class B Manual), you are legally permitted to drive both Manual and Automatic cars. However, if you obtain an Automatic license (Class B Auto), your driving license will be endorsed with restriction code 'Auto Only', meaning you cannot drive manual vehicles legally.",
      answerSi: "මැනුවල් (Manual) බලපත්‍රයක් ලබාගත් විට ඔබට ඔටෝ සහ මැනුවල් වාහන දෙකම ධාවනය කළ හැක. නමුත් ඔටෝ (Auto) බලපත්‍රයකින් ධාවනය කළ හැක්කේ ඔටෝ ගියර් වාහන පමණි.",
      tags: ["auto vs manual", "difference", "restriction", "transmission"]
    },
    {
      id: "faq-weekend-classes",
      category: "schedules",
      questionEn: "Do you have weekend-only or evening driving classes for working people?",
      questionSi: "රැකියාවල නියුතු අයට සති අන්තයේ (Weekend) හෝ සවස පුහුණු සැසි තිබේද?",
      answerEn: "Yes! We specialize in flexible schedules. We have Saturday & Sunday special batches, as well as early morning (7:30 AM – 9:00 AM) and evening (4:30 PM – 6:30 PM) sessions specifically tailored for professionals and university students.",
      answerSi: "ඔව්! කාර්යබහුල රැකියාවල නියුතු අය සඳහා සෙනසුරාදා සහ ඉරිදා විශේෂ කණ්ඩායම් මෙන්ම උදෑසන හා සවස 6:30 දක්වා පහසු වේලාවන් වෙන්කරවා ගත හැක.",
      tags: ["weekend", "evening", "flexible", "working hours", "timing"]
    }
  ]
};
