/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { PatientIntakeView } from './components/PatientIntake/PatientIntakeView';
import { DoctorCockpitView } from './components/DoctorCockpit/DoctorCockpitView';
import { HackathonDossierView } from './components/HackathonDossier/HackathonDossierView';
import { SoftwareComparisonView } from './components/SoftwareComparison/SoftwareComparisonView';
import { PatientDoctorAiGuide } from './components/PatientPortal/PatientDoctorAiGuide';
import { AuthModal } from './components/Auth/AuthModal';
import { DoctorAiModal, DoctorAiTopic } from './components/DoctorAI/DoctorAiModal';
import { PhoneHealthTrackerModal } from './components/HealthSync/PhoneHealthTrackerModal';
import { AyushCaseSheet, PhoneHealthMetrics } from './types/ayush';
import { SAMPLE_CASES } from './data/sampleCases';
import { DEMO_USERS, UserAccount } from './data/mockUsers';
import { useLanguage } from './context/LanguageContext';
import { SupportedLanguage } from './utils/translations';

export default function App() {
  const { language, setLanguage } = useLanguage();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'guide' | 'patient' | 'doctor' | 'compare' | 'hackathon'>('dashboard');
  const selectedLanguage = language;
  const setSelectedLanguage = (newLang: string) => setLanguage(newLang as SupportedLanguage);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null); // Starts unauthenticated - user logs in manually
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDoctorAiOpen, setIsDoctorAiOpen] = useState<boolean>(false);
  const [isHealthTrackerOpen, setIsHealthTrackerOpen] = useState<boolean>(false);
  const [doctorAiTopic, setDoctorAiTopic] = useState<DoctorAiTopic>('full_case');
  const [collectedPrescriptions, setCollectedPrescriptions] = useState<string[]>([]);
  const [currentCaseSheet, setCurrentCaseSheet] = useState<AyushCaseSheet | null>(() => {
    // Initialize with a rich sample case so doctor view is immediately demonstrable!
    const sample = SAMPLE_CASES[0];
    return {
      id: 'CASE-AMAVATA-2026',
      createdAt: new Date().toISOString(),
      patientSummary: 'Patient Sunita Sharma, a 46-year-old female, presents with a 6-month history of bilateral symmetrical morning stiffness and pain in the small joints of the hands and wrists, accompanied by sluggish appetite and white tongue coating. Symptoms significantly worsen during cold weather and improve with dry warmth, characteristic of Amavata.',
      systemOfAyush: 'Ayurveda',
      patientInfo: sample.patientInfo,
      chiefComplaints: [
        {
          complaint: 'Symmetrical morning joint stiffness & arthralgia in PIP and MCP joints',
          duration: '6 months',
          severity: 8,
          onset: 'Insidious onset, gradually progressive with episodic exacerbations',
          aggravatingFactors: 'Cold weather, rain, heavy dairy meals, sedentary morning hours',
          relievingFactors: 'Dry heat fomentation, warm water sips, afternoon mobilization',
          associatedSymptoms: 'Early morning fatigue, heaviness in epigastrium, white tongue coating'
        }
      ],
      doshaProfile: {
        vata: 55,
        pitta: 20,
        kapha: 25,
        dominantConstitution: 'Vata-Kapha Prakriti',
        analysis: 'Vitiated Vata dosha has mobilized Ama (undigested endotoxins) into the Asthi-Sandhi (joints), obstructing Rasavaha and Asthivaha srotas.'
      },
      ashtavidhaPariksha: {
        nadi: 'Vata-Kapha Spandana (Tense, slightly slow & irregular wave)',
        jihva: 'Sama Jihva (Prominent thick white coating indicating Ama in Annavaha srotas)',
        mutra: 'Prakrita (Pale yellow, normal stream, no dysuria)',
        mala: 'Vibandha / Grathita (Tendency toward sluggish evacuation and hard stools)',
        shabda: 'Spashta (Clear voice, mild fatigue on prolonged speech)',
        sparsha: 'Sheeta-Ruksha (Cool, dry extremities with localized joint warmth)',
        drik: 'Madhyama (Clear conjunctiva, mild periorbital fatigue)',
        akriti: 'Madhyama (Medium body frame with protective gait due to joint pain)'
      },
      agniKoshtha: {
        agniType: 'Manda Agni (Sluggish digestive metabolism with Ama accumulation)',
        koshthaType: 'Madhyama to Krura (Tendency to irregular sluggish bowels)',
        appetite: 'Low, feels full after small quantities of food',
        thirst: 'Low to moderate, strictly desires warm water',
        sleep: 'Disturbed sleep, frequent awakenings around 3:00 AM due to joint stiffness'
      },
      homeopathicUnaniGenerals: {
        thermalState: 'Chilly patient (Extremely sensitive to cold drafts and rainy season)',
        cravings: 'Warm ginger tea, roasted cumin water, light vegetable soups',
        aversions: 'Cold refrigerated dairy, curds, heavy sweets',
        mentalGenerals: 'Mild anxiety regarding mobility; restless when seated idle',
        miasmaticTendency: 'Sycotic with underlying Psora',
        mizaj: 'Barid-Yabis (Cold and Dry humor predominance)'
      },
      redFlags: [
        {
          riskLevel: 'Moderate',
          title: 'Morning Stiffness Exceeding 60 Minutes',
          recommendation: 'Check inflammatory markers (ESR, hs-CRP, Rheumatoid Factor, Anti-CCP) to rule out active erosive rheumatoid progression.'
        }
      ],
      ayushPathyaApathya: {
        pathyaAhara: [
          'Kulatha (Horse gram soup) with black pepper and ginger',
          'Takra (Buttermilk processed with roasted jeera & shunthi)',
          'Shunthi-Siddha Jala (Water boiled with dry ginger powder)',
          'Purana Shali (Aged rice) and Mudga Yusha (Moong dal soup)'
        ],
        apathyaAhara: [
          'Dadhi (Curd / Yogurt, especially at night)',
          'Masha (Black gram) and heavy fermented bakery products',
          'Sheeta Jala (Ice-cold water) and cold refrigerated foods',
          'Viruddha Ahara (Incompatible food combinations like milk with sour fruits)'
        ],
        pathyaVihara: [
          'Valuka Sweda (Dry sand or rock salt poultice heat fomentation)',
          'Sukshma Vyayama (Gentle micro-movement of finger joints)',
          'Nadi Shodhana & Surya Bhedana Pranayama (10 mins each morning)',
          'Early dinner before 7:30 PM followed by light stroll (Shatapadi)'
        ],
        apathyaVihara: [
          'Diva Swapna (Daytime sleeping)',
          'Purovata Sevana (Exposure to direct cold easterly winds or AC drafts)',
          'Vega Dharana (Suppression of natural physiological urges)'
        ]
      },
      clinicalAyushImpression: {
        diagnosisCandidate: 'Amavata (NAMASTE Code: AYU-AMV-001 / ICD-11: FA20)',
        sampraptiGhataka: 'Mandagni -> Ama Formation -> Vata-Prakopa -> Ama-Vata Sammurchhana in Sandhis.',
        dushyaInvolved: 'Rasa Dhatu, Asthi Dhatu, Mamsa Dhatu, Snayu',
        srotasInvolved: 'Annavaha Srotas, Rasavaha Srotas, Asthivaha Srotas',
        recommendedNextSteps: 'Initiate Langhana (light fasting) and Deepana-Pachana with Shunthi & Haritaki, followed by Valuka Sweda.'
      }
    };
  });

  const handleCaseExtracted = (caseSheet: AyushCaseSheet) => {
    // Inject patient info from logged in user if available
    if (currentUser) {
      caseSheet.patientInfo = {
        fullName: currentUser.name,
        age: currentUser.age || 40,
        gender: currentUser.gender || 'Female',
        phone: currentUser.phone,
        abhaId: currentUser.abhaId || '91-4829-1029-3841',
        location: currentUser.city || 'New Delhi, India',
        language: selectedLanguage,
      };
    }
    setCurrentCaseSheet(caseSheet);
    setCurrentTab('doctor');
  };

  const handleSelectFormulation = (rxText: string) => {
    setCollectedPrescriptions(prev => [...prev, rxText]);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    // If patient logged in, adapt current case sheet's name & ABHA
    if (currentCaseSheet && user) {
      setCurrentCaseSheet(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          patientInfo: {
            fullName: user.name,
            age: user.age || 42,
            gender: user.gender || 'Female',
            phone: user.phone,
            abhaId: user.abhaId,
            location: user.city,
            language: selectedLanguage,
          }
        };
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        caseCount={currentCaseSheet ? 1 : 0}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenDoctorAi={() => {
          setDoctorAiTopic('full_case');
          setIsDoctorAiOpen(true);
        }}
        onOpenHealthTracker={() => setIsHealthTrackerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 lg:pb-0">
        {currentTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            onOpenLogin={() => setIsAuthModalOpen(true)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            caseSheet={currentCaseSheet}
            selectedLanguage={selectedLanguage}
            onSelectHistoricalCase={(sheet) => {
              setCurrentCaseSheet(sheet);
              setCurrentTab('doctor');
            }}
            onOpenDoctorAi={(topic) => {
              setDoctorAiTopic((topic as DoctorAiTopic) || 'full_case');
              setIsDoctorAiOpen(true);
            }}
            onOpenHealthTracker={() => setIsHealthTrackerOpen(true)}
          />
        )}

        {currentTab === 'guide' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PatientDoctorAiGuide
              language={selectedLanguage}
              caseSheet={currentCaseSheet}
              onConsultDoctor={() => setCurrentTab('doctor')}
              onUpdateCaseSheetPrescriptions={(newPrescriptions) => {
                if (currentCaseSheet) {
                  setCurrentCaseSheet({
                    ...currentCaseSheet,
                    prescriptions: newPrescriptions
                  });
                }
              }}
            />
          </div>
        )}

        {currentTab === 'patient' && (
          <PatientIntakeView
            onCaseExtracted={handleCaseExtracted}
            selectedLanguage={selectedLanguage}
          />
        )}

        {currentTab === 'doctor' && (
          <DoctorCockpitView
            caseSheet={currentCaseSheet}
            onNewIntakeRequest={() => setCurrentTab('patient')}
            externalPrescriptions={collectedPrescriptions}
            onOpenFormulary={() => setCurrentTab('compare')}
            onOpenDoctorAi={(topic) => {
              setDoctorAiTopic((topic as DoctorAiTopic) || 'full_case');
              setIsDoctorAiOpen(true);
            }}
            onOpenHealthTracker={() => setIsHealthTrackerOpen(true)}
          />
        )}

        {currentTab === 'compare' && (
          <SoftwareComparisonView
            onSelectFormulation={handleSelectFormulation}
            onNavigateToCockpit={() => setCurrentTab('doctor')}
          />
        )}

        {currentTab === 'hackathon' && (
          <HackathonDossierView
            onLaunchIntake={() => setCurrentTab('patient')}
          />
        )}
      </main>

      {/* ABHA / Patient Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Doctor AI Clinical Explainer Modal */}
      <DoctorAiModal
        isOpen={isDoctorAiOpen}
        onClose={() => setIsDoctorAiOpen(false)}
        caseSheet={currentCaseSheet}
        initialTopic={doctorAiTopic}
        language={selectedLanguage}
        onAppendDoctorNote={(note) => {
          if (currentCaseSheet) {
            // append to doctor notes buffer
            setCollectedPrescriptions(prev => [...prev, note]);
          }
        }}
      />

      {/* Phone Health App & Activity Synchronization Modal */}
      <PhoneHealthTrackerModal
        isOpen={isHealthTrackerOpen}
        onClose={() => setIsHealthTrackerOpen(false)}
        caseSheet={currentCaseSheet}
        patientName={currentUser ? currentUser.name : (currentCaseSheet?.patientInfo?.fullName || 'Sunita Sharma')}
        language={selectedLanguage}
        onSyncToEhr={(updatedMetrics) => {
          if (currentCaseSheet) {
            setCurrentCaseSheet(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                phoneHealthMetrics: updatedMetrics
              };
            });
          }
        }}
      />

      {/* Official Ayush Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-white font-semibold">
              AyushCase — Autonomous Patient Case-Taking & Clinical Intake Platform
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Developed for the Ministry of Ayush • Compliant with ABDM, FHIR R4, and NAMASTE Ontologies
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('guide')}
              className="hover:text-amber-400 transition-colors cursor-pointer text-amber-300 font-bold"
            >
              AI Doctor Guide & Alarms
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('compare')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Software Comparison & Formulary
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('doctor')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Vaidya EHR Cockpit
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
