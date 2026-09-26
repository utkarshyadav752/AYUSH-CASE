import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, RefreshCw, CheckCircle2, 
  CloudUpload, Volume2
} from 'lucide-react';
import { 
  getOfflinePendingLogs, 
  syncOfflineLogsToServer, 
} from '../../data/patientSymptomLogs';

interface OfflineSyncStatusIndicatorProps {
  patientId?: string;
  onSyncComplete?: (count: number) => void;
  className?: string;
}

export const OfflineSyncStatusIndicator: React.FC<OfflineSyncStatusIndicatorProps> = ({
  patientId = 'USR-PAT-001',
  onSyncComplete,
  className = '',
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const checkPendingQueue = () => {
    const queue = getOfflinePendingLogs(patientId);
    setPendingCount(queue.length);
  };

  useEffect(() => {
    checkPendingQueue();

    const handleOnline = async () => {
      setIsOnline(true);
      setSyncToast('Network restored. Synchronizing cached records to cloud...');
      await triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncToast('Device is offline. New entries are cached safely on this device.');
    };

    const handleCustomQueueUpdate = () => {
      checkPendingQueue();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('ayush-symptom-logged', handleCustomQueueUpdate);

    // Periodic check every 15 seconds
    const interval = setInterval(() => {
      checkPendingQueue();
      if (navigator.onLine && !isSyncing) {
        const queue = getOfflinePendingLogs(patientId);
        if (queue.length > 0) {
          triggerSync();
        }
      }
    }, 15000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('ayush-symptom-logged', handleCustomQueueUpdate);
      clearInterval(interval);
    };
  }, [patientId]);

  const triggerSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await syncOfflineLogsToServer(patientId);
      if (result.success && result.syncedCount > 0) {
        checkPendingQueue();
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncedTime(timeStr);
        setSyncToast(`Synced ${result.syncedCount} record(s) at ${timeStr}`);
        if (onSyncComplete) {
          onSyncComplete(result.syncedCount);
        }
      } else if (result.success && result.syncedCount === 0) {
        checkPendingQueue();
      }
    } catch (e) {
      console.warn('Sync attempt failed:', e);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 4000);
    }
  };

  const toggleSimulatedConnection = () => {
    if (isOnline) {
      setIsOnline(false);
      setSyncToast('Offline simulation active. Logs will be stored locally.');
    } else {
      setIsOnline(true);
      setSyncToast('Online restored. Syncing locally stored entries...');
      triggerSync();
    }
  };

  const speakStatus = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = !isOnline
      ? 'Aapka device bina internet ke bhi kaam kar raha hai. Aapki rozana tabiyat device me save ho rahi hai.'
      : pendingCount > 0
      ? `Internet connected hai. ${pendingCount} entry cloud par upload ho rahi hain.`
      : 'Device cloud se synchronized hai.';
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'hi-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded flex items-center justify-center ${
              !isOnline
                ? 'bg-amber-100 text-amber-800'
                : pendingCount > 0
                ? 'bg-sky-100 text-sky-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {!isOnline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-700" />
            ) : isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 text-sky-700 animate-spin" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-700" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-900">
                {!isOnline
                  ? 'Offline Mode (Local Storage)'
                  : pendingCount > 0
                  ? 'Online · Pending Sync'
                  : 'Online · Cloud Synchronized'}
              </span>

              {pendingCount > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-amber-700 font-medium">
                  ({pendingCount} pending)
                </span>
              )}

              <button
                type="button"
                onClick={speakStatus}
                title="Audio announcement"
                className="text-slate-400 hover:text-slate-700 p-0.5 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-0.5">
              {!isOnline
                ? 'Data safely saved locally; auto-syncs when connection resumes.'
                : lastSyncedTime
                ? `Backed up to ABDM Cloud. Last synced at ${lastSyncedTime}.`
                : 'Connected to ABDM & Ayush EHR Cloud.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={triggerSync}
              disabled={isSyncing || !isOnline}
              className="px-2.5 py-1 text-xs font-medium bg-emerald-700 text-white rounded hover:bg-emerald-800 disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleSimulatedConnection}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-900 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isOnline ? 'Test Offline Mode' : 'Restore Online'}
          </button>
        </div>
      </div>

      {syncToast && (
        <div className="text-xs bg-slate-900 text-slate-200 px-3 py-1.5 rounded-md flex items-center justify-between border border-slate-800">
          <span>{syncToast}</span>
          <button
            type="button"
            onClick={() => setSyncToast(null)}
            className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
