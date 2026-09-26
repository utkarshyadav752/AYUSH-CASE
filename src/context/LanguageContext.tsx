import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, Translations, TRANSLATIONS, getTranslation } from '../utils/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  speak: (text: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'ayush_selected_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage?: string }> = ({ 
  children,
  initialLanguage = 'English'
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && TRANSLATIONS[stored as SupportedLanguage]) {
        return stored as SupportedLanguage;
      }
    } catch (e) {
      console.warn('Could not read stored language', e);
    }
    return (TRANSLATIONS[initialLanguage as SupportedLanguage] ? initialLanguage : 'English') as SupportedLanguage;
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save language to storage', e);
    }
  };

  useEffect(() => {
    // Set html lang attribute
    const codeMap: Record<SupportedLanguage, string> = {
      English: 'en',
      Hindi: 'hi',
      Hinglish: 'hi-Latn',
      Tamil: 'ta',
      Marathi: 'mr',
      Bengali: 'bn',
      Telugu: 'te',
    };
    document.documentElement.lang = codeMap[language] || 'en';
  }, [language]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const langCodeMap: Record<SupportedLanguage, string> = {
      English: 'en-IN',
      Hindi: 'hi-IN',
      Hinglish: 'hi-IN',
      Tamil: 'ta-IN',
      Marathi: 'mr-IN',
      Bengali: 'bn-IN',
      Telugu: 'te-IN',
    };

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCodeMap[language] || 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speak }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'English' as SupportedLanguage,
      setLanguage: () => {},
      t: TRANSLATIONS.English,
      speak: () => {},
    };
  }
  return context;
}
