export type SupportedLanguage = 
  | 'English' 
  | 'Hindi' 
  | 'Hinglish' 
  | 'Tamil' 
  | 'Marathi' 
  | 'Bengali' 
  | 'Telugu';

export interface Translations {
  // Navigation & Header
  ministryOfAyush: string;
  nationalMission: string;
  autonomousScribe: string;
  audioGuide: string;
  phoneSync: string;
  doctorAi: string;
  loginAbha: string;
  logout: string;
  guestSession: string;
  verified: string;

  navDashboard: string;
  navGuide: string;
  navIntake: string;
  navDoctor: string;
  navFormulary: string;
  navDossier: string;

  // Hero Card
  heroTitle: string;
  heroSubtitle: string;
  heroDoctorAiBtn: string;
  heroAskSathiBtn: string;
  heroDoseAlarmsBtn: string;
  heroVoiceIntakeBtn: string;
  heroVaidyaEhrBtn: string;
  heroPhoneSyncBtn: string;
  heroLoginBtn: string;
  heroDemoIntakeBtn: string;

  // Stat Highlights
  statTimeSaved: string;
  statTimeSavedSub: string;
  statLanguages: string;
  statLanguagesSub: string;
  statInterop: string;
  statInteropSub: string;
  statFormulary: string;
  statFormularySub: string;

  // Phone Health Sync
  phoneSyncTitle: string;
  phoneSyncSubtitle: string;
  openActivityTracker: string;
  stepsToday: string;
  stepGoal: string;
  distanceKm: string;
  caloriesBurned: string;
  activeMinutes: string;
  restingPulse: string;
  nidraSleep: string;
  shatapadiPaces: string;
  syncWithDoctorEhr: string;
  lastSynced: string;

  // Modules Grid
  modulesTitle: string;
  modulesSubtitle: string;
  modIntakeTitle: string;
  modIntakeDesc: string;
  modDoctorTitle: string;
  modDoctorDesc: string;
  modAlarmsTitle: string;
  modAlarmsDesc: string;
  modFormularyTitle: string;
  modFormularyDesc: string;
  modDossierTitle: string;
  modDossierDesc: string;

  // Sections
  visualHealthTitle: string;
  symptomTrendsTitle: string;
  offlineSyncTitle: string;
  caregiverSosTitle: string;
  voiceGuideFloating: string;

  // Doctor Cockpit
  cockpitTitle: string;
  subtabCaseSheet: string;
  subtabChikitsa: string;
  subtabFhir: string;
  subtabActivity: string;
  exportPdf: string;
  exportFhir: string;
  directPrint: string;
  patientPresentation: string;
  complaintsTitle: string;
  tridoshaRadar: string;
  ashtavidhaTitle: string;
  agniKoshthaTitle: string;
  pathyaTitle: string;
  apathyaTitle: string;
  rxPlanTitle: string;
  addRxBtn: string;
  addActivityToRx: string;

  // Patient Intake
  intakeTitle: string;
  intakeSubtitle: string;
  recordingPrompt: string;
  startRecording: string;
  stopRecording: string;
  analyzingNarrative: string;
  generateCaseSheet: string;

  // Common UI
  close: string;
  save: string;
  refresh: string;
  copied: string;
  copy: string;
  languageSelect: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  English: {
    ministryOfAyush: 'Ministry of Ayush',
    nationalMission: 'National Ayush Mission',
    autonomousScribe: 'Autonomous Clinical Case-Taking',
    audioGuide: 'Audio Guide',
    phoneSync: 'Phone Sync',
    doctorAi: 'Doctor AI',
    loginAbha: 'Login / ABHA',
    logout: 'Logout',
    guestSession: 'Guest Session',
    verified: 'Verified',

    navDashboard: 'Dashboard',
    navGuide: 'Dose & Alarms',
    navIntake: 'Voice Intake',
    navDoctor: 'Vaidya EHR',
    navFormulary: 'Formulary',
    navDossier: 'SIH Dossier',

    heroTitle: 'Ayush Case-Taking & Multimodal Clinical Scribe',
    heroSubtitle: 'Capturing natural spoken medical histories across vernacular languages, structured into ABDM FHIR R4 clinical sheets for Ayush physicians and patients.',
    heroDoctorAiBtn: 'Doctor AI Explainer',
    heroAskSathiBtn: 'Ask Ayush Sathi (Voice Assistant)',
    heroDoseAlarmsBtn: 'Dose Schedule & Alarms',
    heroVoiceIntakeBtn: 'Voice Intake',
    heroVaidyaEhrBtn: 'Vaidya EHR',
    heroPhoneSyncBtn: 'Phone Health Sync',
    heroLoginBtn: 'Login / ABHA',
    heroDemoIntakeBtn: 'Demo Intake',

    statTimeSaved: 'Time Saved / Intake',
    statTimeSavedSub: 'Reduced from 45 min',
    statLanguages: 'Vernacular Languages',
    statLanguagesSub: 'Hindi, Hinglish, Tamil...',
    statInterop: 'Interoperability Standard',
    statInteropSub: 'NAMASTE & SNOMED-CT',
    statFormulary: 'Formulary Catalog',
    statFormularySub: 'Classical Formulations',

    phoneSyncTitle: 'Phone Health App & Activity Synchronization',
    phoneSyncSubtitle: 'Live hardware pedometer & HealthKit / Health Connect bridge',
    openActivityTracker: 'Open Activity Tracker',
    stepsToday: 'Steps Today',
    stepGoal: 'Target',
    distanceKm: 'Distance',
    caloriesBurned: 'Calories',
    activeMinutes: 'Active Mins',
    restingPulse: 'Resting Pulse (Nadi)',
    nidraSleep: 'Nidra (Sleep Duration)',
    shatapadiPaces: 'Shatapadi (100 Paces)',
    syncWithDoctorEhr: 'Sync with Doctor EHR',
    lastSynced: 'Last Synced',

    modulesTitle: 'Clinical Modules & Case Workflow',
    modulesSubtitle: 'Select a module to conduct case intakes, inspect EHR sheets, or verify standard compliance.',
    modIntakeTitle: 'Voice Scribe',
    modIntakeDesc: 'Record vernacular symptoms. Gemini AI extracts Ashtavidha Pariksha, Agni, and Tridosha balance.',
    modDoctorTitle: 'Vaidya Cockpit',
    modDoctorDesc: 'Clinician review with Tridosha radar, Ashtavidha findings, Pathya builder, and FHIR export.',
    modAlarmsTitle: 'Dose & Alarms',
    modAlarmsDesc: 'Prescription dosage alarms, nearby verified Ayush clinics via Google Maps, and symptom triage.',
    modFormularyTitle: 'Formulary',
    modFormularyDesc: 'Classical Ayush medicine catalog, e-Aushadhi index, and feature comparison against legacy EHRs.',
    modDossierTitle: 'SIH Dossier',
    modDossierDesc: 'Ministry problem statement alignment, technical architecture diagram, and evaluation rubrics.',

    visualHealthTitle: 'Patient 30-Day Recovery Index',
    symptomTrendsTitle: 'Longitudinal Symptom Severity Trends',
    offlineSyncTitle: 'Offline Mode & ABDM Cloud Sync',
    caregiverSosTitle: 'Caregiver & 1-Touch Family SOS Bridge',
    voiceGuideFloating: 'Ayush Sathi (Voice Guide)',

    cockpitTitle: 'Vaidya Clinical Review & EHR Cockpit',
    subtabCaseSheet: 'Case Sheet',
    subtabChikitsa: 'Chikitsa & Rx',
    subtabFhir: 'FHIR Bundle',
    subtabActivity: 'Phone Vitals & Activity',
    exportPdf: 'Export HTML / PDF',
    exportFhir: 'Export FHIR',
    directPrint: 'Print',
    patientPresentation: 'Patient Presentation Summary',
    complaintsTitle: 'Chief Complaints (Pradhana Vedana)',
    tridoshaRadar: 'Tridosha Constitutional Profile',
    ashtavidhaTitle: 'Ashtavidha Pariksha (Eight-Fold Clinical Examination)',
    agniKoshthaTitle: 'Agni & Koshtha Assessment',
    pathyaTitle: 'Pathya (Wholesome Regimen)',
    apathyaTitle: 'Apathya (Strictly Avoid)',
    rxPlanTitle: 'Chikitsa Plan & Prescriptions (Rx)',
    addRxBtn: 'Add Rx',
    addActivityToRx: 'Add Dinacharya Physical Regimen to Patient Rx',

    intakeTitle: 'Multilingual Clinical Voice Intake',
    intakeSubtitle: 'Speak naturally in your mother tongue. The clinical engine extracts Ayush entities automatically.',
    recordingPrompt: 'Press record and explain your symptoms, pain, digestion, sleep, and lifestyle...',
    startRecording: 'Start Voice Intake',
    stopRecording: 'Stop & Process',
    analyzingNarrative: 'Analyzing clinical narrative with Gemini AI...',
    generateCaseSheet: 'Generate Standardized Ayush Case Sheet',

    close: 'Close',
    save: 'Save',
    refresh: 'Refresh',
    copied: 'Copied!',
    copy: 'Copy',
    languageSelect: 'Language',
  },

