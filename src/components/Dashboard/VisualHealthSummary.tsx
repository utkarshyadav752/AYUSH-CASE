import React, { useState } from 'react';
import { 
  Volume2, Heart, Activity, 
  Flame, Moon, Sun, ArrowUp, ArrowDown, 
  CheckCircle2, Calendar, HelpCircle, ShieldCheck
} from 'lucide-react';
import { AyushCaseSheet } from '../../types/ayush';

interface VisualHealthSummaryProps {
  caseSheet?: AyushCaseSheet | null;
  patientName?: string;
  language?: string;
}

interface HealthPillar {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  titleHindi: string;
  titleEnglish: string;
  status: 'excellent' | 'improving' | 'needs_care';
  trend: 'better' | 'stable' | 'watch';
  textColor: string;
  badgeText: string;
  simpleExplanationHindi: string;
  simpleExplanationEnglish: string;
  scorePercent: number; // 0-100
  calendarDays: ('good' | 'average' | 'bad')[]; // 30 days
}

export const VisualHealthSummary: React.FC<VisualHealthSummaryProps> = ({
  caseSheet,
  patientName = 'Sunita Sharma',
  language = 'Hindi',
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('pain');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 30-day recovery pillars
  const pillars: HealthPillar[] = [
    {
      id: 'pain',
      icon: Activity,
      titleHindi: 'Dard me Aaraam (Joint & Body Pain)',
      titleEnglish: 'Pain Relief & Joint Flexibility',
      status: 'improving',
      trend: 'better',
      textColor: 'text-emerald-700',
      badgeText: '70% Relief',
      simpleExplanationHindi: 'Pehle se dard bahut kam hua hai. Ghutno aur jodon me soojan ghati hai.',
      simpleExplanationEnglish: 'Joint stiffness and knee pain significantly reduced over the past 30 days.',
      scorePercent: 70,
      calendarDays: [
        'bad', 'bad', 'bad', 'average', 'bad', 'average', 'average', 'bad', 'average', 'average',
        'average', 'average', 'good', 'average', 'good', 'good', 'average', 'good', 'good', 'good',
        'good', 'good', 'good', 'good', 'average', 'good', 'good', 'good', 'good', 'good'
      ]
    },
    {
      id: 'energy',
      icon: Sun,
      titleHindi: 'Shareer ki Taakat (Vitality & Energy)',
      titleEnglish: 'Vitality & Daily Stamina',
      status: 'excellent',
      trend: 'better',
      textColor: 'text-amber-700',
      badgeText: 'Optimal Energy',
      simpleExplanationHindi: 'Thakan aur susti door ho gayi hai. Subah taazgi se jaag rahe hain.',
      simpleExplanationEnglish: 'Lethargy and heaviness cleared. Good morning freshness and daytime stamina.',
      scorePercent: 85,
      calendarDays: [
        'bad', 'bad', 'average', 'average', 'average', 'average', 'good', 'average', 'good', 'good',
        'average', 'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good',
        'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good'
      ]
    },
    {
      id: 'digestion',
      icon: Flame,
      titleHindi: 'Pet aur Bhookh (Agni & Digestion)',
      titleEnglish: 'Digestive Metabolism',
      status: 'improving',
      trend: 'better',
      textColor: 'text-orange-700',
      badgeText: 'Digestion Balanced',
      simpleExplanationHindi: 'Khaana theek se pach raha hai. Pet me gas aur bhaari-pan nahi lag raha.',
      simpleExplanationEnglish: 'Food is digesting comfortably without heaviness or gas accumulation.',
      scorePercent: 78,
      calendarDays: [
        'bad', 'bad', 'bad', 'bad', 'average', 'average', 'average', 'average', 'average', 'good',
        'average', 'average', 'good', 'good', 'average', 'good', 'good', 'good', 'good', 'good',
        'good', 'good', 'average', 'good', 'good', 'good', 'good', 'good', 'good', 'good'
      ]
    },
    {
      id: 'sleep',
      icon: Moon,
      titleHindi: 'Chain ki Neend (Restful Sleep)',
      titleEnglish: 'Sound Night Sleep',
      status: 'excellent',
      trend: 'better',
      textColor: 'text-indigo-700',
      badgeText: '7h Deep Sleep',
      simpleExplanationHindi: 'Raat ko bina tanaav aur bina jage poore 7 ghante chain ki neend aa rahi hai.',
      simpleExplanationEnglish: 'Uninterrupted 7 hours of peaceful night rest without restlessness or body ache.',
      scorePercent: 90,
      calendarDays: [
        'average', 'bad', 'bad', 'average', 'average', 'good', 'average', 'good', 'good', 'good',
        'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good',
        'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good', 'good'
      ]
    }
  ];

  const selectedPillar = pillars.find(p => p.id === selectedPillarId) || pillars[0];
  const SelectedIcon = selectedPillar.icon;

  const speakOverallSummary = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = language.toLowerCase().includes('hindi');
    
    const text = isHindi
      ? `Namaste ${patientName}! Pichhle tees dino me aapki tabiyat me badiya sudhar aaya hai. Dard sattar pratishat tak kam hua hai, pet saaf ho raha hai, aur neend bahut gehri aa rahi hai. Aapka shareer theek ho raha hai, dawa niyamit lete rahein.`
      : `Hello ${patientName}! In the last 30 days, your health has shown steady recovery. Pain has reduced by 70%, digestion is clear, and sleep is peaceful. Keep continuing your prescribed medicines.`;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const speakSinglePillar = (p: HealthPillar) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = language.toLowerCase().includes('hindi');
    const text = isHindi
      ? `${p.titleHindi}: ${p.simpleExplanationHindi} Nateeja: ${p.badgeText}.`
      : `${p.titleEnglish}: ${p.simpleExplanationEnglish} Status: ${p.badgeText}.`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const goodDaysCount = selectedPillar.calendarDays.filter(d => d === 'good').length;
  const badDaysCount = selectedPillar.calendarDays.filter(d => d === 'bad').length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-slate-500">
            <span className="font-semibold text-emerald-700">Visual Recovery Summary</span>
            <span aria-hidden="true">·</span>
            <span>30-Day Longitudinal Status</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Patient Recovery & Wellness Trajectory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key recovery indicators tracked across physical symptoms, digestive fire, sleep patterns, and daily vitality.
          </p>
        </div>

        {/* Audio Summary Button */}
        <button
          type="button"
          onClick={speakOverallSummary}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-3.5 py-2 rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-slate-200"
        >
          <Volume2 className="w-3.5 h-3.5 text-slate-600" />
          <span>{isSpeaking ? 'Playing...' : 'Listen Audio Summary'}</span>
        </button>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar) => {
          const isSelected = selectedPillarId === pillar.id;
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              onClick={() => setSelectedPillarId(pillar.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected 
                  ? 'border-emerald-600 bg-emerald-50/30 shadow-xs' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-md flex items-center justify-center ${isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakSinglePillar(pillar);
                  }}
                  title="Listen this indicator"
                  className="w-7 h-7 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-900 leading-snug">
                  {pillar.titleEnglish}
                </h3>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {pillar.titleHindi}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  {pillar.badgeText}
                </span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {pillar.scorePercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 30-Day Day-by-Day Visual Calendar Strip */}
      <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <SelectedIcon className="w-4 h-4 text-emerald-700" />
            <div>
              <h4 className="text-xs font-semibold text-slate-900">
                30-Day Progress: {selectedPillar.titleEnglish}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {selectedPillar.simpleExplanationEnglish}
              </p>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600"></span>
              <span>Optimal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400"></span>
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-400"></span>
              <span>Needs Attention</span>
            </div>
          </div>
        </div>

        {/* 30-Day Visual Grid */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
            <span>Day 1 (30 days ago)</span>
            <span className="text-emerald-700 font-medium">Day 30 (Today)</span>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1 sm:gap-1.5">
            {selectedPillar.calendarDays.map((status, idx) => (
              <div
                key={idx}
                title={`Day ${idx + 1}: ${status === 'good' ? 'Optimal / Relieved' : status === 'average' ? 'Moderate' : 'Discomfort reported'}`}
                className={`h-7 rounded-sm flex items-center justify-center font-mono text-[10px] tabular-nums transition-colors cursor-pointer ${
                  status === 'good'
                    ? 'bg-emerald-600 text-white'
                    : status === 'average'
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-rose-400 text-white'
                }`}
              >
                <span>{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Outcome Strip */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            <span className="font-medium text-slate-900">Outcome summary: </span>
            <span>{goodDaysCount} of 30 days rated as feeling healthy and active with noticeable symptoms relief.</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums text-xs">
            <span className="text-emerald-700 font-semibold">{goodDaysCount} optimal days</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-500">{badDaysCount} flagged days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
