const fs = require('fs');

const languages = ['en', 'hi', 'ta', 'te', 'mr', 'bn', 'gu'];
const baseTranslations = {
  NAV: {
    HOME: "Home",
    TOOLS: "Tools",
    LEARN: "Learn",
    REPORT: "Report Cybercrime"
  },
  MODULES: {
    PASSWORD_LAB: "Password Lab",
    PHISHING_DETECTOR: "Phishing Detector",
    DATA_BREACH: "Data Breach Check",
    SAFETY_SCORE: "Digital Safety Score",
    SCAM_AWARENESS: "Scam Awareness",
    REPORT_CYBERCRIME: "Report Cybercrime",
    UPI_SCANNER: "UPI Scanner",
    TWO_FACTOR: "2FA Advisor",
    PRIVACY_AUDIT: "Privacy Audit",
    EMAIL_HEADER: "Email Header Analyzer",
    APP_PERMISSIONS: "App Permission Checker",
    WIFI_SAFETY: "WiFi Safety Tester",
    THREAT_FEED: "Threat Feed",
    CYBER_LAW: "Cyber Law Knowledge Base",
    DAILY_TIPS: "Daily Tips",
    SCAM_STORIES: "Scam Stories",
    AADHAAR_GUIDE: "Aadhaar Safety Guide",
    OSINT_CHECK: "Personal OSINT Check",
    ROADMAP: "30-Day Security Roadmap",
    GLOSSARY: "Security Glossary"
  },
  COMMON: {
    SAFE: "Safe",
    SUSPICIOUS: "Suspicious",
    DANGEROUS: "Dangerous",
    SCAN: "Scan Now",
    NEXT: "Next",
    BACK: "Back",
    SHARE: "Share",
    COPY: "Copy",
    DONE: "Done",
    ERROR: "An error occurred. Please try again.",
    LOADING: "Loading..."
  }
};

