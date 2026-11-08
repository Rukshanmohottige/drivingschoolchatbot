export interface SriLankanDrivingSchool {
  id: string;
  name: string;
  nameSi: string;
  district: 'Colombo' | 'Gampaha' | 'Kandy' | 'Galle' | 'Kurunegala' | 'Kalutara';
  mainBranch: string;
  branches: string[];
  phone: string;
  whatsapp: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  vehicleClasses: string[];
  features: string[];
  featuresSi: string[];
  popularPackages: Array<{
    name: string;
    fee: number;
    lessons: number;
  }>;
}

export const SRI_LANKAN_DRIVING_SCHOOLS: SriLankanDrivingSchool[] = [
  {
    id: 'drivemate-academy',
    name: 'DriveMate Academy (Official)',
    nameSi: 'ඩ්‍රයිව්මේට් රියදුරු ඇකඩමිය',
    district: 'Colombo',
    mainBranch: 'High Level Road, Nugegoda',
    branches: ['Nugegoda Main Campus', 'Werahera / Boralesgamuwa', 'Kandy William Gopallawa Mw', 'Gampaha Colombo Rd'],
    phone: '+94 11 234 5678 / +94 77 123 4567',
    whatsapp: '+94 77 123 4567',
    experienceYears: 18,
    rating: 4.9,
    reviewCount: 1420,
    vehicleClasses: ['Class B (Auto)', 'Class B (Manual)', 'Class A/A1 (Motorcycle)', 'Class B1 (Three Wheeler)', 'Class C/CE (Heavy Lorry/Bus)'],
    features: ['Dual-Control AC Fleet', 'Female Instructors Available', 'Flexible Weekend & Evening Batches', 'Free Theory Exam Coaching', 'Vehicle Provided on RMV Trial Day', '3-Stage Easy Installments'],
    featuresSi: ['ද්විත්ව පාලක නවීන වාහන', 'කාන්තා උපදේශකවරියන්', 'සති අන්ත හා සවස පහසු වේලාවන්', 'නොමිලේ ලිඛිත විභාග පුහුණුව', 'ට්‍රයල් දින වාහනය නොමිලේ', 'පහසු වාරික 3ක ගෙවීම්'],
    popularPackages: [
      { name: 'Auto Car Full Package', fee: 42000, lessons: 18 },
      { name: 'Manual Car Full Package', fee: 38000, lessons: 20 },
      { name: 'Car + Motorcycle Combo', fee: 48000, lessons: 25 },
      { name: 'Motorcycle Only (A/A1)', fee: 18000, lessons: 12 }
    ]
  },
  {
    id: 'perera-driving-school',
    name: 'Perera Driving School',
    nameSi: 'පෙරේරා ඩ්‍රයිවිං ස්කූල්',
    district: 'Colombo',
    mainBranch: '102 High Level Rd, Nugegoda',
    branches: ['Nugegoda', 'Havelock City (Colombo 5)', 'Embuldeniya', 'Maharagama'],
    phone: '+94 11 285 2415',
    whatsapp: '+94 77 345 6789',
    experienceYears: 70,
    rating: 4.8,
    reviewCount: 3200,
    vehicleClasses: ['Class B (Auto)', 'Class B (Manual)', 'Class A (Bike)', 'Class B1 (Three Wheeler)'],
    features: ['Sri Lanka’s Oldest Driving School (70+ Years)', 'Modern Dual-Pedal Vehicles', 'Individual Road Lessons', 'Theory Exam Practice Software'],
    featuresSi: ['වසර 70කට වැඩි විශ්වාසය', 'නවීන ද්විත්ව පාලක වාහන', 'තනි පුද්ගල පුහුණුව', 'ලිඛිත විභාග පරිගණක පුහුණුව'],
    popularPackages: [
      { name: 'Auto Car Package', fee: 44000, lessons: 18 },
      { name: 'Manual Car Package', fee: 40000, lessons: 20 },
      { name: 'Bike Class A1/A', fee: 19000, lessons: 12 }
    ]
  },
  {
    id: 'ama-learners',
    name: 'Ama Learners',
    nameSi: 'අමා ලර්නර්ස්',
    district: 'Colombo',
    mainBranch: 'No: 1444/1, Kotte Road, Rajagiriya',
    branches: ['Rajagiriya', 'Battaramulla', 'Malabe'],
    phone: '+94 11 286 7890',
    whatsapp: '+94 71 888 9900',
    experienceYears: 24,
    rating: 4.7,
    reviewCount: 980,
    vehicleClasses: ['Class B Auto', 'Class B Manual', 'Class A Bike', 'Class B1 Three-Wheeler'],
    features: ['High Pass Rate in Werahera', 'Friendly Certified Instructors', 'Doorstep Pickup Options in Kotte', 'Weekend Intensive Batches'],
    featuresSi: ['වේරහැර ට්‍රයල් සමත් වීමේ ඉහළ ප්‍රතිශතය', 'සුහදශීලී උපදේශකවරුන්', 'රාජගිරිය අවට නිවසටම පැමිණීමේ සේවාව'],
    popularPackages: [
      { name: 'Auto Car Package', fee: 43000, lessons: 18 },
      { name: 'Manual Car Package', fee: 39000, lessons: 20 },
      { name: 'Car + Bike Combo', fee: 49000, lessons: 24 }
    ]
  },
  {
    id: 'aravinda-learners',
    name: 'Aravinda Learners',
    nameSi: 'අරවින්ද ලර්නර්ස්',
    district: 'Colombo',
    mainBranch: '121/2 High Level Rd, Maharagama',
    branches: ['Maharagama', 'Kottawa', 'Homagama'],
    phone: '+94 11 284 3322',
    whatsapp: '+94 77 444 5566',
    experienceYears: 30,
    rating: 4.8,
    reviewCount: 1650,
    vehicleClasses: ['Class B (Auto/Manual)', 'Class A (Bike)', 'Class C (Heavy)'],
    features: ['High Level Road Practical Drills', 'Heavy Vehicle Training Ground', 'Installment Payments Available'],
    featuresSi: ['හයිලෙවල් පාරේ ප්‍රායෝගික පුහුණුව', 'බර වාහන විශේෂ පුහුණු භූමිය', 'පහසු වාරික ක්‍රම'],
    popularPackages: [
      { name: 'Auto Car Standard', fee: 41000, lessons: 18 },
      { name: 'Manual Car Standard', fee: 37500, lessons: 20 },
      { name: 'Heavy Lorry/Bus Course', fee: 57000, lessons: 22 }
    ]
  },
  {
    id: 'athula-driving-school',
    name: 'Athula Driving School',
    nameSi: 'අතුල ඩ්‍රයිවිං ස්කූල්',
    district: 'Colombo',
    mainBranch: '219 Hospital Road, Kalubowila, Dehiwala',
    branches: ['Kalubowila', 'Dehiwala', 'Kohuwala', 'Wellawatte'],
    phone: '+94 11 276 5432',
    whatsapp: '+94 77 654 3210',
    experienceYears: 28,
    rating: 4.7,
    reviewCount: 1120,
    vehicleClasses: ['Class B Auto', 'Class B Manual', 'Class A/A1 Bike'],
    features: ['Female Instructors for Ladies', 'City & Galle Road Traffic Lessons', 'Evening Night Driving Coaching'],
    featuresSi: ['කාන්තාවන් සඳහා කාන්තා උපදේශිකාවන්', 'නගරබද හා ගාලු පාර තදබද පුහුණුව', 'රාත්‍රී ධාවන පුහුණුව'],
    popularPackages: [
      { name: 'Ladies Auto Car Special', fee: 42500, lessons: 18 },
      { name: 'Manual Car Course', fee: 38500, lessons: 20 }
    ]
  },
  {
    id: 'charika-learners-colombo',
    name: 'Charika Learners (Colombo & Kandy)',
    nameSi: 'චාරිකා ලර්නර්ස්',
    district: 'Colombo',
    mainBranch: '812 Maradana Rd, Borella, Colombo 10',
    branches: ['Borella (Colombo 10)', 'D.S. Senanayake Street (Kandy)', 'Pannipitiya'],
    phone: '+94 11 269 1234 / +94 81 223 9876',
    whatsapp: '+94 77 789 0123',
    experienceYears: 35,
    rating: 4.8,
    reviewCount: 2100,
    vehicleClasses: ['Class B Auto', 'Class B Manual', 'Class A Bike', 'Class B1 Three Wheeler', 'Class C Lorry'],
    features: ['Islandwide Inter-district Branch Network', 'Official RMV Examination Mock Grounds', 'Dual-Control Fleet'],
    featuresSi: ['කොළඹ හා නුවර ප්‍රධාන ශාඛා', 'RMV විභාග පෙරහුරු පුහුණු භූමි', 'ද්විත්ව පාලක වාහන'],
    popularPackages: [
      { name: 'Auto Car Package', fee: 42000, lessons: 18 },
      { name: 'Manual Car Package', fee: 38000, lessons: 20 },
      { name: 'Car + Bike Combi', fee: 48500, lessons: 24 }
    ]
  },
  {
    id: 'auto-driving-school-gampaha',
    name: 'Auto Driving School (Pvt) Ltd',
    nameSi: 'ඔටෝ ඩ්‍රයිවිං ස්කූල් ගම්පහ',
    district: 'Gampaha',
    mainBranch: 'Mangala Road, Gampaha Town',
    branches: ['Gampaha Town', 'Yakkala', 'Miriswatta'],
    phone: '+94 33 222 5566',
    whatsapp: '+94 71 555 6677',
    experienceYears: 22,
    rating: 4.8,
    reviewCount: 1350,
    vehicleClasses: ['Class B Auto', 'Class B Manual', 'Class A Bike', 'Class B1 Three Wheeler'],
    features: ['Gampaha District RMV Trial Specialists', 'Full Course Highway Code Lectures', 'Dual-pedal AC Vehicles'],
    featuresSi: ['ගම්පහ දිස්ත්‍රික් RMV ට්‍රයල් විශේෂඥයින්', 'සම්පූර්ණ මාර්ග නීති දේශන', 'නවීන AC වාහන'],
    popularPackages: [
      { name: 'Car Auto Full', fee: 41000, lessons: 18 },
      { name: 'Car Manual Full', fee: 37000, lessons: 20 },
      { name: 'Combo Car + Bike', fee: 47000, lessons: 24 }
    ]
  },
  {
    id: 'sarathi-learners-kiribathgoda',
    name: 'Sarathi Driving School',
    nameSi: 'සාරථි ඩ්‍රයිවිං ස්කූල්',
    district: 'Gampaha',
    mainBranch: '142 Kandy Road, Kiribathgoda',
    branches: ['Kiribathgoda', 'Kelaniya', 'Kadawatha'],
    phone: '+94 11 291 4455',
    whatsapp: '+94 77 222 3344',
    experienceYears: 26,
    rating: 4.7,
    reviewCount: 1490,
    vehicleClasses: ['Class B (Auto/Manual)', 'Class A Bike', 'Class C Lorry'],
    features: ['Kandy Road Heavy Traffic Navigation', 'Dual-Control Hatchbacks & Sedans', 'Reverse & Parallel Parking Mastery'],
    featuresSi: ['නුවර පාරේ තදබද ධාවන පුහුණුව', 'රිවර්ස් හා සමාන්තර පාක් කිරීමේ පුහුණුව'],
    popularPackages: [
      { name: 'Auto Car Course', fee: 41500, lessons: 18 },
      { name: 'Manual Car Course', fee: 37500, lessons: 20 },
      { name: 'Bike Training', fee: 18000, lessons: 12 }
    ]
  },
  {
    id: 'dasuni-learners-kandy',
    name: 'Dasuni Driving School & Learners',
    nameSi: 'දසුනි ඩ්‍රයිවිං ස්කූල් මහනුවර',
    district: 'Kandy',
    mainBranch: 'Gatambe Junction, Kandy',
    branches: ['Gatambe (Head Office)', 'Peradeniya', 'Katugastota', 'Kandy City'],
    phone: '+94 81 238 8899',
    whatsapp: '+94 77 999 1122',
    experienceYears: 32,
    rating: 4.9,
    reviewCount: 2450,
    vehicleClasses: ['Class B Auto', 'Class B Manual', 'Class A Bike', 'Class B1 Three Wheeler', 'Class C/D Heavy Bus/Lorry'],
    features: ['Kandy Hill Country Road Specialists (Hill start & Hairpin bends)', 'Peradeniya Trial Ground Simulation', 'Female Instructors Available'],
    featuresSi: ['මහනුවර කඳුකර මාර්ග හා හෙයාපින් වංගු ධාවන විශේෂඥයින්', 'පේරාදෙණිය ට්‍රයල් පෙරහුරු පිටිය', 'කාන්තා උපදේශිකාවන්'],
    popularPackages: [
      { name: 'Hill Country Auto Car', fee: 43000, lessons: 18 },
      { name: 'Hill Country Manual Car', fee: 39000, lessons: 20 },
      { name: 'Car + Bike Kandy Special', fee: 49000, lessons: 25 }
    ]
  },
  {
    id: 'ruhunu-learners-galle',
    name: 'Ruhunu Driving School (Galle & Matara)',
    nameSi: 'රුහුණු ඩ්‍රයිවිං ස්කූල් ගාල්ල',
    district: 'Galle',
    mainBranch: 'Wakwella Road, Galle',
    branches: ['Galle Town', 'Karapitiya', 'Matara Nupe'],
    phone: '+94 91 223 3445',
    whatsapp: '+94 77 888 2233',
    experienceYears: 34,
    rating: 4.8,
    reviewCount: 1780,
    vehicleClasses: ['Class B Auto', 'Class B Manual', 'Class A Bike', 'Class B1 Three Wheeler'],
    features: ['Southern Expressway Feeder Road Training', 'Galle Fort Coastal Driving', 'Medical Test Guidance'],
    featuresSi: ['දක්ෂිණ අධිවේගී පිවිසුම් මාර්ග පුහුණුව', 'ගාල්ල දිස්ත්‍රික් ට්‍රයල් පෙරහුරුව'],
    popularPackages: [
      { name: 'Auto Car Package', fee: 40000, lessons: 18 },
      { name: 'Manual Car Package', fee: 36000, lessons: 20 },
      { name: 'Motorcycle Training', fee: 17000, lessons: 12 }
    ]
  }
];

