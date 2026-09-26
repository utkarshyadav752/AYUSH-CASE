import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Footprints, Heart, Moon, 
  Flame, Watch, RefreshCw, Check, ArrowRight, Activity, Sparkles
} from 'lucide-react';
import { PhoneHealthMetrics } from '../../types/ayush';
import { getLocalHealthMetrics, fetchHealthMetricsFromServer } from '../../services/phoneHealthService';
import { useLanguage } from '../../context/LanguageContext';

interface PhoneHealthSyncCardProps {
  patientId?: string;
  patientName?: string;
  onOpenTrackerModal: () => void;
  className?: string;
}

export const PhoneHealthSyncCard: React.FC<PhoneHealthSyncCardProps> = ({
  patientId = 'USR-PAT-001',
  patientName = 'Sunita Sharma',
  onOpenTrackerModal,
  className = '',
}) => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<PhoneHealthMetrics>(getLocalHealthMetrics(patientId));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchHealthMetricsFromServer(patientId).then(data => {
      setMetrics(data);
    });

    const handleSync = (e: any) => {
      if (e.detail) {
        setMetrics(e.detail);
      }
    };
    window.addEventListener('ayush-health-sync', handleSync);
    return () => window.removeEventListener('ayush-health-sync', handleSync);
  }, [patientId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const data = await fetchHealthMetricsFromServer(patientId);
    setMetrics(data);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const percentGoal = Math.min(Math.round((metrics.stepsToday / metrics.stepGoal) * 100), 100);

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4 ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900">
                {t.phoneSyncTitle}
              </h3>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {metrics.sourceApp}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {t.phoneSyncSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            title={t.refresh}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded transition-colors cursor-pointer border border-slate-200 sm:border-transparent"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onOpenTrackerModal}
            className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.openActivityTracker}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Responsive: 2 cols on mobile, 5 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Steps */}
        <div className="p-3 rounded border border-slate-200 bg-slate-50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{t.stepsToday}</span>
            <Footprints className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
              {metrics.stepsToday.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              {t.stepGoal}: {metrics.stepGoal} ({percentGoal}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all"
              style={{ width: `${percentGoal}%` }}
            />
          </div>
        </div>

        {/* Distance & Calorie */}
        <div className="p-3 rounded border border-slate-200 bg-slate-50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{t.distanceKm} & {t.caloriesBurned}</span>
            <Flame className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
              {metrics.distanceKm} <span className="text-xs font-normal text-slate-500">km</span>
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">
              {metrics.caloriesBurned} kcal
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">
            {metrics.activeMinutes} {t.activeMinutes}
          </span>
        </div>

        {/* Shatapadi 100 paces */}
        <div className="p-3 rounded border border-slate-200 bg-slate-50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{t.shatapadiPaces}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
              {metrics.shatapadiPacesCount} <span className="text-xs font-normal text-slate-500">/ 100</span>
            </span>
            <span className="text-[10px] text-emerald-700 block font-medium">
              {metrics.shatapadiPacesCount >= 100 ? '✓ Complete' : 'In Progress'}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(metrics.shatapadiPacesCount, 100)}%` }}
            />
          </div>
        </div>

        {/* Resting Heart Rate */}
        <div className="p-3 rounded border border-slate-200 bg-slate-50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{t.restingPulse}</span>
            <Heart className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
              {metrics.currentHeartRateBpm || metrics.restingHeartRateBpm} <span className="text-xs font-normal text-slate-500">bpm</span>
            </span>
            <span className="text-[10px] text-slate-500 block">
              Normal sinus rhythm
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">
            Nadi frequency stable
          </span>
        </div>

        {/* Sleep (Nidra) */}
        <div className="p-3 rounded border border-slate-200 bg-slate-50 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{t.nidraSleep}</span>
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
              {metrics.sleepHours} <span className="text-xs font-normal text-slate-500">hrs</span>
            </span>
            <span className="text-[10px] text-slate-500 block">
              {metrics.deepSleepMinutes} min deep (Ojas)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">
            Restorative rest
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 gap-1">
        <div>
          {t.lastSynced}: <span className="font-mono text-slate-600">{new Date(metrics.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> via {metrics.sourceApp}
        </div>
        <div className="text-emerald-700 font-medium">
          ABDM Physical Activity Category: Vihara (Dinacharya)
        </div>
      </div>
    </div>
  );
};
