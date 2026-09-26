import React, { useState, useEffect } from 'react';
import { 
  Bell, Droplets, Pill, Clock, CheckCircle2, Volume2, 
  VolumeX, AlertCircle, Sun, Sunset, Moon, Coffee, Sparkles, Check
} from 'lucide-react';

export interface ScheduleItem {
  id: string;
  type: 'medicine' | 'water';
  title: string;
  amountOrDose: string;
  timingLabel: string;
  timeString: string; // e.g., "08:00 AM"
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  visualIcon: 'pill' | 'powder' | 'liquid' | 'water';
  colorHex: string;
  instructions: string;
  completed: boolean;
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  {
    id: 'w-1',
    type: 'water',
    title: 'Warm Water Hydration (Ushnodaka)',
    amountOrDose: '1 Big Glass (250 ml warm)',
    timingLabel: 'Wake-up Morning',
    timeString: '06:30 AM',
    period: 'morning',
    visualIcon: 'water',
    colorHex: '#0284c7',
    instructions: 'Sip slowly while sitting. Cleanses bowels and kindles Agni.',
    completed: true,
  },
  {
    id: 'm-1',
    type: 'medicine',
    title: 'Dashamoola Kwatha',
    amountOrDose: '4 Teaspoons (20 ml) + equal warm water',
    timingLabel: 'Before Breakfast',
    timeString: '07:30 AM',
    period: 'morning',
    visualIcon: 'liquid',
    colorHex: '#d97706',
    instructions: 'Drink on empty stomach before morning meal.',
    completed: true,
  },
  {
    id: 'm-2',
    type: 'medicine',
    title: 'Kaishore Guggulu (Green Tablets)',
    amountOrDose: '2 Round Tablets',
    timingLabel: 'After Breakfast',
    timeString: '08:30 AM',
    period: 'morning',
    visualIcon: 'pill',
    colorHex: '#059669',
    instructions: 'Swallow with lukewarm water. Do NOT take with ice water.',
    completed: false,
  },
  {
    id: 'w-2',
    type: 'water',
    title: 'Mid-Morning Water Reminder',
    amountOrDose: '1 Glass warm/room temp water',
    timingLabel: 'Mid-Morning',
    timeString: '11:00 AM',
    period: 'morning',
    visualIcon: 'water',
    colorHex: '#0284c7',
    instructions: 'Flush toxins, prevent dry throat.',
    completed: false,
  },
  {
    id: 'w-3',
    type: 'water',
    title: 'Post-Lunch Warm Water Sip',
    amountOrDose: 'Half Glass (warm)',
    timingLabel: '30 mins After Lunch',
    timeString: '02:00 PM',
    period: 'afternoon',
    visualIcon: 'water',
    colorHex: '#0284c7',
    instructions: 'Do not drink chilled water after meals.',
    completed: false,
  },
  {
    id: 'm-3',
    type: 'medicine',
    title: 'Kaishore Guggulu (Evening Dose)',
    amountOrDose: '2 Round Tablets',
    timingLabel: 'After Dinner',
    timeString: '08:00 PM',
    period: 'night',
    visualIcon: 'pill',
    colorHex: '#059669',
    instructions: 'Take 20 mins after dinner with warm water.',
    completed: false,
  },
  {
    id: 'm-4',
    type: 'medicine',
    title: 'Ashwagandha Churna (Brown Powder)',
    amountOrDose: '1 Spoonful (5g)',
    timingLabel: 'Bedtime',
    timeString: '09:30 PM',
    period: 'night',
    visualIcon: 'powder',
    colorHex: '#7c3aed',
    instructions: 'Mix in half cup of lukewarm milk or water before sleep.',
    completed: false,
  }
];

