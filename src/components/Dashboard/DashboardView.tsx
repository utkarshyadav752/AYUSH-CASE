import React, { useState } from 'react';
import { 
  Sparkles, Mic, Stethoscope, FileText, ArrowRight, ShieldCheck, 
  Activity, Users, Award, Pill, Clock, CheckCircle2, ChevronRight, 
  HeartPulse, Brain, Droplets, Flame, Wind, Download, Share2, Layers, 
  TrendingDown, Bot, Bell, AlertTriangle, Upload, Volume2, Smartphone
} from 'lucide-react';
import { UserAccount } from '../../data/mockUsers';
import { AyushCaseSheet } from '../../types/ayush';
import { SymptomTrendAnalytics } from './SymptomTrendAnalytics';
import { MedicationNotificationToast } from './MedicationNotificationToast';
import { VisualHealthSummary } from './VisualHealthSummary';
import { OfflineSyncStatusIndicator } from './OfflineSyncStatusIndicator';
import { CaregiverEmergencyHub } from './CaregiverEmergencyHub';
import { SimpleAyushAssistantModal } from './SimpleAyushAssistantModal';
import { PhoneHealthSyncCard } from '../HealthSync/PhoneHealthSyncCard';
import { useLanguage } from '../../context/LanguageContext';

interface DashboardViewProps {
  currentUser: UserAccount | null;
  onOpenLogin: () => void;
  onNavigateTab: (tab: 'dashboard' | 'guide' | 'patient' | 'doctor' | 'compare' | 'hackathon') => void;
  caseSheet: AyushCaseSheet | null;
  onSelectHistoricalCase?: (caseSheet: AyushCaseSheet) => void;
  selectedLanguage?: string;
  onOpenDoctorAi?: (topic?: string) => void;
  onOpenHealthTracker?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onOpenLogin,
  onNavigateTab,
  caseSheet,
  onSelectHistoricalCase,
  selectedLanguage = 'English',
  onOpenDoctorAi,
  onOpenHealthTracker,
}) => {
  const { t } = useLanguage();
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const patientDisplayName = currentUser ? currentUser.name : (caseSheet?.patientInfo?.fullName || 'Sunita Sharma');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Clinical Overview Card (Responsive) */}
      <div className="bg-slate-900 text-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-slate-800 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.ministryOfAyush}
              </span>
              <span aria-hidden="true">·</span>
              <span>{t.nationalMission}</span>
              <span aria-hidden="true">·</span>
              {currentUser ? (
                <span className="text-slate-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {t.verified}: {currentUser.name} ({currentUser.role})
                </span>
              ) : (
                <span className="text-slate-400">
                  {t.guestSession}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* ABHA Status Strip */}
            {currentUser && currentUser.abhaId && (
              <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 font-mono">
                <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">
                  ABHA: {currentUser.abhaId}
                </span>
                <span className="text-slate-300 font-sans">
                  Prakriti: <span className="text-white font-medium">{currentUser.prakritiBaseline || 'Vata-Kapha'}</span>
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons Column */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            {onOpenHealthTracker && (
              <button
                type="button"
                onClick={onOpenHealthTracker}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>{t.heroPhoneSyncBtn}</span>
              </button>
            )}

            {onOpenDoctorAi && (
              <button
                type="button"
                onClick={() => onOpenDoctorAi('full_case')}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{t.heroDoctorAiBtn}</span>
              </button>
            )}

            <button
              onClick={() => setIsAssistantModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>{t.heroAskSathiBtn}</span>
            </button>

            <button
              onClick={() => onNavigateTab('guide')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Pill className="w-4 h-4 text-emerald-400" />
              <span>{t.heroDoseAlarmsBtn}</span>
            </button>

            {currentUser ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigateTab('patient')}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.heroVoiceIntakeBtn}</span>
                </button>
                <button
                  onClick={() => onNavigateTab('doctor')}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t.heroVaidyaEhrBtn}</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onOpenLogin}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{t.heroLoginBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigateTab('patient')}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{t.heroDemoIntakeBtn}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabular Numerical Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">{t.statTimeSaved}</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">75%</span>
            <span className="text-slate-400 text-[10px] sm:text-[11px] block">{t.statTimeSavedSub}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">{t.statLanguages}</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">7+</span>
            <span className="text-slate-400 text-[10px] sm:text-[11px] block">{t.statLanguagesSub}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">{t.statInterop}</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono">FHIR R4</span>
            <span className="text-slate-400 text-[10px] sm:text-[11px] block">{t.statInteropSub}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">{t.statFormulary}</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono">e-Aushadhi</span>
            <span className="text-slate-400 text-[10px] sm:text-[11px] block">{t.statFormularySub}</span>
          </div>
        </div>
      </div>

      {/* Phone Health App & Live Activity Sync Card */}
      <PhoneHealthSyncCard
        patientId={currentUser ? currentUser.id : 'USR-PAT-001'}
        patientName={patientDisplayName}
        onOpenTrackerModal={onOpenHealthTracker || (() => {})}
      />

      {/* Offline Mode Status & Local Caching Sync Indicator */}
      <OfflineSyncStatusIndicator
        patientId={currentUser ? currentUser.id : 'USR-PAT-001'}
      />

      {/* Main Feature Modules Grid (Responsive cards) */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {t.modulesTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.modulesSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Patient Voice Intake */}
          <div 
            onClick={() => onNavigateTab('patient')}
            className="bg-white rounded-lg border border-slate-200 hover:border-emerald-600 p-4 transition-all cursor-pointer flex flex-col justify-between group shadow-xs active:scale-[0.99]"
          >
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 block">
                  Patient Intake
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                  {t.modIntakeTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t.modIntakeDesc}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-emerald-700 group-hover:translate-x-0.5 transition-transform">
              <span>Start Intake</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Vaidya EHR Cockpit */}
          <div 
            onClick={() => onNavigateTab('doctor')}
            className="bg-white rounded-lg border border-slate-200 hover:border-teal-600 p-4 transition-all cursor-pointer flex flex-col justify-between group shadow-xs active:scale-[0.99]"
          >
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 block">
                  Physician EHR
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                  {t.modDoctorTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t.modDoctorDesc}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-teal-700 group-hover:translate-x-0.5 transition-transform">
              <span>Review Case</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: AI Doctor Guide & Dose Reminder */}
          <div 
            onClick={() => onNavigateTab('guide')}
            className="bg-white rounded-lg border border-slate-200 hover:border-emerald-600 p-4 transition-all cursor-pointer flex flex-col justify-between group shadow-xs active:scale-[0.99]"
          >
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                <Bell className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Patient Care
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                  {t.modAlarmsTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t.modAlarmsDesc}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-emerald-700 group-hover:translate-x-0.5 transition-transform">
              <span>Open Alarms</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Software Comparison & Dispensary */}
          <div 
            onClick={() => onNavigateTab('compare')}
            className="bg-white rounded-lg border border-slate-200 hover:border-slate-400 p-4 transition-all cursor-pointer flex flex-col justify-between group shadow-xs active:scale-[0.99]"
          >
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                <Pill className="w-4 h-4 text-slate-700" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Benchmark
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                  {t.modFormularyTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t.modFormularyDesc}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-800 group-hover:translate-x-0.5 transition-transform">
              <span>View Formulary</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: SIH Hackathon Dossier */}
          <div 
            onClick={() => onNavigateTab('hackathon')}
            className="bg-white rounded-lg border border-slate-200 hover:border-slate-400 p-4 transition-all cursor-pointer flex flex-col justify-between group shadow-xs active:scale-[0.99]"
          >
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                <Award className="w-4 h-4 text-slate-700" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Documentation
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                  {t.modDossierTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t.modDossierDesc}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-800 group-hover:translate-x-0.5 transition-transform">
              <span>Review Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Simplified 'Patient Health Summary' Visual Component */}
      <VisualHealthSummary
        caseSheet={caseSheet}
        patientName={currentUser ? currentUser.name : (caseSheet?.patientInfo?.fullName || 'Sunita Sharma')}
        language={selectedLanguage}
      />

      {/* Longitudinal Recharts Symptom Severity Dashboard Component */}
      <SymptomTrendAnalytics
        onSelectVisitCaseSheet={(sheet) => {
          if (onSelectHistoricalCase) {
            onSelectHistoricalCase(sheet);
          } else {
            onNavigateTab('doctor');
          }
        }}
        patientName={currentUser ? currentUser.name : (caseSheet?.patientInfo?.fullName || 'Sunita Sharma')}
        patientAbha={currentUser?.abhaId || (caseSheet?.patientInfo?.abhaId || '91-4829-1029-3841')}
        patientId={currentUser?.id || 'USR-PAT-001'}
      />

      {/* Prescribed Medication Notification & Toast Alarm System */}
      <MedicationNotificationToast
        caseSheet={caseSheet}
        language={selectedLanguage}
        patientName={currentUser ? currentUser.name : (caseSheet?.patientInfo?.fullName || 'Sunita Sharma')}
      />

      {/* Caregiver & 1-Touch Family SOS Bridge */}
      <CaregiverEmergencyHub
        caseSheet={caseSheet}
        patientName={patientDisplayName}
        phone={currentUser?.phone || '+91 98765 43210'}
        language={selectedLanguage}
      />

      {/* Floating Voice Guide Trigger (Positioned above bottom nav on mobile) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 flex flex-col items-end gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsAssistantModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700 transition-transform hover:scale-105 active:scale-95 cursor-pointer text-xs"
        >
          <Bot className="w-4 h-4 text-emerald-400" />
          <span className="hidden xs:inline">{t.voiceGuideFloating}</span>
        </button>
      </div>

      {/* Saral Ayush Sathi Conversational Voice Modal */}
      <SimpleAyushAssistantModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        caseSheet={caseSheet}
        patientName={patientDisplayName}
        language={selectedLanguage}
        onNavigateToTab={onNavigateTab}
      />
    </div>
  );
};
