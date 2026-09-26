import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, FileText, Download, Printer, ShieldCheck, AlertCircle, 
  Sparkles, CheckCircle2, ChevronDown, ChevronUp, Copy, Check, Plus, 
  Trash2, Flame, Wind, Droplets, HeartPulse, Brain, Activity, User, FileDown, Eye,
  Smartphone, Footprints, Watch, Moon, RefreshCw
} from 'lucide-react';
import { AyushCaseSheet, PhoneHealthMetrics } from '../../types/ayush';
import { exportCaseToPrintableHtml } from '../../utils/pdfExport';
import { getLocalHealthMetrics, fetchHealthMetricsFromServer } from '../../services/phoneHealthService';
import { useLanguage } from '../../context/LanguageContext';

interface DoctorCockpitViewProps {
  caseSheet: AyushCaseSheet | null;
  onNewIntakeRequest: () => void;
  externalPrescriptions?: string[];
  onOpenFormulary?: () => void;
  onOpenDoctorAi?: (topic?: string) => void;
  onOpenHealthTracker?: () => void;
}

export const DoctorCockpitView: React.FC<DoctorCockpitViewProps> = ({
  caseSheet,
  onNewIntakeRequest,
  externalPrescriptions,
  onOpenFormulary,
  onOpenDoctorAi,
  onOpenHealthTracker,
}) => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'sheet' | 'fhir' | 'prescription' | 'activity'>('sheet');
  const [fhirData, setFhirData] = useState<any>(null);
  const [isGeneratingFhir, setIsGeneratingFhir] = useState(false);
  const [copiedFhir, setCopiedFhir] = useState(false);
  const [patientHealthMetrics, setPatientHealthMetrics] = useState<PhoneHealthMetrics>(() => {
    return caseSheet?.phoneHealthMetrics || getLocalHealthMetrics(caseSheet?.patientInfo?.phone || 'USR-PAT-001');
  });

  useEffect(() => {
    if (caseSheet?.patientInfo?.phone) {
      fetchHealthMetricsFromServer(caseSheet.patientInfo.phone).then(setPatientHealthMetrics);
    }
    const handleSync = (e: any) => {
      if (e.detail) {
        setPatientHealthMetrics(e.detail);
      }
    };
    window.addEventListener('ayush-health-sync', handleSync);
    return () => window.removeEventListener('ayush-health-sync', handleSync);
  }, [caseSheet]);

  const handleRefreshHealthMetrics = async () => {
    const updated = await fetchHealthMetricsFromServer(caseSheet?.patientInfo?.phone || 'USR-PAT-001');
    setPatientHealthMetrics(updated);
  };

  const handleAddActivityPrescription = () => {
    const rx = `Dinacharya Vihara: Target ${patientHealthMetrics.stepGoal} steps daily (gentle walking); mandatory 100 paces Shatapadi post meals for Agni; Avoid sedentary morning hours.`;
    if (!prescriptions.includes(rx)) {
      setPrescriptions([...prescriptions, rx]);
    }
  };

  // Doctor custom prescription state
  const [prescriptions, setPrescriptions] = useState<string[]>([
    'Simhanada Guggulu 2 tabs twice daily after food with warm water',
    'Dashamoola Kwatha 20 ml with 40 ml lukewarm water before meals',
    'Gandharvahastadi Kashaya 15 ml morning on empty stomach'
  ]);

  // Sync external prescriptions if passed
  React.useEffect(() => {
    if (externalPrescriptions && externalPrescriptions.length > 0) {
      setPrescriptions(prev => {
        const combined = [...prev];
        externalPrescriptions.forEach(p => {
          if (!combined.includes(p)) {
            combined.push(p);
          }
        });
        return combined;
      });
    }
  }, [externalPrescriptions]);
  const [newPrescription, setNewPrescription] = useState('');
  const [doctorNotes, setDoctorNotes] = useState(
    'Patient presents classic features of Amavata (Vata-Kapha vitiation with Ama). Advised to avoid heavy night meals and cold exposure. Review in 14 days with repeat ESR and CRP report.'
  );

  if (!caseSheet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          No Active Patient Case Record
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          To review an Ayush clinical case sheet, record a patient intake via the Voice Intake portal or load one of our realistic pre-configured clinical test cases.
        </p>
        <button
          onClick={onNewIntakeRequest}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
        >
          Open Patient Voice Intake
        </button>
      </div>
    );
  }

  const {
    patientSummary,
    systemOfAyush,
    patientInfo,
    chiefComplaints,
    doshaProfile,
    ashtavidhaPariksha,
    agniKoshtha,
    homeopathicUnaniGenerals,
    redFlags,
    ayushPathyaApathya,
    clinicalAyushImpression,
  } = caseSheet;

  // Generate FHIR Bundle
  const handleLoadFhir = async () => {
    setIsGeneratingFhir(true);
    try {
      const response = await fetch('/api/generate-fhir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData: caseSheet,
          patientInfo: patientInfo,
        }),
      });
      const data = await response.json();
      setFhirData(data);
      setActiveSubTab('fhir');
    } catch (err) {
      console.error('FHIR export error:', err);
    } finally {
      setIsGeneratingFhir(false);
    }
  };

  const handleCopyFhir = () => {
    if (!fhirData) return;
    navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
    setCopiedFhir(true);
    setTimeout(() => setCopiedFhir(false), 2000);
  };

  const handleDownloadFhir = () => {
    if (!fhirData) return;
    const blob = new Blob([JSON.stringify(fhirData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ABDM_AYUSH_CASE_${patientInfo?.fullName?.replace(/\s+/g, '_') || 'RECORD'}.json`;
    a.click();
  };

  // Direct 1-Click Structured FHIR JSON Export
  const handleDirectExportFhirJson = async () => {
    try {
      setIsGeneratingFhir(true);
      let payload = fhirData;
      if (!payload) {
        const response = await fetch('/api/generate-fhir', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseData: { ...caseSheet, prescriptions, doctorNotes },
            patientInfo: patientInfo,
          }),
        });
        payload = await response.json();
        setFhirData(payload);
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FHIR_R4_AYUSH_${patientInfo?.fullName?.replace(/\s+/g, '_') || 'RECORD'}_${Date.now()}.json`;
      a.click();
    } catch (err) {
      console.error('Failed to export FHIR JSON:', err);
    } finally {
      setIsGeneratingFhir(false);
    }
  };

  // Direct 1-Click Clinical PDF Export using formatted printable download
  const handleDirectExportPdf = () => {
    const html = exportCaseToPrintableHtml({
      ...caseSheet,
      prescriptions,
      doctorNotes,
    });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AYUSH_CASE_SHEET_${patientInfo?.fullName?.replace(/\s+/g, '_') || 'PATIENT'}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrescription.trim()) return;
    setPrescriptions([...prescriptions, newPrescription.trim()]);
    setNewPrescription('');
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
      {/* Clinician Action Bar */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-teal-800 text-white flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4 text-teal-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Vaidya Clinical Review & EHR Cockpit
              </h2>
              <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {systemOfAyush}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              AI-synthesized from patient spoken narrative, Prakriti self-check & Dinacharya observations
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Sub-tabs */}
          <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveSubTab('sheet')}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === 'sheet' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.subtabCaseSheet}
            </button>
            <button
              onClick={() => setActiveSubTab('prescription')}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === 'prescription' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.subtabChikitsa}
            </button>
            <button
              onClick={handleLoadFhir}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeSubTab === 'fhir' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.subtabFhir}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('activity')}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeSubTab === 'activity' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.subtabActivity}</span>
            </button>
          </div>

          {/* Quick Export Controls */}
          <div className="flex items-center flex-wrap gap-1.5">
            {onOpenHealthTracker && (
              <button
                type="button"
                onClick={onOpenHealthTracker}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium shadow-xs transition-colors cursor-pointer"
                title="Open Phone Health App & Pedometer Bridge"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.phoneSync}</span>
              </button>
            )}

            {onOpenDoctorAi && (
              <button
                type="button"
                onClick={() => onOpenDoctorAi('full_case')}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Explain case with Doctor AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.heroDoctorAiBtn}</span>
              </button>
            )}

            <button
              onClick={handleDirectExportPdf}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium shadow-xs transition-colors cursor-pointer"
              title="Save printable patient case sheet"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{t.exportPdf}</span>
            </button>

            <button
              onClick={handleDirectExportFhirJson}
              disabled={isGeneratingFhir}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-100 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium border border-slate-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Download structured FHIR R4 Bundle JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>{isGeneratingFhir ? 'Generating...' : t.exportFhir}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              title={t.directPrint}
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ABDM FHIR JSON View */}
      {activeSubTab === 'fhir' && fhirData && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-6 mb-6 font-mono text-xs shadow-xl print:hidden">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white">
                FHIR R4 Ayush Health Record Document Bundle (ABDM Standard)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyFhir}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer"
              >
                {copiedFhir ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFhir ? 'Copied!' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={handleDownloadFhir}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer font-sans font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON</span>
              </button>
            </div>
          </div>
          <pre className="max-h-96 overflow-y-auto p-4 bg-slate-950 rounded-xl text-[11px] text-emerald-300">
            {JSON.stringify(fhirData, null, 2)}
          </pre>
        </div>
      )}

      {/* Clinical Phone Health App & Activity Synchronization Panel */}
      {activeSubTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 mb-6 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Footprints className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Patient Phone Health App & Dinacharya Activity Audit
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {patientHealthMetrics.sourceApp}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Continuous hardware step tracking, post-meal Shatapadi pacing, and resting pulse correlation for Ayush diagnosis.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefreshHealthMetrics}
                className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 bg-slate-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Refresh latest sync"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Sync Now</span>
              </button>

              {onOpenHealthTracker && (
                <button
                  type="button"
                  onClick={onOpenHealthTracker}
                  className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Phone Pedometer</span>
                </button>
              )}
            </div>
          </div>

          {/* Vitals Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Today's Steps
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {patientHealthMetrics.stepsToday.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ {patientHealthMetrics.stepGoal}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block">
                {Math.round((patientHealthMetrics.stepsToday / patientHealthMetrics.stepGoal) * 100)}% of Dinacharya target
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Shatapadi (100 Paces)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {patientHealthMetrics.shatapadiPacesCount}
                </span>
                <span className="text-xs text-slate-500">/ 100 paces</span>
              </div>
              <span className="text-[11px] text-slate-600 block">
                {patientHealthMetrics.shatapadiPacesCount >= 100 ? '✓ Target achieved post meals' : 'Pending 100-pace digestive stroll'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Resting Pulse (Nadi)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {patientHealthMetrics.currentHeartRateBpm || patientHealthMetrics.restingHeartRateBpm}
                </span>
                <span className="text-xs text-slate-500">BPM</span>
              </div>
              <span className="text-[11px] text-slate-600 block">
                Matches Vata-Kapha Nadi wave
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Nidra (Sleep Duration)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {patientHealthMetrics.sleepHours}
                </span>
                <span className="text-xs text-slate-500">hrs</span>
              </div>
              <span className="text-[11px] text-slate-600 block">
                {patientHealthMetrics.deepSleepMinutes} min deep Ojas recovery
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Distance & Energy
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {patientHealthMetrics.distanceKm}
                </span>
                <span className="text-xs text-slate-500">km</span>
              </div>
              <span className="text-[11px] text-slate-600 block">
                {patientHealthMetrics.caloriesBurned} kcal · {patientHealthMetrics.activeMinutes} min active
              </span>
            </div>
          </div>

          {/* Clinical Ayush Guidance on Physical Activity */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Vaidya Clinical Assessment of Patient Activity
              </span>
              <span className="text-[11px] font-mono text-emerald-800">
                Prakriti: {doshaProfile?.dominantConstitution || 'Vata-Kapha'}
              </span>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              Patient exhibits steady adherence with {patientHealthMetrics.stepsToday.toLocaleString()} steps today. In {doshaProfile?.dominantConstitution || 'Vata-Kapha'} Amavata presentation, regular gentle walking warms the joints, dissolves metabolic Ama, and improves lymphatic micro-drainage without aggravating dry/rough Vata dosha. Shatapadi post-meal pacing is vital for stimulating Jatharagni.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAddActivityPrescription}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Dinacharya Physical Regimen to Patient Rx</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('prescription')}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Review Full Prescription (Rx)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Printable Clinical Ayush Case Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Printable Official Ayush Hospital Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              ॐ
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Government of India • Ministry of Ayush
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Standardized Ayush Clinical Case Record
              </h1>
              <p className="text-[11px] text-slate-500">
                Department of {systemOfAyush} • Electronic Health Record (EHR) v2.1
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs space-y-0.5 font-mono text-slate-600 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
            <div><span className="font-semibold text-slate-800">Case ID:</span> {caseSheet.id || 'AYUSH-2026-9041'}</div>
            <div><span className="font-semibold text-slate-800">Date:</span> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            <div><span className="font-semibold text-slate-800">ABHA ID:</span> {patientInfo?.abhaId || 'ABHA-91-8472-3091-2241'}</div>
          </div>
        </div>

        {/* Patient Identity Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name</span>
            <span className="font-bold text-slate-900 text-sm">{patientInfo?.fullName || 'Anonymous'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender</span>
            <span className="font-semibold text-slate-800">{patientInfo?.age} Yrs / {patientInfo?.gender}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone / Mobile</span>
            <span className="font-semibold text-slate-800 font-mono text-[11px]">{patientInfo?.phone || '+91 98XXX XXXXX'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Location</span>
            <span className="font-semibold text-slate-800">{patientInfo?.location || 'India'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Occupation</span>
            <span className="font-semibold text-slate-800">{patientInfo?.occupation || 'General'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Dominant Prakriti</span>
            <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px] inline-block">
              {doshaProfile?.dominantConstitution || 'Prakriti Balanced'}
            </span>
          </div>
        </div>

        {/* Red Flags & Clinical Safety Alert Box */}
        {redFlags && redFlags.length > 0 && (
          <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Clinical Triage Alert & Safety Flags (Allopathic & Ayush Watchlist)</span>
            </div>
            {redFlags.map((flag, idx) => (
              <div key={idx} className="text-slate-700 pl-6 space-y-0.5">
                <span className="font-semibold text-slate-900">
                  [{flag.riskLevel} Risk] {flag.title}:
                </span>{' '}
                <span>{flag.recommendation}</span>
              </div>
            ))}
          </div>
        )}

        {/* Section 1: Clinical Synthesis & Chief Complaints */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>Patient Presentation Summary</span>
              </h3>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-800">
                {patientSummary}
              </div>
            </div>

            {/* Chief Complaints Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Chief Complaints (Pradhana Vedana / Lakshana)
              </h3>
              <div className="space-y-2.5">
                {chiefComplaints?.map((cc, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">{cc.complaint}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                          Duration: {cc.duration}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          cc.severity >= 7 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Severity: {cc.severity}/10
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-800">Aggravating Factors:</span> {cc.aggravatingFactors || 'N/A'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Relieving Factors:</span> {cc.relievingFactors || 'N/A'}
                      </div>
                    </div>
                    {cc.associatedSymptoms && (
                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Associated:</span> {cc.associatedSymptoms}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 1 Right: Tridosha & Bio-energetic Radar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Tridosha Constitutional Profile</span>
                {onOpenDoctorAi && (
                  <button
                    type="button"
                    onClick={() => onOpenDoctorAi('tridosha_radar')}
                    className="text-[11px] font-medium text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Explain Doshas</span>
                  </button>
                )}
              </h3>

              {/* Visual Bars for Vata, Pitta, Kapha */}
              <div className="space-y-3 mb-4">
                {/* Vata */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-blue-800 flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5" /> Vata (Movement & Nervous system)
                    </span>
                    <span className="font-mono text-blue-900 font-bold">{doshaProfile?.vata || 40}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${doshaProfile?.vata || 40}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pitta */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-amber-800 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Pitta (Digestion & Transformation)
                    </span>
                    <span className="font-mono text-amber-900 font-bold">{doshaProfile?.pitta || 35}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${doshaProfile?.pitta || 35}%` }}
                    ></div>
                  </div>
                </div>

                {/* Kapha */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-emerald-800 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5" /> Kapha (Structure & Lubrication)
                    </span>
                    <span className="font-mono text-emerald-900 font-bold">{doshaProfile?.kapha || 25}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${doshaProfile?.kapha || 25}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900">
                <span className="font-bold">Dosha Analysis:</span> {doshaProfile?.analysis}
              </div>
            </div>

            {/* Agni & Koshtha Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                Agni & Koshtha (Digestive Matrix)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Agni Status:</span>
                  <span className="font-semibold text-slate-800">{agniKoshtha?.agniType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Koshtha (Bowel):</span>
                  <span className="font-semibold text-slate-800">{agniKoshtha?.koshthaType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Appetite:</span>
                  <span className="font-semibold text-slate-800">{agniKoshtha?.appetite}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nidra (Sleep):</span>
                  <span className="font-semibold text-slate-800">{agniKoshtha?.sleep}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Ashtavidha Pariksha (Eight-Fold Clinical Examination) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Ashtavidha Pariksha (Eight-Fold Clinical Examination)
            </h3>
            {onOpenDoctorAi && (
              <button
                type="button"
                onClick={() => onOpenDoctorAi('ashtavidha_pariksha')}
                className="text-[11px] font-medium text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Explain 8-Fold Examination</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">1. Nadi (Pulse)</span>
              <span className="font-semibold text-slate-800 text-[11px]">{ashtavidhaPariksha?.nadi}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">2. Jihva (Tongue)</span>
              <span className="font-semibold text-slate-800 text-[11px]">{ashtavidhaPariksha?.jihva}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">3. Mala (Bowel)</span>
              <span className="font-semibold text-slate-800 text-[11px]">{ashtavidhaPariksha?.mala}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">4. Mutra (Urine)</span>
              <span className="font-semibold text-slate-800 text-[11px]">{ashtavidhaPariksha?.mutra}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">5. Shabda (Voice)</span>
              <span className="font-semibold text-slate-800 text-[11px]">{ashtavidhaPariksha?.shabda}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">6. Sparsha (Touch/Skin)</span>
              <span className="font-semibold text-slate-800 text-[11px]">{ashtavidhaPariksha?.sparsha}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">7. Drik (Eyes)</span>
              <span className="font-semibold text-slate-800 text-[11px]">{ashtavidhaPariksha?.drik}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">8. Akriti (Build/Gait)</span>
              <span className="font-semibold text-slate-800 text-[11px]">{ashtavidhaPariksha?.akriti}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Homeopathy & Unani Modalities (Thermal, Cravings, Miasm, Mizaj) */}
        {(systemOfAyush === 'Homeopathy' || systemOfAyush === 'Unani' || systemOfAyush === 'Integrative Ayush') && (
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 text-xs space-y-3">
            <h3 className="font-bold text-purple-900 uppercase text-[11px] tracking-wider">
              {systemOfAyush === 'Homeopathy' ? 'Homeopathic Repertory Generals' : 'Unani Mizaj & Akhlat Matrix'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 block">Thermal Modality:</span>
                <span className="font-semibold text-slate-800">{homeopathicUnaniGenerals?.thermalState}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Food Cravings / Desires:</span>
                <span className="font-semibold text-slate-800">{homeopathicUnaniGenerals?.cravings}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Food Aversions:</span>
                <span className="font-semibold text-slate-800">{homeopathicUnaniGenerals?.aversions}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mental Generals:</span>
                <span className="font-semibold text-slate-800">{homeopathicUnaniGenerals?.mentalGenerals}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Miasmatic Tendency:</span>
                <span className="font-semibold text-slate-800">{homeopathicUnaniGenerals?.miasmaticTendency}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mizaj (Temperament):</span>
                <span className="font-semibold text-slate-800">{homeopathicUnaniGenerals?.mizaj}</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Ayurvedic Samprapti Ghataka & Clinical Impression */}
        <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 text-xs space-y-2">
          <h3 className="font-bold text-teal-950 uppercase text-[11px] tracking-wider">
            Clinical Ayush Diagnosis & Samprapti (Pathogenesis)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block">Provisional Diagnosis:</span>
              <span className="font-bold text-emerald-900 text-xs">
                {clinicalAyushImpression?.diagnosisCandidate}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Pathophysiology (Samprapti Ghataka):</span>
              <span className="text-slate-800">{clinicalAyushImpression?.sampraptiGhataka}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Dushya (Tissues affected):</span>
              <span className="font-semibold text-slate-800">{clinicalAyushImpression?.dushyaInvolved}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Srotas (Channels involved):</span>
              <span className="font-semibold text-slate-800">{clinicalAyushImpression?.srotasInvolved}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Pathya & Apathya (Diet & Lifestyle Regimen) */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            Pathya-Apathya Regimen (Dietary & Lifestyle Directives)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Wholesome (Pathya) */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pathya (Wholesome - Recommended)</span>
              </h4>
              <div className="space-y-2 text-[11px] text-slate-700">
                <div>
                  <span className="font-semibold text-emerald-950">Ahara (Diet):</span>
                  <ul className="list-disc list-inside mt-0.5 text-slate-600">
                    {ayushPathyaApathya?.pathyaAhara?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-emerald-950">Vihara (Lifestyle & Yoga):</span>
                  <ul className="list-disc list-inside mt-0.5 text-slate-600">
                    {ayushPathyaApathya?.pathyaVihara?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Unwholesome (Apathya) */}
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/50">
              <h4 className="font-bold text-red-900 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Apathya (Unwholesome - Strictly Avoid)</span>
              </h4>
              <div className="space-y-2 text-[11px] text-slate-700">
                <div>
                  <span className="font-semibold text-red-950">Ahara (Incompatible Foods):</span>
                  <ul className="list-disc list-inside mt-0.5 text-slate-600">
                    {ayushPathyaApathya?.apathyaAhara?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-red-950">Vihara (Harmful Habits):</span>
                  <ul className="list-disc list-inside mt-0.5 text-slate-600">
                    {ayushPathyaApathya?.apathyaVihara?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Vaidya Prescription & Digital Signature */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-emerald-700" />
              <span>Chikitsa Plan & Prescriptions (Rx)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Sign-off by Registered Ayush Practitioner
            </span>
          </div>

          {/* Prescription List */}
          <div className="space-y-2 mb-3">
            {prescriptions.map((rx, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-medium text-slate-800">
                  <span className="font-bold text-emerald-800 mr-2">Rx {idx + 1}:</span>
                  {rx}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePrescription(idx)}
                  className="text-slate-400 hover:text-red-600 transition-colors print:hidden cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Prescription Input (Hidden on Print) */}
          <form onSubmit={handleAddPrescription} className="flex gap-2 mb-2 print:hidden">
            <input
              type="text"
              value={newPrescription}
              onChange={(e) => setNewPrescription(e.target.value)}
              placeholder="Add Ayush formulation (e.g., Kaishore Guggulu 2 tabs TDS after food)..."
              className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 bg-slate-50 text-slate-800"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Rx</span>
            </button>
          </form>

          {onOpenFormulary && (
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-4 print:hidden">
              <span className="text-[11px] text-amber-900 font-medium">
                Looking for classical standardized dosages & anupana from the Ayurvedic Pharmacopoeia (API)?
              </span>
              <button
                type="button"
                onClick={onOpenFormulary}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
              >
                <span>Browse e-Aushadhi Formulary Catalog →</span>
              </button>
            </div>
          )}

          {/* Doctor clinical notes */}
          <div className="mb-6">
            <label className="text-[11px] font-semibold text-slate-700 mb-1 block">
              Practitioner's Confidential Clinical Notes
            </label>
            <textarea
              rows={2}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-emerald-500 bg-slate-50/60 text-slate-800"
            ></textarea>
          </div>

          {/* Digital Signature line */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-6 border-t border-slate-200 text-xs text-slate-600 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified via ABDM Ayush Health Professional Registry (HPR)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Authenticated EHR generated using NAMASTE Standardized Ayush Ontologies.
              </p>
            </div>
            <div className="text-right">
              <div className="font-signature text-base text-slate-900 font-serif italic">
                Dr. A. K. Vaidyanathan, BAMS, MD (Ayur)
              </div>
              <div className="text-[11px] text-slate-500">
                Reg No: AYU-DEL-2014-9982 • Senior Ayush Medical Officer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