const translations = {
  en: baseTranslations,
  hi: {
    NAV: { HOME: "होम", TOOLS: "उपकरण", LEARN: "सीखें", REPORT: "साइबर अपराध की रिपोर्ट करें" },
    MODULES: { PASSWORD_LAB: "पासवर्ड लैब", PHISHING_DETECTOR: "फ़िशिंग डिटेक्टर", DATA_BREACH: "डेटा ब्रीच चेक", SAFETY_SCORE: "डिजिटल सुरक्षा स्कोर", SCAM_AWARENESS: "स्कैम जागरूकता", REPORT_CYBERCRIME: "साइबर अपराध की रिपोर्ट करें", UPI_SCANNER: "यूपीआई स्कैनर", TWO_FACTOR: "2FA सलाहकार", PRIVACY_AUDIT: "प्राइवेसी ऑडिट", EMAIL_HEADER: "ईमेल हैडर विश्लेषक", APP_PERMISSIONS: "ऐप परमिशन चेकर", WIFI_SAFETY: "वाईफाई सुरक्षा परीक्षक", THREAT_FEED: "खतरा फ़ीड", CYBER_LAW: "साइबर कानून ज्ञान आधार", DAILY_TIPS: "दैनिक टिप्स", SCAM_STORIES: "स्कैम की कहानियाँ", AADHAAR_GUIDE: "आधार सुरक्षा गाइड", OSINT_CHECK: "व्यक्तिगत OSINT चेक", ROADMAP: "30-दिवसीय सुरक्षा रोडमैप", GLOSSARY: "सुरक्षा शब्दावली" },
    COMMON: { SAFE: "सुरक्षित", SUSPICIOUS: "संदिग्ध", DANGEROUS: "खतरनाक", SCAN: "अभी स्कैन करें", NEXT: "अगला", BACK: "वापस", SHARE: "साझा करें", COPY: "कॉपी करें", DONE: "हो गया", ERROR: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।", LOADING: "लोड हो रहा है..." }
  },
  ta: {
    NAV: { HOME: "முகப்பு", TOOLS: "கருவிகள்", LEARN: "அறிய", REPORT: "புகார்" },
    MODULES: { PASSWORD_LAB: "கடவுச்சொல் ஆய்வகம்", PHISHING_DETECTOR: "ஃபிஷிங் டிடெக்டர்", DATA_BREACH: "தரவு மீறல் சரிபார்ப்பு", SAFETY_SCORE: "டிஜிட்டல் பாதுகாப்பு மதிப்பெண்", SCAM_AWARENESS: "மோசடி விழிப்புணர்வு", REPORT_CYBERCRIME: "சைபர்கிரைம் புகாரளிக்கவும்", UPI_SCANNER: "UPI ஸ்கேனர்", TWO_FACTOR: "2FA வழிகாட்டி", PRIVACY_AUDIT: "தனியுரிமை தணிக்கை", EMAIL_HEADER: "மின்னஞ்சல் பகுப்பாய்வி", APP_PERMISSIONS: "பயன்பாட்டு அனுமதி செக்கர்", WIFI_SAFETY: "வைஃபை பாதுகாப்பு சோதனை", THREAT_FEED: "அச்சுறுத்தல் ஊட்டம்", CYBER_LAW: "சைபர் சட்டம்", DAILY_TIPS: "தினசரி குறிப்புகள்", SCAM_STORIES: "மோசடி கதைகள்", AADHAAR_GUIDE: "ஆதார் பாதுகாப்பு", OSINT_CHECK: "தனிப்பட்ட OSINT", ROADMAP: "30 நாள் திட்டம்", GLOSSARY: "கலைச்சொற்கள்" },
    COMMON: { SAFE: "பாதுகாப்பானது", SUSPICIOUS: "சந்தேகத்திற்குரியது", DANGEROUS: "ஆபத்தானது", SCAN: "ஸ்கேன்", NEXT: "அடுத்தது", BACK: "திரும்பி", SHARE: "பகிர்", COPY: "நகலெடு", DONE: "முடிந்தது", ERROR: "பிழை ஏற்பட்டது.", LOADING: "ஏற்றுகிறது..." }
  },
  te: {
    NAV: { HOME: "హోమ్", TOOLS: "సాధనాలు", LEARN: "నేర్చుకోండి", REPORT: "రిపోర్ట్ చేయండి" },
    MODULES: { PASSWORD_LAB: "పాస్‌వర్డ్ ల్యాబ్", PHISHING_DETECTOR: "ఫిషింగ్ డిటెక్టర్", DATA_BREACH: "డేటా బ్రీచ్ చెక్", SAFETY_SCORE: "సేఫ్టీ స్కోర్", SCAM_AWARENESS: "స్కామ్ అవగాహన", REPORT_CYBERCRIME: "సైబర్‌క్రైమ్ రిపోర్ట్", UPI_SCANNER: "UPI స్కానర్", TWO_FACTOR: "2FA సలహాదారు", PRIVACY_AUDIT: "గోప్యత ఆడిట్", EMAIL_HEADER: "ఈమెయిల్ హెడర్ అనలైజర్", APP_PERMISSIONS: "యాప్ పర్మిషన్ చెకర్", WIFI_SAFETY: "వైఫై సేఫ్టీ", THREAT_FEED: "థ్రెట్ ఫీడ్", CYBER_LAW: "సైబర్ చట్టం", DAILY_TIPS: "రోజువారీ చిట్కాలు", SCAM_STORIES: "స్కామ్ కథలు", AADHAAR_GUIDE: "ఆధార్ భద్రత", OSINT_CHECK: "OSINT చెక్", ROADMAP: "30-రోజుల ప్లాన్", GLOSSARY: "పదకోశం" },
    COMMON: { SAFE: "సురక్షితం", SUSPICIOUS: "అనుమానాస్పదం", DANGEROUS: "ప్రమాదకరం", SCAN: "స్కాన్ చేయండి", NEXT: "తరువాత", BACK: "వెనుకకు", SHARE: "షేర్ చేయండి", COPY: "కాపీ చేయండి", DONE: "పూర్తయింది", ERROR: "లోపం ఏర్పడింది.", LOADING: "లోడ్ అవుతోంది..." }
  },
  mr: {
    NAV: { HOME: "मुख्यपृष्ठ", TOOLS: "साधने", LEARN: "शिका", REPORT: "रिपोर्ट" },
    MODULES: { PASSWORD_LAB: "पासवर्ड लॅब", PHISHING_DETECTOR: "फिशिंग डिटेक्टर", DATA_BREACH: "डेटा ब्रीच चेक", SAFETY_SCORE: "सेफ्टी स्कोअर", SCAM_AWARENESS: "घोटाळा जागरूकता", REPORT_CYBERCRIME: "सायबर गुन्ह्याची तक्रार करा", UPI_SCANNER: "UPI स्कॅनर", TWO_FACTOR: "2FA सल्लागार", PRIVACY_AUDIT: "गोपनीयता ऑडिट", EMAIL_HEADER: "ईमेल हेडर विश्लेषक", APP_PERMISSIONS: "ॲप परमिशन चेकर", WIFI_SAFETY: "वायफाय सुरक्षा", THREAT_FEED: "थ्रेट फीड", CYBER_LAW: "सायबर कायदा", DAILY_TIPS: "दैनिक टिप्स", SCAM_STORIES: "घोटाळ्याच्या कथा", AADHAAR_GUIDE: "आधार सुरक्षा", OSINT_CHECK: "OSINT चेक", ROADMAP: "30-दिवसांची योजना", GLOSSARY: "शब्दकोश" },
    COMMON: { SAFE: "सुरक्षित", SUSPICIOUS: "संशयास्पद", DANGEROUS: "धोकादायक", SCAN: "स्कॅन करा", NEXT: "पुढे", BACK: "मागे", SHARE: "शेअर करा", COPY: "कॉपी करा", DONE: "पूर्ण झाले", ERROR: "एक त्रुटी आली.", LOADING: "लोड होत आहे..." }
  },
  bn: {
    NAV: { HOME: "হোম", TOOLS: "টুলস", LEARN: "শিখুন", REPORT: "রিপোর্ট" },
    MODULES: { PASSWORD_LAB: "পাসওয়ার্ড ল্যাব", PHISHING_DETECTOR: "ফিশিং ডিটেক্টর", DATA_BREACH: "ডেটা ব্রিচ চেক", SAFETY_SCORE: "নিরাপত্তা স্কোর", SCAM_AWARENESS: "স্ক্যাম সচেতনতা", REPORT_CYBERCRIME: "সাইবার অপরাধ রিপোর্ট করুন", UPI_SCANNER: "ইউপিআই স্ক্যানার", TWO_FACTOR: "2FA উপদেষ্টা", PRIVACY_AUDIT: "গোপনীয়তা অডিট", EMAIL_HEADER: "ইমেল হেডার বিশ্লেষক", APP_PERMISSIONS: "অ্যাপ পারমিশন চেকার", WIFI_SAFETY: "ওয়াইফাই নিরাপত্তা", THREAT_FEED: "হুমকি ফিড", CYBER_LAW: "সাইবার আইন", DAILY_TIPS: "দৈনিক টিপস", SCAM_STORIES: "স্ক্যামের গল্প", AADHAAR_GUIDE: "আধার নিরাপত্তা", OSINT_CHECK: "OSINT চেক", ROADMAP: "৩০ দিনের পরিকল্পনা", GLOSSARY: "শব্দকোষ" },
    COMMON: { SAFE: "নিরাপদ", SUSPICIOUS: "সন্দেহজনক", DANGEROUS: "বিপজ্জনক", SCAN: "স্ক্যান করুন", NEXT: "পরবর্তী", BACK: "ফিরে যান", SHARE: "শেয়ার করুন", COPY: "কপি করুন", DONE: "সম্পন্ন", ERROR: "একটি ত্রুটি ঘটেছে।", LOADING: "লোড হচ্ছে..." }
  },
  gu: {
    NAV: { HOME: "હોમ", TOOLS: "ટૂલ્સ", LEARN: "શીખો", REPORT: "રિપોર્ટ કરો" },
    MODULES: { PASSWORD_LAB: "પાસવર્ડ લેબ", PHISHING_DETECTOR: "ફિશિંગ ડિટેક્ટર", DATA_BREACH: "ડેટા બ્રીચ ચેક", SAFETY_SCORE: "સેફ્ટી સ્કોર", SCAM_AWARENESS: "સ્કેમ જાગૃતિ", REPORT_CYBERCRIME: "સાયબર ક્રાઇમ રિપોર્ટ કરો", UPI_SCANNER: "યુપીઆઈ સ્કેનર", TWO_FACTOR: "2FA સલાહકાર", PRIVACY_AUDIT: "ગોપનીયતા ઓડિટ", EMAIL_HEADER: "ઈમેલ હેડર વિશ્લેષક", APP_PERMISSIONS: "એપ્લિકેશન પરમિશન ચેકર", WIFI_SAFETY: "વાઇફાઇ સુરક્ષા", THREAT_FEED: "થ્રેટ ફીડ", CYBER_LAW: "સાયબર કાયદો", DAILY_TIPS: "દૈનિક ટિપ્સ", SCAM_STORIES: "સ્કેમની વાર્તાઓ", AADHAAR_GUIDE: "આધાર સુરક્ષા", OSINT_CHECK: "OSINT ચેક", ROADMAP: "30-દિવસની યોજના", GLOSSARY: "શબ્દકોશ" },
    COMMON: { SAFE: "સલામત", SUSPICIOUS: "શંકાસ્પદ", DANGEROUS: "ખતરનાક", SCAN: "સ્કેન કરો", NEXT: "આગળ", BACK: "પાછા", SHARE: "શેર કરો", COPY: "કોપી કરો", DONE: "પૂર્ણ", ERROR: "એક ભૂલ આવી.", LOADING: "લોડ થઈ રહ્યું છે..." }
  }
};

if (!fs.existsSync('src/assets/i18n')) {
  fs.mkdirSync('src/assets/i18n', { recursive: true });
}

languages.forEach(lang => {
  fs.writeFileSync(`src/assets/i18n/${lang}.json`, JSON.stringify(translations[lang] || baseTranslations, null, 2));
});

console.log('Generated translation files.');
