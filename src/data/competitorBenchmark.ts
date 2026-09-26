export interface SoftwareComparisonItem {
  name: string;
  category: string;
  focus: string;
  strengths: string[];
  limitations: string[];
  featuresCapturedInAyushCase: string[];
  badgeColor: string;
}

export const COMPETITOR_BENCHMARKS: SoftwareComparisonItem[] = [
  {
    name: 'RadarOpus (Synthesis Repertory)',
    category: 'Commercial Homeopathy Repertorization',
    focus: 'Classical Hahnemannian & Kentian repertory rubric search, Materia Medica verification, Clificol clinical cases',
    strengths: [
      'Over 90 repertories & thousands of symptom rubrics',
      'Remedy grading (1 to 4) & cross-repertorization matrices',
      'Materia Medica lookup and proving notes'
    ],
    limitations: [
      'Desktop legacy install ($1500+ license fee)',
      'Clinician-only typing interface; zero autonomous patient voice intake',
      'No Ayurveda (Tridosha/Prakriti/Ashtavidha) or Unani/Siddha support',
      'Zero ABDM / Ayushman Bharat FHIR interoperability'
    ],
    featuresCapturedInAyushCase: [
      'Interactive Repertory Matrix & Rubric Explorer',
      'Remedy grading scorecards with classical affinities',
      'Thermal modalities (Chilly/Hot) and Food Desires/Aversions extraction'
    ],
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
  },
  {
    name: 'MacRepertory / ReferenceWorks',
    category: 'Homeopathic Repertory & Family Graphs',
    focus: 'Theme palettes, kingdom & miasmatic family graphs, rubric synthesis',
    strengths: [
      'Visual kingdom graphs (Mineral, Plant, Animal)',
      'Miasmatic tendency breakdown (Psora, Sycosis, Syphilis, Tubercular)',
      'Extensive Materia Medica text library'
    ],
    limitations: [
      'Strictly offline desktop software with high learning curve',
      'Zero vernacular voice transcription for patients',
      'No government standardization or NAMASTE ontology mapping'
    ],
    featuresCapturedInAyushCase: [
      'Miasmatic Tendency & Constitution Profiler',
      'Visual Symptom Theme Palettes',
      'Holistic Mind-Body Modal synthesis'
    ],
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
  },
  {
    name: 'NAMASTE Portal (Ministry of Ayush)',
    category: 'National Terminology & Morbidity Coding',
    focus: 'Standardized Ayush terminologies and dual-coding with WHO ICD-10/ICD-11',
    strengths: [
      'Official nomenclature for Ayurveda, Siddha & Unani diseases',
      'Dual-coding mapping with WHO ICD-11 (Chapter 26 & Traditional Medicine)',
      'Standardized diagnostic codes for insurance coverage'
    ],
    limitations: [
      'Reference registry / catalog only; not a patient case-taking tool',
      'Cannot record patient history or conversational symptoms',
      'Requires manual lookup of clinical codes by doctors'
    ],
    featuresCapturedInAyushCase: [
      'Automated NAMASTE Code Matcher & WHO ICD-11 Dual Coding',
      'Instant Morbidity Code Generation from freeform narrative',
      'Official Ayush Terminology Dictionary'
    ],
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
  },
  {
    name: 'AHMIS (Ayush Grid / CDAC)',
    category: 'Government Hospital Management System',
    focus: 'OPD registration, pharmacy inventory, bed management, billing',
    strengths: [
      'Deployed across National Ayush Institutes and CGHS wellness centers',
      'ABDM linked with ABHA ID registration',
      'EHR storage for hospital staff'
    ],
    limitations: [
      'Heavy hospital administration focus with complex multi-screen clerk workflows',
      'Patients cannot record history themselves before arrival; queues take 45+ mins',
      'No AI-driven conversational vernacular voice transcription',
      'Lacks intelligent Tridosha radar or automated Samprapti synthesis'
    ],
    featuresCapturedInAyushCase: [
      'ABHA ID verification & Milestone 1/2 integration',
      'OPD Waiting-Room / Kiosk Self-Registration Mode',
      'Seamless ABDM FHIR R4 Bundle generator'
    ],
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
  },
  {
    name: 'e-Aushadhi (Supply Chain & Pharmacy)',
    category: 'Ayush Drug Inventory & Pharmacovigilance',
    focus: 'Drug procurement, warehouse distribution, batch expiry, classical Ayush formulations catalog',
    strengths: [
      'National drug warehouse inventory tracking and barcode labeling',
      'Standardized drug formulary (Ayurvedic Pharmacopoeia of India - API)',
      'Safety alerts and quality testing samples'
    ],
    limitations: [
      'Pure supply chain; does not handle clinical case taking or patient symptoms',
      'No patient interaction or clinical diagnosis support'
    ],
    featuresCapturedInAyushCase: [
      'Integrated Classical Ayush Dispensary & Formulary Catalog',
      'Instant Dosage & Anupana (vehicle/carrier) recommender',
      'Safety & Herb-Drug interaction checks'
    ],
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    name: 'AyurCDS & Private Ayurvedic EMRs',
    category: 'Ayurvedic Clinical Decision Support',
    focus: 'Clinical guidelines, Chikitsa protocol suggestions, Prakriti forms',
    strengths: [
      'Prakriti assessment forms and disease protocols',
      'Doctor prescription templates'
    ],
    limitations: [
      'Doctor-facing typing forms only; no patient voice self-taking',
      'Rigid English-only UI; cannot handle Hinglish or rural Indian dialects',
      'Subscription paywall; lack unified cross-Ayush support (Homeopathy/Unani)'
    ],
    featuresCapturedInAyushCase: [
      'Multilingual Vernacular Speech-to-Case synthesis',
      'Comprehensive Cross-Ayush coverage (Ayurveda, Homeopathy, Unani, Siddha)',
      'Zero-barrier patient-led autonomous intake'
    ],
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-200'
  }
];