  Hindi: {
    ministryOfAyush: 'आयुष मंत्रालय',
    nationalMission: 'राष्ट्रीय आयुष मिशन',
    autonomousScribe: 'स्वचालित नैदानिक केस-टेकिंग',
    audioGuide: 'ऑडियो गाइड',
    phoneSync: 'फ़ोन सिंक',
    doctorAi: 'डॉक्टर AI',
    loginAbha: 'लॉगिन / आभा',
    logout: 'लॉगआउट',
    guestSession: 'अतिथि सत्र',
    verified: 'प्रमाणित',

    navDashboard: 'डैशबोर्ड',
    navGuide: 'दवा व अलार्म',
    navIntake: 'आवाज़ केस-टेकिंग',
    navDoctor: 'वैद्य EHR',
    navFormulary: 'दवा सूची (Formulary)',
    navDossier: 'SIH दस्तावेज़',

    heroTitle: 'आयुष केस-टेकिंग व बहुभाषी क्लिनिकल स्क्राइब',
    heroSubtitle: 'अपनी मातृभाषा में बोलकर लक्षण बताएं। AI इसे आयुष चिकित्सकों हेतु ABDM FHIR R4 प्रमाणित केस शीट में बदलता है।',
    heroDoctorAiBtn: 'डॉक्टर AI विश्लेषक',
    heroAskSathiBtn: 'आयुष साथी से पूछें (Voice Assistant)',
    heroDoseAlarmsBtn: 'दवा समय व अलार्म',
    heroVoiceIntakeBtn: 'आवाज़ से केस लें',
    heroVaidyaEhrBtn: 'वैद्य EHR कॉकपिट',
    heroPhoneSyncBtn: 'फ़ोन हेल्थ सिंक',
    heroLoginBtn: 'लॉगिन / आभा',
    heroDemoIntakeBtn: 'डेमो केस-टेकिंग',

    statTimeSaved: 'समय की बचत / केस',
    statTimeSavedSub: '45 मिनट से घटकर 10 मिनट',
    statLanguages: 'मातृभाषाएं',
    statLanguagesSub: 'हिन्दी, तमिल, मराठी...',
    statInterop: 'मानक अनुरूपता',
    statInteropSub: 'नमस्ते व स्नोमेड (NAMASTE)',
    statFormulary: 'दवा सूची',
    statFormularySub: 'शास्त्रीय आयुष औषधियां',

    phoneSyncTitle: 'फ़ोन हेल्थ ऐप व गतिविधि तुल्यकालन (Sync)',
    phoneSyncSubtitle: 'लाइव हार्डवेयर पेडोमीटर, गूगल हेल्थ कनेक्ट व एप्पल हेल्थ ब्रिज',
    openActivityTracker: 'एक्टिविटी ट्रैकर खोलें',
    stepsToday: 'आज के कदम (Steps)',
    stepGoal: 'लक्ष्य',
    distanceKm: 'दूरी (किमी)',
    caloriesBurned: 'ऊर्जा (kcal)',
    activeMinutes: 'सक्रिय मिनट',
    restingPulse: 'विश्राम नाड़ी (Nadi)',
    nidraSleep: 'निद्रा (नींद के घंटे)',
    shatapadiPaces: 'शतपदी (100 कदम टहलना)',
    syncWithDoctorEhr: 'वैद्य EHR के साथ सिंक करें',
    lastSynced: 'अंतिम सिंक',

    modulesTitle: 'नैदानिक मॉड्यूल व कार्यप्रणाली',
    modulesSubtitle: 'केस लेने, पर्ची देखने या आयुष मानकों की जांच हेतु मॉड्यूल चुनें।',
    modIntakeTitle: 'आवाज़ स्क्राइब',
    modIntakeDesc: 'अपनी भाषा में बोलें। AI अष्टविध परीक्षा, अग्नि और त्रिदोष संतुलन निकालता है।',
    modDoctorTitle: 'वैद्य कॉकपिट',
    modDoctorDesc: 'त्रिदोष रडार, अष्टविध लक्षण, पथ्य-अपथ्य निर्माता और FHIR एक्सपोर्ट।',
    modAlarmsTitle: 'दवा व अलार्म',
    modAlarmsDesc: 'दवा खुराक के अलार्म, गूगल मैप्स पर निकटतम आयुष क्लीनिक, और लक्षण सहायता।',
    modFormularyTitle: 'दवा निर्देशिका',
    modFormularyDesc: 'ई-औषधि कैटलॉग, क्लासिकल फॉर्मूलेशन और पुराने EHR से तुलना।',
    modDossierTitle: 'SIH दस्तावेज़',
    modDossierDesc: 'आयुष मंत्रालय समस्या विवरण, तकनीकी आर्किटेक्चर और मूल्यांकन रूपरेखा।',

    visualHealthTitle: 'रोगी 30-दिवसीय स्वास्थ्य सुधार सूचकांक',
    symptomTrendsTitle: 'दीर्घकालिक लक्षण गंभीरता विश्लेषण',
    offlineSyncTitle: 'ऑफ़लाइन मोड व आभा क्लाउड सिंक',
    caregiverSosTitle: 'देखभालकर्ता व 1-टच परिवार SOS आपातकालीन सेवा',
    voiceGuideFloating: 'आयुष साथी (आवाज़ गाइड)',

    cockpitTitle: 'वैद्य नैदानिक समीक्षा व EHR कॉकपिट',
    subtabCaseSheet: 'केस शीट',
    subtabChikitsa: 'चिकित्सा व पर्ची (Rx)',
    subtabFhir: 'FHIR बंडल',
    subtabActivity: 'फ़ोन गतिविधि व वाइटल्स',
    exportPdf: 'HTML / PDF डाउनलोड करें',
    exportFhir: 'FHIR JSON एक्सपोर्ट',
    directPrint: 'प्रिंट करें',
    patientPresentation: 'रोगी का संक्षिप्त विवरण',
    complaintsTitle: 'मुख्य लक्षण (प्रधान वेदना)',
    tridoshaRadar: 'त्रिदोष प्रकृति व विकृति प्रोफाइल',
    ashtavidhaTitle: 'अष्टविध परीक्षा (नाड़ी, जिह्वा, मूत्र, मल, शब्द, स्पर्श, दृक, आकृति)',
    agniKoshthaTitle: 'अग्नि व कोष्ठ परीक्षण',
    pathyaTitle: 'पथ्य (हितकारी आहार-विहार)',
    apathyaTitle: 'अपथ्य (वर्जित आहार-विहार)',
    rxPlanTitle: 'चिकित्सा योजना व औषधियां (Rx)',
    addRxBtn: 'दवा जोड़ें',
    addActivityToRx: 'पर्चे में दिनचर्या व शतपदी व्यायाम जोड़ें',

    intakeTitle: 'बहुभाषी नैदानिक आवाज़ केस-टेकिंग',
    intakeSubtitle: 'अपनी स्थानीय भाषा में सहजता से बोलें। क्लिनिकल इंजन स्वतः आयुष तथ्यों का विश्लेषण करता है।',
    recordingPrompt: 'माइक दबाएं और अपनी समस्या, दर्द, पाचन, नींद और खान-पान के बारे में बताएं...',
    startRecording: 'आवाज़ रिकॉर्ड करें',
    stopRecording: 'रोकें व विश्लेषण करें',
    analyzingNarrative: 'जेमिनी AI द्वारा क्लिनिकल विश्लेषण जारी है...',
    generateCaseSheet: 'प्रमाणित आयुष केस शीट तैयार करें',

    close: 'बंद करें',
    save: 'सहेजें',
    refresh: 'ताज़ा करें',
    copied: 'कॉपी हो गया!',
    copy: 'कॉपी करें',
    languageSelect: 'भाषा',
  },

