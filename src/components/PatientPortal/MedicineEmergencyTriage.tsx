import React, { useState } from 'react';
import { 
  AlertTriangle, PhoneCall, Volume2, ShieldAlert, Sparkles, 
  HelpCircle, ArrowRight, HeartPulse, Stethoscope, RefreshCw, CheckCircle2
} from 'lucide-react';

interface MedicineEmergencyTriageProps {
  currentMedicines?: any[];
  language?: string;
  onConsultDoctor?: () => void;
}

export const MedicineEmergencyTriage: React.FC<MedicineEmergencyTriageProps> = ({
  currentMedicines = [],
  language = 'Hindi',
  onConsultDoctor,
}) => {
  const [problemDescription, setProblemDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<any | null>(null);

  // Quick preset problem buttons for rapid voice/touch input (simple visual/voice mode)
  const quickProblems = [
    { label: 'Pet me jalan / Acidity', hindi: 'Dawa khane ke baad pet me tezz jalan aur ulti jaisa lag raha hai.' },
    { label: 'Chakkar / Giddiness', hindi: 'Dawa khate hi sir ghoom raha hai aur chakkar aa rahe hain.' },
    { label: 'Khujli / Lal daane (Rash)', hindi: 'Sharir par lal daane aur khujli ho gayi hai.' },
    { label: 'Saans lene me dikkat (Breathing)', hindi: 'Gale me ghutan aur saans lene me takleef ho rahi hai.' }
  ];

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser. Please type or select a problem button.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setProblemDescription(prev => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.start();
  };

  const handleTriageSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSubmit = customText || problemDescription;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/medicine-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemDescription: textToSubmit,
          currentMedicines: currentMedicines,
          language: language,
        }),
      });
      const data = await response.json();
      setTriageResult(data);

      // Auto speak response out loud so patients can listen immediately
      if ('speechSynthesis' in window && data.audioSpeechText) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(data.audioSpeechText);
        utter.lang = language.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
      }
    } catch (err) {
      console.error('Triage error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playSpeechAgain = () => {
    if (!triageResult?.audioSpeechText || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(triageResult.audioSpeechText);
    utter.lang = language.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="bg-white rounded-3xl border border-red-200 shadow-sm overflow-hidden p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-100 text-red-800 border border-red-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              Emergency & Side-Effect Triage
            </span>
            <span className="text-slate-500 text-xs font-semibold">24/7 AI Doctor Guidance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Having Trouble After Taking Your Medicine?
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dawa lene ke baad koi takleef ho to yahan bolein ya likhein. AI turant gharelu upay aur emergency salaah dega.
          </p>
        </div>

        {/* SOS Hotline Box */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-right shrink-0">
          <span className="text-[10px] text-red-600 uppercase font-black block">National Ambulance</span>
          <a href="tel:108" className="text-base font-black text-red-700 flex items-center gap-1.5 justify-end">
            <PhoneCall className="w-4 h-4 text-red-600 animate-bounce" />
            <span>Call 108</span>
          </a>
        </div>
      </div>

      {/* 1-Click Quick Problem Pills for Visual / Voice-First Users */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          One-Touch Quick Report (Bina type kiye choose karein):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickProblems.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setProblemDescription(q.hindi);
                handleTriageSubmit(undefined, q.hindi);
              }}
              className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-slate-800 text-xs font-bold text-left transition-all cursor-pointer"
            >
              <span className="block text-red-700 font-extrabold">{q.label}</span>
              <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{q.hindi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Voice / Text Input */}
      <form onSubmit={(e) => handleTriageSubmit(e)} className="space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Apni takleef bol kar ya likh kar batayein (e.g. Dawa lene ke baad pet me tezz jalan aur ghabrahat ho rahi hai)..."
            className="w-full text-xs p-4 rounded-2xl border-2 border-slate-200 focus:border-red-500 bg-slate-50 focus:bg-white text-slate-800 transition-all"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isRecording ? 'Listening...' : 'Speak in Voice'}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !problemDescription.trim()}
          className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-40"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{loading ? 'Analyzing Emergency Symptoms...' : 'Get Instant Doctor Advice & Emergency Guidance'}</span>
        </button>
      </form>

      {/* Triage Guidance Results */}
      {triageResult && (
        <div className={`p-6 rounded-3xl border-2 transition-all space-y-4 animate-fade-in ${
          triageResult.isEmergency
            ? 'bg-red-50/90 border-red-500 text-red-950'
            : 'bg-amber-50/90 border-amber-400 text-amber-950'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-red-200">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl font-black ${
                triageResult.isEmergency ? 'bg-red-600 animate-bounce' : 'bg-amber-600'
              }`}>
                {triageResult.isEmergency ? '🚨' : '⚠️'}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block">
                  Triage Assessment:
                </span>
                <h3 className="text-lg font-black">
                  {triageResult.urgencyLevel === 'IMMEDIATE_EMERGENCY'
                    ? 'Immediate Emergency Alert — Discontinue Dose'
                    : 'Adverse Reaction Warning — Medical Attention Recommended'}
                </h3>
              </div>
            </div>

            {/* Listen again speaker */}
            <button
              type="button"
              onClick={playSpeechAgain}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Listen Again (Awaaz Sunein)</span>
            </button>
          </div>

          {/* Action Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="font-extrabold text-emerald-800 text-xs block mb-1">
                🛡️ Immediate Safe Step (Gharelu Suraksha Upay):
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {triageResult.immediateHomeAction}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="font-extrabold text-red-800 text-xs block mb-1">
                🩺 Doctor Clinical Directive:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {triageResult.doctorAdvice}
              </p>
            </div>
          </div>

          {/* Emergency SOS contact actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:108"
                className="bg-red-700 hover:bg-red-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Ambulance 108</span>
              </a>

              <a
                href="tel:18001801104"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <span>Ayush Toll-Free 1800-180-1104</span>
              </a>
            </div>

            {onConsultDoctor && (
              <button
                type="button"
                onClick={onConsultDoctor}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Open Vaidya Prescription Cockpit</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
