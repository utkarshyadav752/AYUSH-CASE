import React, { useState } from 'react';
import { 
  Volume2, Sparkles, Flame, Droplets, Wind, ShieldAlert, 
  CheckCircle2, HeartHandshake, Eye, Award, HelpCircle, Layers, Apple
} from 'lucide-react';

interface KnowledgeConcept {
  id: string;
  name: {
    English: string;
    Hindi: string;
    Tamil: string;
    Marathi: string;
    Bengali: string;
    Telugu: string;
    Hinglish: string;
  };
  subtitle: {
    English: string;
    Hindi: string;
    Tamil: string;
    Marathi: string;
    Bengali: string;
    Telugu: string;
    Hinglish: string;
  };
  iconEmoji: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  whatIsItSimple: {
    English: string;
    Hindi: string;
    Tamil: string;
    Marathi: string;
    Bengali: string;
    Telugu: string;
    Hinglish: string;
  };
  visualMetaphor: {
    English: string;
    Hindi: string;
    Tamil: string;
    Marathi: string;
    Bengali: string;
    Telugu: string;
    Hinglish: string;
  };
  howToFixIt: {
    English: string;
    Hindi: string;
    Tamil: string;
    Marathi: string;
    Bengali: string;
    Telugu: string;
    Hinglish: string;
  };
  audioSpeechText: {
    English: string;
    Hindi: string;
    Tamil: string;
    Marathi: string;
    Bengali: string;
    Telugu: string;
    Hinglish: string;
  };
}

