export interface DailySymptomLog {
  id: string;
  date: string; // YYYY-MM-DD
  severity: number; // 1-10
  jointStiffnessMinutes?: number;
  digestiveState?: 'Good (Sama Agni)' | 'Mild Bloating' | 'Severe Acidity/Gas';
  energyLevel?: 'High' | 'Moderate' | 'Low/Fatigued';
  notes?: string;
  loggedAt: string;
  voiceTranscript?: string;
}

const STORAGE_KEY = 'ayushcase_patient_daily_symptom_logs';
const OFFLINE_QUEUE_KEY = 'ayushcase_offline_symptom_sync_queue';

export function getOfflinePendingLogs(patientId: string = 'USR-PAT-001'): DailySymptomLog[] {
  try {
    const raw = localStorage.getItem(`${OFFLINE_QUEUE_KEY}_${patientId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading offline sync queue:', e);
  }
  return [];
}

export function clearOfflinePendingLogs(patientId: string = 'USR-PAT-001'): void {
  try {
    localStorage.removeItem(`${OFFLINE_QUEUE_KEY}_${patientId}`);
  } catch (e) {
    console.error('Error clearing offline queue:', e);
  }
}

export function addToOfflineQueue(log: DailySymptomLog, patientId: string = 'USR-PAT-001'): void {
  try {
    const pending = getOfflinePendingLogs(patientId);
    const updated = [...pending.filter(l => l.date !== log.date), log];
    localStorage.setItem(`${OFFLINE_QUEUE_KEY}_${patientId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('Error adding to offline queue:', e);
  }
}

export async function syncOfflineLogsToServer(patientId: string = 'USR-PAT-001'): Promise<{ success: boolean; syncedCount: number }> {
  const pending = getOfflinePendingLogs(patientId);
  if (pending.length === 0) {
    return { success: true, syncedCount: 0 };
  }

  try {
    const res = await fetch('/api/sync-symptom-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, logs: pending })
    });
    if (res.ok) {
      const data = await res.json();
      clearOfflinePendingLogs(patientId);
      return { success: true, syncedCount: data.syncedCount || pending.length };
    }
  } catch (err) {
    console.warn('Sync failed, keeping items in offline queue:', err);
  }
  return { success: false, syncedCount: 0 };
}

export function getStoredDailyLogs(patientId: string = 'USR-PAT-001'): DailySymptomLog[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${patientId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading stored logs:', e);
  }

  // Initial seed logs leading up to today so the chart shows a lively progression
  const seedLogs: DailySymptomLog[] = [
    {
      id: 'log-1',
      date: '2026-09-19',
      severity: 3.5,
      jointStiffnessMinutes: 25,
      digestiveState: 'Good (Sama Agni)',
      energyLevel: 'Moderate',
      notes: 'Slight finger tightness in early morning, relieved after drinking ginger water.',
      loggedAt: '2026-09-19T08:15:00Z'
    },
    {
      id: 'log-2',
      date: '2026-09-20',
      severity: 3.0,
      jointStiffnessMinutes: 20,
      digestiveState: 'Good (Sama Agni)',
      energyLevel: 'High',
      notes: 'Walked 3 km in morning without knee discomfort.',
      loggedAt: '2026-09-20T08:30:00Z'
    },
    {
      id: 'log-3',
      date: '2026-09-21',
      severity: 2.8,
      jointStiffnessMinutes: 18,
      digestiveState: 'Good (Sama Agni)',
      energyLevel: 'High',
      notes: 'Took Kaishore Guggulu on time. Bowels regular.',
      loggedAt: '2026-09-21T08:20:00Z'
    },
    {
      id: 'log-4',
      date: '2026-09-22',
      severity: 2.2,
      jointStiffnessMinutes: 15,
      digestiveState: 'Good (Sama Agni)',
      energyLevel: 'High',
      notes: 'No pain during daytime school teaching. Slept 7 hours soundly.',
      loggedAt: '2026-09-22T08:00:00Z'
    }
  ];

  return seedLogs;
}

export function saveDailyLog(log: DailySymptomLog, patientId: string = 'USR-PAT-001'): DailySymptomLog[] {
  try {
    const existing = getStoredDailyLogs(patientId);
    // Replace if same date exists or prepend new
    const filtered = existing.filter(l => l.date !== log.date);
    const updated = [...filtered, log].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    localStorage.setItem(`${STORAGE_KEY}_${patientId}`, JSON.stringify(updated));

    // Offline caching & queue logic
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline) {
      // If offline, queue for later automatic sync
      addToOfflineQueue(log, patientId);
    } else {
      // If online, attempt background sync directly
      fetch('/api/sync-symptom-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, logs: [log] })
      }).catch((err) => {
        console.warn('Network request failed, moving to offline queue:', err);
        addToOfflineQueue(log, patientId);
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ayush-symptom-logged', { detail: { log } }));
    }

    return updated;
  } catch (e) {
    console.error('Error saving daily log:', e);
    return [];
  }
}
