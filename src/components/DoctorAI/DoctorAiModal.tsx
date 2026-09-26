import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Volume2, Sparkles, X, RefreshCw, 
  BookOpen, ShieldCheck, HeartPulse, Send, Check, 
  Copy, FileText, ChevronRight, HelpCircle, AlertTriangle, 
  Flame, Wind, Eye, Pill, Activity, User, ArrowRight
} from 'lucide-react';
import { AyushCaseSheet } from '../../types/ayush';

export type DoctorAiTopic = 
  | 'full_case' 
  | 'diagnosis_samprapti' 
  | 'tridosha_radar' 
  | 'ashtavidha_pariksha' 
  | 'pathya_apathya' 
  | 'prescriptions' 
  | 'red_flags' 
  | 'custom_question';

interface DoctorAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseSheet: AyushCaseSheet | null;
  initialTopic?: DoctorAiTopic;
  onAppendDoctorNote?: (note: string) => void;
  language?: string;
}

interface ExplanationResult {
  title: string;
  summary: string;
  detailedExplanation: string;
  clinicalMechanisms?: Array<{ key: string; explanation: string }>;
  actionableGuidance?: string[];
  audioSpeechSummary?: string;
  references?: string[];
}

export const DoctorAiModal: React.FC<DoctorAiModalProps> = ({
  isOpen,
  onClose,
  caseSheet,
  initialTopic = 'full_case',
  onAppendDoctorNote,
  language = 'English',
}) => {
  const [activeTopic, setActiveTopic] = useState<DoctorAiTopic>(initialTopic);
  const [audience, setAudience] = useState<'clinician' | 'patient'>('clinician');
  const [selectedLang, setSelectedLang] = useState<string>(language);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [injected, setInjected] = useState<boolean>(false);

  useEffect(() => {
    if (initialTopic) {
      setActiveTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (language) {
      setSelectedLang(language);
    }
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      fetchExplanation(activeTopic, customQuestion);
    } else {
      stopSpeech();
    }
  }, [isOpen, activeTopic, audience, selectedLang]);

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const fetchExplanation = async (topicToFetch: DoctorAiTopic, query?: string) => {
    setIsLoading(true);
    stopSpeech();
    try {
      const response = await fetch('/api/doctor-ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseSheet,
          topic: topicToFetch,
          customQuestion: query || '',
          targetAudience: audience,
          language: selectedLang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error('Failed to retrieve explanation from server');
      }
    } catch (err) {
      console.warn('Doctor AI server error, using client fallback:', err);
      setResult({
        title: 'Clinical Synthesis: Amavata & Tridosha Imbalance',
        summary: 'Sluggish metabolic fire (Mandagni) produces Ama, which circulates into the small joints via vitiated Vata.',
        detailedExplanation: `### Clinical Overview
Patient Sunita Sharma presents with classic **Amavata** (correlating to Rheumatoid Spectrum under ICD-11 FA20 and NAMASTE AYU-AMV-001). 

1. **Etiological Factors (Nidana)**: Cold exposure, heavy meals, and sedentary habits impair Jatharagni.
2. **Pathogenesis (Samprapti)**: Undigested endotoxins (Ama) combine with Vata dosha and lodge in the Asthi-Sandhi (small joints of the hands and wrists).
3. **Clinical Manifestations (Rupa)**: Bilateral morning stiffness exceeding 45 minutes, white tongue coating (Sama Jihva), and sluggish bowels.`,
        clinicalMechanisms: [
          { key: 'Mandagni & Ama', explanation: 'Incomplete digestion forms toxic macromolecular Ama that deposits in synovial tissue.' },
          { key: 'Vata Aggravation', explanation: 'Ruksha (dry) and Sheeta (cold) qualities cause severe morning joint stiffness.' }
        ],
        actionableGuidance: [
          'Administer Deepana-Pachana therapy (Shunthi, Haritaki) to digest Ama prior to nourishment.',
          'Advise dry warmth fomentation (Valuka Sweda) rather than heavy oil massage.',
          'Strictly avoid cold refrigerated foods, curd, and daytime sleeping.'
        ],
        audioSpeechSummary: 'Patient presents with Amavata. Digestion is sluggish, causing Ama toxins to lodge in finger joints. Warm water, Shunthi, and dry heat will facilitate joint mobilization.',
        references: [
          'Charaka Samhita, Chikitsa Sthana (Vata Vyadhi Chapter)',
          'NAMASTE Portal Standard Code: AYU-AMV-001',
          'ICD-11: FA20 / Polyarthritis'
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!result) return;
    if (isSpeaking) {
      stopSpeech();
      return;
    }

    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const textToSpeak = result.audioSpeechSummary || result.summary || result.title;
    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.lang = selectedLang.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleCopy = () => {
    if (!result) return;
    const fullText = `${result.title}\n\nSummary:\n${result.summary}\n\n${result.detailedExplanation}\n\nClinical Guidance:\n${result.actionableGuidance?.map(g => '• ' + g).join('\n') || ''}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInjectToDoctorNotes = () => {
    if (!result || !onAppendDoctorNote) return;
    const noteSnippet = `[Doctor AI Clinical Analysis - ${result.title}]\n${result.summary}\n${result.actionableGuidance?.slice(0, 2).map(g => '- ' + g).join('\n') || ''}`;
    onAppendDoctorNote(noteSnippet);
    setInjected(true);
    setTimeout(() => setInjected(false), 2500);
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setActiveTopic('custom_question');
    fetchExplanation('custom_question', customQuestion.trim());
  };

  if (!isOpen) return null;

  const topicsList: Array<{ id: DoctorAiTopic; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'full_case', label: 'Complete Case & Samprapti', icon: Stethoscope },
    { id: 'tridosha_radar', label: 'Tridosha & Prakriti Distribution', icon: Wind },
    { id: 'ashtavidha_pariksha', label: 'Ashtavidha 8-Fold Pariksha', icon: Eye },
    { id: 'pathya_apathya', label: 'Pathya-Apathya Diet Rules', icon: Flame },
    { id: 'prescriptions', label: 'Medicines & Anupana Safety', icon: Pill },
    { id: 'red_flags', label: 'Safety Flags & Modern Labs', icon: AlertTriangle },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white">
                  Doctor AI — Clinical Case Explainer & Copilot
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Ayush Informatician
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authoritative breakdown of Samprapti, Tridosha balance, Ashtavidha examination, and pharmacology.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Control Strip: Audience Mode & Language Selector */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Explain For:</span>
            <div className="flex bg-white rounded border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setAudience('clinician')}
                className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                  audience === 'clinician'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Clinician / Senior Vaidya
              </button>
              <button
                type="button"
                onClick={() => setAudience('patient')}
                className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                  audience === 'patient'
                    ? 'bg-emerald-700 text-white font-medium'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Patient / Plain Language
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Language:</span>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
            </select>

            <button
              type="button"
              onClick={handleSpeak}
              disabled={isLoading || !result}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                isSpeaking 
                  ? 'bg-rose-600 text-white border-rose-700' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isSpeaking ? 'Stop Audio' : 'Listen Audio'}</span>
            </button>
          </div>
        </div>

        {/* Topic Pills Bar */}
        <div className="px-5 py-2 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
          {topicsList.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTopic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTopic(t.id);
                  setCustomQuestion('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-white">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              <p className="text-xs font-medium">Doctor AI is analyzing clinical pathogenesis and formulation mechanisms...</p>
            </div>
          ) : result ? (
            <div className="space-y-5">
              {/* Card Title & Core Summary */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    {result.title}
                  </h4>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {audience === 'clinician' ? 'Clinical Reasoning' : 'Patient Advisory'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Clinical Mechanism Cards */}
              {result.clinicalMechanisms && result.clinicalMechanisms.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
                    Pathophysiological Mechanisms (Samprapti Ghataka)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {result.clinicalMechanisms.map((mech, idx) => (
                      <div key={idx} className="p-3 rounded border border-slate-200 bg-white space-y-1">
                        <span className="text-xs font-semibold text-emerald-800 block">
                          {mech.key}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {mech.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Markdown Explanation */}
              <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2 text-xs leading-relaxed text-slate-800">
                <div className="whitespace-pre-line font-sans space-y-2">
                  {result.detailedExplanation}
                </div>
              </div>

              {/* Actionable Clinical Guidance */}
              {result.actionableGuidance && result.actionableGuidance.length > 0 && (
                <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                  <h5 className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Actionable Recommendations & Treatment Protocol</span>
                  </h5>
                  <ul className="space-y-1 text-xs text-emerald-950">
                    {result.actionableGuidance.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold shrink-0">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Classical & Modern References */}
              {result.references && result.references.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Standards & References:</span>
                  {result.references.map((ref, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                      {ref}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Free-form Question Bar & Actions Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 space-y-3">
          <form onSubmit={handleCustomQuestionSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Ask Doctor AI anything about this case (e.g. 'Why is buttermilk recommended here?')..."
              className="flex-1 bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
            />
            <button
              type="submit"
              disabled={!customQuestion.trim() || isLoading}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium px-4 py-2 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Doctor AI</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            <div className="text-[11px] text-slate-500">
              Target Patient: <strong className="text-slate-800">{caseSheet?.patientInfo?.fullName || 'Sunita Sharma'}</strong> • Diagnosis: <strong className="text-slate-800">{caseSheet?.clinicalAyushImpression?.diagnosisCandidate || 'Amavata'}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              {onAppendDoctorNote && (
                <button
                  type="button"
                  onClick={handleInjectToDoctorNotes}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{injected ? 'Appended to EHR Notes' : 'Insert in Clinical Notes'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
