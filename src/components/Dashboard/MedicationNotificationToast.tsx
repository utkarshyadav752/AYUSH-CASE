import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle2, Clock, Volume2, X, 
  Pill, Check, Play
} from 'lucide-react';
import { AyushCaseSheet } from '../../types/ayush';
import { 
  PrescribedMedicationAlert, 
  extractMedicationScheduleFromCaseSheet 
} from '../../utils/medicationScheduler';

interface MedicationNotificationToastProps {
  caseSheet: AyushCaseSheet | null;
  language?: string;
  patientName?: string;
}

export const MedicationNotificationToast: React.FC<MedicationNotificationToastProps> = ({
  caseSheet,
  language = 'Hindi',
  patientName = 'Sunita Sharma',
}) => {
  const [alerts, setAlerts] = useState<PrescribedMedicationAlert[]>([]);
  const [activeToast, setActiveToast] = useState<PrescribedMedicationAlert | null>(null);
  const [completedDoses, setCompletedDoses] = useState<string[]>([]);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const list = extractMedicationScheduleFromCaseSheet(caseSheet);
    setAlerts(list);
  }, [caseSheet]);

  // Clock tick & Trigger Check
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${hours}:${minutes}`;
      setCurrentTimeStr(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));

      const match = alerts.find(a => a.targetTime === currentHHMM && !completedDoses.includes(a.id));
      if (match && (!activeToast || activeToast.id !== match.id)) {
        triggerToastNotification(match);
      }
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 10000);
    return () => clearInterval(interval);
  }, [alerts, completedDoses, activeToast]);

  const triggerToastNotification = (alertItem: PrescribedMedicationAlert) => {
    setActiveToast(alertItem);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Ayush Medication: ${alertItem.medicineName}`, {
          body: `Dose: ${alertItem.dosage}. ${alertItem.instructions}`,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.log('Notification trigger error:', e);
      }
    }

    speakAlarmVoice(alertItem);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  };

  const speakAlarmVoice = (alertItem: PrescribedMedicationAlert) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = language.toLowerCase().includes('hindi');
    const text = isHindi
      ? `Dhyan dijiye! Dawa lene ka samay ho gaya hai. Dawa: ${alertItem.medicineName}. Matra: ${alertItem.dosage}. Kripya ${alertItem.anupana} ke sath lein.`
      : `Medication Reminder. Time to take ${alertItem.medicineName}. Dosage: ${alertItem.dosage} with ${alertItem.anupana}.`;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const handleMarkTaken = (alertId: string) => {
    setCompletedDoses(prev => [...prev, alertId]);
    setActiveToast(null);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = language.toLowerCase().includes('hindi')
        ? `Dawa darj ho gayi.`
        : `Dose marked as taken.`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = language.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utter);
    }
  };

  const testTriggerAlert = (alertItem: PrescribedMedicationAlert) => {
    triggerToastNotification(alertItem);
  };

  return (
    <>
      {/* Floating System Medication Alarm Toast */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full">
          <div className="bg-slate-900 text-white rounded-lg p-4 shadow-xl border border-slate-700 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-emerald-800 text-emerald-100 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tabular-nums text-emerald-400 block font-medium">
                    Scheduled: {activeToast.formattedTime}
                  </span>
                  <h4 className="text-xs font-semibold text-white">
                    {activeToast.medicineName}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveToast(null)}
                className="text-slate-400 hover:text-white p-0.5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Dosage:</span>
                <span className="text-white font-medium">{activeToast.dosage}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Carrier (Anupana):</span>
                <span className="text-emerald-300 font-medium">{activeToast.anupana}</span>
              </div>
              <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-700">
                {activeToast.instructions}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => speakAlarmVoice(activeToast)}
                className="text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Repeat Voice</span>
              </button>

              <button
                type="button"
                onClick={() => handleMarkTaken(activeToast.id)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ml-auto"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark as Taken</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Medication Alarm Tracker Panel */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-slate-500">
              <span className="font-semibold text-emerald-700">Prescription Alarms</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Clock: {currentTimeStr || 'Live'}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Prescription Timetable & Dose Notifications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Synchronized from the active case sheet. Triggers audio speech reminders and browser notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={requestNotificationPermission}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <Bell className="w-3.5 h-3.5 text-slate-600" />
              <span>Enable Browser Alerts</span>
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {alerts.map((item) => {
            const isCompleted = completedDoses.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-colors flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono tabular-nums font-semibold text-slate-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {item.formattedTime}
                    </span>
                    <span className="text-[10px] uppercase font-medium text-slate-500">
                      {item.period}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 truncate">
                    {item.medicineName}
                  </h4>

                  <div className="text-xs font-medium text-emerald-700 mt-0.5">
                    {item.dosage}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {item.instructions}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => testTriggerAlert(item)}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Test</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarkTaken(item.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Taken</span>
                      </>
                    ) : (
                      <span>Mark Taken</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
