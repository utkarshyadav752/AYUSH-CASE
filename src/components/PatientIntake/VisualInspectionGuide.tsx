import React from 'react';
import { Eye, HelpCircle, CheckCircle } from 'lucide-react';

interface VisualInspectionGuideProps {
  selectedTongueState: string;
  onSelectTongueState: (state: string) => void;
}

const TONGUE_OPTIONS = [
  {
    id: 'clean-pink',
    title: 'Clean, Pink & Moist (Nirama Jihva)',
    description: 'Normal healthy Agni; no thick coating or deep fissures',
    indication: 'Balanced digestion, low Ama (toxins)',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  },
  {
    id: 'white-coating',
    title: 'Thick White / Sluggish Coating (Sama / Kapha-Vata)',
    description: 'Noticeable white film, especially visible upon waking',
    indication: 'Presence of Ama, sluggish gut fire (Manda Agni)',
    color: 'bg-blue-50 border-blue-200 text-blue-900',
  },
  {
    id: 'yellow-bitter',
    title: 'Yellowish / Red Margin Coating (Pitta Jihva)',
    description: 'Yellow film, red papillae, burning sensation or bitter taste',
    indication: 'Pitta aggravation, excess bile/acid secretion',
    color: 'bg-amber-50 border-amber-200 text-amber-900',
  },
  {
    id: 'cracked-dry',
    title: 'Dry, Darkened, Cracked or Quivering (Vata Jihva)',
    description: 'Dry rough surface, cracks along center, mild tremor',
    indication: 'Vata vitiation, dehydration, tissue depletion (Dhatu Kshaya)',
    color: 'bg-purple-50 border-purple-200 text-purple-900',
  },
];

export const VisualInspectionGuide: React.FC<VisualInspectionGuideProps> = ({
  selectedTongueState,
  onSelectTongueState,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800">
            <Eye className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Jihva Pariksha (Tongue Observation Self-Check)
            </h3>
            <p className="text-[11px] text-slate-500">
              In Ayush diagnosis, tongue coating reflects internal digestive fire (Agni) and gut toxins (Ama)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TONGUE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelectTongueState(opt.id)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedTongueState === opt.id
                ? `${opt.color} ring-2 ring-emerald-600/30`
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                {selectedTongueState === opt.id && (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">{opt.description}</p>
            </div>
            <span className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Ayush Sign: {opt.indication}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
