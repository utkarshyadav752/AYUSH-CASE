import React, { useState } from 'react';
import { 
  Bot, Volume2, Droplets, Pill, AlertTriangle, 
  Upload, CheckCircle2, HeartHandshake, PhoneCall, Stethoscope, 
  HelpCircle, ShieldCheck, ArrowRight, MessageSquare, BookOpen, MapPin
} from 'lucide-react';
import { SimplifiedScheduleReminder } from './SimplifiedScheduleReminder';
import { MedicineEmergencyTriage } from './MedicineEmergencyTriage';
import { PrescriptionUploadComparison } from './PrescriptionUploadComparison';
import { AyushKnowledgeCenter } from './AyushKnowledgeCenter';
import { AyushClinicFinder } from './AyushClinicFinder';
import { AyushCaseSheet } from '../../types/ayush';
import { useLanguage } from '../../context/LanguageContext';

interface PatientDoctorAiGuideProps {
  currentMedicines?: any[];
  language?: string;
  onConsultDoctor?: () => void;
  caseSheet?: AyushCaseSheet | null;
  onUpdateCaseSheetPrescriptions?: (newPrescriptions: string[], fullParsed: any) => void;
}

export const PatientDoctorAiGuide: React.FC<PatientDoctorAiGuideProps> = ({
  currentMedicines = [],
  language = 'Hindi',
  onConsultDoctor,
  caseSheet,
  onUpdateCaseSheetPrescriptions,
}) => {
  const { language: currentLang, speak } = useLanguage();
  const effectiveLanguage = currentLang || language;
  const [activeGuideTab, setActiveGuideTab] = useState<'schedule' | 'upload' | 'problem' | 'knowledge' | 'clinics'>('schedule');
  const [parsedPrescriptionMedicines, setParsedPrescriptionMedicines] = useState<any[]>([]);

  const handlePrescriptionParsed = (data: any) => {
    if (data.medicines && data.medicines.length > 0) {
      setParsedPrescriptionMedicines(data.medicines);
    }
  };

  const speakWelcomeVoice = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = language.toLowerCase().includes('hindi');
    const text = isHindi
      ? 'Namaste! Main aapka AI Doctor Guide hoon. Yahan aap apna parcha scan kar sakte hain, dawa aur paani ka time dekh sakte hain, dawa se koi takleef ho to turant pooch sakte hain, aur apne shahar me certified Ayush dispensaries aur pharmacies dhoondh sakte hain.'
      : 'Hello! I am your AI Doctor Guide. You can upload prescriptions, manage your dose schedule, ask emergency symptom advice, learn Ayush concepts, and locate certified Ayush clinics and pharmacies near you.';
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Guide */}
      <div className="bg-slate-900 text-white rounded-lg p-6 sm:p-8 border border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                Ayush Patient Sathi
              </span>
              <span aria-hidden="true">·</span>
              <span>Dose Management & Clinic Finder</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Patient Care & Medicine Assistance
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Timely reminders for classical formulations, OCR prescription digitization, nearby certified Ayush clinics via Google Maps, and symptom triage.
            </p>
          </div>

          <button
            type="button"
            onClick={speakWelcomeVoice}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audio Guidance</span>
          </button>
        </div>

        {/* 5 Clean Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-6 pt-5 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setActiveGuideTab('schedule')}
            className={`p-3 rounded-md text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
              activeGuideTab === 'schedule'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${activeGuideTab === 'schedule' ? 'bg-sky-100 text-sky-700' : 'bg-slate-700 text-slate-300'}`}>
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs block font-semibold">1. Water & Dose</span>
              <span className={`text-[10px] block ${activeGuideTab === 'schedule' ? 'text-slate-500' : 'text-slate-400'}`}>
                Timed alarms
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuideTab('upload')}
            className={`p-3 rounded-md text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
              activeGuideTab === 'upload'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${activeGuideTab === 'upload' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-700 text-slate-300'}`}>
              <Upload className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs block font-semibold">2. Prescription OCR</span>
              <span className={`text-[10px] block ${activeGuideTab === 'upload' ? 'text-slate-500' : 'text-slate-400'}`}>
                Scan paper slip
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuideTab('problem')}
            className={`p-3 rounded-md text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
              activeGuideTab === 'problem'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${activeGuideTab === 'problem' ? 'bg-rose-100 text-rose-700' : 'bg-slate-700 text-slate-300'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs block font-semibold">3. Symptom Triage</span>
              <span className={`text-[10px] block ${activeGuideTab === 'problem' ? 'text-slate-500' : 'text-slate-400'}`}>
                Discomfort advice
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuideTab('knowledge')}
            className={`p-3 rounded-md text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
              activeGuideTab === 'knowledge'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${activeGuideTab === 'knowledge' ? 'bg-amber-100 text-amber-700' : 'bg-slate-700 text-slate-300'}`}>
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs block font-semibold">4. Knowledge Base</span>
              <span className={`text-[10px] block ${activeGuideTab === 'knowledge' ? 'text-slate-500' : 'text-slate-400'}`}>
                Ayush glossary
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuideTab('clinics')}
            className={`p-3 rounded-md text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
              activeGuideTab === 'clinics'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${activeGuideTab === 'clinics' ? 'bg-teal-100 text-teal-700' : 'bg-slate-700 text-slate-300'}`}>
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs block font-semibold">5. Clinic Finder</span>
              <span className={`text-[10px] block ${activeGuideTab === 'clinics' ? 'text-slate-500' : 'text-slate-400'}`}>
                Nearby dispensaries
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Render Active Tool Module */}
      {activeGuideTab === 'schedule' && (
        <SimplifiedScheduleReminder
          speechLanguage={language}
          customMedicines={
            parsedPrescriptionMedicines.length > 0
              ? parsedPrescriptionMedicines
              : caseSheet?.prescriptions?.map((rx, idx) => ({
                  name: rx.split(' ')[0] + ' ' + (rx.split(' ')[1] || ''),
                  dosage: rx.includes('tablet') ? '2 tablets' : rx.includes('ml') ? '20 ml' : '1 teaspoon',
                  timing: rx.includes('after') ? 'After meals' : 'Before meals',
                  timeOfDay: idx % 2 === 0 ? ['morning', 'night'] : ['morning'],
                  anupana: 'Lukewarm water',
                  visualIcon: rx.includes('Kwatha') ? 'liquid' : rx.includes('Churna') ? 'powder' : 'pill',
                  pillColor: idx === 0 ? '#059669' : idx === 1 ? '#d97706' : '#7c3aed'
                }))
          }
        />
      )}

      {activeGuideTab === 'upload' && (
        <PrescriptionUploadComparison
          language={language}
          onPrescriptionParsed={handlePrescriptionParsed}
          onUpdateCaseSheetPrescriptions={onUpdateCaseSheetPrescriptions}
        />
      )}

      {activeGuideTab === 'problem' && (
        <MedicineEmergencyTriage
          language={language}
          currentMedicines={
            parsedPrescriptionMedicines.length > 0
              ? parsedPrescriptionMedicines
              : caseSheet?.prescriptions
          }
          onConsultDoctor={onConsultDoctor}
        />
      )}

      {activeGuideTab === 'knowledge' && (
        <AyushKnowledgeCenter
          language={language}
        />
      )}

      {activeGuideTab === 'clinics' && (
        <AyushClinicFinder
          initialCity={caseSheet?.patientInfo?.location || 'Delhi'}
          patientRegion={caseSheet?.patientInfo?.location}
          language={language}
        />
      )}
    </div>
  );
};
