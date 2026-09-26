import React from 'react';
import { Sparkles, CheckCircle2, Flame, Wind, Droplets } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  subtitle: string;
  vata: { label: string; detail: string };
  pitta: { label: string; detail: string };
  kapha: { label: string; detail: string };
}

const QUESTIONS: Question[] = [
  {
    id: 'build',
    title: 'Physical Frame & Body Build (Akriti)',
    subtitle: 'Your natural bone structure and weight stability',
    vata: { label: 'Lean & Variable', detail: 'Slender, prominent joints, difficult to gain weight, quick movements' },
    pitta: { label: 'Medium & Symmetrical', detail: 'Athletic build, moderate muscles, easy to maintain steady weight' },
    kapha: { label: 'Solid & Broad', detail: 'Sturdy, broad shoulders/hips, easily gains weight, slower pace' }
  },
  {
    id: 'skin',
    title: 'Skin Texture & Temperature (Sparsha)',
    subtitle: 'Touch characteristics and weather sensitivity',
    vata: { label: 'Dry & Cool', detail: 'Prone to roughness, cracking in winter, cold hands and feet' },
    pitta: { label: 'Warm & Sensitive', detail: 'Prone to redness, rashes, moles, flushes easily in heat' },
    kapha: { label: 'Soft, Oily & Thick', detail: 'Smooth, cool, well-hydrated, slow to show wrinkles' }
  },
  {
    id: 'digestion',
    title: 'Digestive Fire & Appetite (Agni)',
    subtitle: 'How your stomach responds to daily meals',
    vata: { label: 'Irregular (Vishama Agni)', detail: 'Unpredictable hunger, bloating, gas, skips meals without noticing' },
    pitta: { label: 'Intense (Tikshna Agni)', detail: 'Strong sharp appetite, irritable if meals delayed, hyperacidity' },
    kapha: { label: 'Slow & Steady (Manda Agni)', detail: 'Moderate hunger, feels heavy after normal meals, can fast comfortably' }
  },
  {
    id: 'thermal',
    title: 'Thermal Preference & Weather Reaction',
    subtitle: 'Comfort in different seasons',
    vata: { label: 'Loves Warmth', detail: 'Strong aversion to cold drafts, air conditioning, and dry winds' },
    pitta: { label: 'Loves Cold', detail: 'Intolerant of direct sunlight, hot weather, and humid rooms' },
    kapha: { label: 'Dislikes Cold & Damp', detail: 'Prefers warm and dry climates, congestion in damp rainy weather' }
  },
  {
    id: 'sleep',
    title: 'Sleep Pattern & Dreams (Nidra)',
    subtitle: 'Quality of nocturnal rest',
    vata: { label: 'Light & Interrupted', detail: 'Wakes up around 2-4 AM, light sleeper, dreams of flying or running' },
    pitta: { label: 'Moderate & Sound', detail: 'Sleeps 6-7 hours, can wake up refreshed, colorful intense dreams' },
    kapha: { label: 'Deep & Heavy', detail: 'Heavy sleeper, difficult to awaken in mornings, dreams of water/lakes' }
  },
  {
    id: 'mind',
    title: 'Mental Disposition & Stress Reaction',
    subtitle: 'Natural emotional response under pressure',
    vata: { label: 'Quick & Anxious', detail: 'Learns rapidly, forgets quickly, prone to worry and restlessness' },
    pitta: { label: 'Sharp & Ambitious', detail: 'Perfectionist, strong focus, prone to impatience, anger, or frustration' },
    kapha: { label: 'Calm & Patient', detail: 'Tranquil, methodical, loyal, prone to complacency or resistance to change' }
  }
];

interface PrakritiQuizProps {
  answers: Record<string, 'vata' | 'pitta' | 'kapha'>;
  onAnswerChange: (questionId: string, value: 'vata' | 'pitta' | 'kapha') => void;
}

export const PrakritiQuiz: React.FC<PrakritiQuizProps> = ({ answers, onAnswerChange }) => {
  // Calculate quick score
  const counts = { vata: 0, pitta: 0, kapha: 0 };
  Object.values(answers).forEach((val) => {
    if (val) counts[val]++;
  });
  const total = Object.values(answers).length || 1;
  const vataPct = Math.round((counts.vata / Math.max(total, 6)) * 100);
  const pittaPct = Math.round((counts.pitta / Math.max(total, 6)) * 100);
  const kaphaPct = Math.round((counts.kapha / Math.max(total, 6)) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Ayush Constitutional Intake (Prakriti & Agni Assessment)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized CCRA-aligned self-check to evaluate your baseline bio-energetic balance (Tridosha)
          </p>
        </div>

        {/* Live Dosha Pill Indicator */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
          <span className="flex items-center gap-1 font-bold text-blue-700">
            <Wind className="w-3.5 h-3.5" /> V: {vataPct}%
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 font-bold text-amber-700">
            <Flame className="w-3.5 h-3.5" /> P: {pittaPct}%
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 font-bold text-emerald-700">
            <Droplets className="w-3.5 h-3.5" /> K: {kaphaPct}%
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {QUESTIONS.map((q, idx) => (
          <div key={q.id} className="pb-5 border-b border-slate-100 last:border-none last:pb-0">
            <div className="flex items-baseline gap-2 mb-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-bold">
                {idx + 1}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{q.title}</h4>
                <p className="text-[11px] text-slate-500">{q.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Vata Option */}
              <button
                type="button"
                onClick={() => onAnswerChange(q.id, 'vata')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  answers[q.id] === 'vata'
                    ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-blue-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-blue-600" />
                    {q.vata.label}
                  </span>
                  {answers[q.id] === 'vata' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{q.vata.detail}</p>
              </button>

              {/* Pitta Option */}
              <button
                type="button"
                onClick={() => onAnswerChange(q.id, 'pitta')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  answers[q.id] === 'pitta'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:border-amber-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-600" />
                    {q.pitta.label}
                  </span>
                  {answers[q.id] === 'pitta' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{q.pitta.detail}</p>
              </button>

              {/* Kapha Option */}
              <button
                type="button"
                onClick={() => onAnswerChange(q.id, 'kapha')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  answers[q.id] === 'kapha'
                    ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-emerald-600" />
                    {q.kapha.label}
                  </span>
                  {answers[q.id] === 'kapha' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{q.kapha.detail}</p>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