  Hinglish: {
    ministryOfAyush: 'Ministry of Ayush',
    nationalMission: 'National Ayush Mission',
    autonomousScribe: 'Smart Clinical Case-Taking',
    audioGuide: 'Audio Guide',
    phoneSync: 'Phone Sync',
    doctorAi: 'Doctor AI',
    loginAbha: 'Login / ABHA',
    logout: 'Logout',
    guestSession: 'Guest Session',
    verified: 'Verified',

    navDashboard: 'Dashboard',
    navGuide: 'Dose & Alarms',
    navIntake: 'Voice Intake',
    navDoctor: 'Vaidya EHR',
    navFormulary: 'Formulary',
    navDossier: 'SIH Dossier',

    heroTitle: 'Ayush Case-Taking & Multimodal Clinical Scribe',
    heroSubtitle: 'Apni bhasha mein bol kar bimari batayein. AI automatically ise ABDM FHIR certified Ayush sheet mein convert kar dega.',
    heroDoctorAiBtn: 'Doctor AI Explainer',
    heroAskSathiBtn: 'Ayush Sathi se Poochein (Voice)',
    heroDoseAlarmsBtn: 'Dawa Time & Alarms',
    heroVoiceIntakeBtn: 'Bol Kar Intake Lein',
    heroVaidyaEhrBtn: 'Vaidya EHR Cockpit',
    heroPhoneSyncBtn: 'Phone Health Sync',
    heroLoginBtn: 'Login / ABHA',
    heroDemoIntakeBtn: 'Demo Intake',

    statTimeSaved: 'Time Saved / Intake',
    statTimeSavedSub: '45 mins se ghat kar 10 mins',
    statLanguages: 'Apni Bhashayein',
    statLanguagesSub: 'Hindi, Hinglish, Tamil...',
    statInterop: 'Standard Compliance',
    statInteropSub: 'NAMASTE & SNOMED-CT',
    statFormulary: 'Formulary Catalog',
    statFormularySub: 'Classical Formulations',

    phoneSyncTitle: 'Phone Health App & Activity Synchronization',
    phoneSyncSubtitle: 'Live mobile pedometer & Health Connect / Apple Health sync',
    openActivityTracker: 'Activity Tracker Kholein',
    stepsToday: 'Aaj Ke Steps',
    stepGoal: 'Target',
    distanceKm: 'Distance (km)',
    caloriesBurned: 'Calories',
    activeMinutes: 'Active Mins',
    restingPulse: 'Resting Pulse (Nadi)',
    nidraSleep: 'Sleep Duration (Nidra)',
    shatapadiPaces: 'Shatapadi (100 Paces Walk)',
    syncWithDoctorEhr: 'Doctor EHR ke sath Sync Karein',
    lastSynced: 'Last Synced',

    modulesTitle: 'Clinical Modules & Case Workflow',
    modulesSubtitle: 'Case lene ke liye ya doctor parchi dekhne ke liye module select karein.',
    modIntakeTitle: 'Voice Scribe',
    modIntakeDesc: 'Apni zubaan mein bole. AI Ashtavidha Pariksha, Agni aur Dosha balance nikalega.',
    modDoctorTitle: 'Vaidya Cockpit',
    modDoctorDesc: 'Tridosha radar, Ashtavidha observations, Pathya builder aur FHIR export.',
    modAlarmsTitle: 'Dose & Alarms',
    modAlarmsDesc: 'Medicine dose alerts, pass ke verified Ayush clinic aur symptom guidance.',
    modFormularyTitle: 'Formulary',
    modFormularyDesc: 'Classical medicine index aur old software comparison.',
    modDossierTitle: 'SIH Dossier',
    modDossierDesc: 'Ministry evaluation metrics aur technical architecture.',

    visualHealthTitle: 'Patient 30-Day Recovery Index',
    symptomTrendsTitle: 'Symptom Severity Trends',
    offlineSyncTitle: 'Offline Mode & Local Sync',
    caregiverSosTitle: 'Caregiver & 1-Touch Family SOS Bridge',
    voiceGuideFloating: 'Ayush Sathi (Voice Guide)',

    cockpitTitle: 'Vaidya Clinical Review & EHR Cockpit',
    subtabCaseSheet: 'Case Sheet',
    subtabChikitsa: 'Chikitsa & Rx',
    subtabFhir: 'FHIR Bundle',
    subtabActivity: 'Phone Vitals & Activity',
    exportPdf: 'Export HTML / PDF',
    exportFhir: 'Export FHIR',
    directPrint: 'Print',
    patientPresentation: 'Patient Presentation Summary',
    complaintsTitle: 'Chief Complaints (Pradhana Vedana)',
    tridoshaRadar: 'Tridosha Constitutional Profile',
    ashtavidhaTitle: 'Ashtavidha Pariksha (Pulse, Tongue, Bowels etc.)',
    agniKoshthaTitle: 'Agni & Koshtha Assessment',
    pathyaTitle: 'Pathya (Kya Khana Hai)',
    apathyaTitle: 'Apathya (Kya Avoid Karna Hai)',
    rxPlanTitle: 'Chikitsa Plan & Prescriptions (Rx)',
    addRxBtn: 'Add Rx',
    addActivityToRx: 'Add Dinacharya & Shatapadi to Rx',

    intakeTitle: 'Multilingual Clinical Voice Intake',
    intakeSubtitle: 'Apni aam bhasha mein bolein, medical details automatically capture hongi.',
    recordingPrompt: 'Record dabayein aur dard, pachan, neend aur dincharya explain karein...',
    startRecording: 'Record Shuru Karein',
    stopRecording: 'Roko & Process Karo',
    analyzingNarrative: 'Gemini AI se clinical analysis chal raha hai...',
    generateCaseSheet: 'Standard Ayush Case Sheet Banao',

    close: 'Close',
    save: 'Save',
    refresh: 'Refresh',
    copied: 'Copied!',
    copy: 'Copy',
    languageSelect: 'Language',
  },

