import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { 
  TrendingDown, TrendingUp, Calendar, Activity, Flame, ShieldAlert, 
  Sparkles, CheckCircle2, ChevronRight, FileText, Stethoscope, Droplets, 
  Wind, Plus, PlusCircle, HeartPulse
} from 'lucide-react';
import { SUNITA_LONGITUDINAL_HISTORY, LongitudinalCaseVisit } from '../../data/longitudinalCases';
import { AyushCaseSheet } from '../../types/ayush';
import { DailySymptomLog, getStoredDailyLogs, saveDailyLog } from '../../data/patientSymptomLogs';
import { DailySymptomLoggerModal } from './DailySymptomLoggerModal';

interface SymptomTrendAnalyticsProps {
  onSelectVisitCaseSheet?: (caseSheet: AyushCaseSheet) => void;
  patientName?: string;
  patientAbha?: string;
  patientId?: string;
}

export const SymptomTrendAnalytics: React.FC<SymptomTrendAnalyticsProps> = ({
  onSelectVisitCaseSheet,
  patientName = 'Sunita Sharma',
  patientAbha = '91-4829-1029-3841',
  patientId = 'USR-PAT-001',
}) => {
  const [selectedVisitIndex, setSelectedVisitIndex] = useState<number>(3); // Default to current visit 4
  const [metricTab, setMetricTab] = useState<'severity' | 'metabolic' | 'doshas' | 'dailylogs'>('severity');
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [dailyLogs, setDailyLogs] = useState<DailySymptomLog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load persisted daily symptom logs
  useEffect(() => {
    setDailyLogs(getStoredDailyLogs(patientId));
  }, [patientId]);

  const handleSaveDailyLog = (newLog: DailySymptomLog) => {
    const updated = saveDailyLog(newLog, patientId);
    setDailyLogs(updated);
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline) {
      setToastMessage(`✓ Logged severity ${newLog.severity}/10 for ${newLog.date}! Saved locally in offline cache. Will auto-sync when network returns.`);
    } else {
      setToastMessage(`✓ Logged severity ${newLog.severity}/10 for ${newLog.date}! Saved and synced with Ayush Cloud EHR.`);
    }
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Format clinical encounter data
  const encounterData = SUNITA_LONGITUDINAL_HISTORY.map((visit) => {
    const dateFormatted = new Date(visit.visitDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
    return {
      date: dateFormatted,
      fullDate: visit.visitDate,
      visitNumber: `Visit ${visit.visitNumber}`,
      phase: visit.treatmentPhase,
      severity: visit.symptomSeverityScore,
      stiffness: visit.jointStiffnessMinutes,
      agni: visit.agniScore,
      ama: visit.amaToxinIndex,
      vata: visit.vataSeverity,
      pitta: visit.pittaSeverity,
      kapha: visit.kaphaSeverity,
      type: 'clinical_visit'
    };
  });

  // Daily self-reported logs data for continuous trend
  const dailyChartData = dailyLogs.map((log) => {
    const dFormatted = new Date(log.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
    return {
      date: dFormatted,
      fullDate: log.date,
      severity: log.severity,
      stiffness: log.jointStiffnessMinutes || 0,
      notes: log.notes || '',
      type: 'daily_patient_log'
    };
  });

  // Unified chart data (merges clinical visits and recent daily check-ins for the recovery curve)
  const unifiedSeverityData = [
    ...encounterData.map(e => ({
      date: e.date,
      fullDate: e.fullDate,
      label: e.visitNumber,
      severity: e.severity,
      stiffness: e.stiffness,
      source: 'Doctor Encounter'
    })),
    ...dailyChartData.slice(-3).map(d => ({
      date: d.date,
      fullDate: d.fullDate,
      label: 'Daily Check-in',
      severity: d.severity,
      stiffness: d.stiffness,
      source: 'Patient Self-Log'
    }))
  ];

  const currentVisit = SUNITA_LONGITUDINAL_HISTORY[selectedVisitIndex];
  const initialVisit = SUNITA_LONGITUDINAL_HISTORY[0];

  const latestDailySeverity = dailyLogs.length > 0 ? dailyLogs[dailyLogs.length - 1].severity : currentVisit.symptomSeverityScore;

  const overallImprovement = Math.round(
    ((initialVisit.symptomSeverityScore - latestDailySeverity) / initialVisit.symptomSeverityScore) * 100
  );

  const stiffnessReduction = Math.round(
    ((initialVisit.jointStiffnessMinutes - (dailyLogs[dailyLogs.length - 1]?.jointStiffnessMinutes || currentVisit.jointStiffnessMinutes)) / initialVisit.jointStiffnessMinutes) * 100
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
      {/* Analytics Card Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                ABDM Longitudinal Analytics
              </span>
              <span aria-hidden="true">·</span>
              <span>4 Clinical Encounters</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{dailyLogs.length} Daily Self-Logs</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Symptom Severity & Recovery Trajectory
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Cross-case monitoring of <span className="text-white font-medium">{patientName}</span> ({patientAbha}) tracking daily severity scores and clinical response.
            </p>
          </div>

          {/* Quick Outcome Badges & Log Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-left">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Overall Remission</span>
              <div className="flex items-center gap-1.5 mt-0.5 font-mono tabular-nums">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-base font-bold text-white">{overallImprovement}%</span>
                <span className="text-[11px] text-slate-400">VAS {initialVisit.symptomSeverityScore} → {latestDailySeverity}</span>
              </div>
            </div>

            {/* Daily Log Button */}
            <button
              type="button"
              onClick={() => setIsLoggerOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-2 rounded-md text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-100" />
              <span>Log Today's Severity</span>
            </button>
          </div>
        </div>

        {/* View Switcher Sub-tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-3.5 border-t border-slate-800 text-xs">
          <button
            onClick={() => setMetricTab('severity')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              metricTab === 'severity'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Recovery Curve (VAS 0-10)</span>
          </button>

          <button
            onClick={() => setMetricTab('dailylogs')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              metricTab === 'dailylogs'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Daily Patient Logs ({dailyLogs.length})</span>
          </button>

          <button
            onClick={() => setMetricTab('metabolic')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              metricTab === 'metabolic'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Agni & Ama Index</span>
          </button>

          <button
            onClick={() => setMetricTab('doshas')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              metricTab === 'doshas'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Tridosha Dynamics</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-emerald-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Chart Area */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Interactive Recharts Visualization */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                {metricTab === 'severity' && 'Continuous Longitudinal Recovery Curve: Clinical Visits & Daily Logged Doses'}
                {metricTab === 'dailylogs' && 'Daily Self-Reported Symptom Tracking (Past 7 Days)'}
                {metricTab === 'metabolic' && 'Agni Index (Metabolic Strength) vs. Ama Endotoxin Clearance'}
                {metricTab === 'doshas' && 'Vata, Pitta, and Kapha Dosha Modulation Over Time'}
              </span>
              <span className="text-[11px] text-slate-500 italic">Persisted in Local Profile</span>
            </div>

            <div className="h-72 w-full bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
              <ResponsiveContainer width="100%" height="100%">
                {metricTab === 'severity' ? (
                  <AreaChart data={unifiedSeverityData} margin={{ top: 10, right: 25, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUnified" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorStiff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="m" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(value: any, name: any, item: any) => {
                        if (name === 'severity') return [`${value} / 10 (${item.payload.source})`, 'Symptom Severity (VAS)'];
                        if (name === 'stiffness') return [`${value} mins`, 'Morning Stiffness Duration'];
                        return [value, name];
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    />
                    <Area 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="severity" 
                      name="Symptom Severity (VAS 0-10)" 
                      stroke="#dc2626" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorUnified)" 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="stiffness" 
                      name="Joint Stiffness (mins)" 
                      stroke="#059669" 
                      strokeWidth={3} 
                      dot={{ r: 5, fill: '#059669', strokeWidth: 2, stroke: '#fff' }} 
                    />
                  </AreaChart>
                ) : metricTab === 'dailylogs' ? (
                  <LineChart data={dailyChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(value: any, name: any, item: any) => [
                        `${value} / 10 (Notes: "${item.payload.notes}")`,
                        'Self-Reported Severity'
                      ]}
                    />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                    <Line type="monotone" dataKey="severity" name="Daily Logged Severity (1-10)" stroke="#059669" strokeWidth={3} dot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                ) : metricTab === 'metabolic' ? (
                  <BarChart data={encounterData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(value: any, name: any) => {
                        if (name === 'agni') return [`${value} / 100`, 'Agni Strength (Metabolism)'];
                        if (name === 'ama') return [`${value} / 10`, 'Ama Endotoxin Index'];
                        return [value, name];
                      }}
                    />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                    <Bar dataKey="agni" name="Agni Strength (0-100)" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="ama" name="Ama Toxin Index (0-10)" fill="#f97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={encounterData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[10, 70]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(value: any, name: any) => [`${value}%`, name]}
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                    <Line type="monotone" dataKey="vata" name="Vata Dosha %" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="pitta" name="Pitta Dosha %" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="kapha" name="Kapha Dosha %" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Visit selector pills */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Clinical Encounters (Click to load detailed case sheet):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUNITA_LONGITUDINAL_HISTORY.map((visit, idx) => (
                  <button
                    key={visit.visitDate}
                    onClick={() => setSelectedVisitIndex(idx)}
                    className={`p-2.5 rounded-md border text-left transition-colors cursor-pointer ${
                      selectedVisitIndex === idx
                        ? 'bg-emerald-50/50 border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">Visit {visit.visitNumber}</span>
                      <span className="text-[10px] font-mono tabular-nums text-slate-600 font-medium">
                        VAS {visit.symptomSeverityScore}/10
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {new Date(visit.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-[11px] text-slate-700 font-medium block truncate mt-1">
                      {visit.treatmentPhase.split('(')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Detailed Visit Card & Recent Patient Daily Logs */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="border-b border-slate-200 pb-3 mb-3">
                <span className="text-[10px] font-mono uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Encounter #{currentVisit.visitNumber}
                </span>
                <h3 className="text-xs font-semibold text-slate-900 mt-1">
                  {currentVisit.treatmentPhase}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Recorded: {new Date(currentVisit.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {/* Clinical Metrics Snapshot */}
              <div className="grid grid-cols-2 gap-2 mb-3.5 text-xs">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Severity Score</span>
                  <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">{currentVisit.symptomSeverityScore} / 10</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Morning Stiffness</span>
                  <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">{currentVisit.jointStiffnessMinutes} mins</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Agni Score</span>
                  <span className="text-sm font-semibold text-emerald-700 font-mono tabular-nums">{currentVisit.agniScore} / 100</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Ama Toxicity</span>
                  <span className="text-sm font-semibold text-slate-700 font-mono tabular-nums">{currentVisit.amaToxinIndex} / 10</span>
                </div>
              </div>

              {/* Recent Daily Logs List */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    Patient Daily Logs:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLoggerOpen(true)}
                    className="text-[11px] font-medium text-emerald-700 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Log</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {dailyLogs.slice().reverse().map((log) => (
                    <div key={log.id} className="p-2 rounded bg-white border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 text-[11px] block">{log.date}</span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">{log.notes || 'Routine check'}</span>
                      </div>
                      <span className="text-[10px] font-mono tabular-nums text-slate-700 font-medium">
                        VAS {log.severity}/10
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspect in Vaidya Cockpit */}
            {onSelectVisitCaseSheet && (
              <button
                type="button"
                onClick={() => onSelectVisitCaseSheet(currentVisit.caseSheet)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                <span>Load Visit #{currentVisit.visitNumber} in EHR</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Daily Symptom Logger Modal */}
      <DailySymptomLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSaveLog={handleSaveDailyLog}
        patientName={patientName}
      />
    </div>
  );
};
