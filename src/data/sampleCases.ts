import { PatientInfo } from '../types/ayush';

export interface SamplePreset {
  id: string;
  title: string;
  system: 'Ayurveda' | 'Homeopathy' | 'Unani' | 'Siddha';
  badge: string;
  language: string;
  patientInfo: PatientInfo;
  narrative: string;
  audioDurationHint: string;
}

export const SAMPLE_CASES: SamplePreset[] = [
  {
    id: 'case-amavata',
    title: 'Rheumatoid Polyarthritis (Amavata) with Agni Mandya',
    system: 'Ayurveda',
    badge: 'Joints & Autoimmune',
    language: 'Hinglish / Hindi',
    patientInfo: {
      fullName: 'Sunita Sharma',
      age: 46,
      gender: 'Female',
      phone: '+91 98231 44521',
      abhaId: 'ABHA-91-8472-3091-2241',
      occupation: 'School Teacher',
      location: 'Jaipur, Rajasthan',
      language: 'Hindi / Hinglish',
    },
    narrative: `Mujhe pichhle 5-6 mahine se subah uthne par dono haathon ki ungliyon aur kalaiyon me bhari dard aur jakdan (stiffness) rehti hai jo lagbhag 1-2 ghante tak bani rehti hai.
Shaam hote hote ghutno me bhi halki soojan aa jati hai aur chalne me kathinayi hoti hai.
Bhookh bilkul nahi lagti, subah jeebh par safed moti parat (white thick coating) rehti hai aur pet me bhari-pan rehta hai.
Thand ke mausam me ya baarish ke dino me dard kafi badh jata hai, aur garam paani se sek karne par ya dhoop me baithne par aaram milta hai.
Raat ko neend 2-3 baje khul jati hai aur phir bechaini rehti hai. Koi allopathic painkillers khane par thodi der aaram hota hai lekin pet me jalan shuru ho jati hai.`,
    audioDurationHint: '0:52 spoken narrative'
  },
  {
    id: 'case-amlapitta',
    title: 'Acid Peptic Disorder (Amlapitta) & Pitta-Vata Disturbance',
    system: 'Ayurveda',
    badge: 'Gastrointestinal',
    language: 'English',
    patientInfo: {
      fullName: 'Vikram Malhotra',
      age: 34,
      gender: 'Male',
      phone: '+91 99104 77283',
      abhaId: 'ABHA-33-1920-4491-7712',
      occupation: 'Software Engineer',
      location: 'Bengaluru, Karnataka',
      language: 'English',
    },
    narrative: `I have been suffering from recurrent burning sensation in my chest (heartburn) and sour eructations for over 4 months, typically peaking around 2 hours after lunch and late at night.
I also experience severe nausea in the mornings, bitter taste on my tongue, and throbbing temporal headaches when meals are delayed even by an hour.
My bowel movements are irregular—loose motions on spicy food days and hard stools when working overnight shifts.
I have a strong craving for chilled water and ice creams, but cold dairy causes throat irritation later.
I am under significant workplace stress and sleep only 5 hours a night. When agitated or angry, the retrosternal burning immediately intensifies.`,
    audioDurationHint: '0:45 spoken narrative'
  },
  {
    id: 'case-homeopathy-eczema',
    title: 'Chronic Atopic Dermatitis (Vicharchika / Chronic Eczema)',
    system: 'Homeopathy',
    badge: 'Dermatological',
    language: 'English',
    patientInfo: {
      fullName: 'Ananya Deshmukh',
      age: 28,
      gender: 'Female',
      phone: '+91 94220 81190',
      abhaId: 'ABHA-72-9118-2004-5519',
      occupation: 'Architect',
      location: 'Pune, Maharashtra',
      language: 'English',
    },
    narrative: `I have severe dry, scaly, and erythematous patches on both elbow flexures and behind the knees for the past 2 years.
The itching is voluptuous and intensely worse at night once I get into warm bed covers, leading to scratching until raw oozing of clear sticky fluid occurs.
Application of cold water or cold compresses provides temporary relief, while woolen clothes and hot showers make the itching intolerable.
Mentally, I am very fastidious, anxious about neatness and order, and prone to dwelling on past grievances.
I am extremely chilly, needing socks even during mild weather, yet my skin lesions crave cool open air. I have strong cravings for salty snacks and aversion to fatty mutton or oily gravies.`,
    audioDurationHint: '0:58 spoken narrative'
  },
  {
    id: 'case-unani-migraine',
    title: 'Shaqeeqa (Migraine / Hemicrania) with Safrawi Imbalance',
    system: 'Unani',
    badge: 'Neurological',
    language: 'Hinglish / Urdu',
    patientInfo: {
      fullName: 'Mohammad Farooq',
      age: 41,
      gender: 'Male',
      phone: '+91 98110 53219',
      abhaId: 'ABHA-11-7392-8812-4091',
      occupation: 'Government Officer',
      location: 'Hyderabad, Telangana',
      language: 'Urdu / Hindi',
    },
    narrative: `Mujhe pichhle 8 mahino se aadh-kapari (aadhe sar me teekha dard) hota hai jo dhoop me nikalne par ya bhookha rehne par tezi se ubhar aata hai.
Dard daayein (right) ankh ke upar shuru hokar pure sar me phailta hai, sath me ulti jaisa mehsus hota hai aur tez roshni ya aawaz bardasht nahi hoti.
Gusse me ya dhoop me sar dard ki tees aur badh jati hai. Mizaj mera gusse wala aur jald-baz rehta hai.
Thande sharbat, rooh afza, ya gulab jal se sir par thandi patti rakhne par kafi aaram lagta hai. Pyaas kafi lagti hai aur munh me kadwapan rehta hai.`,
    audioDurationHint: '0:48 spoken narrative'
  }
];