  Tamil: {
    ministryOfAyush: 'ஆயுஷ் அமைச்சகம்',
    nationalMission: 'தேசிய ஆயுஷ் இயக்கம்',
    autonomousScribe: 'தானியங்கி மருத்துவ கேஸ்-டேக்கிங்',
    audioGuide: 'ஆடியோ வழிகாட்டி',
    phoneSync: 'போன் ஒத்திசைவு',
    doctorAi: 'டாக்டர் AI',
    loginAbha: 'உள்நுழை / ஆபா',
    logout: 'வெளியேறு',
    guestSession: 'விருந்தினர் அமர்வு',
    verified: 'சரிபார்க்கப்பட்டது',

    navDashboard: 'டாஷ்போர்டு',
    navGuide: 'மருந்து & அலாரம்',
    navIntake: 'குரல் பதிவு',
    navDoctor: 'வைத்தியர் EHR',
    navFormulary: 'மருந்து அட்டவணை',
    navDossier: 'SIH ஆவணம்',

    heroTitle: 'ஆயுஷ் மருத்துவ கேஸ்-டேக்கிங் & AI எழுத்தர்',
    heroSubtitle: 'உங்கள் தாய்மொழியில் பேசி அறிகுறிகளை பதிவு செய்யுங்கள். இது ABDM FHIR தரநிலைக்கு தானாக மாற்றப்படுகிறது.',
    heroDoctorAiBtn: 'டாக்டர் AI விளக்கம்',
    heroAskSathiBtn: 'ஆயுஷ் உதவியாளரிடம் கேளுங்கள்',
    heroDoseAlarmsBtn: 'மருந்து அட்டவணை & அலாரங்கள்',
    heroVoiceIntakeBtn: 'குரல் வழி பதிவு',
    heroVaidyaEhrBtn: 'வைத்தியர் காக்பிட்',
    heroPhoneSyncBtn: 'போன் ஹெல்த் சிங்',
    heroLoginBtn: 'உள்நுழை / ஆபா',
    heroDemoIntakeBtn: 'டெமோ பதிவு',

    statTimeSaved: 'சேமிக்கப்பட்ட நேரம்',
    statTimeSavedSub: '45 நிமிடத்திலிருந்து குறைவு',
    statLanguages: 'தாய்மொழிகள்',
    statLanguagesSub: 'தமிழ், இந்தி, தெலுங்கு...',
    statInterop: 'தரநிலை இணக்கம்',
    statInteropSub: 'NAMASTE & SNOMED-CT',
    statFormulary: 'மருந்து பட்டியல்',
    statFormularySub: 'பாரம்பரிய மருந்துகள்',

    phoneSyncTitle: 'போன் ஹெல்த் ஆப் & படி கண்காணிப்பு',
    phoneSyncSubtitle: 'நேரடி மொபைல் பெடோமீட்டர் & ஹெல்த் கனெக்ட் இணைப்பு',
    openActivityTracker: 'செயல்பாட்டு டிராக்கரை திறக்கவும்',
    stepsToday: 'இன்றைய நடைகள் (Steps)',
    stepGoal: 'இலக்கு',
    distanceKm: 'தூரம் (கிமீ)',
    caloriesBurned: 'எரித்த கலோரிகள்',
    activeMinutes: 'சுறுசுறுப்பான நிமிடங்கள்',
    restingPulse: 'நாடித் துடிப்பு (Nadi)',
    nidraSleep: 'தூக்க நேரம் (Nidra)',
    shatapadiPaces: 'சதபதீ (100 நடைகள்)',
    syncWithDoctorEhr: 'மருத்துவருடன் ஒத்திசைக்கவும்',
    lastSynced: 'கடைசியாக ஒத்திசைக்கப்பட்டது',

    modulesTitle: 'மருத்துவ தொகுதிகள் & பணிப்பாய்வு',
    modulesSubtitle: 'கேஸ் எடுக்க அல்லது மருத்துவர் சீட்டை ஆய்வு செய்ய தொகுதியைத் தேர்ந்தெடுக்கவும்.',
    modIntakeTitle: 'குரல் எழுத்தர்',
    modIntakeDesc: 'தமிழில் பேசுங்கள். AI அஷ்டவித பரீட்சை, அக்னி மற்றும் தோஷங்களை பிரித்தெடுக்கிறது.',
    modDoctorTitle: 'வைத்தியர் காக்பிட்',
    modDoctorDesc: 'திரிதோஷ ரேடார், அஷ்டவித பரீட்சை மற்றும் FHIR ஏற்றுமதி.',
    modAlarmsTitle: 'மருந்து & அலாரம்',
    modAlarmsDesc: 'மருந்து நினைவூட்டல் மற்றும் அருகிலுள்ள ஆயுஷ் மருத்துவமனைகள்.',
    modFormularyTitle: 'மருந்து அட்டவணை',
    modFormularyDesc: 'பாரம்பரிய ஆயுர்வேத & சித்த மருந்துகள் அட்டவணை.',
    modDossierTitle: 'SIH ஆவணம்',
    modDossierDesc: 'அமைச்சக மதிப்பீட்டு அளவுகோல்கள் மற்றும் கட்டமைப்பு வரைபடம்.',

    visualHealthTitle: 'நோயாளி 30 நாள் மீட்பு குறியீடு',
    symptomTrendsTitle: 'நீண்டகால தீவிர போக்குகள்',
    offlineSyncTitle: 'ஆஃப்லைன் முறை & ஆபா கிளவுட் சிங்',
    caregiverSosTitle: 'குடும்ப அவசர SOS உதவி',
    voiceGuideFloating: 'ஆயுஷ் குரல் வழிகாட்டி',

    cockpitTitle: 'வைத்தியர் மருத்துவ ஆய்வு & EHR காக்பிட்',
    subtabCaseSheet: 'கேஸ் ஷீட்',
    subtabChikitsa: 'சிகிச்சை & மருந்துச் சீட்டு',
    subtabFhir: 'FHIR மூட்டை',
    subtabActivity: 'போன் செயல்பாடு & உடலியல்',
    exportPdf: 'HTML / PDF சேமிக்க',
    exportFhir: 'FHIR ஏற்றுமதி',
    directPrint: 'அச்சிடுக',
    patientPresentation: 'நோயாளி சுருக்கம்',
    complaintsTitle: 'முக்கிய புகார்கள்',
    tridoshaRadar: 'திரிதோஷ சுயவிவரம்',
    ashtavidhaTitle: 'அஷ்டவித பரீட்சை (நாடி, நாக்கு, முதலியன)',
    agniKoshthaTitle: 'அக்னி & கோஷ்ட சோதனை',
    pathyaTitle: 'பத்தியம் (ஏற்கத்தக்க உணவுகள்)',
    apathyaTitle: 'அபத்தியம் (தவிர்க்க வேண்டியவை)',
    rxPlanTitle: 'சிகிச்சை திட்டம் & பரிந்துரைகள் (Rx)',
    addRxBtn: 'மருந்து சேர்',
    addActivityToRx: 'தினசரி நடை & சதபதியை பரிந்துரையில் சேர்க்கவும்',

    intakeTitle: 'பன்மொழி குரல் வழி கேஸ்-டேக்கிங்',
    intakeSubtitle: 'உங்கள் தாய்மொழியில் இயல்பாகப் பேசுங்கள்.',
    recordingPrompt: 'மைக்கை அழுத்தி அறிகுறிகள் மற்றும் செரிமானம் பற்றி பேசவும்...',
    startRecording: 'குரல் பதிவு செய்க',
    stopRecording: 'நிறுத்தி செயலாக்குக',
    analyzingNarrative: 'AI மருத்துவ பகுப்பாய்வு செய்கிறது...',
    generateCaseSheet: 'ஆயுஷ் கேஸ் தாளை உருவாக்கவும்',

    close: 'மூடு',
    save: 'சேமி',
    refresh: 'புதுப்பி',
    copied: 'நகலெடுக்கப்பட்டது!',
    copy: 'நகலெடு',
    languageSelect: 'மொழி',
  },

