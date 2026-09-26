import React, { useState } from 'react';
import { 
  Bot, Volume2, ShieldCheck, 
  Send, Mic, MicOff, RefreshCw, X, AlertTriangle, 
  Pill, Droplets, Sparkles, HeartPulse
} from 'lucide-react';
import { AyushCaseSheet } from '../../types/ayush';

interface SimpleAyushAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseSheet?: AyushCaseSheet | null;
  patientName?: string;
  language?: string;
  onNavigateToTab?: (tab: 'dashboard' | 'guide' | 'patient' | 'doctor' | 'compare' | 'hackathon') => void;
}

interface QuickSuggestion {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  queryHindi: string;
  queryEnglish: string;
  category: 'diet' | 'medicine' | 'pain' | 'water' | 'emergency';
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  spokenText?: string;
  timestamp: string;
  isUrgent?: boolean;
}

export const SimpleAyushAssistantModal: React.FC<SimpleAyushAssistantModalProps> = ({
  isOpen,
  onClose,
  caseSheet,
  patientName = 'Sunita Sharma',
  language = 'Hindi',
  onNavigateToTab,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Namaste ${patientName}! Main aapka Ayush Sathi hoon. Dawa lene ka samay, khana-peena, ya koi asuvidha ho to poochhein ya neeche diye gaye sujhav chunein.`,
      spokenText: `Namaste ${patientName}! Main aapka Ayush Sathi hoon. Dawa ya khane peene ka koi bhi sawaal ho, poochhein.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickButtons: QuickSuggestion[] = [
    {
      id: 'q1',
      icon: Sparkles,
      queryHindi: 'Ghutno ke dard me kya khayein aur kya parhez karein?',
      queryEnglish: 'What should I eat & avoid for joint pain? (Pathya-Apathya)',
      category: 'diet'
    },
    {
      id: 'q2',
      icon: Pill,
      queryHindi: 'Kashayam aur Vati lene ka sahi samay kya hai?',
      queryEnglish: 'What is the right time to take my Kashayam & herbal tablets?',
      category: 'medicine'
    },
    {
      id: 'q3',
      icon: Droplets,
      queryHindi: 'Dawa ke baad kitna garam paani peena chahiye?',
      queryEnglish: 'How much warm water should I drink after medicine?',
      category: 'water'
    },
    {
      id: 'q4',
      icon: AlertTriangle,
      queryHindi: 'Dawa khane ke baad pet me jalan ya ulti lage to kya karein?',
      queryEnglish: 'What to do if feeling nausea or burning after medicine?',
      category: 'emergency'
    }
  ];

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = language.toLowerCase().includes('hindi');
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.92;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: MessageItem = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/simple-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          patientName,
          language,
          caseSheetContext: caseSheet ? {
            diagnosis: caseSheet.clinicalAyushImpression?.diagnosisCandidate,
            pathya: caseSheet.ayushPathyaApathya?.pathyaAhara,
            apathya: caseSheet.ayushPathyaApathya?.apathyaAhara,
            prescriptions: caseSheet.prescriptions
          } : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: MessageItem = {
          id: 'res-' + Date.now(),
          sender: 'assistant',
          text: data.reply || data.text,
          spokenText: data.spokenReply || data.reply || data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUrgent: data.isUrgent
        };
        setMessages(prev => [...prev, assistantMsg]);
        speakText(assistantMsg.spokenText || assistantMsg.text);
      } else {
        throw new Error('Server returned error');
      }
    } catch (err) {
      const fallbackReply = query.includes('khayein') || query.includes('diet')
        ? 'Aapke jodon ke dard ke liye halke aur garam bhojan lene ki salah hai: moong dal, lahsun, adrak, aur saunth lena labhkari hai. Khatti cheezein, dahi, urad dal, baasi khana aur thanda paani bilkul mat lein.'
        : query.includes('samay') || query.includes('time')
        ? 'Kashayam subah aur shaam ko khane se 30 minute pehle gun-gune paani ke sath lein. Yogaraj Guggulu ki goli khane ke 30 minute baad garam paani se lein.'
        : query.includes('paani') || query.includes('water')
        ? 'Dawa ke baad hamesha aadha ya ek gilass kosa garam paani (Ushnodaka) peeyein. Thanda paani pachan agni ko manda kar deta hai.'
        : 'Aapki dawaiyan bilkul theek niyamit chal rahi hain. Agar koi asuvidha lage to dawai rok kar turant apne Ayush Vaidya se salah lein.';

      const fallbackMsg: MessageItem = {
        id: 'fb-' + Date.now(),
        sender: 'assistant',
        text: fallbackReply,
        spokenText: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
      speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceNotice('Voice recognition is not supported in this browser. Please type your question.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setInputText(speechToText);
      setIsRecording(false);
      handleSendMessage(speechToText);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden shadow-xl border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold tracking-tight text-white">
                  Ayush Sathi
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Clinical Voice Guide
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Spoken dietary pathya, dosage guidance & symptom clarifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }}
              title="Stop audio"
              className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                isSpeaking ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-500 shrink-0 mr-1">
            Suggestions:
          </span>
          {quickButtons.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSendMessage(q.queryHindi)}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <Icon className="w-3 h-3 text-slate-500" />
                <span className="truncate max-w-[200px]">{q.queryHindi}</span>
              </button>
            );
          })}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-md p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white'
                    : m.isUrgent
                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[10px] font-medium ${m.sender === 'user' ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {m.sender === 'user' ? 'You' : 'Ayush Sathi'}
                  </span>
                  {m.sender === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => speakText(m.spokenText || m.text)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Listen aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <p className="whitespace-pre-line">{m.text}</p>
                <span className="text-[10px] opacity-60 block text-right mt-1 font-mono">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200 w-fit text-xs text-slate-600">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Ayush Sathi is preparing guidance...</span>
            </div>
          )}
        </div>

        {voiceNotice && (
          <div className="px-4 py-1 text-xs text-amber-700 bg-amber-50 border-t border-amber-100">
            {voiceNotice}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleVoiceRecording}
              title="Speak query"
              className={`w-9 h-9 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question or speak your query..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-slate-400"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-9 h-9 rounded bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
