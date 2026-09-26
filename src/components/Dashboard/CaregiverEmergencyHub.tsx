import React, { useState } from 'react';
import { 
  HeartHandshake, PhoneCall, Volume2, ShieldAlert, 
  Clock, Check, UserCheck, AlertTriangle
} from 'lucide-react';
import { AyushCaseSheet } from '../../types/ayush';

interface CaregiverEmergencyHubProps {
  caseSheet?: AyushCaseSheet | null;
  patientName?: string;
  phone?: string;
  language?: string;
}

interface CaregiverContact {
  id: string;
  relation: string;
  name: string;
  phone: string;
  isPrimary: boolean;
  notifiedToday: boolean;
}

export const CaregiverEmergencyHub: React.FC<CaregiverEmergencyHubProps> = ({
  caseSheet,
  patientName = 'Sunita Sharma',
  phone = '+91 98765 43210',
  language = 'Hindi',
}) => {
  const [contacts, setContacts] = useState<CaregiverContact[]>([
    {
      id: 'c1',
      relation: 'Son (Primary Caregiver)',
      name: 'Ramesh Sharma',
      phone: '+91 98112 34567',
      isPrimary: true,
      notifiedToday: true,
    },
    {
      id: 'c2',
      relation: 'Attending Vaidya / Ayush OPD',
      name: 'Dr. Ananya Varma (AIIA)',
      phone: '+91 11 2695 0401',
      isPrimary: false,
      notifiedToday: false,
    },
    {
      id: 'c3',
      relation: 'Ministry 24/7 Ayush Helpline',
      name: 'Toll-Free Ayush Sanjeevani',
      phone: '14443',
      isPrimary: false,
      notifiedToday: false,
    }
  ]);

  const [sosSent, setSosSent] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakEmergencyAloud = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = language.toLowerCase().includes('hindi');
    const text = isHindi
      ? `Aapka Parivar Sathi: Agar achanak zyada dard ya tabiyat kharab lage, to lal rang ka SOS button dabayein. Aapke bete Ramesh aur doctor ko turant alert chala jayega.`
      : `Caregiver Alert Hub: If you feel acute discomfort, tap the Emergency Alert button to notify your primary caregiver and attending physician.`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleTriggerSOS = () => {
    setSosSent(true);
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = language.toLowerCase().includes('hindi')
      ? 'Aapke bete Ramesh aur Doctor ko emergency sandesh bhej diya gaya hai. Kripya aaram karein.'
      : 'Emergency alert dispatched to caregiver Ramesh and attending physician.';
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-slate-500">
            <span className="font-semibold text-rose-700">Safety & Family Bridge</span>
            <span aria-hidden="true">·</span>
            <span>Caregiver Notification Hub</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Caregiver Network & Urgent Support
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time SMS dose synchronization and single-click priority emergency routing to family members and attending Vaidya.
          </p>
        </div>

        <button
          type="button"
          onClick={speakEmergencyAloud}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-3.5 py-2 rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-slate-200"
        >
          <Volume2 className="w-3.5 h-3.5 text-slate-600" />
          <span>{isSpeaking ? 'Playing...' : 'Audio Guide'}</span>
        </button>
      </div>

      {/* Emergency Action Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-rose-950 text-rose-400 border border-rose-800/80 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                {sosSent ? 'Emergency Dispatch Active' : 'Priority Caregiver SOS Notification'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              {sosSent 
                ? 'Alerts transmitted to primary contact Ramesh Sharma (+91 98112 34567) and AIIA OPD clinic.'
                : 'Instantly notify registered family contacts and duty clinicians with your current symptom log and location.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerSOS}
          disabled={sosSent}
          className={`px-4 py-2 rounded-md font-medium text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
            sosSent
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
        >
          {sosSent ? (
            <>
              <Check className="w-4 h-4" />
              <span>Dispatched</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>Send SOS Alert</span>
            </>
          )}
        </button>
      </div>

      {/* Caregiver Contacts List with 1-Tap Call */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{contact.relation}</span>
                {contact.isPrimary && (
                  <span className="text-emerald-700 font-medium">Primary</span>
                )}
              </div>
              <h4 className="text-xs font-semibold text-slate-900 mt-1">
                {contact.name}
              </h4>
              <span className="text-xs text-slate-500 font-mono tabular-nums block mt-0.5">
                {contact.phone}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                {contact.notifiedToday ? 'Dose Synced' : 'Ready'}
              </span>

              <a
                href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-slate-600" />
                <span>Call</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
