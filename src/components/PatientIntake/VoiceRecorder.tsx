import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Play, Pause, Sparkles, Volume2, RotateCcw, AlertCircle, FileText } from 'lucide-react';
import { SAMPLE_CASES, SamplePreset } from '../../data/sampleCases';

interface VoiceRecorderProps {
  onTranscriptUpdate: (text: string) => void;
  currentTranscript: string;
  selectedLanguage: string;
  onSelectPreset?: (preset: SamplePreset) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptUpdate,
  currentTranscript,
  selectedLanguage,
  onSelectPreset,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState<number[]>([12, 24, 38, 55, 30, 20, 45, 60, 25, 15]);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const waveIntervalRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      // Set language code based on selected language
      let langCode = 'en-IN';
      if (selectedLanguage === 'Hindi') langCode = 'hi-IN';
      else if (selectedLanguage === 'Tamil') langCode = 'ta-IN';
      else if (selectedLanguage === 'Marathi') langCode = 'mr-IN';
      else if (selectedLanguage === 'Bengali') langCode = 'bn-IN';
      else if (selectedLanguage === 'Telugu') langCode = 'te-IN';
      else if (selectedLanguage === 'Hinglish') langCode = 'hi-IN';

      recognition.lang = langCode;

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTrans) {
          onTranscriptUpdate(currentTranscript ? `${currentTranscript.trim()} ${finalTrans.trim()}` : finalTrans.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setIsRecording(false);
        }
      };

      recognition.onend = () => {
        if (isRecording && !isPaused) {
          try {
            recognition.start();
          } catch (e) {
            // Already started or finished
          }
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition init error:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      clearInterval(timerRef.current);
      clearInterval(waveIntervalRef.current);
    };
  }, [selectedLanguage, isRecording, isPaused, currentTranscript]);

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingSeconds(0);

    // Audio level wave animation
    waveIntervalRef.current = setInterval(() => {
      setAudioLevel(Array.from({ length: 14 }, () => Math.floor(Math.random() * 65) + 10));
    }, 120);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start exception:', err);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(timerRef.current);
    clearInterval(waveIntervalRef.current);
    setAudioLevel([12, 20, 15, 25, 10, 18, 12, 16, 20, 15]);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    } else {
      setIsPaused(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Mic className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Spoken Medical Case Intake (Natural Voice)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Speak comfortably in Hindi, Hinglish, English, or regional language. Describe symptoms, onset, food triggers, and sleep.
          </p>
        </div>

        {/* Quick test presets badge */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-medium text-slate-700">Quick Test Cases:</span>
        </div>
      </div>

      {/* Preset Buttons for Quick Evaluator Testing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
        {SAMPLE_CASES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset?.(preset)}
            className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-semibold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                  {preset.system}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  {preset.audioDurationHint}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-800 line-clamp-1 group-hover:text-emerald-900">
                {preset.title}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
              Load realistic patient case
            </span>
          </button>
        ))}
      </div>

      {/* Live Voice Recording Console */}
      <div className="bg-slate-900 rounded-xl p-5 text-white shadow-inner mb-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status & Timer */}
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                isRecording
                  ? isPaused
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-red-500 animate-ping'
                  : 'bg-slate-600'
              }`}
            ></div>
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                {isRecording ? (isPaused ? 'Paused' : 'Listening & Transcribing...') : 'Ready for Audio Dictation'}
              </div>
              <div className="text-xl font-mono font-bold text-white tracking-tight">
                {formatTime(recordingSeconds)}
              </div>
            </div>
          </div>

          {/* Simulated / Live Waveform */}
          <div className="flex items-center gap-1 h-9 px-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex-1 max-w-xs justify-center">
            {audioLevel.map((height, idx) => (
              <span
                key={idx}
                className={`w-1 rounded-full transition-all duration-100 ${
                  isRecording && !isPaused
                    ? 'bg-gradient-to-t from-emerald-500 to-amber-300'
                    : 'bg-slate-600'
                }`}
                style={{ height: `${isRecording && !isPaused ? Math.max(height, 8) : 6}px` }}
              ></span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/40 transition-all transform active:scale-95 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Start Speaking</span>
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-red-950/40 transition-all cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop & Process</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Browser Speech API notice if needed */}
        {!speechSupported && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>
              Voice dictation uses Web Speech API. You can also paste or type your symptoms directly in the text area below.
            </span>
          </div>
        )}
      </div>

      {/* Transcribed Text Area (Editable by Patient) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <span>Patient Narrative Transcript</span>
            <span className="text-[11px] font-normal text-slate-400">
              (You can freely edit or type additional health details)
            </span>
          </label>
          {currentTranscript && (
            <button
              onClick={() => onTranscriptUpdate('')}
              className="text-[11px] text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear Text
            </button>
          )}
        </div>
        <textarea
          rows={5}
          value={currentTranscript}
          onChange={(e) => onTranscriptUpdate(e.target.value)}
          placeholder="Tap 'Start Speaking' or load a quick test case above. Describe your complaints, how long they have persisted, what makes them better or worse, your digestion, sleep, and lifestyle habits..."
          className="w-full text-xs leading-relaxed p-3.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50/60 placeholder-slate-400 transition-all text-slate-800"
        ></textarea>
      </div>
    </div>
  );
};
