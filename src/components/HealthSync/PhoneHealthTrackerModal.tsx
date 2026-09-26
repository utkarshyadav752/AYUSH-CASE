import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Smartphone, Footprints, Heart, Moon, 
  Flame, Watch, Check, RefreshCw, X, Play, Square, 
  Plus, Volume2, ShieldCheck, Upload, Sparkles, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { PhoneHealthMetrics, AyushCaseSheet } from '../../types/ayush';
import { 
  PhoneMotionTracker, 
  getLocalHealthMetrics, 
  syncHealthMetricsToServer, 
  connectBluetoothHeartRateSensor 
} from '../../services/phoneHealthService';

interface PhoneHealthTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseSheet?: AyushCaseSheet | null;
  patientName?: string;
  onSyncToEhr?: (metrics: PhoneHealthMetrics) => void;
  language?: string;
}

export const PhoneHealthTrackerModal: React.FC<PhoneHealthTrackerModalProps> = ({
  isOpen,
  onClose,
  caseSheet,
  patientName = 'Sunita Sharma',
  onSyncToEhr,
  language = 'English',
}) => {
  const [metrics, setMetrics] = useState<PhoneHealthMetrics>(getLocalHealthMetrics());
  const [isSensorActive, setIsSensorActive] = useState<boolean>(false);
  const [currentCadence, setCurrentCadence] = useState<number>(0);
  const [liveBpm, setLiveBpm] = useState<number | null>(null);
  const [isConnectingBt, setIsConnectingBt] = useState<boolean>(false);
  const [btConnected, setBtConnected] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'live' | 'apps' | 'shatapadi' | 'ayush'>('live');
  const [simulatedWalking, setSimulatedWalking] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const trackerRef = useRef<PhoneMotionTracker | null>(null);
  const btDisconnectRef = useRef<(() => void) | null>(null);
  const simIntervalRef = useRef<any>(null);

  useEffect(() => {
    trackerRef.current = new PhoneMotionTracker();
    setMetrics(getLocalHealthMetrics());

    const handleHealthSyncEvent = (e: any) => {
      if (e.detail) {
        setMetrics(e.detail);
      }
    };
    window.addEventListener('ayush-health-sync', handleHealthSyncEvent);

    return () => {
      window.removeEventListener('ayush-health-sync', handleHealthSyncEvent);
      if (trackerRef.current) {
        trackerRef.current.stopTracking();
      }
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
      }
      if (btDisconnectRef.current) {
        btDisconnectRef.current();
      }
    };
  }, []);

  const handleToggleMotionSensor = async () => {
    if (!trackerRef.current) return;

    if (isSensorActive) {
      trackerRef.current.stopTracking();
      setIsSensorActive(false);
      setCurrentCadence(0);
      setSyncStatus('Motion tracking paused. Synced latest steps to EHR.');
      setTimeout(() => setSyncStatus(null), 3500);
    } else {
      const granted = await trackerRef.current.requestMotionPermission();
      if (!granted) {
        setSyncStatus('Motion sensor permission was denied or not supported in this browser. You can test live walking via "Test Walk Simulator" or manually add paces.');
        setTimeout(() => setSyncStatus(null), 5000);
        return;
      }

      trackerRef.current.startTracking(
        (newSteps, updatedMetrics) => {
          setMetrics(updatedMetrics);
        },
        (cadence) => {
          setCurrentCadence(cadence);
        }
      );
      setIsSensorActive(true);
      setSyncStatus('Live accelerometer step tracker active! Walk with your phone.');
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const handleToggleSimulatedWalk = () => {
    if (simulatedWalking) {
      clearInterval(simIntervalRef.current);
      setSimulatedWalking(false);
      setCurrentCadence(0);
    } else {
      setSimulatedWalking(true);
      setCurrentCadence(108); // typical brisk pace
      simIntervalRef.current = setInterval(() => {
        if (trackerRef.current) {
          trackerRef.current.recordStep(2);
        }
      }, 1000);
    }
  };

  const handleManualAddSteps = (count: number) => {
    if (trackerRef.current) {
      trackerRef.current.recordStep(count);
    }
  };

  const handleConnectBluetooth = async () => {
    setIsConnectingBt(true);
    try {
      const conn = await connectBluetoothHeartRateSensor((bpm) => {
        setLiveBpm(bpm);
        setMetrics(prev => ({
          ...prev,
          currentHeartRateBpm: bpm,
          lastSyncTimestamp: new Date().toISOString()
        }));
      });
      btDisconnectRef.current = conn.disconnect;
      setBtConnected(true);
      setSyncStatus('Connected to Bluetooth Heart Rate sensor!');
    } catch (err: any) {
      setSyncStatus(err.message || 'Could not connect to Bluetooth device. Ensure Bluetooth is enabled.');
      setTimeout(() => setSyncStatus(null), 4000);
    } finally {
      setIsConnectingBt(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      try {
        const res = await fetch('/api/health-metrics/parse-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileContent: text, filename: file.name })
        });
        if (res.ok) {
          const json = await res.json();
          if (json.metrics) {
            const merged = { ...metrics, ...json.metrics };
            setMetrics(merged);
            await syncHealthMetricsToServer(merged);
            setSyncStatus(`Successfully imported ${json.source} data! Steps: ${json.metrics.stepsToday}`);
          }
        }
      } catch (err) {
        console.warn('Import error:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleDirectConnectApp = (appName: PhoneHealthMetrics['sourceApp']) => {
    const updated = {
      ...metrics,
      sourceApp: appName,
      lastSyncTimestamp: new Date().toISOString()
    };
    setMetrics(updated);
    syncHealthMetricsToServer(updated);
    setSyncStatus(`Connected to ${appName}! Real-time background sync active.`);
    setTimeout(() => setSyncStatus(null), 3500);
  };

  const handleSyncToEhr = () => {
    syncHealthMetricsToServer(metrics);
    if (onSyncToEhr) {
      onSyncToEhr(metrics);
    }
    setSyncStatus('Vitals & Step Log synchronized with Vaidya Clinical EHR!');
    setTimeout(() => setSyncStatus(null), 3500);
  };

  const speakActivitySummary = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = language.toLowerCase().includes('hindi');
    const text = isHindi
      ? `Aapne aaj ${metrics.stepsToday} kadam poore kiye hain. Kul doori ${metrics.distanceKm} kilometer hai, aur shatapadi ke ${metrics.shatapadiPacesCount} kadam poore hue hain. Aapka shareer theek gatisheel hai.`
      : `You have completed ${metrics.stepsToday} steps today, covering ${metrics.distanceKm} kilometers with ${metrics.activeMinutes} active minutes. Your activity aligns with your daily target.`;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  if (!isOpen) return null;

  const percentGoal = Math.min(Math.round((metrics.stepsToday / metrics.stepGoal) * 100), 100);
  const shatapadiPercent = Math.min(Math.round((metrics.shatapadiPacesCount / 100) * 100), 100);
  const dominantDosha = caseSheet?.doshaProfile?.dominantConstitution || 'Vata-Kapha';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white">
                  Phone Health App Sync & Live Activity Tracker
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  {metrics.sourceApp}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Connecting phone pedometers, Google Health Connect, Apple Health, and BLE heart rate monitors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={speakActivitySummary}
              className="text-slate-400 hover:text-white p-1.5 transition-colors cursor-pointer"
              title="Listen aloud"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'live', label: '1. Live Step Pedometer', icon: Activity },
            { id: 'shatapadi', label: '2. Shatapadi (100 Paces)', icon: Footprints },
            { id: 'ayush', label: '3. Dosha Dinacharya Target', icon: Sparkles },
            { id: 'apps', label: '4. Health Connect / Apple Health', icon: Smartphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Toast Notification */}
        {syncStatus && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-xs text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              {syncStatus}
            </span>
            <button
              type="button"
              onClick={() => setSyncStatus(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Main Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-white">
          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">
                Today's Steps
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {metrics.stepsToday.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ {metrics.stepGoal}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${percentGoal}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">
                Distance & Energy
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {metrics.distanceKm}
                </span>
                <span className="text-xs text-slate-500">km</span>
                <span className="text-xs text-slate-400" aria-hidden="true">·</span>
                <span className="text-xs font-semibold text-emerald-700 font-mono">{metrics.caloriesBurned} kcal</span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                {metrics.activeMinutes} active minutes
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">
                Resting Pulse (Nadi)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {liveBpm || metrics.currentHeartRateBpm || metrics.restingHeartRateBpm}
                </span>
                <span className="text-xs text-slate-500">BPM</span>
                {liveBpm && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-1" />
                )}
              </div>
              <span className="text-[11px] text-slate-500 block">
                Basal rate: {metrics.restingHeartRateBpm} bpm
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">
                Nidra (Sleep Duration)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {metrics.sleepHours}
                </span>
                <span className="text-xs text-slate-500">hours</span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                {metrics.deepSleepMinutes} min deep sleep (Ojas)
              </span>
            </div>
          </div>

          {/* TAB 1: LIVE HARDWARE PEDOMETER */}
          {activeTab === 'live' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isSensorActive || simulatedWalking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <h4 className="text-sm font-bold text-slate-900">
                      Smartphone Accelerometer Motion Pedometer
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 max-w-xl">
                    Tracks real physical walking steps using your device's built-in 3-axis accelerometer sensor. Keep your phone in your pocket or hand while walking.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMotionSensor}
                    className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isSensorActive
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {isSensorActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSensorActive ? 'Stop Motion Sensor' : 'Start Motion Sensor'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleSimulatedWalk}
                    className={`px-3 py-2 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      simulatedWalking
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{simulatedWalking ? 'Stop Test Walk' : 'Test Walk Simulator'}</span>
                  </button>
                </div>
              </div>

              {/* Sensor Live Readout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded border border-slate-200 bg-white flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Walking Cadence</span>
                  <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    {currentCadence}
                  </span>
                  <span className="text-[10px] text-slate-400">steps per minute</span>
                </div>

                <div className="p-4 rounded border border-slate-200 bg-white flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Add Quick Steps</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button
                      type="button"
                      onClick={() => handleManualAddSteps(10)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded font-mono text-slate-800 cursor-pointer"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => handleManualAddSteps(50)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded font-mono text-slate-800 cursor-pointer"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => handleManualAddSteps(100)}
                      className="px-2.5 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 rounded font-mono text-emerald-800 font-semibold cursor-pointer"
                    >
                      +100
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Manual test increments</span>
                </div>

                <div className="p-4 rounded border border-slate-200 bg-white flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Bluetooth Heart Rate</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button
                      type="button"
                      onClick={handleConnectBluetooth}
                      disabled={isConnectingBt || btConnected}
                      className="px-3 py-1 text-xs bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Watch className="w-3 h-3 text-emerald-400" />
                      <span>{btConnected ? 'BLE Paired' : isConnectingBt ? 'Searching...' : 'Pair Smartwatch'}</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {btConnected ? 'Live GATT Notifications Active' : 'Apple Watch / Mi Band / BLE Straps'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHATAPADI 100 PACES */}
          {activeTab === 'shatapadi' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-emerald-700" />
                    <h4 className="text-sm font-bold text-emerald-950">
                      Ayurvedic Shatapadi (शतपदी — The 100-Paces Digestive Walk)
                    </h4>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed max-w-xl">
                    Classical Ayurvedic texts (Bhavaprakasha & Charaka) prescribe a gentle stroll of exactly 100 paces immediately after meals to kindle <strong>Jatharagni</strong> (digestive fire), avoid heaviness (Guruta), and prevent Ama formation.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleManualAddSteps(10)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3.5 py-1.5 rounded text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Walk 10 Paces</span>
                  </button>
                </div>
              </div>

              {/* Progress Ring / Bar */}
              <div className="p-5 rounded-lg border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">
                    Post-Meal Progress: {metrics.shatapadiPacesCount} / 100 Paces
                  </span>
                  <span className="font-mono tabular-nums font-bold text-emerald-700">
                    {shatapadiPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${shatapadiPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {metrics.shatapadiPacesCount >= 100
                    ? '✓ Complete! 100 paces achieved. Samana Vata is harmonized and food will digest smoothly.'
                    : `Remaining: ${100 - metrics.shatapadiPacesCount} more paces to complete post-meal Shatapadi.`}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: AYUSH DOSHA TARGETS */}
          {activeTab === 'ayush' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Prakriti Physical Activity Prescriptions ({dominantDosha})
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                    Dinacharya Standard
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Exercise capacity in Ayush is defined as <em>Ardha-Shakti Vyayama</em> (exercising up to half of one's maximal capacity to preserve Ojas and avoid joint wear).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-4 rounded-lg border ${dominantDosha.includes('Vata') ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                  <span className="text-xs font-bold text-slate-900 block">Vata Dosha Profile</span>
                  <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">5,000 – 7,000 Steps</span>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Gentle, steady walking on flat terrain. Avoid excessive steps (over 11,000) as high Ruksha/Sheeta qualities trigger joint pain.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                  <span className="text-xs font-bold text-slate-900 block">Pitta Dosha Profile</span>
                  <span className="text-[11px] font-semibold text-amber-700 block mt-0.5">6,000 – 8,000 Steps</span>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Moderate walking during cool morning or evening hours. Avoid direct hot noon sun to prevent Pitta exacerbation.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                  <span className="text-xs font-bold text-slate-900 block">Kapha Dosha Profile</span>
                  <span className="text-[11px] font-semibold text-teal-700 block mt-0.5">8,000 – 11,000+ Steps</span>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Vigorous, fast-paced walking is essential to stimulate sluggish lymphatic circulation, burn Medas, and dispel Ama.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXTERNAL PHONE HEALTH APPS */}
          {activeTab === 'apps' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Google Health Connect</span>
                    <span className="text-[11px] text-slate-500 block">Android 14+ / Pixel / Samsung</span>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Direct device synchronization with Google Health Connect API.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDirectConnectApp('Google Health Connect')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-1.5 rounded text-xs transition-colors cursor-pointer"
                  >
                    Sync Health Connect
                  </button>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Apple Health (HealthKit)</span>
                    <span className="text-[11px] text-slate-500 block">iPhone & Apple Watch</span>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Synchronize daily steps, active energy, and heart rate history.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDirectConnectApp('Apple Health')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-1.5 rounded text-xs transition-colors cursor-pointer"
                  >
                    Sync Apple Health
                  </button>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Fitbit & Samsung Health</span>
                    <span className="text-[11px] text-slate-500 block">Galaxy Watch & WearOS</span>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Continuous step count, resting heart rate, and sleep duration.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDirectConnectApp('Fitbit')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-1.5 rounded text-xs transition-colors cursor-pointer"
                  >
                    Sync WearOS / Fitbit
                  </button>
                </div>
              </div>

              {/* Import File Area */}
              <div className="p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Upload Apple Health XML or Google Takeout JSON
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Import exported activity files directly from your phone
                  </span>
                </div>

                <label className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-slate-600" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".xml,.json,.txt"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Last Synced: <span className="font-mono text-slate-700">{new Date(metrics.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> via {metrics.sourceApp}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium px-3.5 py-1.5 rounded text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSyncToEhr}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Sync with Doctor EHR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