export const AYUSH_KNOWLEDGE_CONCEPTS: KnowledgeConcept[] = [
  {
    id: 'agni',
    name: {
      English: 'Agni (Digestive Fire)',
      Hindi: 'अग्नि (पेट की पाचन शक्ति)',
      Tamil: 'அக்னி (செரிமான தீ)',
      Marathi: 'अग्नी (पचन शक्ती)',
      Bengali: 'অগ্নি (হজম শক্তি)',
      Telugu: 'అగ్ని (జీర్ణ శక్తి)',
      Hinglish: 'Agni (Pet ki Paachan Shakti)'
    },
    subtitle: {
      English: 'The cooking flame inside your stomach',
      Hindi: 'पेट के अंदर खाना पकाने वाला चूल्हा',
      Tamil: 'வயிற்றில் உணவு வேகும் அடுப்பு',
      Marathi: 'पोटात अन्न शिजवणारी शेगडी',
      Bengali: 'পেটের ভেতরের রান্নার আগুন',
      Telugu: 'కడుపులో ఆహారం ఉడికించే పొయ్యి',
      Hinglish: 'Pet ke andar khana pakane wala chulha'
    },
    iconEmoji: '🔥',
    colorBg: 'bg-amber-50',
    colorBorder: 'border-amber-300',
    colorText: 'text-amber-900',
    visualMetaphor: {
      English: 'Think of your stomach like a kitchen stove. If the fire is strong, food cooks perfectly. If the fire is weak or wet, raw food remains and rots.',
      Hindi: 'जैसे रसोई के चूल्हे में आग मंद हो तो दाल कच्ची रह जाती है, वैसे ही पेट की अग्नि कमजोर होने पर खाना पचता नहीं है और सड़ने लगता है।',
      Tamil: 'சமையல் அடுப்பில் தீ குறைவாக இருந்தால் உணவு வேகாது. அதேபோல் வயிற்றில் அக்னி குறைந்தால் உணவு செரிக்காது.',
      Marathi: 'जशी चुलीवर मंद आचेवर अन्न शिजत नाही, तसेच पोटात अग्नी मंद असेल तर अन्न पचत नाही.',
      Bengali: 'যেমন উনুনের আঁচ কম হলে রান্না কাঁচা থাকে, তেমনই পেটের অগ্নি দুর্বল হলে খাবার ঠিকমতো হজম হয় না।',
      Telugu: 'పొయ్యిలో మంట సరిగ్గా లేకపోతే ఆహారం ఉడకదు. అలాగే కడుపులో అగ్ని తగ్గితే ఆహారం జీర్ణం కాదు.',
      Hinglish: 'Jaise rasoi ke chulhe me aag dheemi ho to daal kachi reh jati hai, waise hi pet ki agni kamjor hone par khana pachta nahi hai.'
    },
    whatIsItSimple: {
      English: 'When Agni is healthy (Sama Agni), you feel energetic, light, and hungry at meal times. When weak (Mandagni), you feel bloated, heavy, and tired.',
      Hindi: 'अच्छी अग्नि होने पर भूख सही समय पर लगती है, पेट हल्का रहता है और शरीर में ताकत रहती है।',
      Tamil: 'நல்ல அக்னி இருந்தால் சரியான நேரத்தில் பசி எடுக்கும், உடல் சுறுசுறுப்பாக இருக்கும்.',
      Marathi: 'चांगला अग्नी असेल तर वेळेवर भूक लागते, पोट हलके वाटते आणि ताकद मिळते.',
      Bengali: 'অগ্নি ভালো থাকলে সময়ে খিদে পায় ও শরীর চাঙ্গা থাকে।',
      Telugu: 'మంచి అగ్ని ఉంటే సమయానికి ఆకలి వేస్తుంది, శరీరం తేలికగా ఉంటుంది.',
      Hinglish: 'Achi Agni hone par sahi samay par bhookh lagti hai aur pet halka rehta hai.'
    },
    howToFixIt: {
      English: 'Drink warm water with a pinch of dry ginger (Shunthi). Avoid ice water and do not eat heavy sweets at night.',
      Hindi: 'गुनगुने पानी में थोड़ा सोंठ या अदरक मिलाकर पिएं। ठंडा फ्रिज का पानी बिल्कुल न पिएं।',
      Tamil: 'வெதுவெதுப்பான சுக்கு நீர் அருந்துங்கள். குளிர்சாதனப் பெட்டி தண்ணீரைத் தவிர்க்கவும்.',
      Marathi: 'कोमट पाण्यात थोडे सुंठ पावडर घालून प्या. थंड फ्रीजचे पाणी पिऊ नका.',
      Bengali: 'হালকা গরম জলে আদা বা শুঁঠ দিয়ে খান। ঠান্ডা জল এড়িয়ে চলুন।',
      Telugu: 'గోరువెచ్చని నీటిలో కొద్దిగా శొంఠి కలిపి తాగండి. చల్లటి నీరు తాగవద్దు.',
      Hinglish: 'Gungune paani me thoda soanth milakar pijiye. Fridge ka thanda paani bilkul na pijiye.'
    },
    audioSpeechText: {
      English: 'Agni is your digestive fire. It is like the stove in your kitchen. Drink warm ginger water to keep your digestion strong, and avoid ice water.',
      Hindi: 'अग्नि आपके पेट का चूल्हा है। अगर यह तेज है तो खाना ठीक से पचेगा। इसे मजबूत रखने के लिए हमेशा गुनगुना पानी पिएं और ठंडा पानी न लें।',
      Tamil: 'அக்னி என்பது உங்கள் செரிமான தீ. எப்போதும் வெதுவெதுப்பான நீர் அருந்தி இதனை பாதுகாக்கவும்.',
      Marathi: 'अग्नी म्हणजे तुमची पचनशक्ती. ती चांगली ठेवण्यासाठी नेहमी कोमट पाणी प्या.',
      Bengali: 'অগ্নি হলো আপনার হজম শক্তি। হজম ভালো রাখতে সবসময় হালকা গরম জল পান করুন।',
      Telugu: 'అగ్ని మీ జీర్ణ శక్తి. దీనిని బలంగా ఉంచడానికి ఎప్పుడూ గోరువెచ్చని నీరు తాగండి.',
      Hinglish: 'Agni aapke pet ka chulha hai. Ise majboot rakhne ke liye hamesha gunguna paani piyein.'
    }
  },
  {
    id: 'ama',
    name: {
      English: 'Ama (Undigested Toxins / Kacha Kachra)',
      Hindi: 'आम (पेट का कच्चा चिपचिपा कचरा / टॉक्सिन)',
      Tamil: 'ஆமம் (செரிக்காத நச்சு கழிவு)',
      Marathi: 'आम (न पचलेला चिकट विषारी कचरा)',
      Bengali: 'আম (অপাচ্য বিষাক্ত বর্জ্য)',
      Telugu: 'ఆమం (జీర్ణం కాని విష వ్యర్థాలు)',
      Hinglish: 'Ama (Pet ka Kacha Chipchipa Kachra)'
    },
    subtitle: {
      English: 'Sticky biological sludge blocking your joints and veins',
      Hindi: 'जोड़ों और नसों में जमने वाला गाढ़ा मैल',
      Tamil: 'மூட்டுகள் மற்றும் நரம்புகளை அடைக்கும் கழிவு',
      Marathi: 'सांधे आणि नसा अडवणारा चिकट मळ',
      Bengali: 'শরীরের শিরা ও গাঁটে জমে থাকা চটচটে বর্জ্য',
      Telugu: 'కీళ్ళు మరియు నరాలలో చేరే జిగట వ్యర్థం',
      Hinglish: 'Jodo aur naso me jamne wala gaadha mail'
    },
    iconEmoji: '🧪',
    colorBg: 'bg-emerald-50',
    colorBorder: 'border-emerald-300',
    colorText: 'text-emerald-950',
    visualMetaphor: {
      English: 'Think of dirty grease clogging a kitchen sink pipe. Ama is sticky sludge that sticks to your tongue and settles into finger/knee joints, causing pain and morning stiffness.',
      Hindi: 'जैसे नाली के पाइप में चिकनाई और कचरा जमने से पानी रुक जाता है, वैसे ही पेट का कच्चा रस (आम) नसों और जोड़ों में फंसकर दर्द और जकड़न पैदा करता है।',
      Tamil: 'குழாயில் கிரீஸ் அடைப்பது போல, ஆமம் நச்சு உங்கள் மூட்டுகளில் தங்கி வலியை ஏற்படுத்துகிறது.',
      Marathi: 'जसे पाईपमध्ये कचरा साचून पाणी अडकते, तसेच आम सांध्यामध्ये अडकून वेदना निर्माण करतो.',
      Bengali: 'যেমন পাইপে ময়লা জমে জল আটকে যায়, তেমনই শরীরে আম জমে গাঁটের ব্যথা তৈরি করে।',
      Telugu: 'పైపులో మురికి పేరుకుపోయినట్లు, ఆమం కీళ్ళలో చేరి నొప్పిని కలిగిస్తుంది.',
      Hinglish: 'Jaise naali ke pipe me kachra jamne se paani ruk jata hai, waise hi Ama jodo me fanskar dard karta hai.'
    },
    whatIsItSimple: {
      English: 'How to spot Ama: Look at your tongue in the mirror in the morning! If it has a thick white or yellow coating, that is Ama.',
      Hindi: 'आम की पहचान: सुबह आईने में जीभ देखें! अगर जीभ पर सफेद मोटी परत जमी है, तो समझें पेट में आम कचरा भरा है।',
      Tamil: 'ஆமத்தை கண்டறியும் முறை: காலையில் கண்ணாடியில் நாவைப் பாருங்கள்! வெள்ளை படலம் இருந்தால் அது ஆமம்.',
      Marathi: 'ओळखायची सोपी पद्धत: सकाळी आरशात जीभ पाहा! पांढरा थर असेल तर पोटात आम आहे.',
      Bengali: 'শনাক্ত করার সহজ উপায়: সকালে জিভে সাদা প্রলেপ থাকলে বুঝবেন পেটে আম জমেছে।',
      Telugu: 'గుర్తించే సులువైన పద్ధతి: ఉదయం నాలుకపై తెల్లటి పొర ఉంటే ఆమం ఉన్నట్లు అర్థం.',
      Hinglish: 'Ama ki pehchan: Subah aaine me jeebh dekhein! Agar safed moti parat hai to pet me Ama hai.'
    },
    howToFixIt: {
      English: 'Fast lightly (Langhana) with moong dal soup. Apply warm sand or salt fomentation (Valuka Sweda) to painful joints.',
      Hindi: 'रात को हल्का मूंग दाल का पानी पिएं। जोड़ों पर गर्म बालू या नमक की पोटली से सिकाई करें।',
      Tamil: 'பாசிப்பருப்பு கஞ்சி குடியுங்கள். வெதுவெதுப்பான ஒத்தடம் கொடுங்கள்.',
      Marathi: 'मुगाच्या डाळीचे सूप प्या. गरम वाळू किंवा मिठाच्या पुरचुंडीने शेक द्या.',
      Bengali: 'হালকা মুগ ডালের স্যুপ খান এবং গাঁটে গরম বালির সেঁক দিন।',
      Telugu: 'పెసరపప్పు సూప్ తాగండి. గోరువెచ్చని ఉప్పు మూటతో కాపడం పెట్టండి.',
      Hinglish: 'Raat ko halka moong dal ka paani piyein aur garm baalu ya namak ki potli se sikaai karein.'
    },
    audioSpeechText: {
      English: 'Ama is the sticky undigested waste. Look at your tongue: a white coating means Ama is present. Sip warm ginger water and eat light moong soup to burn it away.',
      Hindi: 'आम पेट का कच्चा कचरा है जो जोड़ों में दर्द करता है। सुबह जीभ पर सफेद मैल इसी का लक्षण है। इसे खत्म करने के लिए गर्म पानी पिएं और मूंग दाल का पानी लें।',
      Tamil: 'ஆமம் என்பது செரிக்காத கழிவு. இது மூட்டுகளில் வலியை தரும். வெதுவெதுப்பான நீர் அருந்தி இதனை வெளியேற்றவும்.',
      Marathi: 'आम म्हणजे पोटातील चिकट विषारी कचरा. हा घालवण्यासाठी कोमट पाणी आणि मुगाचे कढण प्या.',
      Bengali: 'আম হলো জমে থাকা বর্জ্য যা গাঁটে ব্যথা বাড়ায়। হালকা গরম জল এবং মুগ ডালের জল খান।',
      Telugu: 'ఆమం అంటే శరీరంలోని విష వ్యర్థం. దీనిని తగ్గించడానికి గోరువెచ్చని నీరు తాగండి.',
      Hinglish: 'Ama pet ka kacha kachra hai jo jodo me dard karta hai. Isko jalane ke liye gunguna paani pijiye.'
    }
  },
  {
    id: 'doshas',
    name: {
      English: 'Tridosha: Vata, Pitta & Kapha',
      Hindi: 'त्रिदोष: वात, पित्त और कफ',
      Tamil: 'திரிதோஷம்: வாதம், பித்தம், கபம்',
      Marathi: 'त्रिदोष: वात, पित्त आणि कफ',
      Bengali: 'ত্রিActiveদোষ: বায়ু, পিত্ত এবং কফ',
      Telugu: 'త్రిదోషాలు: వాత, పిత్త, కఫ',
      Hinglish: 'Tridosha: Vata, Pitta aur Kapha'
    },
    subtitle: {
      English: 'The three energies balancing your body: Wind, Fire, and Water',
      Hindi: 'शरीर को चलाने वाली 3 शक्तियां: हवा, आग और पानी',
      Tamil: 'உடலை இயக்கும் மூன்று சக்திகள்: காற்று, தீ, நீர்',
      Marathi: 'शरीराला चालवणाऱ्या ३ शक्ती: वारा, आग आणि पाणी',
      Bengali: 'শরীর পরিচালনার তিন শক্তি: বাতাস, আগুন এবং জল',
      Telugu: 'శరీరాన్ని నడిపించే మూడు శక్తులు: గాలి, నిప్పు, నీరు',
      Hinglish: 'Shareer ko chalane wali 3 shaktiyan: Hawa, Aag aur Paani'
    },
    iconEmoji: '⚖️',
    colorBg: 'bg-indigo-50',
    colorBorder: 'border-indigo-300',
    colorText: 'text-indigo-950',
    visualMetaphor: {
      English: 'Vata is Wind (Movement & Pain), Pitta is Sun (Heat & Digestion), Kapha is Earth & Water (Lubrication & Strength). When all 3 are in harmony, you are 100% healthy.',
      Hindi: 'वात मतलब हवा (जोड़ों में दर्द और सूखापन), पित्त मतलब आग (एसिडिटी और जलन), कफ मतलब पानी और चिकनाई (कफ और भारीपन)। जब ये तीनों बराबर हों तो बीमारी नहीं होती।',
      Tamil: 'வாதம் என்பது காற்று, பித்தம் என்பது வெப்பம், கபம் என்பது நீர். இவை மூன்றும் சமமாக இருந்தால் நோய் வராது.',
      Marathi: 'वात म्हणजे वारा (वेदना), पित्त म्हणजे अग्नी (जळजळ), कफ म्हणजे पाणी (जडपणा). हे तिन्ही समतोल हवेत.',
      Bengali: 'বাত মানে বায়ু (ব্যথা), পিত্ত মানে আগুন (অম্বল), কফ মানে জল (ভারী ভাব)। তিনটি ঠিক থাকলে শরীর সুস্থ।',
      Telugu: 'వాతం అంటే గాలి (నొప్పులు), పిత్తం అంటే వేడి (మంట), కఫం అంటే నీరు (బరువు). ఇవి సమంగా ఉండాలి.',
      Hinglish: 'Vata matlab hawa aur dard, Pitta matlab aag aur jalan, Kapha matlab paani aur bhaari-pan.'
    },
    whatIsItSimple: {
      English: 'When Vata goes high: You get joint cracking, dryness, constipation, and body aches. Keep warm and massage with Mahanarayana taila.',
      Hindi: 'जब वात बढ़ता है: जोड़ों से कट-कट आवाज आती है, शरीर में सूखापन और तेज दर्द होता है। ठंड और ठंडी हवा से बचें।',
      Tamil: 'வாதம் கூடினால்: மூட்டு வலி, உடல் வறட்சி ஏற்படும். சூடான ஒத்தடம் தேவை.',
      Marathi: 'वात वाढला की सांधे दुखतात आणि पोट साफ होत नाही. नेहमी उबदार राहा.',
      Bengali: 'বাত বাড়লে গাঁটে ব্যথা ও কোষ্ঠকাঠিন্য হয়। শরীর গরম রাখুন।',
      Telugu: 'వాతం పెరిగితే కీళ్ళ నొప్పులు వస్తాయి. శరీరాన్ని వెచ్చగా ఉంచండి.',
      Hinglish: 'Jab Vata badhta hai: Jodo se kat-kat aawaz aati hai aur tezz dard hota hai. Thand se bachein.'
    },
    howToFixIt: {
      English: 'Eat warm, freshly cooked soft food. Avoid stale, dry biscuits, raw salads, and cold sodas.',
      Hindi: 'गर्म और ताजा बना खाना खाएं। बासी खाना, सूखी चीजें और ठंडी चीजें न खाएं।',
      Tamil: 'எப்போதும் சூடான உணவு உண்ணுங்கள். பழைய உணவை தவிர்க்கவும்.',
      Marathi: 'ताजे आणि गरम अन्न खा. कोरडे आणि शिळे पदार्थ टाळा.',
      Bengali: 'গরম ও টাটকা খাবার খান। বাসি খাবার বর্জন করুন।',
      Telugu: 'తాజా గోరువెచ్చని ఆహారం తినండి. చల్లటి ఆహారం తినవద్దు.',
      Hinglish: 'Garm aur taaza bana khana khayein. Basi aur sukhi cheezein na khayein.'
    },
    audioSpeechText: {
      English: 'Vata, Pitta, and Kapha are the three forces of your body. When Vata wind increases, your joints hurt and feel stiff. Protect yourself from cold winds and eat warm foods.',
      Hindi: 'वात, पित्त और कफ शरीर के तीन स्तंभ हैं। जब वात हवा बिगड़ती है तो जोड़ों में दर्द होता है। ठंडी हवा से बचें और हमेशा ताजा गर्म भोजन खाएं।',
      Tamil: 'வாதம் பித்தம் கபம் மூன்றும் சமமாக இருக்க வேண்டும். வாதம் அதிகமானால் மூட்டு வலி வரும். சூடான உணவு உட்கொள்ளுங்கள்.',
      Marathi: 'वात, पित्त आणि कफ हे शरीराचे तीन आधार आहेत. वात वाढल्यास सांधेदुखी होते. थंड वाऱ्यापासून स्वतःचा बचाव करा.',
      Bengali: 'বাত, পিত্ত এবং কফ হলো শরীরের মূল ভিত্তি। বাত বাড়লে শরীরে ব্যথা হয়। ঠান্ডা থেকে দূরে থাকুন।',
      Telugu: 'వాతం, పిత్తం, కఫం శరీరాన్ని కాపాడతాయి. వాతం పెరిగితే నొప్పులు వస్తాయి. వెచ్చని ఆహారం తినండి.',
      Hinglish: 'Vata, Pitta aur Kapha shareer ke teen stambh hain. Jab Vata hawa bigadti hai to jodo me dard hota hai.'
    }
  },
  {
    id: 'pathya',
    name: {
      English: 'Pathya-Apathya (What to Eat vs Avoid)',
      Hindi: 'पथ्य-अपथ्य (क्या खाना अमृत है और क्या जहर)',
      Tamil: 'பத்தியம் (சாப்பிட வேண்டியதும் தவிர்க்க வேண்டியதும்)',
      Marathi: 'पथ्य-अपथ्य (काय खावे आणि काय टाळावे)',
      Bengali: 'পথ্য-অপথ্য (কী খাবেন আর কী খাবেন না)',
      Telugu: 'పథ్యము-అపథ్యము (ఏమి తినాలి, ఏమి తినకూడదు)',
      Hinglish: 'Pathya-Apathya (Kya Khana Hai aur Kya Nahi)'
    },
    subtitle: {
      English: 'Ayurveda rule: Medicine is useless without good diet',
      Hindi: 'आयुर्वेद का नियम: सही खान-पान के बिना कोई दवा काम नहीं करती',
      Tamil: 'உணவே மருந்து: சரியான உணவு முறை மிக முக்கியம்',
      Marathi: 'योग्य आहाराशिवाय कोणतेही औषध काम करत नाही',
      Bengali: 'সঠিক পথ্য ছাড়া কোনো ওষুধ কাজ করে না',
      Telugu: 'సరైన ఆహారం లేకపోతే ఏ మందూ పనిచేయదు',
      Hinglish: 'Sahi khaan-paan ke bina koi dawa kaam nahi karti'
    },
    iconEmoji: '🥗',
    colorBg: 'bg-teal-50',
    colorBorder: 'border-teal-300',
    colorText: 'text-teal-950',
    visualMetaphor: {
      English: 'Good food puts out the fire of disease. Incompatible food (like curd at night or milk with citrus) pours fuel on joint inflammation.',
      Hindi: 'सही भोजन बीमारी को शांत करता है। गलत खाना (जैसे रात में दही खाना या दूध के साथ खट्टी चीजें लेना) जोड़ों के दर्द में घी डालने जैसा है।',
      Tamil: 'இரவில் தயிர் சாப்பிடுவது மூட்டு வலியை அதிகப்படுத்தும்.',
      Marathi: 'रात्री दही खाणे किंवा थंड पदार्थ घेणे सांधेदुखी वाढवते.',
      Bengali: 'রাতে দই বা ঠান্ডা খাবার খেলে বাত আরও বাড়ে।',
      Telugu: 'రాత్రి పెరుగు తినడం వల్ల కీళ్ళ నొప్పులు పెరుగుతాయి.',
      Hinglish: 'Raat ko dahi khana ya doodh ke sath khatta lena jodo ke dard me ghee daalne jaisa hai.'
    },
    whatIsItSimple: {
      English: 'Good For You (Pathya): Warm water, kulatha (horsegram) soup, garlic, ginger, turmeric. Bad For You (Apathya): Cold curd, black urad dal, day-sleeping.',
      Hindi: 'क्या खाएं: गुनगुना पानी, कुलथी का सूप, लहसुन, सोंठ, हल्दी। क्या छोड़ें: रात का दही, उड़द की दाल, दिन में सोना।',
      Tamil: 'சாப்பிடவும்: சுக்கு, வெந்நீர், பூண்டு, கொள்ளு. தவிர்க்கவும்: தயிர், உளுந்து.',
      Marathi: 'काय खावे: कोमट पाणी, लसूण, सुंठ, हळद. काय टाळावे: दही, उडीद डाळ, दिवसा झोपणे.',
      Bengali: 'খাবেন: গরম জল, আদা, রসুন, হলুদ। ছাড়বেন: দই, কলাইয়ের ডাল, দিনে ঘুমানো।',
      Telugu: 'తినండి: వెల్లుల్లి, శొంఠి, పసుపు, ఉలవచారు. మానండి: పెరుగు, మినపప్పు, పగటి నిద్ర.',
      Hinglish: 'Kya khayein: Gunguna paani, Lahsun, Soanth, Haldi. Kya chhodein: Raat ka dahi, Urad daal, din me sona.'
    },
    howToFixIt: {
      English: 'Eat light dinner before 7:30 PM. Walk 100 gentle steps (Shatapadi) before going to bed.',
      Hindi: 'शाम का खाना 7:30 बजे से पहले खा लें और सोने से पहले सौ कदम टहलें।',
      Tamil: 'இரவு உணவை 7:30 மணிக்கு முன் முடித்துவிட்டு 100 அடிகள் நடக்கவும்.',
      Marathi: 'संध्याकाळी ७:३० च्या आधी जेवा आणि झोपण्यापूर्वी शतपावली करा.',
      Bengali: 'সন্ধ্যা ৭:৩০ এর মধ্যে রাতের খাবার খান এবং ১০০ পা হাঁটুন।',
      Telugu: 'రాత్రి 7:30 లోపు భోజనం చేసి, 100 అడుగులు నడవండి.',
      Hinglish: 'Shaam ka khana 7:30 baje se pehle khayein aur sone se pehle 100 kadam tahlein.'
    },
    audioSpeechText: {
      English: 'Pathya means wholesome food that heals you. Avoid curd at night and ice cold water. Drink warm ginger water and eat dinner early before sunset.',
      Hindi: 'पथ्य का मतलब है सही खाना। रात में दही और ठंडा पानी बिल्कुल न लें। शाम का खाना जल्दी खाएं और हल्का गुनगुना पानी पिएं।',
      Tamil: 'பத்தியம் மிக முக்கியம். இரவில் தயிர் உண்ணாதீர்கள். எப்போதும் வெதுவெதுப்பான நீர் குடியுங்கள்.',
      Marathi: 'पथ्य पाळणे गरजेचे आहे. रात्री दही खाऊ नका आणि संध्याकाळी लवकर जेवा.',
      Bengali: 'পথ্য মেনে চলুন। রাতে দই ও ঠান্ডা জল খাবেন না। তাড়াতাড়ি রাতের খাবার শেষ করুন।',
      Telugu: 'పథ్యం చాలా ముఖ్యం. రాత్రి పూట పెరుగు తినవద్దు. గోరువెచ్చని నీరు తాగండి.',
      Hinglish: 'Pathya ka matlab hai sahi khana. Raat me dahi aur thanda paani bilkul na lein.'
    }
  }
];

