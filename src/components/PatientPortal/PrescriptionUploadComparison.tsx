import React, { useState } from 'react';
import { 
  Upload, FileText, Sparkles, CheckCircle2, ArrowRight, 
  Eye, RefreshCw, AlertCircle, Calendar, User, Pill, Volume2, 
  Check, ArrowUpRight, Clock, ShieldCheck
} from 'lucide-react';

interface PrescriptionUploadProps {
  onPrescriptionParsed?: (parsedData: any) => void;
  onUpdateCaseSheetPrescriptions?: (newPrescriptions: string[], fullParsed: any) => void;
  language?: string;
}

export const PrescriptionUploadComparison: React.FC<PrescriptionUploadProps> = ({
  onPrescriptionParsed,
  onUpdateCaseSheetPrescriptions,
  language = 'Hindi',
}) => {
  const [latestImage, setLatestImage] = useState<string | null>(null);
  const [oldImage, setOldImage] = useState<string | null>(null);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [loadingOld, setLoadingOld] = useState(false);
  const [latestParsed, setLatestParsed] = useState<any | null>(null);
  const [oldParsed, setOldParsed] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'latest' | 'old' | 'comparison'>('latest');
  const [scheduleUpdatedToast, setScheduleUpdatedToast] = useState<string | null>(null);

  // Handle image upload from camera or file picker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'latest' | 'old') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      if (type === 'latest') {
        setLatestImage(base64);
        processPrescription(base64, 'latest');
      } else {
        setOldImage(base64);
        processPrescription(base64, 'old');
      }
    };
    reader.readAsDataURL(file);
  };

  const processPrescription = async (base64: string, type: 'latest' | 'old') => {
    if (type === 'latest') setLoadingLatest(true);
    else setLoadingOld(true);

    try {
      const response = await fetch('/api/parse-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          prescriptionType: type,
        }),
      });
      const data = await response.json();
      if (type === 'latest') {
        setLatestParsed(data);
        if (onPrescriptionParsed) {
          onPrescriptionParsed(data);
        }
        // Auto update schedule and case records
        syncScheduleFromParsed(data);
      } else {
        setOldParsed(data);
      }
    } catch (err) {
      console.error('Failed to parse prescription:', err);
    } finally {
      if (type === 'latest') setLoadingLatest(false);
      else setLoadingOld(false);
    }
  };

  const syncScheduleFromParsed = (data: any) => {
    if (!data.medicines || data.medicines.length === 0) return;
    const formattedRxList: string[] = data.medicines.map((m: any) => 
      `${m.name} (${m.form}) - ${m.dosage}, ${m.timing} with ${m.anupana || 'lukewarm water'}`
    );

    if (onUpdateCaseSheetPrescriptions) {
      onUpdateCaseSheetPrescriptions(formattedRxList, data);
    }

    setScheduleUpdatedToast(`Medication schedule and alarms updated with ${data.medicines.length} medicines from the prescription!`);
    setTimeout(() => setScheduleUpdatedToast(null), 5000);
  };

  // Demo loader for instantaneous testing
  const loadDemoPrescription = () => {
    const sample = {
      doctorName: "Dr. Vaidya K. S. Sharma (MD Ayur, Ph.D)",
      date: new Date().toISOString().split('T')[0],
      system: "Ayurveda",
      diagnosis: "Amavata (Rheumatoid joint stiffness) with Mandagni & Sama Dosha",
      medicines: [
        {
          name: "Kaishore Guggulu",
          form: "Tablet",
          dosage: "2 tablets (500mg each)",
          timing: "Twice daily after food",
          timeOfDay: ["morning", "night"],
          anupana: "Lukewarm water",
          visualIcon: "pill",
          pillColor: "#059669"
        },
        {
          name: "Dashamoola Kwatha",
          form: "Liquid Decoction",
          dosage: "20 ml with 40 ml warm water",
          timing: "Morning on empty stomach",
          timeOfDay: ["morning"],
          anupana: "Lukewarm water",
          visualIcon: "liquid",
          pillColor: "#d97706"
        },
        {
          name: "Ashwagandha Churna",
          form: "Powder",
          dosage: "1 teaspoon (3g - 5g)",
          timing: "Night before bed",
          timeOfDay: ["night"],
          anupana: "Warm milk or warm water",
          visualIcon: "powder",
          pillColor: "#4f46e5"
        }
      ],
      dietaryAdvice: "Drink warm water only (Ushnodaka), strictly avoid cold refrigerated curds and heavy fermented bakery items.",
      simplifiedExplanation: "Subah khane se pehle 4 chammach Dashamoola kwatha gungune paani me milakar pijiye. Khane ke baad 2 goli Kaishore Guggulu lein. Raat ko sone se pehle 1 chammach Ashwagandha churna gungune doodh se lein."
    };
    setLatestParsed(sample);
    if (onPrescriptionParsed) onPrescriptionParsed(sample);
    syncScheduleFromParsed(sample);
  };

  const speakExplanation = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-7 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Upload className="w-3 h-3 text-emerald-700" />
              Prescription OCR & Vision Reader
            </span>
            <span className="text-slate-500 text-xs font-semibold">Gemini 3.8 Multimodal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Paper Prescription Scanner & Auto-Scheduler
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Take a photo of paper doctor slips. AI extracts structured medicines, syncs your daily alarm schedule, and generates spoken guides.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDemoPrescription}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Load & Scan Sample Prescription</span>
        </button>
      </div>

      {scheduleUpdatedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{scheduleUpdatedToast}</span>
          </div>
          <span className="bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase">
            Schedule Synced
          </span>
        </div>
      )}

      {/* Upload Boxes: Latest vs Old Prescription */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Box 1: Latest Prescription */}
        <div className="p-5 rounded-3xl border-2 border-emerald-200 bg-emerald-50/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                Latest Prescription (Naya Parcha)
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Active Schedule Source
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Snap a clear photo of your latest doctor prescription slip. AI will parse medicines, dosages, and sync medication alarms.
            </p>

            {latestImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-300 max-h-48 bg-slate-900 group">
                <img src={latestImage} alt="Latest Rx" className="w-full h-48 object-cover opacity-90" />
                <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[10px] px-2.5 py-1 rounded-md font-bold">
                  ✓ Prescription Uploaded
                </span>
                <label className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer shadow-xs">
                  Re-take Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleFileUpload(e, 'latest')}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-emerald-50/50">
                <Upload className="w-8 h-8 text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-slate-900">Click to Upload or Snap Photo</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Supports JPG, PNG, mobile camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileUpload(e, 'latest')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {loadingLatest && (
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Scanning handwriting & formulations with Gemini Vision...</span>
            </div>
          )}
        </div>

        {/* Box 2: Old / Previous Prescription */}
        <div className="p-5 rounded-3xl border-2 border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Old Prescription (Purana Parcha)
              </span>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                Comparison & History
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Upload past doctor slips to compare dosage adjustments and check if old medicines were discontinued.
            </p>

            {oldImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 max-h-48 bg-slate-900">
                <img src={oldImage} alt="Old Rx" className="w-full h-48 object-cover opacity-90" />
                <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[10px] px-2 py-0.5 rounded-md">
                  Old Prescription Uploaded
                </span>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-100">
                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-xs font-bold text-slate-900">Upload Old Doctor Slip</span>
                <span className="text-[10px] text-slate-500 mt-0.5">To detect changed or stopped medicines</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'old')}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Extracted Structured Records & Schedule Update Confirmation */}
      {latestParsed && (
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  Digital Structured Record Generated
                </span>
                <span className="text-xs text-slate-500">• Synced with Dose Alarms</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                {latestParsed.doctorName} • {latestParsed.diagnosis}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {latestParsed.simplifiedExplanation && (
                <button
                  type="button"
                  onClick={() => speakExplanation(latestParsed.simplifiedExplanation)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Awaaz Me Sunein</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => syncScheduleFromParsed(latestParsed)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Re-apply to Schedule</span>
              </button>
            </div>
          </div>

          {/* Simple Explanation banner with audio-ready guidance */}
          {latestParsed.simplifiedExplanation && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 leading-relaxed font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong className="text-amber-900 block font-bold mb-1">
                  📢 Saral Bhasha Me Samjhein (Easy Dose Instructions):
                </strong>
                {latestParsed.simplifiedExplanation}
              </div>
              <button
                type="button"
                onClick={() => speakExplanation(latestParsed.simplifiedExplanation)}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Awaaz Me Sunein</span>
              </button>
            </div>
          )}

          {/* Extracted Structured Medicines Grid */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              Extracted Prescribed Medicines ({latestParsed.medicines?.length || 0}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {latestParsed.medicines?.map((med: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{med.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {med.form}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800 font-bold">
                    Dose: {med.dosage}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    When: {med.timing}
                  </div>
                  <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                    Carrier (Anupana): {med.anupana || 'Lukewarm water'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