  Marathi: {
    ministryOfAyush: 'आयुष मंत्रालय',
    nationalMission: 'राष्ट्रीय आयुष अभियान',
    autonomousScribe: 'स्वयंचलित क्लिनिकल केस-टेकिंग',
    audioGuide: 'ऑडिओ मार्गदर्शक',
    phoneSync: 'फोन सिंक',
    doctorAi: 'डॉक्टर AI',
    loginAbha: 'लॉगिन / आभा',
    logout: 'लॉगआउट',
    guestSession: 'अतिथी सत्र',
    verified: 'प्रमाणित',

    navDashboard: 'डॅशबोर्ड',
    navGuide: 'औषध व अलार्म',
    navIntake: 'आवाज नोंदणी',
    navDoctor: 'वैद्य EHR',
    navFormulary: 'औषध सूची',
    navDossier: 'SIH दस्तऐवज',

    heroTitle: 'आयुष केस-टेकिंग आणि बहुभाषिक क्लिनिकल स्क्राइब',
    heroSubtitle: 'आपल्या मातृभाषेत बोलून लक्षणे सांगा. AI हे ABDM FHIR R4 प्रमाणित केस शीटमध्ये रूपांतरित करते.',
    heroDoctorAiBtn: 'डॉक्टर AI विश्लेषक',
    heroAskSathiBtn: 'आयुष साथीला विचारा',
    heroDoseAlarmsBtn: 'औषध वेळापत्रक व अलार्म',
    heroVoiceIntakeBtn: 'आवाजाने केस घ्या',
    heroVaidyaEhrBtn: 'वैद्य EHR कॉकपिट',
    heroPhoneSyncBtn: 'फोन हेल्थ सिंक',
    heroLoginBtn: 'लॉगिन / आभा',
    heroDemoIntakeBtn: 'डेमो केस-टेकिंग',

    statTimeSaved: 'वेळेची बचत / केस',
    statTimeSavedSub: '45 मिनिटांवरून घटून 10 मिनिटे',
    statLanguages: 'मातृभाषा',
    statLanguagesSub: 'मराठी, हिंदी, इंग्रजी...',
    statInterop: 'मानक सुसंगतता',
    statInteropSub: 'NAMASTE आणि स्नोमेड',
    statFormulary: 'औषध सूची',
    statFormularySub: 'शास्त्रीय आयुष औषधे',

    phoneSyncTitle: 'फोन हेल्थ ॲप आणि ॲक्टिव्हिटी सिंक',
    phoneSyncSubtitle: 'थेट हार्डवेअर पेडोमीटर आणि हेल्थ कनेक्ट ब्रिज',
    openActivityTracker: 'ॲक्टिव्हिटी ट्रॅकर उघडा',
    stepsToday: 'आजची पावले (Steps)',
    stepGoal: 'ध्येय',
    distanceKm: 'अंतर (किमी)',
    caloriesBurned: 'कॅलरीज',
    activeMinutes: 'सक्रिय मिनिटे',
    restingPulse: 'विश्राम नाडी (Nadi)',
    nidraSleep: 'निद्रा (झोपेचे तास)',
    shatapadiPaces: 'शतपदी (100 पावले चालणे)',
    syncWithDoctorEhr: 'वैद्य EHR सोबत सिंक करा',
    lastSynced: 'शेवटचे सिंक',

    modulesTitle: 'क्लिनिकल मॉड्यूल्स आणि कार्यप्रणाली',
    modulesSubtitle: 'केस घेण्यासाठी किंवा ईएचआर पाहण्यासाठी मॉड्यूल निवडा.',
    modIntakeTitle: 'व्हॉइस स्क्राइब',
    modIntakeDesc: 'मराठीत बोला. AI अष्टविध परीक्षा, अग्नी आणि त्रिदोष संतुलन काढते.',
    modDoctorTitle: 'वैद्य कॉकपिट',
    modDoctorDesc: 'त्रिदोष रडार, अष्टविध निष्कर्ष, पथ्य-अपथ्य आणि FHIR एक्सपोर्ट.',
    modAlarmsTitle: 'औषध व अलार्म',
    modAlarmsDesc: 'औषध वेळेचे अलार्म आणि जवळचे प्रमाणित आयुष दवाखाने.',
    modFormularyTitle: 'औषध निर्देशिका',
    modFormularyDesc: 'ई-औषधी कॅटलॉग आणि शास्त्रीय फॉर्म्युलेशन.',
    modDossierTitle: 'SIH दस्तऐवज',
    modDossierDesc: 'आयुष मंत्रालय तांत्रिक आर्किटेक्चर आणि मूल्यांकन निकष.',

    visualHealthTitle: 'रुग्ण 30-दिवसीय आरोग्य सुधारणा निर्देशांक',
    symptomTrendsTitle: 'दीर्घकालीन लक्षण तीव्रता विश्लेषण',
    offlineSyncTitle: 'ऑफलाइन मोड आणि आभा क्लाउड सिंक',
    caregiverSosTitle: 'कुटुंब आपत्कालीन SOS सेवा',
    voiceGuideFloating: 'आयुष साथी (व्हॉइस मार्गदर्शक)',

    cockpitTitle: 'वैद्य क्लिनिकल पुनरावलोकन आणि EHR कॉकपिट',
    subtabCaseSheet: 'केस शीट',
    subtabChikitsa: 'चिकित्सा व प्रिस्क्रिप्शन',
    subtabFhir: 'FHIR बंडल',
    subtabActivity: 'फोन ॲक्टिव्हिटी व व्हायटल्स',
    exportPdf: 'HTML / PDF डाउनलोड करा',
    exportFhir: 'FHIR एक्सपोर्ट',
    directPrint: 'प्रिंट करा',
    patientPresentation: 'रुग्ण सादरीकरण सारांश',
    complaintsTitle: 'मुख्य लक्षणे (प्रधान वेदना)',
    tridoshaRadar: 'त्रिदोष प्रकृती प्रोफाइल',
    ashtavidhaTitle: 'अष्टविध परीक्षा (नाडी, जीभ, मलमूत्र इत्यादी)',
    agniKoshthaTitle: 'अग्नी व कोष्ठ तपासणी',
    pathyaTitle: 'पथ्य (हितकारक आहार-विहार)',
    apathyaTitle: 'अपथ्य (वर्ज्य गोष्टी)',
    rxPlanTitle: 'चिकित्सा योजना आणि औषधे (Rx)',
    addRxBtn: 'औषध जोडा',
    addActivityToRx: 'प्रिस्क्रिप्शनमध्ये दिनचर्या व शतपदी जोडा',

    intakeTitle: 'बहुभाषिक क्लिनिकल व्हॉइस केस-टेकिंग',
    intakeSubtitle: 'आपल्या मातृभाषेत सहजतेने बोला. क्लिनिकल इंजिन आपोआप माहिती संकलित करते.',
    recordingPrompt: 'माइक दाबा आणि आपले आजारपण, पचन आणि झोपेबद्दल सांगा...',
    startRecording: 'आवाज रेकॉर्ड करा',
    stopRecording: 'थांबवा व प्रक्रिया करा',
    analyzingNarrative: 'AI द्वारे क्लिनिकल विश्लेषण सुरू आहे...',
    generateCaseSheet: 'आयुष केस शीट तयार करा',

    close: 'बंद करा',
    save: 'जतन करा',
    refresh: 'ताजे करा',
    copied: 'कॉपी झाले!',
    copy: 'कॉपी करा',
    languageSelect: 'भाषा',
  },

