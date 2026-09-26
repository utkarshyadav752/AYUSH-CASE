import React, { useState } from 'react';
import { 
  HeartPulse, Sparkles, CheckCircle2, AlertCircle, Volume2, 
  Calendar, Flame, TrendingDown, Clock, Smile, Meh, Frown, Plus
} from 'lucide-react';
import { DailySymptomLog } from '../../data/patientSymptomLogs';

interface DailySymptomLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLog: (log: DailySymptomLog) => void;
  patientName?: string;
  language?: string;
}

export const DailySymptomLoggerModal: React.FC<DailySymptomLoggerModalProps> = ({
  isOpen,
  onClose,
  onSaveLog,
  patientName = 'Sunita Sharma',
  language = 'Hindi',
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [severity, setSeverity] = useState<number>(3); // 1-10
  const [stiffnessMinutes, setStiffnessMinutes] = useState<number>(15);
  const [digestiveState, setDigestiveState] = useState<'Good (Sama Agni)' | 'Mild Bloating' | 'Severe Acidity/Gas'>('Good (Sama Agni)');
  const [energyLevel, setEnergyLevel] = useState<'High' | 'Moderate' | 'Low/Fatigued'>('High');
  const [notes, setNotes] = useState<string>('Joint stiffness resolved after warm ginger water. Digestion feels light.');
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type or move the slider.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNotes(prev => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.start();
  };

  const speakDosePrompt = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = language.toLowerCase().includes('hindi');
    const text = isHindi
      ? `Aap aaj kaisa mehsoos kar rahe hain? 1 se 10 ke paimane par apna dard chuniye. 1 ka matlab koi dard nahi, aur 10 ka matlab bohot tezz dard.`
      : `How are you feeling today? Rate your symptom severity from 1 to 10, where 1 is pain-free and 10 is severe discomfort.`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailySymptomLog = {
      id: `log-${Date.now()}`,
      date,
      severity,
      jointStiffnessMinutes: Number(stiffnessMinutes),
      digestiveState,
      energyLevel,
      notes,
      loggedAt: new Date().toISOString()
    };
    onSaveLog(newLog);
    onClose();
  };

  const getSeverityColor = (val: number) => {
    if (val <= 3) return 'bg-emerald-500 text-white';
    if (val <= 6) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getSeverityDescriptor = (val: number) => {
    if (val <= 2) return { text: 'Minimal / Remission (Aasan / Shanta)', emoji: '😊' };
    if (val <= 4) return { text: 'Mild Discomfort (Halka dard)', emoji: '🙂' };
    if (val <= 6) return { text: 'Moderate Pain (Madhyama takleef)', emoji: '😐' };
    if (val <= 8) return { text: 'Significant Distress (Zyada dard)', emoji: '😟' };
    return { text: 'Severe / Acute Exacerbation (Asahaneey dard)', emoji: '😫' };
  };

  const descriptor = getSeverityDescriptor(severity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Top Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Log Daily Symptom Severity
              </h3>
              <p className="text-[11px] text-emerald-200">
                Patient: {patientName} • Persisting to Longitudinal Profile
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={speakDosePrompt}
            title="Listen Prompt"
            className="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Log Entry Date:</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-slate-50 font-medium"
            />
          </div>

          {/* 1-10 Severity Slider with Visual High-Contrast Indicator */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  Symptom Severity (VAS 1 to 10 Scale)
                </span>
                <span className="text-[11px] text-slate-500">
                  Dard aur takleef ka paimāna chuniye:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{descriptor.emoji}</span>
                <span className={`text-sm font-black px-3 py-1 rounded-xl shadow-xs ${getSeverityColor(severity)}`}>
                  {severity} / 10
                </span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />

            {/* 1-10 Pill Chips for Fast 1-Touch Selection */}
            <div className="grid grid-cols-10 gap-1 pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSeverity(num)}
                  className={`py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    Math.round(severity) === num
                      ? 'bg-slate-900 text-white scale-110 shadow-sm'
                      : num <= 3
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : num <= 6
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="text-center pt-1">
              <span className="text-xs font-bold text-slate-700">
                {descriptor.text}
              </span>
            </div>
          </div>

          {/* Morning Stiffness Minutes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Morning Stiffness (Minutes):</span>
              </label>
              <input
                type="number"
                min={0}
                max={300}
                value={stiffnessMinutes}
                onChange={(e) => setStiffnessMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white font-bold"
              />
            </div>

            {/* Digestion / Agni */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Digestive State (Agni):</span>
              </label>
              <select
                value={digestiveState}
                onChange={(e) => setDigestiveState(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white font-medium cursor-pointer"
              >
                <option value="Good (Sama Agni)">Good (Sama Agni)</option>
                <option value="Mild Bloating">Mild Bloating / Sluggish</option>
                <option value="Severe Acidity/Gas">Severe Acidity / Gas</option>
              </select>
            </div>
          </div>

          {/* Notes with Voice Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Patient Notes & Observations:
              </label>
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                <Volume2 className="w-3 h-3" />
                <span>{isRecording ? 'Listening...' : 'Dictate in Voice'}</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Aaj kaisa mehsoos hua, dawa ka asar kaisa raha..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${typeof navigator !== 'undefined' && !navigator.onLine ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>
                {typeof navigator !== 'undefined' && !navigator.onLine
                  ? 'Offline: Will cache safely on device'
                  : 'Online: Direct sync to EHR'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Update Recovery Trends</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