export interface ClassicalFormulation {
  name: string;
  system: 'Ayurveda' | 'Homeopathy' | 'Unani' | 'Siddha';
  category: 'Kashaya' | 'Vati / Gutika' | 'Asava / Arishta' | 'Churna' | 'Taila / Ghrita' | 'Repertory Simillimum' | 'Kushta / Majun';
  dosage: string;
  anupana: string;
  indications: string;
  namasteCode: string;
  keyIngredients: string;
}

export const CLASSICAL_FORMULARY_CATALOG: ClassicalFormulation[] = [
  {
    name: 'Simhanada Guggulu',
    system: 'Ayurveda',
    category: 'Vati / Gutika',
    dosage: '2 tablets (500mg each) twice daily',
    anupana: 'Warm water or Dashamoola Kwatha',
    indications: 'Amavata (Rheumatoid arthritis), Sandhivata, Vatarakta, sluggish digestion',
    namasteCode: 'AYU-FORM-014',
    keyIngredients: 'Triphala, Shuddha Gandhaka, Shuddha Guggulu, Eranda Taila'
  },
  {
    name: 'Dashamoola Kwatha Churna',
    system: 'Ayurveda',
    category: 'Kashaya',
    dosage: '20 ml decoction with 40 ml lukewarm water before meals',
    anupana: 'Lukewarm water',
    indications: 'Vata shamana, respiratory distress, pelvic & lumbosacral pain, inflammation',
    namasteCode: 'AYU-FORM-042',
    keyIngredients: 'Bilva, Agnimantha, Shyonaka, Patala, Gambhari, Shalaparni, Brihati, Kantakari, Gokshura'
  },
  {
    name: 'Avipattikara Churna',
    system: 'Ayurveda',
    category: 'Churna',
    dosage: '3 to 5 grams twice daily before food',
    anupana: 'Cold water, honey, or lukewarm water',
    indications: 'Amlapitta (Hyperacidity), heartburn, nausea, constipation with bilious heat',
    namasteCode: 'AYU-FORM-008',
    keyIngredients: 'Trikatu, Triphala, Musta, Vidanga, Ela, Patra, Lavanga, Trivrit, Sharkara'
  },
  {
    name: 'Mahasudarshana Ghanavati',
    system: 'Ayurveda',
    category: 'Vati / Gutika',
    dosage: '1-2 tablets twice daily after food',
    anupana: 'Warm water',
    indications: 'Jwara (chronic/intermittent fevers), liver sluggishness, Yakrit-Pleeha vriddhi',
    namasteCode: 'AYU-FORM-089',
    keyIngredients: 'Kiratatikta, Triphala, Haridra, Daruharidra, Katuki, Guduchi'
  },
  {
    name: 'Rhus Toxicodendron 30C / 200C',
    system: 'Homeopathy',
    category: 'Repertory Simillimum',
    dosage: '4 pills 3 times daily on clean tongue',
    anupana: 'Sublingual, 15 mins before food',
    indications: 'Joint stiffness worse at first motion, better with continued motion & warmth; restless',
    namasteCode: 'HOM-REP-055',
    keyIngredients: 'Poison Ivy potentized tincture'
  },
  {
    name: 'Nux Vomica 30C',
    system: 'Homeopathy',
    category: 'Repertory Simillimum',
    dosage: '4 pills at bedtime',
    anupana: 'Sublingual, avoid mint/camphor',
    indications: 'Gastric irritability from sedentary habits, stimulants, constipation with ineffectual urging',
    namasteCode: 'HOM-REP-019',
    keyIngredients: 'Strychnos Nux-Vomica potentized tincture'
  },
  {
    name: 'Majun Suranjan',
    system: 'Unani',
    category: 'Kushta / Majun',
    dosage: '5 grams twice daily after meals',
    anupana: 'Warm water or milk',
    indications: 'Waja-ul-Mafasil (Joint pain), Niqras (Gout), sciatica, Balghami excess',
    namasteCode: 'UNA-FORM-022',
    keyIngredients: 'Suranjan Shirin (Colchicum), Asgandh, Elwa, Turbud, Qand Safaid'
  },
  {
    name: 'Nilavembu Kudineer',
    system: 'Siddha',
    category: 'Kashaya',
    dosage: '30 to 60 ml boiled decoction twice daily',
    anupana: 'Warm water with honey/palm sugar',
    indications: 'Viral fevers, joint arthralgia, immune modulation, Pitha-Kabha balance',
    namasteCode: 'SID-FORM-003',
    keyIngredients: 'Nilavembu (Andrographis paniculata), Vetiver, Vilamiccanver, Chandan, Peyputtal'
  }
];