  Bengali: {
    ministryOfAyush: 'আয়ুষ মন্ত্রণালয়',
    nationalMission: 'জাতীয় আয়ুষ মিশন',
    autonomousScribe: 'স্বয়ংক্রিয় ক্লিনিকাল কেস-টেকিং',
    audioGuide: 'অডিও গাইড',
    phoneSync: 'ফোন সিঙ্ক',
    doctorAi: 'ডাক্তার AI',
    loginAbha: 'লগইন / আভা',
    logout: 'লগআউট',
    guestSession: 'অতিথি সেশন',
    verified: 'যাচাইকৃত',

    navDashboard: 'ড্যাশবোর্ড',
    navGuide: 'ওষুধ ও অ্যালার্ম',
    navIntake: 'ভয়েস গ্রহণ',
    navDoctor: 'বৈদ্য EHR',
    navFormulary: 'ওষুধ তালিকা',
    navDossier: 'SIH নথি',

    heroTitle: 'আয়ুষ কেস-টেকিং ও বহুভাষিক ক্লিনিকাল স্ক্রাইব',
    heroSubtitle: 'আপনার মাতৃভাষায় বলে লক্ষণ জানান। AI এটিকে ABDM FHIR R4 অনুমোদিত কেস শীটে রূপান্তর করে।',
    heroDoctorAiBtn: 'ডাক্তার AI বিশ্লেষক',
    heroAskSathiBtn: 'আয়ুষ সাথীকে জিজ্ঞাসা করুন',
    heroDoseAlarmsBtn: 'ওষুধের সময় ও অ্যালার্ম',
    heroVoiceIntakeBtn: 'ভয়েস কেস নিন',
    heroVaidyaEhrBtn: 'বৈদ্য EHR ককপিট',
    heroPhoneSyncBtn: 'ফোন হেলথ সিঙ্ক',
    heroLoginBtn: 'লগইন / আভা',
    heroDemoIntakeBtn: 'ডেমো কেস গ্রহণ',

    statTimeSaved: 'সময় বাঁচানো / কেস',
    statTimeSavedSub: '৪৫ মিনিট থেকে কমে ১০ মিনিট',
    statLanguages: 'মাতৃভাষা',
    statLanguagesSub: 'বাংলা, হিন্দি, ইংরেজি...',
    statInterop: 'মানক সামঞ্জস্য',
    statInteropSub: 'NAMASTE ও স্নোমেড',
    statFormulary: 'ওষুধ নির্দেশিকা',
    statFormularySub: 'শাস্ত্রীয় আয়ুষ ওষুধ',

    phoneSyncTitle: 'ফোন হেলথ অ্যাপ ও অ্যাক্টিভিটি সিঙ্ক',
    phoneSyncSubtitle: 'লাইভ মোবাইল পেডোমিটার ও গুগল হেলথ কানেক্ট ব্রিজ',
    openActivityTracker: 'অ্যাক্টিভিটি ট্র্যাকার খুলুন',
    stepsToday: 'আজকের পদক্ষেপ (Steps)',
    stepGoal: 'লক্ষ্য',
    distanceKm: 'দূরত্ব (কিমি)',
    caloriesBurned: 'ক্যালোরি',
    activeMinutes: 'সক্রিয় মিনিট',
    restingPulse: 'বিশ্রাম নাড়ি (Nadi)',
    nidraSleep: 'নিদ্রা (ঘুমের সময়)',
    shatapadiPaces: 'শতপদী (১০০ কদম হাঁটা)',
    syncWithDoctorEhr: 'ডাক্তার EHR এর সাথে সিঙ্ক করুন',
    lastSynced: 'সর্বশেষ সিঙ্ক',

    modulesTitle: 'ক্লিনিকাল মডিউল ও কার্যপ্রণালী',
    modulesSubtitle: 'কেস নেওয়ার জন্য বা ডাক্তারের ব্যবস্থাপত্র দেখতে মডিউল নির্বাচন করুন।',
    modIntakeTitle: 'ভয়েস স্ক্রাইব',
    modIntakeDesc: 'বাংলায় বলুন। AI অষ্টবিধ পরীক্ষা, অগ্নি এবং ত্রিদোষ ভারসাম্য বের করে।',
    modDoctorTitle: 'বৈদ্য ককপিট',
    modDoctorDesc: 'ত্রিদোষ রাডার, অষ্টবিধ ফলাফল, পথ্য নির্মাতা এবং FHIR এক্সপোর্ট।',
    modAlarmsTitle: 'ওষুধ ও অ্যালার্ম',
    modAlarmsDesc: 'ওষুধের অ্যালার্ম এবং গুগল ম্যাপে নিকটবর্তী আয়ুষ ক্লিনিক।',
    modFormularyTitle: 'ওষুধ নির্দেশিকা',
    modFormularyDesc: 'ই-ঔষধি ক্যাটালগ এবং ক্লাসিক্যাল ফর্মুলেশন।',
    modDossierTitle: 'SIH নথি',
    modDossierDesc: 'আয়ুষ মন্ত্রণালয়ের প্রযুক্তিগত আর্কিটেকচার এবং মূল্যায়ন রূপরেখা।',

    visualHealthTitle: 'রোগীর ৩০-দিনের স্বাস্থ্য পুনরুদ্ধার সূচক',
    symptomTrendsTitle: 'দীর্ঘমেয়াদী লক্ষণের তীব্রতা বিশ্লেষণ',
    offlineSyncTitle: 'অফলাইন মোড ও আভা ক্লাউড সিঙ্ক',
    caregiverSosTitle: 'পরিবার জরুরি SOS সেবা',
    voiceGuideFloating: 'আয়ুষ সাথী (ভয়েস গাইড)',

    cockpitTitle: 'বৈদ্য ক্লিনিকাল পর্যালোচনা ও EHR ককপিট',
    subtabCaseSheet: 'কেস শীট',
    subtabChikitsa: 'চিকিৎসা ও প্রেসক্রিপশন',
    subtabFhir: 'FHIR বান্ডিল',
    subtabActivity: 'ফোন কার্যকলাপ ও ভাইটাল',
    exportPdf: 'HTML / PDF ডাউনলোড করুন',
    exportFhir: 'FHIR এক্সপোর্ট',
    directPrint: 'প্রিন্ট করুন',
    patientPresentation: 'রোগীর উপস্থাপনা সারসংক্ষেপ',
    complaintsTitle: 'প্রধান অভিযোগ (প্রধান বেদনা)',
    tridoshaRadar: 'ত্রিদোষ সংবিধান প্রোফাইল',
    ashtavidhaTitle: 'অষ্টবিধ পরীক্ষা (নাড়ি, জিহ্বা ইত্যাদি)',
    agniKoshthaTitle: 'অগ্নি ও কোষ্ঠ পরীক্ষা',
    pathyaTitle: 'পথ্য (উপকারী খাদ্য ও অভ্যাস)',
    apathyaTitle: 'অপথ্য (বর্জনীয় খাদ্য ও অভ্যাস)',
    rxPlanTitle: 'চিকিৎসা পরিকল্পনা ও প্রেসক্রিপশন (Rx)',
    addRxBtn: 'ওষুধ যোগ করুন',
    addActivityToRx: 'প্রেসক্রিপশনে শতপদী ও ব্যায়াম যোগ করুন',

    intakeTitle: 'বহুভাষিক ক্লিনিকাল ভয়েস কেস-টেকিং',
    intakeSubtitle: 'আপনার মাতৃভাষায় স্বাভাবিকভাবে কথা বলুন।',
    recordingPrompt: 'মাইক চাপুন এবং আপনার লক্ষণ, হজম এবং ঘুম সম্পর্কে বলুন...',
    startRecording: 'ভয়েস রেকর্ড করুন',
    stopRecording: 'থামান ও বিশ্লেষণ করুন',
    analyzingNarrative: 'AI দ্বারা ক্লিনিকাল বিশ্লেষণ চলছে...',
    generateCaseSheet: 'আয়ুষ কেস শীট তৈরি করুন',

    close: 'বন্ধ করুন',
    save: 'সংরক্ষণ',
    refresh: 'রিফ্রেশ',
    copied: 'কপি হয়েছে!',
    copy: 'কপি করুন',
    languageSelect: 'ভাষা',
  },

