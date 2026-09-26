import React, { useState } from 'react';
import { 
  Stethoscope, FileText, Award, Mic, Sparkles,
  ShieldCheck, Languages, LayoutDashboard, User, LogIn, LogOut, 
  CheckCircle2, Bot, Bell, Volume2, Pill, Smartphone, Menu, X, ChevronRight
} from 'lucide-react';
import { UserAccount } from '../data/mockUsers';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../utils/translations';

interface HeaderProps {
  currentTab: 'dashboard' | 'guide' | 'patient' | 'doctor' | 'compare' | 'hackathon';
  setCurrentTab: (tab: 'dashboard' | 'guide' | 'patient' | 'doctor' | 'compare' | 'hackathon') => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  caseCount: number;
  currentUser: UserAccount | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenDoctorAi?: () => void;
  onOpenHealthTracker?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedLanguage,
  setSelectedLanguage,
  caseCount,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenDoctorAi,
  onOpenHealthTracker,
}) => {
  const { t, language, setLanguage, speak } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    setLanguage(newLang as SupportedLanguage);
  };

  const speakAppIntro = () => {
    const textMap: Record<string, string> = {
      English: 'Welcome to AyushCase. You can record your health symptoms by voice, track prescribed medicine schedules, and review certified clinical EHR records.',
      Hindi: 'आयुष केस में आपका स्वागत है। आप आवाज़ से अपने लक्षण बता सकते हैं, दवा का समय देख सकते हैं, और प्रमाणित ईएचआर रिकॉर्ड की समीक्षा कर सकते हैं।',
      Hinglish: 'AyushCase mein aapka swagat hai. Yahan aap bol kar symptoms bata sakte hain, dawa ka time dekh sakte hain, aur verified EHR records check kar sakte hain.',
      Tamil: 'ஆயுஷ் கேஸ் தளத்திற்கு வரவேற்கிறோம். உங்கள் குரல் மூலம் அறிகுறிகளைப் பதிவுசெய்து, மருந்து அட்டவணைகளைக் கண்காணிக்கலாம்.',
      Marathi: 'आयुष केस मध्ये आपले स्वागत आहे. आपण आवाजाने आपली लक्षणे सांगू शकता आणि औषध वेळापत्रक तपासू शकता.',
      Bengali: 'আয়ুষ কেস পোর্টালে স্বাগতম। আপনি ভয়েস দিয়ে লক্ষণ রেকর্ড করতে পারেন এবং ওষুধের সময়সূচী দেখতে পারেন।',
      Telugu: 'ఆయుష్ కేస్ పోర్టల్‌కు స్వాగతం. మీరు మీ వాయిస్ ద్వారా లక్షణాలను రికార్డ్ చేయవచ్చు మరియు మందుల షెడ్యూల్‌ను చూడవచ్చు.',
    };
    speak(textMap[selectedLanguage] || textMap.English);
  };

  const navItems = [
    { id: 'dashboard' as const, label: t.navDashboard, icon: LayoutDashboard },
    { id: 'guide' as const, label: t.navGuide, icon: Bell },
    { id: 'patient' as const, label: t.navIntake, icon: Mic },
    { id: 'doctor' as const, label: t.navDoctor, icon: Stethoscope, badge: caseCount > 0 ? caseCount : undefined },
    { id: 'compare' as const, label: t.navFormulary, icon: Pill },
    { id: 'hackathon' as const, label: t.navDossier, icon: Award },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        {/* Institutional Top Ribbon (Clean & Responsive) */}
        <div className="bg-slate-900 text-slate-300 text-xs px-3 sm:px-8 py-1 font-medium flex items-center justify-between gap-2 overflow-x-hidden">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="font-semibold text-slate-200">{t.ministryOfAyush}</span>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-slate-400 hidden sm:inline">{t.nationalMission}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[11px] shrink-0">
            <button
              type="button"
              onClick={speakAppIntro}
              title="Audio Guide (Listen aloud)"
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline">{t.audioGuide}</span>
            </button>
            <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ABDM / FHIR R4</span>
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <div 
            onClick={() => setCurrentTab('dashboard')} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  Ayush<span className="text-emerald-700">Case</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-1 rounded">
                  EHR
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden md:block">
                Clinical Case-Taking & Scribe
              </p>
            </div>
          </div>

          {/* Desktop Primary View Switcher */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-lg border border-slate-200/80 overflow-x-auto max-w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 text-[10px] font-mono tabular-nums bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-sm font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Phone Sync, Doctor AI, Language & Auth Status */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Phone Health App Sync Trigger (Hidden on tiny screens, accessible in drawer) */}
            {onOpenHealthTracker && (
              <button
                type="button"
                onClick={onOpenHealthTracker}
                className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                title={t.phoneSync}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden md:inline">{t.phoneSync}</span>
              </button>
            )}

            {/* Doctor AI Explainer Trigger */}
            {onOpenDoctorAi && (
              <button
                type="button"
                onClick={onOpenDoctorAi}
                className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md px-2 sm:px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                title={t.doctorAi}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="hidden xs:inline">{t.doctorAi}</span>
              </button>
            )}

            {/* Language Selector (Always visible & phone friendly) */}
            <div className="flex items-center gap-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-md px-1.5 sm:px-2 py-1.5 hover:border-slate-300 transition-colors shadow-2xs">
              <Languages className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer pr-1"
                aria-label={t.languageSelect}
              >
                <option value="English">EN (English)</option>
                <option value="Hindi">HI (हिन्दी)</option>
                <option value="Hinglish">HG (Hinglish)</option>
                <option value="Tamil">TA (தமிழ்)</option>
                <option value="Marathi">MR (मराठी)</option>
                <option value="Bengali">BN (বাংলা)</option>
                <option value="Telugu">TE (తెలుగు)</option>
              </select>
            </div>

            {/* Desktop User Account / Login Button */}
            <div className="hidden sm:block">
              {currentUser ? (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs">
                  <div className="w-6 h-6 rounded bg-emerald-700 text-white flex items-center justify-center font-semibold text-[11px]">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="font-semibold text-slate-900 block leading-tight text-[11px] truncate max-w-[100px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase block leading-tight">
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    title={t.logout}
                    className="text-slate-400 hover:text-red-600 p-0.5 transition-colors cursor-pointer ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.loginAbha}</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Over Drawer Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[88px] z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-start">
            <div className="bg-white border-b border-slate-200 p-4 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
              {/* User Account Strip on Mobile */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                {currentUser ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {currentUser.abhaId || currentUser.role}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {t.guestSession}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Sign in for personalized Ayush EHR & ABHA sync
                    </span>
                  </div>
                )}

                {currentUser ? (
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1 bg-white rounded border border-red-200 cursor-pointer"
                  >
                    {t.logout}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded cursor-pointer"
                  >
                    {t.loginAbha}
                  </button>
                )}
              </div>

              {/* Navigation Tabs List */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-1">
                  Menu & Modules
                </span>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge !== undefined && (
                          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                {onOpenHealthTracker && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenHealthTracker();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span>{t.phoneSync}</span>
                  </button>
                )}

                {onOpenDoctorAi && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenDoctorAi();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>{t.doctorAi}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Bottom Navigation Bar for Mobile Phones (Fixed at bottom for easy thumb access) */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-1 py-1.5 shadow-lg safe-bottom"
      >
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded transition-colors cursor-pointer ${
            currentTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
            {t.navDashboard}
          </span>
        </button>

        {/* Tab 2: Dose & Alarms */}
        <button
          type="button"
          onClick={() => setCurrentTab('guide')}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded transition-colors cursor-pointer ${
            currentTab === 'guide' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
            {t.navGuide}
          </span>
        </button>

        {/* Tab 3: Center Elevated Voice Intake Button */}
        <button
          type="button"
          onClick={() => setCurrentTab('patient')}
          className="flex flex-col items-center justify-center -mt-4 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover:scale-105 active:scale-95">
            <Mic className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 mt-1">
            {t.navIntake}
          </span>
        </button>

        {/* Tab 4: Vaidya EHR */}
        <button
          type="button"
          onClick={() => setCurrentTab('doctor')}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded transition-colors cursor-pointer ${
            currentTab === 'doctor' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
            {t.navDoctor}
          </span>
        </button>

        {/* Tab 5: Menu / More */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded transition-colors cursor-pointer ${
            isMobileMenuOpen ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-[10px] mt-0.5 tracking-tight">
            Menu
          </span>
        </button>
      </nav>
    </>
  );
};