interface KnowledgeCenterProps {
  language?: string;
  onSelectConcept?: (conceptId: string) => void;
}

export const AyushKnowledgeCenter: React.FC<KnowledgeCenterProps> = ({
  language = 'Hindi',
  onSelectConcept,
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>('agni');
  const [activeSpeechLang, setActiveSpeechLang] = useState<string>(language);

  // Normalize language key safely
  const getLangKey = (lang: string): keyof KnowledgeConcept['name'] => {
    const l = lang.toLowerCase();
    if (l.includes('tamil')) return 'Tamil';
    if (l.includes('marathi')) return 'Marathi';
    if (l.includes('bengali')) return 'Bengali';
    if (l.includes('telugu')) return 'Telugu';
    if (l.includes('hinglish')) return 'Hinglish';
    if (l.includes('hindi')) return 'Hindi';
    return 'English';
  };

  const currentLangKey = getLangKey(activeSpeechLang);

  const speakConceptAudio = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (currentLangKey === 'Hindi') utter.lang = 'hi-IN';
    else if (currentLangKey === 'Tamil') utter.lang = 'ta-IN';
    else if (currentLangKey === 'Marathi') utter.lang = 'mr-IN';
    else if (currentLangKey === 'Bengali') utter.lang = 'bn-IN';
    else if (currentLangKey === 'Telugu') utter.lang = 'te-IN';
    else utter.lang = 'en-IN';
    utter.rate = 0.88;
    window.speechSynthesis.speak(utter);
  };

  const selectedConcept = AYUSH_KNOWLEDGE_CONCEPTS.find(c => c.id === selectedConceptId) || AYUSH_KNOWLEDGE_CONCEPTS[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Top Banner with Multilingual Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-700" />
              Patient Knowledge Center • ज्ञान केंद्र
            </span>
            <span className="text-slate-500 text-xs font-semibold">
              Simplified Audio & Picture Guide
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Learn Ayush Health Secrets in Simple Vernacular Language
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear picture-based explanations of Agni, Ama, Doshas, and Diet rules, with high-clarity voice read-aloud buttons.
          </p>
        </div>

        {/* Functional Language Switcher for Knowledge Center */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start lg:self-auto overflow-x-auto max-w-full">
          {['Hindi', 'English', 'Hinglish', 'Tamil', 'Marathi', 'Bengali', 'Telugu'].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActiveSpeechLang(l)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSpeechLang.toLowerCase().includes(l.toLowerCase())
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {l === 'Hindi' ? 'हिन्दी' : l === 'Tamil' ? 'தமிழ்' : l === 'Marathi' ? 'मराठी' : l === 'Bengali' ? 'বাংলা' : l === 'Telugu' ? 'తెలుగు' : l}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Big High-Contrast Visual Cards (Picture / Metaphor Driven) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AYUSH_KNOWLEDGE_CONCEPTS.map((concept) => {
          const isSelected = concept.id === selectedConceptId;
          return (
            <div
              key={concept.id}
              onClick={() => {
                setSelectedConceptId(concept.id);
                if (onSelectConcept) onSelectConcept(concept.id);
              }}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-amber-500 shadow-md ring-4 ring-amber-400/20 scale-[1.02]'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-2xl">
                    {concept.iconEmoji}
                  </div>

                  {/* Individual Audio Button on Card */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakConceptAudio(concept.audioSpeechText[currentLangKey]);
                    }}
                    title="Awaaz me sunein"
                    className="w-9 h-9 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {concept.name[currentLangKey]}
                </h3>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {concept.subtitle[currentLangKey]}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>{isSelected ? '✓ Active Lesson' : 'Click to Read & Hear'}</span>
                <span className="text-base">👉</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Detailed Lesson Viewer with Large Visual Metaphor */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 ${selectedConcept.colorBorder} ${selectedConcept.colorBg} space-y-6 animate-fade-in`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl shrink-0">
              {selectedConcept.iconEmoji}
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200">
                Interactive Picture Guide
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {selectedConcept.name[currentLangKey]}
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                {selectedConcept.subtitle[currentLangKey]}
              </p>
            </div>
          </div>

          {/* Big Voice Play Button */}
          <button
            type="button"
            onClick={() => speakConceptAudio(selectedConcept.audioSpeechText[currentLangKey])}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Volume2 className="w-4 h-4" />
            <span>Awaaz Me Pura Sunein (Listen Aloud)</span>
          </button>
        </div>

        {/* 3 Intuitive Visual Section Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Box 1: Visual Real-Life Metaphor */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide">
              <span>🖼️ Real Life Example</span>
            </div>
            <h4 className="text-xs font-black text-slate-900">
              Asal Zindagi Ka Udaharan (Metaphor):
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedConcept.visualMetaphor[currentLangKey]}
            </p>
          </div>

          {/* Box 2: How to spot it in your body */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
              <span>👀 Body Sign Check</span>
            </div>
            <h4 className="text-xs font-black text-slate-900">
              Shareer Me Kaise Pehchanein:
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedConcept.whatIsItSimple[currentLangKey]}
            </p>
          </div>

          {/* Box 3: What to do at home (Remedy) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
              <span>🍵 Ghar Par Kya Karein</span>
            </div>
            <h4 className="text-xs font-black text-slate-900">
              Gharelu Upay & Bachav:
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedConcept.howToFixIt[currentLangKey]}
            </p>
          </div>
        </div>

        {/* Spoken Text Audio Preview Banner */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📢</span>
            <span className="text-slate-800 italic">
              "{selectedConcept.audioSpeechText[currentLangKey]}"
            </span>
          </div>

          <button
            type="button"
            onClick={() => speakConceptAudio(selectedConcept.audioSpeechText[currentLangKey])}
            className="text-[11px] font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Play Audio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