export interface RepertoryRubric {
  id: string;
  rubric: string;
  section: string;
  topRemedies: { remedy: string; grade: number }[];
}

export const REPERTORY_SAMPLE_RUBRICS: RepertoryRubric[] = [
  {
    id: 'RUB-01',
    rubric: 'EXTREMITIES - PAIN - Joints - motion - agg. on beginning of, amel. on continued',
    section: 'Extremities',
    topRemedies: [
      { remedy: 'Rhus tox', grade: 4 },
      { remedy: 'Rhododendron', grade: 3 },
      { remedy: 'Calcarea carb', grade: 2 },
      { remedy: 'Lycopodium', grade: 2 }
    ]
  },
  {
    id: 'RUB-02',
    rubric: 'STOMACH - ERUCTATIONS - sour, with burning heartburn after rich food',
    section: 'Stomach / Digestion',
    topRemedies: [
      { remedy: 'Nux vomica', grade: 4 },
      { remedy: 'Pulsatilla', grade: 3 },
      { remedy: 'Carbo veg', grade: 3 },
      { remedy: 'Robinia', grade: 2 }
    ]
  },
  {
    id: 'RUB-03',
    rubric: 'GENERALITIES - COLD - agg. - wet weather, drafts, winter',
    section: 'Generalities',
    topRemedies: [
      { remedy: 'Dulcamara', grade: 4 },
      { remedy: 'Rhus tox', grade: 4 },
      { remedy: 'Silicea', grade: 3 },
      { remedy: 'Arsenicum alb', grade: 3 }
    ]
  },
  {
    id: 'RUB-04',
    rubric: 'MIND - ANXIETY - health about - anticipation - restless night',
    section: 'Mind / Generals',
    topRemedies: [
      { remedy: 'Arsenicum alb', grade: 4 },
      { remedy: 'Aconitum nap', grade: 3 },
      { remedy: 'Phosphorus', grade: 3 },
      { remedy: 'Argentum nit', grade: 2 }
    ]
  }
];
