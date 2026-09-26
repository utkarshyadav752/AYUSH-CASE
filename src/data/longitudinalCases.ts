import { AyushCaseSheet } from '../types/ayush';

export interface LongitudinalCaseVisit {
  visitDate: string;
  visitNumber: number;
  treatmentPhase: string;
  caseSheet: AyushCaseSheet;
  symptomSeverityScore: number; // 0-10 scale
  jointStiffnessMinutes: number;
  agniScore: number; // 0-100 (100 = Sama Agni / Optimal, 20 = Severe Mandagni)
  amaToxinIndex: number; // 0-10 (0 = Nirama / Clear, 10 = Severe Ama)
  vataSeverity: number;
  pittaSeverity: number;
  kaphaSeverity: number;
  clinicianNotes: string;
  prescriptions: string[];
}

export const SUNITA_LONGITUDINAL_HISTORY: LongitudinalCaseVisit[] = [
  {
    visitDate: '2026-06-15',
    visitNumber: 1,
    treatmentPhase: 'Baseline / Initial Presentation',
    symptomSeverityScore: 8.5,
    jointStiffnessMinutes: 90,
    agniScore: 30, // Sluggish Mandagni
    amaToxinIndex: 8.5, // Thick coated tongue
    vataSeverity: 58,
    pittaSeverity: 18,
    kaphaSeverity: 24,
    clinicianNotes: 'Patient Sunita Sharma presents with severe early morning stiffness (90 mins) in PIP and MCP joints. Sluggish digestion, heavy epigastrium, white tongue coating (Sama Jihva). Diagnosis: Amavata. Initiated Langhana (light fasting) and Deepana-Pachana with Shunthi & Haritaki.',
    prescriptions: [
      'Shunthi-Khanda Churna 3g twice daily before food with warm water',
      'Valuka Sweda (dry sand fomentation) twice daily',
      'Dashamoola Kwatha 20ml with 40ml lukewarm water'
    ],
    caseSheet: {
      id: 'CASE-AMAVATA-V1',
      createdAt: '2026-06-15T10:30:00Z',
      patientSummary: 'Initial presentation of chronic Amavata with severe 90-minute bilateral joint stiffness, epigastric heaviness, and marked Mandagni.',
      systemOfAyush: 'Ayurveda',
      patientInfo: {
        fullName: 'Sunita Sharma',
        age: 46,
        gender: 'Female',
        phone: '+91 98765 43210',
        abhaId: '91-4829-1029-3841',
        location: 'Jaipur, Rajasthan',
        language: 'Hindi'
      },
      chiefComplaints: [
        {
          complaint: 'Symmetrical morning joint stiffness & arthralgia in PIP and MCP joints',
          duration: '6 months',
          severity: 9,
          onset: 'Insidious, progressive',
          aggravatingFactors: 'Cold weather, heavy meals',
          relievingFactors: 'Dry heat fomentation'
        }
      ],
      doshaProfile: {
        vata: 58,
        pitta: 18,
        kapha: 24,
        dominantConstitution: 'Vata-Kapha Prakriti',
        analysis: 'Severe Vata-Kapha vitiation with high Ama obstruction in Sandhis.'
      },
      ashtavidhaPariksha: {
        nadi: 'Vata-Kapha Spandana (Tense & sluggish)',
        jihva: 'Bahula Sama Jihva (Heavy thick white coating)',
        mutra: 'Prakrita (Pale yellow)',
        mala: 'Vibandha / Grathita (Hard sluggish stools)',
        shabda: 'Spashta',
        sparsha: 'Sheeta-Ruksha (Cool & dry extremities)',
        drik: 'Madhyama',
        akriti: 'Madhyama'
      },
      agniKoshtha: {
        agniType: 'Manda Agni',
        koshthaType: 'Krura Koshtha',
        appetite: 'Very low',
        thirst: 'Low',
        sleep: 'Disturbed sleep, 3 AM awakening'
      },
      homeopathicUnaniGenerals: {
        thermalState: 'Extremely Chilly',
        cravings: 'Warm ginger tea',
        aversions: 'Cold dairy, ice',
        mentalGenerals: 'Anxious regarding mobility',
        miasmaticTendency: 'Sycotic',
        mizaj: 'Barid-Yabis'
      },
      redFlags: [
        {
          riskLevel: 'Moderate',
          title: 'Morning Stiffness Exceeding 60 Minutes',
          recommendation: 'Monitor ESR and hs-CRP inflammatory response.'
        }
      ],
      ayushPathyaApathya: {
        pathyaAhara: ['Warm moong dal soup', 'Kulatha soup', 'Dry ginger water'],
        apathyaAhara: ['Curds', 'Fermented bakery items', 'Cold drinks'],
        pathyaVihara: ['Valuka Sweda', 'Warm water sips'],
        apathyaVihara: ['Daytime sleep', 'Cold drafts']
      },
      clinicalAyushImpression: {
        diagnosisCandidate: 'Amavata (NAMASTE: AYU-AMV-001)',
        sampraptiGhataka: 'Mandagni -> Ama -> Vata-Prakopa -> Sandhi Sammurchhana',
        dushyaInvolved: 'Rasa, Asthi, Mamsa',
        srotasInvolved: 'Annavaha, Rasavaha, Asthivaha',
        recommendedNextSteps: 'Langhana and Pachana protocol.'
      }
    }
  },
  {
    visitDate: '2026-07-06',
    visitNumber: 2,
    treatmentPhase: 'Pachana & Snehana Review (Week 3)',
    symptomSeverityScore: 6.8,
    jointStiffnessMinutes: 65,
    agniScore: 52,
    amaToxinIndex: 6.2,
    vataSeverity: 52,
    pittaSeverity: 22,
    kaphaSeverity: 26,
    clinicianNotes: 'Digestive fire improving; tongue coating noticeably lighter. Stiffness reduced from 90 to 65 minutes. Appetite returning. Added Simhanada Guggulu and Gandharvahastadi Eranda Taila for mild virechana.',
    prescriptions: [
      'Simhanada Guggulu 2 tabs twice daily after meals with warm water',
      'Dashamoola Kwatha 20ml with warm water twice daily before meals',
      'Gandharvahastadi Eranda Taila 10ml in warm milk on weekends'
    ],
    caseSheet: {
      id: 'CASE-AMAVATA-V2',
      createdAt: '2026-07-06T11:00:00Z',
      patientSummary: 'Follow-up visit 2 shows positive response to Pachana therapy; morning stiffness decreased by 25 minutes, Agni recovering.',
      systemOfAyush: 'Ayurveda',
      patientInfo: {
        fullName: 'Sunita Sharma',
        age: 46,
        gender: 'Female',
        phone: '+91 98765 43210',
        abhaId: '91-4829-1029-3841',
        location: 'Jaipur, Rajasthan',
        language: 'Hindi'
      },
      chiefComplaints: [
        {
          complaint: 'Morning stiffness in finger joints',
          duration: '6.5 months',
          severity: 7,
          onset: 'Improving with warm fomentation',
          aggravatingFactors: 'Rainy mornings',
          relievingFactors: 'Simhanada Guggulu, dry heat'
        }
      ],
      doshaProfile: {
        vata: 52,
        pitta: 22,
        kapha: 26,
        dominantConstitution: 'Vata-Kapha Prakriti',
        analysis: 'Ama mobilization underway; Srotorodha gradually clearing.'
      },
      ashtavidhaPariksha: {
        nadi: 'Vata-Kapha (Moderate tension)',
        jihva: 'Madhyama Sama (Coating reduced by 40%)',
        mutra: 'Prakrita',
        mala: 'Regular daily soft bowel movement',
        shabda: 'Spashta',
        sparsha: 'Madhyama',
        drik: 'Prakrita',
        akriti: 'Madhyama'
      },
      agniKoshtha: {
        agniType: 'Vishama to Sama transition',
        koshthaType: 'Madhyama',
        appetite: 'Moderate, feeling hungry at meal times',
        thirst: 'Normal',
        sleep: 'Improved, waking once around 4:30 AM'
      },
      homeopathicUnaniGenerals: {
        thermalState: 'Chilly',
        cravings: 'Warm spiced soups',
        aversions: 'Refrigerated food',
        mentalGenerals: 'Encouraged by pain reduction',
        miasmaticTendency: 'Sycotic',
        mizaj: 'Barid-Yabis'
      },
      redFlags: [],
      ayushPathyaApathya: {
        pathyaAhara: ['Warm moong dal', 'Takra with roasted jeera', 'Light seasonal greens'],
        apathyaAhara: ['Curds at night', 'Fried snacks'],
        pathyaVihara: ['Gentle finger flexion exercises', 'Nadi Shodhana'],
        apathyaVihara: ['Day sleep']
      },
      clinicalAyushImpression: {
        diagnosisCandidate: 'Amavata (Madhyama Avastha)',
        sampraptiGhataka: 'Ama pachana progressing, Vata pacification initiated',
        dushyaInvolved: 'Rasa, Asthi',
        srotasInvolved: 'Rasavaha, Asthivaha',
        recommendedNextSteps: 'Continue Shamana Chikitsa.'
      }
    }
  },
  {
    visitDate: '2026-08-01',
    visitNumber: 3,
    treatmentPhase: 'Shamana & Rasayana Therapy (Week 7)',
    symptomSeverityScore: 4.5,
    jointStiffnessMinutes: 40,
    agniScore: 70,
    amaToxinIndex: 3.8,
    vataSeverity: 46,
    pittaSeverity: 28,
    kaphaSeverity: 26,
    clinicianNotes: 'Marked clinical progress. Joint swelling in MCP and PIP joints has resolved by 60%. Morning stiffness lasts under 40 minutes. Tongue has clear pink edges with minimal central thin fur. Appetite normal.',
    prescriptions: [
      'Simhanada Guggulu 1 tab twice daily after meals',
      'Rasnasaptaka Kwatha 20ml twice daily with warm water',
      'Ashwagandha Churna 3g at bedtime with warm water'
    ],
    caseSheet: {
      id: 'CASE-AMAVATA-V3',
      createdAt: '2026-08-01T10:15:00Z',
      patientSummary: 'Visit 3 demonstrates substantial reduction in inflammation; ESR decreased from 58 to 32 mm/hr.',
      systemOfAyush: 'Ayurveda',
      patientInfo: {
        fullName: 'Sunita Sharma',
        age: 46,
        gender: 'Female',
        phone: '+91 98765 43210',
        abhaId: '91-4829-1029-3841',
        location: 'Jaipur, Rajasthan',
        language: 'Hindi'
      },
      chiefComplaints: [
        {
          complaint: 'Mild finger stiffness on waking up',
          duration: '7.5 months',
          severity: 4,
          onset: 'Residual mild tightness',
          aggravatingFactors: 'Cold AC exposure',
          relievingFactors: 'Gentle warm water washing'
        }
      ],
      doshaProfile: {
        vata: 46,
        pitta: 28,
        kapha: 26,
        dominantConstitution: 'Vata-Pitta Prakriti Baseline',
        analysis: 'Dosha harmony approaching balanced Prakriti state.'
      },
      ashtavidhaPariksha: {
        nadi: 'Manduka-Sarpa Gati (Normal steady wave)',
        jihva: 'Nirama Jihva (Clean with slight posterior thin coat)',
        mutra: 'Prakrita',
        mala: 'Normal regular bowel evacuation',
        shabda: 'Spashta, confident',
        sparsha: 'Samashitoshna',
        drik: 'Prakrita',
        akriti: 'Madhyama with normalized gait'
      },
      agniKoshtha: {
        agniType: 'Sama Agni (Equable balanced metabolism)',
        koshthaType: 'Madhyama',
        appetite: 'Normal and healthy',
        thirst: 'Normal',
        sleep: 'Sound continuous sleep 10 PM to 6 AM'
      },
      homeopathicUnaniGenerals: {
        thermalState: 'Mildly Chilly',
        cravings: 'Fresh warm home-cooked meals',
        aversions: 'Excess oily food',
        mentalGenerals: 'Calm, high energy',
        miasmaticTendency: 'Latent Psora',
        mizaj: 'Mo’tadil (Approaching balance)'
      },
      redFlags: [],
      ayushPathyaApathya: {
        pathyaAhara: ['Fresh seasonal vegetables', 'Moong dal', 'Pomegranate', 'Buttermilk'],
        apathyaAhara: ['Refrigerated curds', 'Processed fast foods'],
        pathyaVihara: ['Daily 30 min morning walk (Shatapadi)', 'Pranayama'],
        apathyaVihara: ['Irregular meal hours']
      },
      clinicalAyushImpression: {
        diagnosisCandidate: 'Amavata (Alpa Avastha / Stage of Remission)',
        sampraptiGhataka: 'Ama cleared from Sandhis; Dhatvagni strengthened',
        dushyaInvolved: 'Asthi, Sandhi',
        srotasInvolved: 'Asthivaha',
        recommendedNextSteps: 'Introduce Rasayana for tissue longevity.'
      }
    }
  },
  {
    visitDate: '2026-09-18',
    visitNumber: 4,
    treatmentPhase: 'Maintenance & Rasayana (Current Evaluation)',
    symptomSeverityScore: 2.2,
    jointStiffnessMinutes: 15,
    agniScore: 88,
    amaToxinIndex: 1.5,
    vataSeverity: 38,
    pittaSeverity: 32,
    kaphaSeverity: 30,
    clinicianNotes: 'Near complete clinical remission. Morning joint stiffness limited to under 15 minutes. No swelling in hands or wrists. Patient resumed full teaching duties and walking 4 km daily. Tongue completely Nirama. Blood markers: ESR 18 mm/hr, hs-CRP normal (<1.0 mg/L). Transitioned to maintenance Rasayana.',
    prescriptions: [
      'Amritarishta 15ml with equal water twice daily after food',
      'Kaishore Guggulu 1 tab once daily in morning',
      'Ashwagandha Rasayana 5g at bedtime with lukewarm milk'
    ],
    caseSheet: {
      id: 'CASE-AMAVATA-V4',
      createdAt: '2026-09-18T09:45:00Z',
      patientSummary: 'Current case evaluation confirms 74% aggregate reduction in symptom severity, complete elimination of Ama, and stable Vata pacification.',
      systemOfAyush: 'Ayurveda',
      patientInfo: {
        fullName: 'Sunita Sharma',
        age: 46,
        gender: 'Female',
        phone: '+91 98765 43210',
        abhaId: '91-4829-1029-3841',
        location: 'Jaipur, Rajasthan',
        language: 'Hindi'
      },
      chiefComplaints: [
        {
          complaint: 'Occasional mild weather-related joint stiffness',
          duration: '9 months total (Under control)',
          severity: 2,
          onset: 'Only with drastic temperature drop',
          aggravatingFactors: 'Sudden rain',
          relievingFactors: 'Normal routine activity'
        }
      ],
      doshaProfile: {
        vata: 38,
        pitta: 32,
        kapha: 30,
        dominantConstitution: 'Tridoshic Balanced (Prakriti Sthiti)',
        analysis: 'Constitutional balance restored; Agni functioning at optimal capacity.'
      },
      ashtavidhaPariksha: {
        nadi: 'Hamsa Gati (Healthy, supple, balanced pulse)',
        jihva: 'Prakrita Nirama Jihva (Clean pink, no Ama)',
        mutra: 'Prakrita (Clear pale amber)',
        mala: 'Regular, easy bowel movement every morning',
        shabda: 'Spashta, vibrant',
        sparsha: 'Samashitoshna (Normal body warmth)',
        drik: 'Snigdha, clear conjunctiva',
        akriti: 'Madhyama with active, agile gait'
      },
      agniKoshtha: {
        agniType: 'Sama Agni',
        koshthaType: 'Madhyama',
        appetite: 'Healthy, timely hunger',
        thirst: 'Normal',
        sleep: 'Deep, rejuvenating 7 hours nightly'
      },
      homeopathicUnaniGenerals: {
        thermalState: 'Ambithermal',
        cravings: 'Balanced nutritious meals',
        aversions: 'None',
        mentalGenerals: 'Cheerful, optimistic',
        miasmaticTendency: 'Quiescent',
        mizaj: 'Mo’tadil'
      },
      redFlags: [],
      ayushPathyaApathya: {
        pathyaAhara: ['Seasonal fruits', 'Ghee in moderation', 'Triphala water occasionally'],
        apathyaAhara: ['Excess cold water', 'Stale food'],
        pathyaVihara: ['Daily Surya Namaskar (6 cycles)', 'Regular walking'],
        apathyaVihara: ['Overexertion late at night']
      },
      clinicalAyushImpression: {
        diagnosisCandidate: 'Amavata in Clinical Remission (Upashamana)',
        sampraptiGhataka: 'Pathological samprapti vighatana complete; Dhatuposhana active',
        dushyaInvolved: 'None active',
        srotasInvolved: 'Channels clear (Srotoshuddhi)',
        recommendedNextSteps: 'Seasonal Rasayana maintenance.'
      }
    }
  }
];
