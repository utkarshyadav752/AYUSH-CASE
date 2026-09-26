import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Phone, Star, ShieldCheck, 
  ExternalLink, Search, Hospital, Pill, CheckCircle2, 
  Clock, Volume2, Sparkles, Building2, Stethoscope
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

export interface AyushFacility {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  userRatingCount: number;
  phone: string;
  type: 'clinic' | 'pharmacy' | 'hospital';
  system: string;
  nabhAccredited: boolean;
  ayushMinistryCertified: boolean;
  openNow: boolean;
  services: string[];
}

interface AyushClinicFinderProps {
  initialCity?: string;
  patientRegion?: string;
  language?: string;
}

export const AyushClinicFinder: React.FC<AyushClinicFinderProps> = ({
  initialCity = 'Delhi',
  patientRegion,
  language = 'Hindi',
}) => {
  const [selectedCity, setSelectedCity] = useState<string>(patientRegion || initialCity || 'Delhi');
  const [filterType, setFilterType] = useState<'all' | 'clinic' | 'pharmacy' | 'hospital'>('all');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [facilities, setFacilities] = useState<AyushFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<AyushFacility | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDSrk_5YoFZVO49Q3pDlRhkCGfLCY8be5k';

  // Indian Cities with certified regional nodes
  const popularCities = [
    { name: 'Delhi NCR', key: 'delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', key: 'mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bengaluru', key: 'bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Jaipur', key: 'jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Varanasi', key: 'varanasi', lat: 25.3176, lng: 82.9739 },
    { name: 'Kochi (Kerala)', key: 'kochi', lat: 9.9312, lng: 76.2673 },
  ];

  const currentCityObj = popularCities.find(c => c.key === selectedCity.toLowerCase()) || popularCities[0];

  const fetchFacilities = async (city: string, system: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ayush-facilities?city=${encodeURIComponent(city)}&system=${encodeURIComponent(system)}`);
      const data = await res.json();
      if (data.facilities && Array.isArray(data.facilities)) {
        setFacilities(data.facilities);
        if (data.facilities.length > 0) {
          setSelectedFacility(data.facilities[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load Ayush facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities(selectedCity, selectedSystem);
  }, [selectedCity, selectedSystem]);

  // Request browser geolocation
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocatingUser(false);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable, using selected city center:', err);
        setLocatingUser(false);
      },
      { timeout: 8000 }
    );
  };

  // Text-to-speech for elderly / rural patients
  const speakFacilityInfo = (f: AyushFacility) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = language.toLowerCase().includes('hindi');
    const text = isHindi
      ? `Aapke paas ${f.name} sthit hai. Pata hai: ${f.address}. Sampark number: ${f.phone}. Yahan Ayush mantralaya dwara pramanit nishulk paramarsh aur dawaiyan upalabdha hain.`
      : `Nearest certified center is ${f.name}, located at ${f.address}. Contact: ${f.phone}. Ministry of Ayush verified with free OPD and generic medicines.`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = isHindi ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const filteredFacilities = facilities.filter(f => {
    if (filterType === 'all') return true;
    return f.type === filterType;
  });

  const mapCenter = userLocation || {
    lat: currentCityObj.lat,
    lng: currentCityObj.lng
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-7 space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Ministry of Ayush Certified Registry
            </span>
            <span className="text-slate-500 text-xs font-semibold">Google Maps Places Integration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Nearest Ayush Clinics, Dispensaries & Pharmacies
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Locate verified government Ayush dispensaries, NABH-accredited Ayurvedic/Homeopathic hospitals, and authentic IMPCL medicine stores with subsidized formulations.
          </p>
        </div>

        {/* GPS Current Location Button */}
        <button
          type="button"
          onClick={handleDetectCurrentLocation}
          disabled={locatingUser}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Navigation className={`w-4 h-4 ${locatingUser ? 'animate-spin' : ''}`} />
          <span>{locatingUser ? 'Detecting GPS...' : 'Find Near My GPS Location'}</span>
        </button>
      </div>

      {/* City Selector & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            City / Region:
          </span>
          {popularCities.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelectedCity(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCity.toLowerCase() === c.key
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700">Filter:</span>
          {(['all', 'clinic', 'pharmacy', 'hospital'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split View: Interactive Google Map + Facility Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-7 h-[420px] rounded-3xl overflow-hidden border border-slate-300 shadow-inner relative bg-slate-100">
          <APIProvider apiKey={mapsApiKey}>
            <Map
              defaultCenter={mapCenter}
              center={mapCenter}
              defaultZoom={12}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="w-full h-full"
            >
              {/* User location pin */}
              {userLocation && (
                <AdvancedMarker position={userLocation}>
                  <div className="bg-sky-600 text-white p-2 rounded-full shadow-lg border-2 border-white animate-pulse">
                    <Navigation className="w-4 h-4" />
                  </div>
                </AdvancedMarker>
              )}

              {/* Verified Ayush Centers */}
              {filteredFacilities.map((facility) => (
                <AdvancedMarker
                  key={facility.id}
                  position={{ lat: facility.lat, lng: facility.lng }}
                  onClick={() => setSelectedFacility(facility)}
                >
                  <Pin
                    background={facility.type === 'pharmacy' ? '#0284c7' : facility.type === 'hospital' ? '#047857' : '#d97706'}
                    borderColor="#ffffff"
                    glyphColor="#ffffff"
                  />
                </AdvancedMarker>
              ))}

              {/* Info Window for Selected Center */}
              {selectedFacility && (
                <InfoWindow
                  position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
                  onCloseClick={() => setSelectedFacility(null)}
                >
                  <div className="p-2 max-w-xs text-slate-900 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full inline-block">
                      {selectedFacility.system} • {selectedFacility.type}
                    </span>
                    <h4 className="text-xs font-extrabold">{selectedFacility.name}</h4>
                    <p className="text-[11px] text-slate-600">{selectedFacility.address}</p>
                    <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedFacility.phone}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Right Column: Verified Facilities List with Audio & Direct Nav */}
        <div className="lg:col-span-5 space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 font-bold">
              Fetching certified centers in {selectedCity}...
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-bold">
              No facilities found matching your criteria in {selectedCity}.
            </div>
          ) : (
            filteredFacilities.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFacility(f)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedFacility?.id === f.id
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                        {f.system}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 capitalize">
                        • {f.type}
                      </span>
                      {f.nabhAccredited && (
                        <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md">
                          NABH
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                      {f.name}
                    </h3>
                  </div>

                  {/* Audio Read-Out Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakFacilityInfo(f);
                    }}
                    title="Listen facility details aloud"
                    className="p-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 shrink-0 cursor-pointer shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{f.address}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold">
                    <Phone className="w-3 h-3" />
                    <span>{f.phone}</span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(f.name + ' ' + f.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
