import React, { useState } from 'react';
import { 
  GitCompare, ShieldCheck, CheckCircle2, XCircle, Sparkles, BookOpen, 
  ExternalLink, Search, Pill, Layers, Cpu, Award, Zap, Stethoscope, ArrowRight
} from 'lucide-react';
import { 
  COMPETITOR_BENCHMARKS, 
  CLASSICAL_FORMULARY_CATALOG, 
  REPERTORY_SAMPLE_RUBRICS,
  SoftwareComparisonItem
} from '../../data/competitorBenchmark';

interface SoftwareComparisonViewProps {
  onSelectFormulation?: (formulationText: string) => void;
  onNavigateToCockpit?: () => void;
}

export const SoftwareComparisonView: React.FC<SoftwareComparisonViewProps> = ({
  onSelectFormulation,
  onNavigateToCockpit
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'comparison' | 'matrix' | 'repertory' | 'dispensary'>('comparison');
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareComparisonItem>(COMPETITOR_BENCHMARKS[0]);
  const [formularySearch, setFormularySearch] = useState('');
  const [systemFilter, setSystemFilter] = useState<string>('All');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const filteredFormulary = CLASSICAL_FORMULARY_CATALOG.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(formularySearch.toLowerCase()) ||
                          item.indications.toLowerCase().includes(formularySearch.toLowerCase()) ||
                          item.namasteCode.toLowerCase().includes(formularySearch.toLowerCase());
    const matchesSystem = systemFilter === 'All' || item.system === systemFilter;
    return matchesSearch && matchesSystem;
  });

  const handleApplyFormulation = (item: typeof CLASSICAL_FORMULARY_CATALOG[0]) => {
    const text = `${item.name} (${item.system} ${item.category}) - ${item.dosage} with ${item.anupana} [${item.namasteCode}]`;
    if (onSelectFormulation) {
      onSelectFormulation(text);
    }
    setCopiedNotification(item.name);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 sm:p-8 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <GitCompare className="w-3.5 h-3.5" />
                Ecosystem Benchmark
              </span>
              <span aria-hidden="true">·</span>
              <span>6 Leading Ayush & Clinical Systems</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ayush EHR Comparison & Classical Formulary
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Comparison across existing homeopathic repertories (RadarOpus, MacRepertory) and national backbones (NAMASTE, AHMIS/Ayush Grid, e-Aushadhi, AyurCDS), synthesizing core features into AyushCase.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveSubSection('matrix')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Comparison Matrix</span>
            </button>
            <button
              onClick={() => setActiveSubSection('dispensary')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pill className="w-3.5 h-3.5 text-emerald-400" />
              <span>e-Aushadhi Catalog</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-slate-800 overflow-x-auto text-xs font-medium">
          {[
            { id: 'comparison', label: 'Software Benchmarks', icon: GitCompare },
            { id: 'matrix', label: 'Capability Matrix', icon: Award },
            { id: 'dispensary', label: 'Classical Formulary', icon: Pill },
            { id: 'repertory', label: 'Repertory Synthesis', icon: BookOpen },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeSubSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubSection(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {copiedNotification && (
        <div className="bg-slate-900 text-white px-4 py-2 rounded-md text-xs flex items-center justify-between border border-slate-800 shadow-xs">
          <span>Added "{copiedNotification}" to clinical prescription buffer</span>
          <button 
            onClick={onNavigateToCockpit}
            className="text-emerald-400 hover:underline text-xs cursor-pointer ml-3"
          >
            Review in Vaidya EHR →
          </button>
        </div>
      )}

      {/* VIEW 1: Software Deep-Dives & Benchmarking */}
      {activeSubSection === 'comparison' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list of benchmarked software */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Analyzed Ayush & Repertory Platforms
              </h3>
              {COMPETITOR_BENCHMARKS.map((comp) => {
                const isSelected = selectedSoftware.name === comp.name;
                return (
                  <div
                    key={comp.name}
                    onClick={() => setSelectedSoftware(comp)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-md'
                        : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{comp.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${comp.badgeColor}`}>
                        {comp.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {comp.focus}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {comp.featuresCapturedInAyushCase.length} features incorporated
                      </span>
                      <span className="text-slate-400 group-hover:text-slate-600">Inspect →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Detailed Comparison Card */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                      Platform Profile & Gap Analysis
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {selectedSoftware.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Category: {selectedSoftware.category}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${selectedSoftware.badgeColor}`}>
                    {selectedSoftware.badgeColor.includes('purple') || selectedSoftware.badgeColor.includes('indigo') ? 'Commercial Desktop' : 'Government / Clinical'}
                  </span>
                </div>

                {/* Primary Focus */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Operational Scope & Clinical Intent
                  </h4>
                  <p className="text-xs text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-200/80 leading-relaxed">
                    {selectedSoftware.focus}
                  </p>
                </div>

                {/* Strengths & Limitations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Notable Strengths</span>
                    </h5>
                    <ul className="space-y-1.5 text-[11px] text-slate-700">
                      {selectedSoftware.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                    <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-amber-600" />
                      <span>Gaps & Limitations</span>
                    </h5>
                    <ul className="space-y-1.5 text-[11px] text-slate-700">
                      {selectedSoftware.limitations.map((l, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* How AyushCase Integrated & Elevated This */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>How AyushCase Incorporates & Elevates These Capabilities</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {selectedSoftware.featuresCapturedInAyushCase.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                        <span className="w-5 h-5 rounded-md bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          ✓
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Complete Capability Matrix Table */}
      {activeSubSection === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cross-Software Feature & Interoperability Benchmark
              </h3>
              <p className="text-xs text-slate-500">
                Detailed comparison of AyushCase against current government systems and commercial proprietary tools.
              </p>
            </div>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full self-start">
              AyushCase: 100% Full Feature Coverage
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-200 font-bold">
                  <th className="p-3">Feature Capability</th>
                  <th className="p-3 text-slate-600">RadarOpus / MacRep</th>
                  <th className="p-3 text-slate-600">AHMIS (Ayush Grid)</th>
                  <th className="p-3 text-slate-600">NAMASTE Portal</th>
                  <th className="p-3 text-slate-600">e-Aushadhi</th>
                  <th className="p-3 text-slate-600">AyurCDS</th>
                  <th className="p-3 text-emerald-900 bg-emerald-100/90 font-extrabold">AyushCase (Ours)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Patient-Led Multilingual Voice Dictation</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-red-500">✕ None (Clerk only)</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-red-500">✕ English forms</td>
                  <td className="p-3 font-bold text-emerald-700 bg-emerald-50">✓ Spoken Hindi, Hinglish, Tamil, Marathi, Bengali</td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-900">Ayush Constitutional Intake (Prakriti / Agni)</td>
                  <td className="p-3 text-amber-600">△ Thermal/Mind only</td>
                  <td className="p-3 text-amber-600">△ Basic dropdown</td>
                  <td className="p-3 text-red-500">✕ Reference only</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-emerald-600">✓ Ayurvedic questionnaire</td>
                  <td className="p-3 font-bold text-emerald-700 bg-emerald-50">✓ Standardized CCRA Tridosha Radar + Agni & Koshtha</td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-900">Ashtavidha Pariksha & Tongue Visual Guide</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-amber-600">△ Text note only</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-amber-600">△ Doctor manual entry</td>
                  <td className="p-3 font-bold text-emerald-700 bg-emerald-50">✓ 8-Fold Extraction + Visual Jihva Pariksha</td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-900">NAMASTE & WHO ICD-11 Dual-Coding</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-amber-600">△ Manual selection</td>
                  <td className="p-3 text-emerald-600">✓ Code repository</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-amber-600">△ Partial ICD-10</td>
                  <td className="p-3 font-bold text-emerald-700 bg-emerald-50">✓ Automated AI Classification & ICD-11 Mapping</td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-900">Repertory Rubrics & Simillimum Search</td>
                  <td className="p-3 text-emerald-600">✓ Synthesis (90+ reps)</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 font-bold text-emerald-700 bg-emerald-50">✓ Integrated Homeopathic Rubric & Grade Explorer</td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-900">Classical Formulary & Dispensary Anupana</td>
                  <td className="p-3 text-red-500">✕ Potencies only</td>
                  <td className="p-3 text-amber-600">△ Hospital stock list</td>
                  <td className="p-3 text-red-500">✕ Terminology only</td>
                  <td className="p-3 text-emerald-600">✓ Drug warehouse supply</td>
                  <td className="p-3 text-amber-600">△ Custom templates</td>
                  <td className="p-3 font-bold text-emerald-700 bg-emerald-50">✓ Integrated e-Aushadhi Classical Formulary + 1-Click Rx</td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-900">Clinical Red Flags & Safety Triage</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-red-500">✕ None</td>
                  <td className="p-3 text-amber-600">△ Batch recall only</td>
                  <td className="p-3 text-amber-600">△ Basic contraindications</td>
                  <td className="p-3 font-bold text-emerald-700 bg-emerald-50">✓ Automated Emergency Triage & Lab Watchlist</td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-900">ABDM / FHIR R4 Bundle Export & ABHA ID</td>
                  <td className="p-3 text-red-500">✕ Closed binary</td>
                  <td className="p-3 text-emerald-600">✓ ABDM compliant</td>
                  <td className="p-3 text-red-500">✕ Lookup only</td>
                  <td className="p-3 text-red-500">✕ Warehouse only</td>
                  <td className="p-3 text-amber-600">△ Proprietary export</td>
                  <td className="p-3 font-bold text-emerald-700 bg-emerald-50">✓ Instant NRCES-compliant FHIR R4 JSON & ABHA linkage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: e-Aushadhi Classical Dispensary & Formulary */}
      {activeSubSection === 'dispensary' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Pill className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  e-Aushadhi Integrated Classical Formulary & Dispensary
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardized classical medicines from the Ayurvedic, Siddha, Unani & Homeopathic Pharmacopoeia of India. Tap "Add to Prescription" to instantly add to the Vaidya clinical plan.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center flex-wrap gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={formularySearch}
                  onChange={(e) => setFormularySearch(e.target.value)}
                  placeholder="Search drug, indication, or code..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 w-56"
                />
              </div>

              <select
                value={systemFilter}
                onChange={(e) => setSystemFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 focus:border-emerald-500 font-medium cursor-pointer"
              >
                <option value="All">All Ayush Systems</option>
                <option value="Ayurveda">Ayurveda</option>
                <option value="Homeopathy">Homeopathy</option>
                <option value="Unani">Unani</option>
                <option value="Siddha">Siddha</option>
              </select>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFormulary.map((med) => (
              <div key={med.name} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                        {med.system} • {med.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {med.namasteCode}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyFormulation(med)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-xs"
                  >
                    <span>+ Add to Rx</span>
                  </button>
                </div>

                <div className="text-xs space-y-1 text-slate-600 pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="font-semibold text-slate-800">Indications:</span> {med.indications}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-800">Dosage:</span> {med.dosage}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Anupana (Carrier):</span> {med.anupana}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-700">Formulation Ingredients:</span> {med.keyIngredients}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: RadarOpus / Synthesis Repertorizer */}
      {activeSubSection === 'repertory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  RadarOpus / Synthesis Repertory Rubric & Simillimum Engine
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Emulates Hahnemannian Kentian repertorization with symptom rubrics, remedy grading (Grade 1 to 4), and miasmatic polarities.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 rounded-full font-semibold">
              Repertorization Module
            </span>
          </div>

          {/* Rubrics List */}
          <div className="space-y-4">
            {REPERTORY_SAMPLE_RUBRICS.map((rubric) => (
              <div key={rubric.id} className="p-4 rounded-xl border border-purple-200/80 bg-purple-50/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-mono text-xs font-bold text-purple-950">
                    {rubric.rubric}
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded self-start sm:self-auto">
                    {rubric.section}
                  </span>
                </div>

                {/* Remedies Grading Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600 mr-2">Top Simillimum Remedies:</span>
                  {rubric.topRemedies.map((rem, i) => (
                    <div 
                      key={i} 
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 ${
                        rem.grade === 4 
                          ? 'bg-red-50 text-red-900 border-red-200 font-bold' 
                          : rem.grade === 3 
                          ? 'bg-amber-50 text-amber-900 border-amber-200 font-semibold' 
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span>{rem.remedy}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/80 border border-current font-mono">
                        Grade {rem.grade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