  Telugu: {
    ministryOfAyush: 'ఆయుష్ మంత్రిత్వ శాఖ',
    nationalMission: 'జాతీయ ఆయుష్ మిషన్',
    autonomousScribe: 'స్వయంప్రతిపత్తి క్లినికల్ కేస్-టేకింగ్',
    audioGuide: 'ఆడియో గైడ్',
    phoneSync: 'ఫోన్ సింక్',
    doctorAi: 'డాక్టర్ AI',
    loginAbha: 'లాగిన్ / ఆభా',
    logout: 'లాగౌట్',
    guestSession: 'అతిథి సెషన్',
    verified: 'ధృవీకరించబడింది',

    navDashboard: 'డ్యాష్‌బోర్డ్',
    navGuide: 'మందులు & అలారాలు',
    navIntake: 'వాయిస్ కేస్',
    navDoctor: 'వైద్య EHR',
    navFormulary: 'మందుల సూచిక',
    navDossier: 'SIH పత్రం',

    heroTitle: 'ఆయుష్ కేస్-టేకింగ్ & బహుభాషా క్లినికల్ స్క్రైబ్',
    heroSubtitle: 'మీ మాతృభాషలో మాట్లాడి లక్షణాలను తెలపండి. AI దీనిని ABDM FHIR R4 కేస్ షీట్‌గా మారుస్తుంది.',
    heroDoctorAiBtn: 'డాక్టర్ AI వివరణకర్త',
    heroAskSathiBtn: 'ఆయుష్ సాథీని అడగండి',
    heroDoseAlarmsBtn: 'మందుల షెడ్యూల్ & అలారాలు',
    heroVoiceIntakeBtn: 'వాయిస్ కేస్ తీసుకోండి',
    heroVaidyaEhrBtn: 'వైద్య EHR కాక్‌పిట్',
    heroPhoneSyncBtn: 'ఫోన్ హెల్త్ సింక్',
    heroLoginBtn: 'లాగిన్ / ఆభా',
    heroDemoIntakeBtn: 'డెమో కేస్-టేకింగ్',

    statTimeSaved: 'ఆదా అయిన సమయం / కేస్',
    statTimeSavedSub: '45 నిమిషాల నుండి 10 నిమిషాలకు',
    statLanguages: 'మాతృభాషలు',
    statLanguagesSub: 'తెలుగు, హిందీ, ఇంగ్లీష్...',
    statInterop: 'ప్రమాణాల అనుగుణ్యత',
    statInteropSub: 'NAMASTE & SNOMED-CT',
    statFormulary: 'మందుల కేటలాగ్',
    statFormularySub: 'సాంప్రదాయ ఆయుష్ మందులు',

    phoneSyncTitle: 'ఫోన్ హెల్త్ యాప్ & యాక్టివిటీ సింక్రొనైజేషన్',
    phoneSyncSubtitle: 'లైవ్ మొబైల్ పెడోమీటర్ & గూగుల్ హెల్త్ కనెక్ట్ బ్రిడ్జ్',
    openActivityTracker: 'యాక్టివిటీ ట్రాకర్ తెరవండి',
    stepsToday: 'ఈ రోజు అడుగులు (Steps)',
    stepGoal: 'లక్ష్యం',
    distanceKm: 'దూరం (కి.మీ)',
    caloriesBurned: 'కేలరీలు',
    activeMinutes: 'క్రియాశీల నిమిషాలు',
    restingPulse: 'విశ్రాంతి నాడి (Nadi)',
    nidraSleep: 'నిద్ర (గంటలు)',
    shatapadiPaces: 'శతపది (100 అడుగుల నడక)',
    syncWithDoctorEhr: 'డాక్టర్ EHR తో సింక్ చేయండి',
    lastSynced: 'చివరి సింక్',

    modulesTitle: 'క్లినికల్ మాడ్యూల్స్ & వర్క్‌ఫ్లో',
    modulesSubtitle: 'కేస్ తీసుకోవడానికి లేదా వైద్యుల చీటీ చూడటానికి మాడ్యూల్ ఎంచుకోండి.',
    modIntakeTitle: 'వాయిస్ స్క్రైబ్',
    modIntakeDesc: 'తెలుగులో మాట్లాడండి. AI అష్టవిధ పరీక్ష, అగ్ని మరియు త్రిదోష సమతుల్యతను గణిస్తుంది.',
    modDoctorTitle: 'వైద్య కాక్‌పిట్',
    modDoctorDesc: 'త్రిదోష రాడార్, అష్టవిధ పరిశీలనలు మరియు FHIR ఎగుమతి.',
    modAlarmsTitle: 'మందులు & అలారాలు',
    modAlarmsDesc: 'మందుల మోతాదు అలారాలు మరియు సమీపంలోని ఆయుష్ క్లినిక్‌లు.',
    modFormularyTitle: 'మందుల సూచిక',
    modFormularyDesc: 'ఈ-ఔషధి కేటలాగ్ మరియు క్లాసికల్ ఫార్ములేషన్లు.',
    modDossierTitle: 'SIH పత్రం',
    modDossierDesc: 'ఆయుష్ మంత్రిత్వ శాఖ సాంకేతిక ఆర్కిటెక్చర్ మరియు మూల్యాంకన ప్రమాణాలు.',

    visualHealthTitle: 'రోగి 30 రోజుల పునరుద్ధరణ సూచిక',
    symptomTrendsTitle: 'దీర్ఘకాలిక తీవ్రత ధోరణులు',
    offlineSyncTitle: 'ఆఫ్‌లైన్ మోడ్ & ఆభా క్లౌడ్ సింక్',
    caregiverSosTitle: 'కుటుంబ అత్యవసర SOS సహాయం',
    voiceGuideFloating: 'ఆయుష్ వాయిస్ గైడ్',

    cockpitTitle: 'వైద్య క్లినికల్ సమీక్ష & EHR కాక్‌పిట్',
    subtabCaseSheet: 'కేస్ షీట్',
    subtabChikitsa: 'చికిత్స & ప్రిస్క్రిప్షన్',
    subtabFhir: 'FHIR బండిల్',
    subtabActivity: 'ఫోన్ యాక్టివిటీ & వైటల్స్',
    exportPdf: 'HTML / PDF డౌన్‌లోడ్',
    exportFhir: 'FHIR ఎగుమతి',
    directPrint: 'ప్రింట్ చేయండి',
    patientPresentation: 'రోగి సారాంశం',
    complaintsTitle: 'ప్రధాన సమస్యలు (ప్రధాన వేదన)',
    tridoshaRadar: 'త్రిదోష ప్రొఫైల్',
    ashtavidhaTitle: 'అష్టవిధ పరీక్ష (నాడి, నాలుక, మొదలైనవి)',
    agniKoshthaTitle: 'అగ్ని & కోష్ట పరీక్ష',
    pathyaTitle: 'పథ్యం (తీసుకోవలసిన ఆహారం & అలవాట్లు)',
    apathyaTitle: 'అపథ్యం (తప్పించవలసినవి)',
    rxPlanTitle: 'చికిత్స ప్రణాళిక & మందులు (Rx)',
    addRxBtn: 'మందు జోడించండి',
    addActivityToRx: 'ప్రిస్క్రిప్షన్‌లో శతపది & వ్యాయామం చేర్చండి',

    intakeTitle: 'బహుభాషా వాయిస్ కేస్-టేకింగ్',
    intakeSubtitle: 'మీ మాతృభాషలో సహజంగా మాట్లాడండి.',
    recordingPrompt: 'మైక్ నొక్కి మీ లక్షణాలు, జీర్ణక్రియ మరియు నిద్ర గురించి చెప్పండి...',
    startRecording: 'వాయిస్ రికార్డ్ చేయండి',
    stopRecording: 'ఆపి ప్రాసెస్ చేయండి',
    analyzingNarrative: 'AI క్లినికల్ విశ్లేషణ చేస్తోంది...',
    generateCaseSheet: 'ఆయుష్ కేస్ షీట్ తయారు చేయండి',

    close: 'మూసివేయి',
    save: 'సేవ్ చేయి',
    refresh: 'రిఫ్రెష్',
    copied: 'కాపీ చేయబడింది!',
    copy: 'కాపీ చేయి',
    languageSelect: 'భాష',
  }
};

export function getTranslation(lang: string = 'English'): Translations {
  const normalized = (Object.keys(TRANSLATIONS) as SupportedLanguage[]).find(
    k => k.toLowerCase() === lang.toLowerCase()
  );
  return TRANSLATIONS[normalized || 'English'];
}