export interface SriLankanEcosystemDetails {
  licenceClasses: Array<{
    code: string;
    name: string;
    nameSi: string;
    description: string;
    minAge: number;
    requirements: string;
  }>;
  howSchoolsWork: Array<{
    step: string;
    title: string;
    titleSi: string;
    detail: string;
    detailSi: string;
    practicalTip: string;
  }>;
  rmvFees: Array<{
    item: string;
    normalFee: string;
    oneDayFee: string;
    notes: string;
  }>;
  trialChecklist: {
    dressCode: string[];
    mandatoryDocuments: string[];
    testManeuvers: string[];
    commonFailReasons: string[];
  };
}

export const SRI_LANKA_DRIVING_ECOSYSTEM: SriLankanEcosystemDetails = {
  licenceClasses: [
    {
      code: 'A1',
      name: 'Light Motorcycle (<= 125cc)',
      nameSi: 'සැහැල්ලු යතුරුපැදි (125cc හෝ ඊට අඩු)',
      description: 'Covers scooters and commuter motorbikes below or equal to 125 cubic centimeters.',
      minAge: 18,
      requirements: 'Valid NIC/Passport, NTMI Medical Fitness Certificate'
    },
    {
      code: 'A',
      name: 'Heavy Motorcycle (> 125cc)',
      nameSi: 'යතුරුපැදි (125cc ට වැඩි)',
      description: 'Covers all standard and high-capacity motorbikes, clutch motorbikes, and superbikes.',
      minAge: 18,
      requirements: 'Valid NIC/Passport, NTMI Medical Fitness Certificate'
    },
    {
      code: 'B1',
      name: 'Motor Tricycle / Three-Wheeler',
      nameSi: 'ත්‍රිරෝද රථ (Three-Wheelers)',
      description: 'Covers passenger and cargo three-wheelers (Bajaj, Piaggio, TVS, etc.).',
      minAge: 18,
      requirements: 'Valid NIC, NTMI Medical'
    },
    {
      code: 'B',
      name: 'Light Motor Vehicle / Car & Dual Purpose (Auto & Manual)',
      nameSi: 'සැහැල්ලු වාහන කාර් සහ ද්විත්ව කාර්ය (ඔටෝ සහ මැනුවල්)',
      description: 'Passenger cars, vans, SUVs, double-cabs not exceeding 3,500 kg gross vehicle weight and up to 9 passenger seats. Manual license permits driving both auto and manual. Auto license has "Auto Only" restriction.',
      minAge: 18,
      requirements: 'Valid NIC, NTMI Medical, Learner Permit held for min 3 months'
    },
    {
      code: 'C1 / C',
      name: 'Commercial Lorries & Trucks',
      nameSi: 'වාණිජ ලොරි සහ බර වාහන',
      description: 'Light and heavy commercial trucks/lorries over 3,500 kg.',
      minAge: 21,
      requirements: 'Must hold Class B license for at least 2 years + Commercial grade NTMI Medical'
    },
    {
      code: 'D1 / D',
      name: 'Motor Coaches & Passenger Buses',
      nameSi: 'මගී බස් රථ',
      description: 'Passenger transport mini-buses (up to 33 seats) and heavy public/private motor coaches.',
      minAge: 21,
      requirements: 'Must hold Class B license for min 2 years + Commercial grade NTMI Medical'
    }
  ],
  howSchoolsWork: [
    {
      step: '1',
      title: 'Registration & NTMI Medical Test',
      titleSi: 'ලියාපදිංචිය සහ NTMI වෛද්‍ය පරීක්ෂණය',
      detail: 'Every driving student begins by booking an Aptitude Medical Fitness examination at the National Transport Medical Institute (NTMI). Centers include Werahera, Nugegoda, Gampaha, Kandy, Galle, Kurunegala, etc. Tests examine eyesight (acuity & color blindness), hearing, blood pressure, and blood sugar. Cost is LKR 1,500.',
      detailSi: 'ජාතික ප්‍රවාහන වෛද්‍ය ආයතනයෙන් (NTMI) වෛද්‍ය සහතිකය ලබාගැනීම. ඇස් පෙනීම, වර්ණ අන්ධතාවය, ශ්‍රවණය හා රුධිර පීඩනය පරීක්ෂා කෙරේ. ගාස්තුව රු. 1,500කි.',
      practicalTip: 'Fast for 8 hours if blood sugar test is required; bring original NIC and 4 photos.'
    },
    {
      step: '2',
      title: 'DMT Registration & Computer-based Written Exam',
      titleSi: 'RMV ලියාපදිංචිය සහ පරිගණක ලිඛිත විභාගය',
      detail: 'The driving school registers the candidate with the Department of Motor Traffic (Werahera or District Office). Candidate sits for the 40-question multiple-choice theory test. Available in Sinhala, English, and Tamil. Questions cover road signs, lane rules, right of way, and engine basics. Pass mark: 30 out of 40 (75%).',
      detailSi: 'ඩ්‍රයිව්මේට් ආයතනය මගින් RMV ලියාපදිංචි කර ප්‍රශ්න 40ක බහුවරණ ලිඛිත විභාගයට පෙනී සිටීම. සමත්වීමට ලකුණු 30ක් (75%) අවශ්‍ය වේ.',
      practicalTip: 'Driving schools provide question banks with all 400 official DMT questions to practice beforehand.'
    },
    {
      step: '3',
      title: 'Learner Permit Issuance (L-Plates) & 3-Month Waiting Law',
      titleSi: 'පුහුණු අවසරපත්‍රය (L ප්ලේට්) සහ මාස 3ක අනිවාර්ය පුහුණු කාලය',
      detail: 'Upon passing theory, the RMV issues an official Learner Driving Permit valid for 18 months. Under Sri Lankan Motor Traffic law, a candidate MUST hold this permit for a mandatory minimum of 3 months before sitting for the practical trial test.',
      detailSi: 'ලිඛිත විභාගය සමත් වූ පසු මාස 18ක් වලංගු පුහුණු අවසරපත්‍රය (Learner Permit) හිමිවේ. නීත්‍යානුකූලව ට්‍රයල් එකට පෙනී සිටීමට අවම මාස 3ක කාලයක් තිබිය යුතුය.',
      practicalTip: 'Practice driving with licensed driver accompaniment and red L-plates affixed front and rear.'
    },
    {
      step: '4',
      title: 'Dual-Control Practical Training Behind the Wheel',
      titleSi: 'ද්විත්ව පාලක වාහන මගින් ප්‍රායෝගික රියදුරු පුහුණුව',
      detail: 'Driving schools in Sri Lanka utilize government-certified dual-pedal vehicles (extra clutch and brake pedals on the instructor passenger side for complete safety). Students complete 18 to 25 one-on-one road hours: clutch balance, hill starts, heavy traffic navigation, parking maneuvers, and reversing.',
      detailSi: 'උපදේශකවරයාගේ පැත්තේ අමතර ක්ලච් හා බ්‍රේක් පැඩල් (Dual-Control) සහිත වාහන මගින් නගරබද ධාවනය, කඳු නැගීම, හා රිවර්ස් පාක් කිරීම පුහුණු කරයි.',
      practicalTip: 'Ask your instructor to drill the exact cone maneuvers used at your district’s testing ground.'
    },
    {
      step: '5',
      title: 'Practical Trial Test Day & Temporary License',
      titleSi: 'ප්‍රායෝගික ට්‍රයල් පරීක්ෂණය සහ තාවකාලික බලපත්‍රය',
      detail: 'Candidate appears before the RMV Motor Vehicle Examiner (MVE) at the official trial ground (e.g. Werahera trial ground). The driving school provides the test vehicle. Pass the reverse "L" / parallel parking cones and road drive. Passing candidate receives a temporary permit sheet immediately; permanent smart card arrives by registered post.',
      detailSi: 'RMV මෝටර් රථ පරීක්ෂකවරයා ඉදිරියේ ට්‍රයල් එකට පෙනී සිටීම. සමත් වූ විගස තාවකාලික බලපත්‍රය හිමිවන අතර ස්මාර්ට් කාඩ්පත තැපෑලෙන් ලැබේ.',
      practicalTip: 'Strict dress code: full covered shoes or sneakers are mandatory. Slippers or sandals result in immediate test disqualification!'
    }
  ],
  rmvFees: [
    { item: 'New License Application (1 Class, e.g. Car B)', normalFee: 'LKR 2,500', oneDayFee: 'LKR 3,500', notes: 'Government stamp & card fee' },
    { item: 'New License (2 Classes, e.g. Car + Bike)', normalFee: 'LKR 3,000', oneDayFee: 'LKR 4,000', notes: 'Most popular combo' },
    { item: 'New License (3 Classes, e.g. Car + Bike + 3-Wheel)', normalFee: 'LKR 3,500', oneDayFee: 'LKR 4,500', notes: 'Triple endorsement' },
    { item: 'Written Exam Retake Fee', normalFee: 'LKR 500', oneDayFee: 'N/A', notes: 'If re-sitting theory test' },
    { item: 'Practical Trial Retake Fee', normalFee: 'LKR 1,000', oneDayFee: 'N/A', notes: 'If re-sitting practical test' },
    { item: 'NTMI Medical Aptitude Certificate', normalFee: 'LKR 1,500', oneDayFee: 'Same Day', notes: 'Valid for 6 months across Sri Lanka' }
  ],
  trialChecklist: {
    dressCode: [
      'Fully enclosed shoes or sneakers are MANDATORY (slippers, sandals, or high heels are strictly forbidden by RMV examiners)',
      'Decent casual attire (long trousers recommended; shorts not permitted on government testing grounds)',
      'For motorcycle trials: SLS-certified safety helmet with securely fastened chin strap is compulsory'
    ],
    mandatoryDocuments: [
      'Original National Identity Card (NIC) or valid Sri Lankan Passport',
      'Original Learner Permit sheet (issued by DMT)',
      'Official Trial Admission Slip with scheduled time stamp'
    ],
    testManeuvers: [
      'Reverse "L" garage parking into cone-marked garage without touching boundaries or stalling',
      'Hill start / Slope start using handbrake without rolling backwards more than 6 inches',
      'Road drive with examiner: signaling, lane discipline, roundabouts, and pedestrian crossings',
      'Motorcycles: Figure-of-8 track and straight plank balance test without placing feet on ground'
    ],
    commonFailReasons: [
      'Stalling the engine inside the cone garage or during hill start',
      'Failing to look over shoulder / checking blind spots before moving off',
      'Touching boundary cones during reversing',
      'Putting feet down during motorcycle Figure-8 test',
      'Incorrect lane discipline or ignoring stop signs at junctions'
    ]
  }
};
