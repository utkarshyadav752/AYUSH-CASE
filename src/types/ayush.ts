export type AyushSystem = 
  | 'Ayurveda' 
  | 'Homeopathy' 
  | 'Unani' 
  | 'Siddha' 
  | 'Yoga & Naturopathy' 
  | 'Integrative Ayush';

export interface PatientInfo {
  fullName: string;
  age: number | string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  abhaId?: string; // Ayushman Bharat Health Account ID
  occupation?: string;
  location?: string;
  language: string;
}

export interface ChiefComplaint {
  complaint: string;
  duration: string;
  severity: number; // 1-10
  onset: string;
  aggravatingFactors: string;
  relievingFactors: string;
  associatedSymptoms?: string;
}

export interface DoshaProfile {
  vata: number;
  pitta: number;
  kapha: number;
  dominantConstitution: string;
  analysis: string;
}

export interface AshtavidhaPariksha {
  nadi: string;    // Pulse
  jihva: string;   // Tongue
  mutra: string;   // Urine
  mala: string;    // Stool / Bowel
  shabda: string;  // Voice / Speech
  sparsha: string; // Skin touch / Temperature
  drik: string;    // Eyes / Sclera
  akriti: string;  // Body build / Posture
}

export interface AgniKoshtha {
  agniType: string;    // Sama, Tikshna, Manda, Vishama
  koshthaType: string; // Krura, Madhyama, Mridu
  appetite: string;
  thirst: string;
  sleep: string;
}

export interface HomeopathicUnaniGenerals {
  thermalState: string;     // Hot / Chilly / Ambithermal
  cravings: string;         // Desires (sweet, sour, salt, warm, cold)
  aversions: string;        // Disliked foods / milk / fat
  mentalGenerals: string;   // Temperament, anxiety, anger, grief
  miasmaticTendency: string;// Psora, Sycosis, Syphilis, Tubercular
  mizaj: string;            // Damvi, Balghami, Safrawi, Saudawi
}

export interface RedFlagAlert {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  title: string;
  recommendation: string;
}

export interface PathyaApathya {
  pathyaAhara: string[];    // Wholesome foods
  apathyaAhara: string[];   // Foods to avoid
  pathyaVihara: string[];   // Beneficial lifestyle & yoga habits
  apathyaVihara: string[];  // Detrimental lifestyle habits
}

export interface ClinicalAyushImpression {
  diagnosisCandidate: string;
  sampraptiGhataka: string;
  dushyaInvolved: string;
  srotasInvolved: string;
  recommendedNextSteps: string;
}

export interface AyushCaseSheet {
  id?: string;
  createdAt?: string;
  patientSummary: string;
  systemOfAyush: AyushSystem;
  patientInfo?: PatientInfo;
  chiefComplaints: ChiefComplaint[];
  doshaProfile: DoshaProfile;
  ashtavidhaPariksha: AshtavidhaPariksha;
  agniKoshtha: AgniKoshtha;
  homeopathicUnaniGenerals: HomeopathicUnaniGenerals;
  redFlags: RedFlagAlert[];
  ayushPathyaApathya: PathyaApathya;
  clinicalAyushImpression: ClinicalAyushImpression;
  doctorNotes?: string;
  prescriptions?: string[];
  rawTranscript?: string;
  phoneHealthMetrics?: PhoneHealthMetrics;
}

export interface PhoneHealthMetrics {
  stepsToday: number;
  stepGoal: number;
  distanceKm: number;
  caloriesBurned: number;
  activeMinutes: number;
  floorsClimbed?: number;
  restingHeartRateBpm: number;
  currentHeartRateBpm?: number;
  sleepHours: number;
  deepSleepMinutes: number;
  shatapadiPacesCount: number;
  lastSyncTimestamp: string;
  sourceApp: 'Google Health Connect' | 'Apple Health' | 'Samsung Health' | 'Fitbit' | 'Phone Motion Sensor' | 'Manual';
  weeklyStepsHistory?: Array<{ day: string; steps: number; goalMet: boolean; activeMinutes: number }>;
  hourlyStepDistribution?: Array<{ hour: string; steps: number }>;
}

export interface ConversationalMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}
