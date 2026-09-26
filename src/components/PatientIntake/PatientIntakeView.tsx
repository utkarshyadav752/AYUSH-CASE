import React, { useState } from 'react';
import { 
  User, Sparkles, Send, CheckCircle2, AlertTriangle, ShieldCheck, 
  HelpCircle, RefreshCw, FileText, ChevronRight, Stethoscope, HeartPulse, Clock, Volume2
} from 'lucide-react';
import { AyushSystem, PatientInfo, AyushCaseSheet, ConversationalMessage } from '../../types/ayush';
import { VoiceRecorder } from './VoiceRecorder';
import { PrakritiQuiz } from './PrakritiQuiz';
import { VisualInspectionGuide } from './VisualInspectionGuide';
import { ConversationalAssistant } from './ConversationalAssistant';
import { SamplePreset } from '../../data/sampleCases';
import { useLanguage } from '../../context/LanguageContext';

interface PatientIntakeViewProps {
  onCaseExtracted: (caseSheet: AyushCaseSheet) => void;
  selectedLanguage: string;
}

export const PatientIntakeView: React.FC<PatientIntakeViewProps> = ({
  onCaseExtracted,
  selectedLanguage,
}) => {
  const { t, speak } = useLanguage();
  const [selectedSystem, setSelectedSystem] = useState<AyushSystem>('Ayurveda');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    fullName: 'Ramesh Patel',
    age: 42,
    gender: 'Male',
    phone: '+91 98765 43210',
    abhaId: 'ABHA-14-9920-5541-8902',
    occupation: 'Self-employed',
    location: 'Ahmedabad, Gujarat',
    language: 'English / Hindi',
  });

  const [narrativeText, setNarrativeText] = useState<string>('');
  const [prakritiAnswers, setPrakritiAnswers] = useState<Record<string, 'vata' | 'pitta' | 'kapha'>>({
    build: 'pitta',
    skin: 'pitta',
    digestion: 'vata',
    thermal: 'vata',
    sleep: 'vata',
    mind: 'pitta',
  });
  const [selectedTongueState, setSelectedTongueState] = useState<string>('white-coating');

  const [messages, setMessages] = useState<ConversationalMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: 'Namaste! I am AyushVani, your patient intake assistant. You can record or type your symptoms freely in any language. Please feel free to share when your discomfort started, what makes it better or worse, and how your digestion and sleep are.',
      timestamp: 'Just now',
      quickReplies: [
        "Severe morning joint stiffness",
        "Burning stomach & acid reflux",
        "Skin rash worse at night",
        "Headaches in sunlight"
      ]
    }
  ]);

  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Preset Selection
  const handleSelectPreset = (preset: SamplePreset) => {
    setSelectedSystem(preset.system);
    setPatientInfo(preset.patientInfo);
    setNarrativeText(preset.narrative);

    // Add message
    setMessages((prev) => [
      ...prev,
      {
        id: `preset-${Date.now()}`,
        role: 'user',
        text: preset.narrative,
        timestamp: 'Just now'
      },
      {
        id: `ack-${Date.now()}`,
        role: 'assistant',
        text: `Thank you, ${preset.patientInfo.fullName}. I have recorded your detailed symptoms regarding ${preset.title}. Everything is ready for automated Ayush EHR structuring. You can click 'Analyze & Generate Ayush Case Sheet' below!`,
        timestamp: 'Just now',
        quickReplies: ["Review case sheet", "Add more details"]
      }
    ]);
  };

  // Conversational Assistant message send
  const handleSendMessage = async (text: string) => {
    const userMsg: ConversationalMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: text,
      timestamp: 'Just now'
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsAssistantLoading(true);

    // Also append to narrative if informative
    if (!narrativeText.includes(text)) {
      setNarrativeText((prev) => prev ? `${prev}\n\nAdditional Note: ${text}` : text);
    }

    try {
      const response = await fetch('/api/ask-clinical-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          currentComplaint: narrativeText || text,
          system: selectedSystem,
          language: selectedLanguage,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.assistantMessage,
          timestamp: 'Just now',
          quickReplies: data.suggestedQuickReplies || []
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: "I have saved your details. Could you also share how your appetite, thirst, and morning energy levels feel?",
          timestamp: 'Just now',
          quickReplies: ["Low appetite, sluggish", "Strong appetite, quick hunger", "Feeling exhausted in mornings"]
        }
      ]);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  // Submit and Extract Case
  const handleExtractCase = async () => {
    if (!narrativeText.trim()) {
      setErrorMessage("Please speak or enter your health complaints before generating the case sheet.");
      return;
    }

    setErrorMessage(null);
    setIsExtracting(true);

    try {
      // Build comprehensive narrative including Prakriti and Tongue hints
      const comprehensiveIntake = `
PATIENT RECORD:
Name: ${patientInfo.fullName}, Age: ${patientInfo.age}, Gender: ${patientInfo.gender}, Occupation: ${patientInfo.occupation}
Ayush System Requested: ${selectedSystem}

PATIENT PRIMARY NARRATIVE:
${narrativeText}

PRAKRITI SELF-ASSESSMENT:
Build: ${prakritiAnswers.build}, Skin: ${prakritiAnswers.skin}, Digestion: ${prakritiAnswers.digestion}, Thermal preference: ${prakritiAnswers.thermal}, Sleep: ${prakritiAnswers.sleep}, Mind: ${prakritiAnswers.mind}

JIHVA (TONGUE) SELF-CHECK:
Selected observation: ${selectedTongueState}
      `.trim();

      const response = await fetch('/api/extract-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narrative: comprehensiveIntake,
          system: selectedSystem,
          patientInfo: patientInfo,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const caseData: AyushCaseSheet = await response.json();
      caseData.patientInfo = patientInfo;
      caseData.rawTranscript = narrativeText;
      caseData.createdAt = new Date().toISOString();
      caseData.id = `CASE-${Date.now()}`;

      onCaseExtracted(caseData);
    } catch (err: any) {
      console.error("Extraction error:", err);
      setErrorMessage("Failed to process intake sheet. Please verify your connection or try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const speakIntakeInstructions = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = selectedLanguage.toLowerCase().includes('hindi');
    const text = isHindi
      ? 'Namaste! Apni bimari batane ke liye dahini taraf diye gaye bade mic button ko dabayein aur bolna shuru karein. Bolne ke baad peele button par click karein. Aapki bimari ka pura parcha apne aap ban jayega.'
      : 'Hello! To record your medical case, tap the big microphone button on the right and speak freely in your language. When finished, tap the button to generate your complete Ayush case sheet.';
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Top Banner Notice */}
      <div className="mb-6 p-4 rounded-lg bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <HeartPulse className="w-4 h-4 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-slate-900">
                {t.intakeTitle}
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">
                ABDM M1 · M2 · M3
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.intakeSubtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={speakIntakeInstructions}
            title="Listen how to use voice intake"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 border border-slate-200"
          >
            <Volume2 className="w-3.5 h-3.5 text-slate-600" />
            <span>{t.audioGuide}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Demographics & System Choice */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patient Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Patient Demographics</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                ABDM Verified
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={patientInfo.fullName}
                  onChange={(e) => setPatientInfo({ ...patientInfo, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-slate-50 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Age</label>
                  <input
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-slate-50 text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Gender</label>
                  <select
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-slate-50 text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  ABHA Health ID (Ayushman Bharat)
                </label>
                <input
                  type="text"
                  value={patientInfo.abhaId}
                  onChange={(e) => setPatientInfo({ ...patientInfo, abhaId: e.target.value })}
                  placeholder="ABHA-XX-XXXX-XXXX-XXXX"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-slate-50 text-slate-800 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Occupation</label>
                  <input
                    type="text"
                    value={patientInfo.occupation || ''}
                    onChange={(e) => setPatientInfo({ ...patientInfo, occupation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-slate-50 text-slate-800 text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Location</label>
                  <input
                    type="text"
                    value={patientInfo.location || ''}
                    onChange={(e) => setPatientInfo({ ...patientInfo, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-slate-50 text-slate-800 text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ayush System Selection */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-700" />
              <span>Target System of Ayush</span>
            </h3>
            <p className="text-[11px] text-slate-500 mb-3.5">
              Select your consultation discipline for system-specific clinical repertory rules:
            </p>

            <div className="space-y-2">
              {(['Ayurveda', 'Homeopathy', 'Unani', 'Siddha', 'Yoga & Naturopathy', 'Integrative Ayush'] as AyushSystem[]).map((sys) => (
                <button
                  key={sys}
                  type="button"
                  onClick={() => setSelectedSystem(sys)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedSystem === sys
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{sys}</span>
                  {selectedSystem === sys && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Intake Recorder, Scribe, and Prakriti */}
        <div className="lg:col-span-8 space-y-6">
          {/* Natural Voice Recorder & Transcript */}
          <VoiceRecorder
            onTranscriptUpdate={setNarrativeText}
            currentTranscript={narrativeText}
            selectedLanguage={selectedLanguage}
            onSelectPreset={handleSelectPreset}
          />

          {/* Conversational Assistant (AyushVani Scribe) */}
          <ConversationalAssistant
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isAssistantLoading}
            system={selectedSystem}
          />

          {/* Tongue Visual Inspection Guide */}
          <VisualInspectionGuide
            selectedTongueState={selectedTongueState}
            onSelectTongueState={setSelectedTongueState}
          />

          {/* Prakriti & Agni Assessment Quiz */}
          <PrakritiQuiz
            answers={prakritiAnswers}
            onAnswerChange={(qid, val) => setPrakritiAnswers({ ...prakritiAnswers, [qid]: val })}
          />

          {/* Error notice if any */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submission and Extraction Action */}
          <div className="bg-slate-900 rounded-lg p-5 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold">
                  Synthesize Ayush EHR Case Sheet
                </h4>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Structures narrative into Ashtavidha Pariksha, Agni, Tridosha balance, and ABDM FHIR R4 document.
              </p>
            </div>

            <button
              onClick={handleExtractCase}
              disabled={isExtracting}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.analyzingNarrative}</span>
                </>
              ) : (
                <>
                  <span>{t.generateCaseSheet}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