export const SimplifiedScheduleReminder: React.FC<{
  speechLanguage?: string;
  customMedicines?: any[];
}> = ({ speechLanguage = 'Hindi', customMedicines }) => {
  const [items, setItems] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [alertBanner, setAlertBanner] = useState<string | null>(null);

  // If custom medicines passed from prescription OCR, merge them in
  useEffect(() => {
    if (customMedicines && customMedicines.length > 0) {
      const generated: ScheduleItem[] = customMedicines.map((m: any, idx: number) => ({
        id: `custom-med-${idx}`,
        type: 'medicine',
        title: m.name,
        amountOrDose: m.dosage || '1 tablet/spoon',
        timingLabel: m.timing || 'As advised',
        timeString: m.timeOfDay?.includes('morning') ? '08:30 AM' : m.timeOfDay?.includes('night') ? '08:30 PM' : '02:00 PM',
        period: m.timeOfDay?.includes('night') ? 'night' : m.timeOfDay?.includes('afternoon') ? 'afternoon' : 'morning',
        visualIcon: m.visualIcon || 'pill',
        colorHex: m.pillColor || '#059669',
        instructions: `Take with ${m.anupana || 'lukewarm water'}. ${m.timing || ''}`,
        completed: false
      }));

      // Combine with water reminders
      const waters = DEFAULT_SCHEDULE.filter(s => s.type === 'water');
      setItems([...generated, ...waters]);
    }
  }, [customMedicines]);

  const toggleComplete = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const nextState = !item.completed;
        if (nextState) {
          playSuccessFeedback(item.title);
        }
        return { ...item, completed: nextState };
      }
      return item;
    }));
  };

  const playSuccessFeedback = (title: string) => {
    setAlertBanner(`Shabash! Marked "${title}" as completed.`);
    setTimeout(() => setAlertBanner(null), 3500);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = speechLanguage.toLowerCase().includes('hindi')
        ? `Bahut badhiya! Aapne ${title} le li hai.`
        : `Great job! You took ${title}.`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = speechLanguage.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utter);
    }
  };

  const speakItemDetails = (item: ScheduleItem) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const isHindi = speechLanguage.toLowerCase().includes('hindi');
    let speechText = '';
    if (isHindi) {
      speechText = item.type === 'water'
        ? `Abhi paani peene ka samay hai! ${item.amountOrDose}. ${item.instructions}`
        : `Dawa ka samay! Dawa ka naam hai: ${item.title}. Kitna lena hai: ${item.amountOrDose}. ${item.instructions}`;
    } else {
      speechText = item.type === 'water'
        ? `Time to drink water! ${item.amountOrDose}. ${item.instructions}`
        : `Medicine reminder! Medicine name: ${item.title}. Take ${item.amountOrDose}. ${item.instructions}`;
    }

    const utter = new SpeechSynthesisUtterance(speechText);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const filteredItems = items.filter(i => filterPeriod === 'all' || i.period === filterPeriod);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Bell className="w-3 h-3 text-amber-700 animate-bounce" />
              Smart Alarm & Dose Assistant
            </span>
            <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Spoken Audio & Visual Dose Guide
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Daily Water & Medicine Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Color-coded visual doses and spoken voice reminders. Tap the speaker icon to hear what to do in your language.
          </p>
        </div>

        {/* Period Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterPeriod === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Doses
          </button>
          <button
            onClick={() => setFilterPeriod('morning')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              filterPeriod === 'morning' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Morning</span>
          </button>
          <button
            onClick={() => setFilterPeriod('night')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              filterPeriod === 'night' ? 'bg-white text-indigo-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Night</span>
          </button>
        </div>
      </div>

      {alertBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{alertBanner}</span>
        </div>
      )}

      {/* Grid of Large Simplified Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
              item.completed
                ? 'bg-slate-50/70 border-slate-200 opacity-60'
                : item.type === 'water'
                ? 'bg-sky-50/50 border-sky-200 hover:border-sky-400 shadow-xs'
                : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 shadow-xs'
            }`}
          >
            <div>
              {/* Top row: Time + Visual Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs font-black text-lg"
                    style={{ backgroundColor: item.colorHex }}
                  >
                    {item.type === 'water' ? (
                      <Droplets className="w-5 h-5 text-white" />
                    ) : item.visualIcon === 'liquid' ? (
                      '💧'
                    ) : item.visualIcon === 'powder' ? (
                      '🥄'
                    ) : (
                      '💊'
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block font-mono">
                      {item.timeString}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {item.timingLabel}
                    </span>
                  </div>
                </div>

                {/* Big Voice Speaker Button */}
                <button
                  type="button"
                  onClick={() => speakItemDetails(item)}
                  title="Listen in Voice"
                  className="w-9 h-9 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center transition-transform hover:scale-105 shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Exact Amount */}
              <h3 className="text-base font-extrabold text-slate-900">
                {item.title}
              </h3>

              {/* High-visibility Dose Box */}
              <div className="my-2.5 p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">How much to take:</span>
                <span className="text-xs font-black text-emerald-800">
                  {item.amountOrDose}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                👉 {item.instructions}
              </p>
            </div>

            {/* Big Action Checkbox */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">
                {item.completed ? 'Completed ✓' : 'Did you take it?'}
              </span>
              <button
                type="button"
                onClick={() => toggleComplete(item.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                }`}
              >
                {item.completed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <span>Mark as Done</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
