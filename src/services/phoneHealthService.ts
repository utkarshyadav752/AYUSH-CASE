import { PhoneHealthMetrics } from '../types/ayush';

const STORAGE_KEY = 'ayush_phone_health_metrics';

export const DEFAULT_HEALTH_METRICS: PhoneHealthMetrics = {
  stepsToday: 6420,
  stepGoal: 7000,
  distanceKm: 4.8,
  caloriesBurned: 320,
  activeMinutes: 44,
  floorsClimbed: 6,
  restingHeartRateBpm: 72,
  currentHeartRateBpm: 76,
  sleepHours: 7.2,
  deepSleepMinutes: 105,
  shatapadiPacesCount: 92,
  lastSyncTimestamp: new Date().toISOString(),
  sourceApp: 'Google Health Connect',
  weeklyStepsHistory: [
    { day: 'Mon', steps: 5800, goalMet: false, activeMinutes: 38 },
    { day: 'Tue', steps: 6950, goalMet: false, activeMinutes: 46 },
    { day: 'Wed', steps: 7200, goalMet: true, activeMinutes: 52 },
    { day: 'Thu', steps: 6100, goalMet: false, activeMinutes: 40 },
    { day: 'Fri', steps: 7450, goalMet: true, activeMinutes: 55 },
    { day: 'Sat', steps: 6800, goalMet: false, activeMinutes: 45 },
    { day: 'Sun', steps: 6420, goalMet: false, activeMinutes: 44 },
  ],
  hourlyStepDistribution: [
    { hour: '06:00', steps: 420 },
    { hour: '08:00', steps: 1100 },
    { hour: '10:00', steps: 850 },
    { hour: '12:00', steps: 620 },
    { hour: '14:00', steps: 390 },
    { hour: '16:00', steps: 740 },
    { hour: '18:00', steps: 1550 },
    { hour: '20:00', steps: 750 }
  ]
};

export function getLocalHealthMetrics(patientId = 'USR-PAT-001'): PhoneHealthMetrics {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${patientId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load local health metrics:', e);
  }
  return DEFAULT_HEALTH_METRICS;
}

export function saveLocalHealthMetrics(metrics: PhoneHealthMetrics, patientId = 'USR-PAT-001') {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${patientId}`, JSON.stringify(metrics));
    window.dispatchEvent(new CustomEvent('ayush-health-sync', { detail: metrics }));
  } catch (e) {
    console.warn('Failed to save local health metrics:', e);
  }
}

export async function syncHealthMetricsToServer(metrics: PhoneHealthMetrics, patientId = 'USR-PAT-001') {
  saveLocalHealthMetrics(metrics, patientId);
  try {
    const res = await fetch('/api/health-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...metrics, patientId })
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
    console.warn('Could not sync to server, using local fallback:', e);
  }
  return metrics;
}

export async function fetchHealthMetricsFromServer(patientId = 'USR-PAT-001'): Promise<PhoneHealthMetrics> {
  try {
    const res = await fetch(`/api/health-metrics/${patientId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        saveLocalHealthMetrics(json.data, patientId);
        return json.data;
      }
    }
  } catch (e) {
    console.warn('Server fetch error:', e);
  }
  return getLocalHealthMetrics(patientId);
}

/**
 * Hardware Accelerometer Pedometer Tracker
 */
export class PhoneMotionTracker {
  private isTracking = false;
  private onStepCallback?: (totalSteps: number, currentMetrics: PhoneHealthMetrics) => void;
  private onCadenceCallback?: (currentCadence: number) => void;
  private currentMetrics: PhoneHealthMetrics;
  private patientId: string;
  private lastStepTimestamp = 0;
  private stepIntervals: number[] = [];
  private motionListener?: (event: DeviceMotionEvent) => void;
  private lastMagnitude = 0;
  private isPeak = false;

  constructor(patientId = 'USR-PAT-001') {
    this.patientId = patientId;
    this.currentMetrics = getLocalHealthMetrics(patientId);
  }

  public getActiveStatus(): boolean {
    return this.isTracking;
  }

  public getCurrentMetrics(): PhoneHealthMetrics {
    return this.currentMetrics;
  }

  public async requestMotionPermission(): Promise<boolean> {
    if (typeof (DeviceMotionEvent as any) !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        return permission === 'granted';
      } catch (err) {
        console.warn('iOS motion permission error:', err);
        return false;
      }
    }
    return true; // standard on Android and modern browsers
  }

  public startTracking(
    onStep: (totalSteps: number, metrics: PhoneHealthMetrics) => void,
    onCadence?: (cadence: number) => void
  ) {
    if (this.isTracking) return;
    this.onStepCallback = onStep;
    this.onCadenceCallback = onCadence;
    this.isTracking = true;

    this.motionListener = (event: DeviceMotionEvent) => {
      const acc = event.acceleration || event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;

      const totalVector = Math.sqrt(x * x + y * y + z * z);
      // Remove approximate Earth gravity (~9.8 m/s²)
      const dynamicMagnitude = Math.abs(totalVector - 9.80665);

      const now = Date.now();
      const threshold = 1.95; // peak threshold in m/s²

      if (dynamicMagnitude > threshold && !this.isPeak) {
        this.isPeak = true;
        // Refractory lockout window of 300ms to eliminate sensor bounce
        if (now - this.lastStepTimestamp > 300) {
          const stepDelta = now - this.lastStepTimestamp;
          this.lastStepTimestamp = now;

          if (stepDelta < 2500) {
            this.stepIntervals.push(stepDelta);
            if (this.stepIntervals.length > 5) this.stepIntervals.shift();
            const avgInterval = this.stepIntervals.reduce((a, b) => a + b, 0) / this.stepIntervals.length;
            const cadence = Math.round(60000 / avgInterval);
            if (this.onCadenceCallback) {
              this.onCadenceCallback(Math.min(cadence, 180));
            }
          }

          this.recordStep();
        }
      } else if (dynamicMagnitude < threshold * 0.7) {
        this.isPeak = false;
      }

      this.lastMagnitude = dynamicMagnitude;
    };

    window.addEventListener('devicemotion', this.motionListener);
  }

  public recordStep(count = 1) {
    const newSteps = this.currentMetrics.stepsToday + count;
    const newDistance = Number((newSteps * 0.000762).toFixed(2));
    const newCalories = Math.round(newSteps * 0.045);
    const newActiveMinutes = Math.max(this.currentMetrics.activeMinutes, Math.round(newSteps / 110));

    // Also increment Shatapadi paces if tracking post-meal walk
    const newShatapadi = this.currentMetrics.shatapadiPacesCount + count;

    this.currentMetrics = {
      ...this.currentMetrics,
      stepsToday: newSteps,
      distanceKm: newDistance,
      caloriesBurned: newCalories,
      activeMinutes: newActiveMinutes,
      shatapadiPacesCount: newShatapadi,
      sourceApp: 'Phone Motion Sensor',
      lastSyncTimestamp: new Date().toISOString()
    };

    saveLocalHealthMetrics(this.currentMetrics, this.patientId);

    if (this.onStepCallback) {
      this.onStepCallback(newSteps, this.currentMetrics);
    }
  }

  public stopTracking() {
    this.isTracking = false;
    if (this.motionListener) {
      window.removeEventListener('devicemotion', this.motionListener);
      this.motionListener = undefined;
    }
    // sync final metrics to server
    syncHealthMetricsToServer(this.currentMetrics, this.patientId);
  }

  public resetTodaySteps() {
    this.currentMetrics = {
      ...this.currentMetrics,
      stepsToday: 0,
      distanceKm: 0,
      caloriesBurned: 0,
      activeMinutes: 0,
      shatapadiPacesCount: 0,
      lastSyncTimestamp: new Date().toISOString()
    };
    saveLocalHealthMetrics(this.currentMetrics, this.patientId);
    if (this.onStepCallback) {
      this.onStepCallback(0, this.currentMetrics);
    }
  }
}

/**
 * Web Bluetooth Heart Rate Monitor Connectivity
 */
export async function connectBluetoothHeartRateSensor(
  onHeartRate: (bpm: number) => void
): Promise<{ disconnect: () => void }> {
  const nav = navigator as any;
  if (!nav.bluetooth) {
    throw new Error('Web Bluetooth is not supported in this browser. Please use Chrome on Android or desktop.');
  }

  const device = await nav.bluetooth.requestDevice({
    filters: [{ services: ['heart_rate'] }],
    optionalServices: ['battery_service']
  });

  const server = await device.gatt?.connect();
  if (!server) throw new Error('Could not connect to Bluetooth GATT server');

  const service = await server.getPrimaryService('heart_rate');
  const characteristic = await service.getCharacteristic('heart_rate_measurement');

  await characteristic.startNotifications();

  characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
    const value: DataView = event.target.value;
    const flags = value.getUint8(0);
    // 0x01 bit determines 8-bit or 16-bit HR value
    const hr = (flags & 0x01) ? value.getUint16(1, true) : value.getUint8(1);
    onHeartRate(hr);
  });

  return {
    disconnect: () => {
      try {
        device.gatt?.disconnect();
      } catch (e) {
        console.warn('Bluetooth disconnect:', e);
      }
    }
  };
}
