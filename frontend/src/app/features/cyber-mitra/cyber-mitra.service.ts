import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ActionButton {
  label: string;
  route: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quickReplies?: string[];
  actionButtons?: ActionButton[];
  relatedTool?: string;
  helpfulState?: 'up' | 'down' | null;
}

interface IntentResponse {
  keywords: string[];
  en: string;
  hi: string;
  quickRepliesEn: string[];
  quickRepliesHi: string[];
  toolButtonEn?: ActionButton;
  toolButtonHi?: ActionButton;
}

@Injectable({
  providedIn: 'root'
})
export class CyberMitraService {
  private readonly HISTORY_KEY = 'CySafeClick_mitra_history';

  private readonly INTENTS: Record<string, IntentResponse> = {
    FINANCIAL_LOSS: {
      keywords: ['money lost', 'lost money', 'amount deducted', 'transaction failed', 'upi fraud', 'bank fraud', 'money deducted', 'पैसे कट', 'धोखाधड़ी'],
      en: "This may be a financial cybercrime. Act now:\n\n1. Call 1930 immediately. Ask for help freezing the transaction.\n2. Call your bank's official helpline and request debit freeze / beneficiary freeze.\n3. Save UTR, transaction ID, screenshots, UPI ID, phone number, and bank SMS.\n4. File the official complaint on cybercrime.gov.in and save the acknowledgement number.\n\nDo not send more money for refund, tax, unlock fee, or verification.",
      hi: "यह वित्तीय साइबर अपराध हो सकता है। अभी कार्रवाई करें:\n\n1. तुरंत 1930 पर कॉल करें। ट्रांजैक्शन फ्रीज में मदद मांगें।\n2. बैंक की आधिकारिक हेल्पलाइन पर कॉल करें।\n3. UTR, स्क्रीनशॉट, UPI ID, फोन नंबर और बैंक SMS सुरक्षित रखें।\n4. cybercrime.gov.in पर शिकायत दर्ज करें।\n\nरिफंड, टैक्स, अनलॉक फीस या वेरिफिकेशन के नाम पर और पैसे न भेजें।",
      quickRepliesEn: ['What evidence do I need?', 'Open report guide', 'Open UPI scanner'],
      quickRepliesHi: ['कौन से सबूत चाहिए?', 'रिपोर्ट गाइड खोलें', 'UPI स्कैनर खोलें'],
      toolButtonEn: { label: 'Open Report Guide', route: '/report-cybercrime', icon: '🚨' },
      toolButtonHi: { label: 'रिपोर्ट गाइड खोलें', route: '/report-cybercrime', icon: '🚨' }
    },
    BLACKMAIL_EXTORTION: {
      keywords: ['blackmail', 'sextortion', 'nude', 'intimate photo', 'morphed photo', 'threatening me', 'ब्लैकमेल', 'धमकी'],
      en: "Do not pay and do not negotiate. Paying usually increases extortion.\n\n1. Save screenshots, profile links, phone numbers, payment demands, and timestamps.\n2. Stop replying after evidence is saved.\n3. Report on cybercrime.gov.in. If there is immediate physical danger, visit the nearest police station.\n4. Tell one trusted person so you are not handling this alone.\n\nIf money was already transferred, call 1930 immediately.",
      hi: "पैसे न दें और बातचीत न करें। पैसे देने से ब्लैकमेल बढ़ सकता है।\n\n1. स्क्रीनशॉट, प्रोफाइल लिंक, फोन नंबर, भुगतान मांग और समय सुरक्षित रखें।\n2. सबूत सुरक्षित करने के बाद जवाब देना बंद करें।\n3. cybercrime.gov.in पर रिपोर्ट करें। तुरंत खतरा हो तो नजदीकी पुलिस स्टेशन जाएं।\n4. किसी भरोसेमंद व्यक्ति को बताएं।\n\nयदि पैसे भेज दिए हैं तो तुरंत 1930 पर कॉल करें।",
      quickRepliesEn: ['Open incident playbook', 'What evidence should I save?'],
      quickRepliesHi: ['इंसीडेंट प्लेबुक खोलें', 'कौन से सबूत बचाऊं?'],
      toolButtonEn: { label: 'Open Incident Playbooks', route: '/tools/incident-response', icon: '📖' },
      toolButtonHi: { label: 'इंसीडेंट प्लेबुक खोलें', route: '/tools/incident-response', icon: '📖' }
    },
    GREETING: {
      keywords: ['hi', 'hello', 'help', 'namaste', 'नमस्ते', 'हेलो', 'hey'],
      en: "Hello! I am Cyber Mitra, your digital safety advisor. How can I help you today? You can ask me about scams, reporting fraud, securing accounts, or checking suspicious links.",
      hi: "नमस्ते! मैं साइबर मित्र हूँ, आपका डिजिटल सुरक्षा सलाहकार। आज मैं आपकी कैसे मदद कर सकता हूँ? आप मुझसे स्कैम, धोखाधड़ी की रिपोर्ट करने, या संदिग्ध लिंक की जाँच के बारे में पूछ सकते हैं।",
      quickRepliesEn: ['Is this SMS a scam?', 'How do I report UPI fraud?', 'My phone got hacked'],
      quickRepliesHi: ['क्या यह एसएमएस स्कैम है?', 'मैं यूपीआई धोखाधड़ी की रिपोर्ट कैसे करूं?', 'मेरा फोन हैक हो गया है']
    },
    OTP_SCAM: {
      keywords: ['otp', 'one time password', 'share otp', 'bank otp', 'paytm otp', 'ओटीपी'],
      en: "I understand you're in a stressful situation. Here's what you need to know about OTP sharing:\n\n⚠️ Never share your OTP with anyone — not even someone claiming to be from your bank, PayTM, or TRAI.\n\nReal banks/companies will NEVER ask for your OTP over the phone. This is one of India's most common scams.\n\nIf you've already shared your OTP:\n1. Immediately call your bank's official helpline\n2. Block your card if you shared a banking OTP\n3. Call 1930 (Cyber Crime Helpline) right now\n4. Screenshot all messages for evidence",
      hi: "मैं समझता हूँ कि आप तनावपूर्ण स्थिति में हैं। ओटीपी के बारे में आपको यह जानना आवश्यक है:\n\n⚠️ कभी भी अपना ओटीपी किसी के साथ साझा न करें - यहां तक ​​कि उस व्यक्ति के साथ भी जो आपके बैंक, PayTM या TRAI से होने का दावा करता है।\n\nअसली बैंक/कंपनियां फोन पर कभी ओटीपी नहीं मांगतीं। यह भारत के सबसे आम घोटालों में से एक है।\n\nयदि आपने पहले ही ओटीपी साझा कर दिया है:\n1. तुरंत अपने बैंक के आधिकारिक हेल्पलाइन पर कॉल करें\n2. अपना कार्ड ब्लॉक करें\n3. अभी 1930 (साइबर क्राइम हेल्पलाइन) पर कॉल करें\n4. सबूत के लिए स्क्रीनशॉट लें",
      quickRepliesEn: ['I already shared it', "I didn't share yet", 'How do I call 1930?'],
      quickRepliesHi: ['मैंने पहले ही साझा कर दिया है', 'मैंने अभी तक साझा नहीं किया है', 'मैं 1930 पर कॉल कैसे करूँ?'],
      toolButtonEn: { label: 'Open Incident Playbooks', route: '/tools/incident-response', icon: '📖' },
      toolButtonHi: { label: 'इंसीडेंट प्लेबुक्स खोलें', route: '/tools/incident-response', icon: '📖' }
    },
    UPI_FRAUD: {
      keywords: ['upi', 'gpay', 'phonepe', 'paytm', 'collect request', 'money deducted', 'पैसे कट गए'],
      en: "This is urgent — act in the next 60 minutes:\n\nStep 1: Call 1930 (National Cyber Crime Helpline) NOW.\nThe faster you call, the higher the chance of recovery. Banks can sometimes freeze transactions within hours.\n\nStep 2: Call your bank's 24x7 helpline immediately.\nMention it's a UPI fraud — ask to freeze the beneficiary.\n\nStep 3: File a complaint at cybercrime.gov.in\nClick 'File a Complaint' → 'Financial Fraud'\n\nStep 4: Collect evidence:\n- Transaction ID / UTR number\n- Screenshots of the UPI request\n- Phone number/UPI ID of scammer",
      hi: "यह तत्काल है — अगले 60 मिनट में कार्रवाई करें:\n\nकदम 1: अभी 1930 (राष्ट्रीय साइबर क्राइम हेल्पलाइन) पर कॉल करें।\nआप जितनी जल्दी कॉल करेंगे, रिकवरी की संभावना उतनी ही अधिक होगी।\n\nकदम 2: तुरंत अपने बैंक के 24x7 हेल्पलाइन पर कॉल करें।\nबताएं कि यह एक यूपीआई धोखाधड़ी है - लाभार्थी को फ्रीज करने के लिए कहें।\n\nकदम 3: cybercrime.gov.in पर शिकायत दर्ज करें\n'शिकायत दर्ज करें' → 'वित्तीय धोखाधड़ी' पर क्लिक करें\n\nकदम 4: सबूत इकट्ठा करें:\n- लेनदेन आईडी / यूटीआर नंबर\n- स्क्रीनशॉट",
      quickRepliesEn: ['What is a UTR number?', 'How do I block my account?'],
      quickRepliesHi: ['यूटीआर नंबर क्या है?', 'मैं अपना खाता कैसे ब्लॉक करूं?'],
      toolButtonEn: { label: 'Open UPI Fraud Scanner', route: '/tools/upi-scanner', icon: '🔍' },
      toolButtonHi: { label: 'यूपीआई फ्रॉड स्कैनर खोलें', route: '/tools/upi-scanner', icon: '🔍' }
    },
    ACCOUNT_HACKED: {
      keywords: ['hacked', 'hack', 'account', 'login', 'someone else', 'हैक'],
      en: "Don't panic — quick action can limit the damage. Follow these steps RIGHT NOW:\n\nFor Gmail/Google:\n1. Go to accounts.google.com/signin/recovery\n2. Choose 'Try another way' if you can't sign in\n3. Sign out all other devices\n\nFor Instagram:\n1. Tap 'Forgot password' → 'Need more help?'\n2. Use your phone number or email to recover\n\nFor WhatsApp:\n1. Re-register your number — this kicks out the hacker\n2. Call 1930 immediately",
      hi: "घबराएं नहीं — त्वरित कार्रवाई से नुकसान को सीमित किया जा सकता है। अभी इन चरणों का पालन करें:\n\nजीमेल के लिए:\n1. accounts.google.com/signin/recovery पर जाएं\n2. 'Try another way' चुनें\n3. अन्य सभी डिवाइस से साइन आउट करें\n\nइंस्टाग्राम के लिए:\n1. 'पासवर्ड भूल गए' पर टैप करें → 'Need more help?'\n\nव्हाट्सएप के लिए:\n1. अपना नंबर फिर से रजिस्टर करें — यह हैकर को बाहर निकाल देगा\n2. तुरंत 1930 पर कॉल करें",
      quickRepliesEn: ['Gmail hacked', 'WhatsApp hacked', 'Instagram hacked'],
      quickRepliesHi: ['जीमेल हैक', 'व्हाट्सएप हैक', 'इंस्टाग्राम हैक'],
      toolButtonEn: { label: 'Account Recovery Guide', route: '/tools/incident-response', icon: '🛡️' },
      toolButtonHi: { label: 'खाता रिकवरी गाइड', route: '/tools/incident-response', icon: '🛡️' }
    },
    SCAM_CALL: {
      keywords: ['call', 'phone', 'police', 'trai', 'rbi', 'income tax', 'cbi', 'arrest', 'कॉल', 'पुलिस'],
      en: "This sounds like a common Indian scam pattern. Here are the red flags:\n\nFake police/TRAI/CBI calls:\n'Your number is involved in illegal activity' — FAKE\n'Your Aadhaar is being misused' — FAKE\n'You'll be arrested if you don't pay' — FAKE\n\nReal government agencies NEVER:\n- Call you asking for payment over phone\n- Ask you to transfer money via UPI to 'clear your name'\n- Threaten immediate arrest over the phone\n\nWhat to do: HANG UP immediately. Do not engage. If they call back, block the number. Report it to cybercrime.gov.in.",
      hi: "यह एक आम भारतीय स्कैम लग रहा है।\n\nफर्जी पुलिस/ट्राई/सीबीआई कॉल:\n'आपका नंबर अवैध गतिविधि में शामिल है' — फर्जी\n'आपके आधार का दुरुपयोग हो रहा है' — फर्जी\n'पैसे नहीं दिए तो गिरफ्तार कर लेंगे' — फर्जी\n\nअसली सरकारी एजेंसियां कभी भी फोन पर पैसे नहीं मांगतीं।\n\nक्या करें: तुरंत फोन काट दें। यदि वे वापस कॉल करते हैं, तो नंबर ब्लॉक करें। cybercrime.gov.in पर रिपोर्ट करें।",
      quickRepliesEn: ['They have my Aadhaar number', 'They sent a fake notice'],
      quickRepliesHi: ['उनके पास मेरा आधार नंबर है', 'उन्होंने फर्जी नोटिस भेजा'],
      toolButtonEn: { label: 'Open Report Guide', route: '/report-cybercrime', icon: '🚨' },
      toolButtonHi: { label: 'रिपोर्ट गाइड खोलें', route: '/report-cybercrime', icon: '🚨' }
    },
    REPORT: {
      keywords: ['report', 'complain', 'cybercrime', '1930', 'fir', 'रिपोर्ट', 'शिकायत'],
      en: "To report a cybercrime in India, you have two official methods:\n\n1. For Immediate Financial Loss:\nCall 1930 (National Cyber Crime Reporting Helpline) immediately. They work with banks to freeze the money if reported in time.\n\n2. For All Cybercrimes (Online):\nVisit https://cybercrime.gov.in and click 'File a Complaint'. You will need to register with your mobile number and provide evidence (screenshots, UTR numbers, URLs).\n\nIf the issue involves severe threats or blackmail, you should also visit your local police station to file an FIR.",
      hi: "भारत में साइबर अपराध की रिपोर्ट करने के दो आधिकारिक तरीके हैं:\n\n1. तत्काल वित्तीय नुकसान के लिए:\nतुरंत 1930 पर कॉल करें। यदि समय पर रिपोर्ट की जाती है तो वे पैसे को फ्रीज कर सकते हैं।\n\n2. सभी साइबर अपराधों के लिए (ऑनलाइन):\nhttps://cybercrime.gov.in पर जाएं और 'File a Complaint' पर क्लिक करें। सबूतों के साथ शिकायत दर्ज करें।\n\nयदि गंभीर खतरा या ब्लैकमेल शामिल है, तो स्थानीय पुलिस स्टेशन में एफआईआर भी दर्ज कराएं।",
      quickRepliesEn: ['How to call 1930', 'What documents are needed?'],
      quickRepliesHi: ['1930 पर कॉल कैसे करें', 'किन दस्तावेजों की जरूरत है?']
    },
    AADHAAR: {
      keywords: ['aadhaar', 'aadhar', 'uid', 'आधार'],
      en: "Aadhaar scams often involve biometric cloning or fake verification calls. Here is how to stay safe:\n\n1. NEVER share your Aadhaar OTP.\n2. Do not send Aadhaar photos to unknown WhatsApp numbers.\n3. Lock your biometrics: Download the mAadhaar app or visit uidai.gov.in to lock your fingerprints/iris data when not in use. You can unlock it temporarily when needed.\n4. Use Masked Aadhaar for hotel check-ins or unverified places.\n\nIf someone claims your Aadhaar is involved in a courier or customs scam, HANG UP. It's a scam.",
      hi: "आधार घोटालों में अक्सर बायोमेट्रिक क्लोनिंग या फर्जी कॉल शामिल होते हैं। सुरक्षित कैसे रहें:\n\n1. कभी भी अपना आधार ओटीपी साझा न करें।\n2. अज्ञात व्हाट्सएप नंबरों पर आधार की तस्वीरें न भेजें।\n3. अपने बायोमेट्रिक्स को लॉक करें: mAadhaar ऐप डाउनलोड करें और अपनी उंगलियों के निशान लॉक करें।\n4. होटलों में मास्क्ड आधार का उपयोग करें।\n\nअगर कोई कहता है कि आपका आधार कुरियर स्कैम में फंसा है, तो फोन काट दें।",
      quickRepliesEn: ['How to lock biometrics?', 'What is Masked Aadhaar?'],
      quickRepliesHi: ['बायोमेट्रिक्स को कैसे लॉक करें?', 'मास्क्ड आधार क्या है?'],
      toolButtonEn: { label: 'Aadhaar Safety Guide', route: '/learn/aadhaar-safety', icon: '📜' },
      toolButtonHi: { label: 'आधार सुरक्षा गाइड', route: '/learn/aadhaar-safety', icon: '📜' }
    },
    RANSOMWARE: {
      keywords: ['ransomware', 'files locked', 'bitcoin', 'pay ransom', 'encrypted'],
      en: "It sounds like you might be a victim of Ransomware. This is a severe threat. Here is what you MUST do:\n\n1. Disconnect from the internet/WiFi immediately to stop it from spreading.\n2. DO NOT PAY THE RANSOM. Paying funds criminals and there is no guarantee you'll get files back.\n3. Report to CERT-In (Indian Computer Emergency Response Team).\n4. Check nomoreransom.org using a safe device to see if a free decryption key exists for your specific ransomware variant.",
      hi: "ऐसा लगता है कि आप रैंसमवेयर का शिकार हो सकते हैं। यहाँ आपको क्या करना चाहिए:\n\n1. इसे फैलने से रोकने के लिए तुरंत इंटरनेट/वाईफाई से डिस्कनेक्ट करें।\n2. फिरौती का भुगतान न करें। भुगतान करने से कोई गारंटी नहीं है कि आपको फाइलें वापस मिलेंगी।\n3. CERT-In को रिपोर्ट करें।\n4. यह देखने के लिए nomoreransom.org की जाँच करें कि क्या मुफ्त डिक्रिप्शन टूल उपलब्ध है।",
      quickRepliesEn: ['What is nomoreransom?', 'How to report to CERT-In'],
      quickRepliesHi: ['nomoreransom क्या है?', 'CERT-In को रिपोर्ट कैसे करें']
    },
    SAFE_CHECK: {
      keywords: ['safe', 'scam', 'real', 'genuine', 'सही है', 'स्कैम', 'fake'],
      en: "I can help you check if something is safe or a scam. What would you like to verify?\n\n- A suspicious link or website?\n- A WhatsApp forwarded message?\n- A job offer?\n- An investment opportunity?\n\nPlease provide more details or use one of CySafeClick's dedicated scanners.",
      hi: "मैं यह जांचने में आपकी मदद कर सकता हूं कि कोई चीज़ सुरक्षित है या स्कैम। आप क्या जाँचना चाहेंगे?\n\n- कोई संदिग्ध लिंक?\n- व्हाट्सएप का कोई फॉरवर्ड मैसेज?\n- नौकरी का प्रस्ताव?\n- निवेश का अवसर?\n\nकृपया अधिक जानकारी दें।",
      quickRepliesEn: ['Check a link', 'Check a job offer', 'Check WhatsApp forward'],
      quickRepliesHi: ['एक लिंक की जाँच करें', 'नौकरी के प्रस्ताव की जाँच करें', 'व्हाट्सएप फॉरवर्ड की जाँच करें'],
      toolButtonEn: { label: 'Fact Checker', route: '/tools/fact-check', icon: '✅' },
      toolButtonHi: { label: 'फैक्ट चेकर', route: '/tools/fact-check', icon: '✅' }
    },
    PHISHING: {
      keywords: ['link', 'click', 'website', 'login', 'password', 'फिशिंग', 'url'],
      en: "Phishing is when scammers send fake links that look like real websites (banks, Amazon, Netflix) to steal your passwords or money.\n\n⚠️ DO NOT CLICK suspicious links from unknown SMS or emails.\n⚠️ Even if it looks real, manually type the website address in your browser instead of clicking the link.\n\nIf you've already clicked and entered your password:\n1. Change your password immediately.\n2. Contact your bank if financial details were entered.",
      hi: "फिशिंग वह है जब स्कैमर्स आपके पासवर्ड या पैसे चुराने के लिए असली वेबसाइटों (बैंक, अमेज़ॅन) की तरह दिखने वाले नकली लिंक भेजते हैं।\n\n⚠️ अज्ञात एसएमएस से संदिग्ध लिंक पर क्लिक न करें।\n⚠️ ब्राउज़र में वेबसाइट का पता खुद टाइप करें।\n\nयदि आपने पहले ही क्लिक कर दिया है:\n1. अपना पासवर्ड तुरंत बदलें।\n2. यदि वित्तीय विवरण दर्ज किए गए थे तो बैंक से संपर्क करें।",
      quickRepliesEn: ['Check a link', 'I clicked a fake link'],
      quickRepliesHi: ['एक लिंक की जाँच करें', 'मैंने एक फर्जी लिंक पर क्लिक किया'],
      toolButtonEn: { label: 'Phishing Detector', route: '/phishing-detector', icon: '🎣' },
      toolButtonHi: { label: 'फिशिंग डिटेक्टर', route: '/phishing-detector', icon: '🎣' }
    },
    SEXTORTION: {
      keywords: ['blackmail', 'video call', 'photo', 'intimate', 'sextortion', 'nude', 'leak'],
      en: "Sextortion is a serious crime where scammers threaten to leak private photos/videos. Please stay calm. Do this NOW:\n\n1. DO NOT PAY. Paying guarantees they will ask for more. It never stops the extortion.\n2. Screenshot all chats, threats, and payment details.\n3. Temporarily deactivate your social media accounts.\n4. Call 1930 or file a report on cybercrime.gov.in.\n\nYou can also use stopncii.org to prevent the images from being shared on major platforms.",
      hi: "सेक्सटॉर्शन एक गंभीर अपराध है जहां स्कैमर निजी तस्वीरें/वीडियो लीक करने की धमकी देते हैं। कृपया शांत रहें:\n\n1. पैसे न दें। पैसे देने से वे और पैसे मांगेंगे।\n2. सभी चैट और धमकियों का स्क्रीनशॉट लें।\n3. अपने सोशल मीडिया खातों को अस्थायी रूप से निष्क्रिय करें।\n4. 1930 पर कॉल करें या cybercrime.gov.in पर रिपोर्ट दर्ज करें।",
      quickRepliesEn: ['How to use stopncii.org', 'Will police help silently?'],
      quickRepliesHi: ['stopncii.org का उपयोग कैसे करें', 'क्या पुलिस चुपचाप मदद करेगी?'],
      toolButtonEn: { label: 'Incident Playbooks', route: '/tools/incident-response', icon: '🚨' },
      toolButtonHi: { label: 'इंसीडेंट प्लेबुक्स', route: '/tools/incident-response', icon: '🚨' }
    },
    JOB_SCAM: {
      keywords: ['job', 'work from home', 'offer', 'part time', 'data entry', 'salary', 'नौकरी'],
      en: "Job scams are very common. Watch out for these RED FLAGS:\n\n- They ask for a 'security deposit', 'registration fee', or 'equipment fee' before you start.\n- The salary is unrealistically high for a simple task (like data entry or liking YouTube videos).\n- Communication is entirely over WhatsApp or Telegram.\n- No formal interview process.\n\nLegitimate companies pay YOU to work. You should never pay to get a job.",
      hi: "नौकरी के घोटाले बहुत आम हैं। इन लाल झंडों से सावधान रहें:\n\n- वे 'सुरक्षा जमा', 'पंजीकरण शुल्क' मांगते हैं।\n- सरल कार्य (जैसे यूट्यूब वीडियो लाइक करना) के लिए वेतन अवास्तविक रूप से अधिक है।\n- बातचीत केवल व्हाट्सएप या टेलीग्राम पर होती है।\n\nअसली कंपनियाँ काम करने के लिए आपको भुगतान करती हैं। आपको नौकरी पाने के लिए कभी भुगतान नहीं करना चाहिए।",
      quickRepliesEn: ['Check a job offer', 'I paid a registration fee'],
      quickRepliesHi: ['नौकरी के प्रस्ताव की जाँच करें', 'मैंने पंजीकरण शुल्क का भुगतान किया'],
      toolButtonEn: { label: 'Job Scam Detector', route: '/tools/job-scam-detector', icon: '💼' },
      toolButtonHi: { label: 'जॉब स्कैम डिटेक्टर', route: '/tools/job-scam-detector', icon: '💼' }
    },
    MATRIMONIAL_SCAM: {
      keywords: ['shaadi', 'matrimony', 'romance', 'nri', 'gift', 'customs', 'शादी'],
      en: "Matrimonial and romance scams often involve someone claiming to be an NRI, doctor, or military officer. Red flags:\n\n- They quickly move the chat from the matrimony app to WhatsApp.\n- They profess love very quickly (love-bombing).\n- They suddenly have an 'emergency' and need money.\n- The 'Customs Gift' scam: They send you an expensive gift, but someone claiming to be from Customs calls you demanding a fee to release it. THIS IS ALWAYS A SCAM.",
      hi: "मैट्रिमोनियल स्कैम में अक्सर कोई एनआरआई या सैन्य अधिकारी होने का दावा करता है। सावधान रहें:\n\n- वे जल्दी से चैट को व्हाट्सएप पर ले जाते हैं।\n- वे 'कस्टम गिफ्ट' स्कैम करते हैं: वे आपको एक महंगा उपहार भेजते हैं, और कोई कस्टम अधिकारी बनकर आपको इसे छोड़ने के लिए शुल्क की मांग करता है। यह हमेशा एक घोटाला है।",
      quickRepliesEn: ['Customs officer called me', 'Check a profile'],
      quickRepliesHi: ['कस्टम अधिकारी ने मुझे फोन किया', 'एक प्रोफाइल की जाँच करें'],
      toolButtonEn: { label: 'Matrimonial Safety', route: '/tools/matrimonial-safety', icon: '❤️' },
      toolButtonHi: { label: 'मैट्रिमोनियल सुरक्षा', route: '/tools/matrimonial-safety', icon: '❤️' }
    },
    INVESTMENT_SCAM: {
      keywords: ['crypto', 'stock', 'invest', 'telegram group', 'trading', 'returns', 'profit', 'निवेश'],
      en: "Investment and crypto scams cause massive losses. Warning signs:\n\n- 'Guaranteed' high returns (e.g., 5% daily). No real investment guarantees returns.\n- You are added to a Telegram/WhatsApp group with 'experts' sharing fake profit screenshots.\n- 'Task-based' scams: They pay you small amounts first to gain trust, then ask you to invest big amounts for 'premium tasks', and then freeze your money.\n\nVerify all brokers with SEBI. If it sounds too good to be true, it is a scam.",
      hi: "निवेश और क्रिप्टो स्कैम भारी नुकसान का कारण बनते हैं। चेतावनी के संकेत:\n\n- 'गारंटीकृत' उच्च रिटर्न। कोई भी वास्तविक निवेश रिटर्न की गारंटी नहीं देता।\n- आपको 'विशेषज्ञों' के टेलीग्राम ग्रुप में जोड़ा जाता है।\n- 'टास्क-आधारित' स्कैम: वे पहले छोटे भुगतान करते हैं, फिर 'प्रीमियम टास्क' के लिए बड़ा निवेश मांगते हैं।\n\nSEBI के साथ सभी दलालों को सत्यापित करें।",
      quickRepliesEn: ['Telegram task scam', 'How to check SEBI registry'],
      quickRepliesHi: ['टेलीग्राम टास्क स्कैम', 'SEBI रजिस्ट्री की जाँच कैसे करें'],
      toolButtonEn: { label: 'Investment Analyzer', route: '/tools/investment-scam', icon: '📈' },
      toolButtonHi: { label: 'निवेश विश्लेषक', route: '/tools/investment-scam', icon: '📈' }
    },
    ECOMMERCE_FRAUD: {
      keywords: ['amazon', 'flipkart', 'meesho', 'delivery', 'order', 'parcel', 'डिलीवरी'],
      en: "E-commerce and delivery scams can happen in a few ways:\n\n1. Fake Customer Care: You search for a helpline number on Google, get a fake number, and they ask you to download an app (like AnyDesk) or pay a small fee.\n2. Cash on Delivery Scam: A parcel arrives that you didn't order. You pay for it, but inside is cheap junk.\n3. Fake Websites: Sites offering 80%+ discounts on iPhones or clothes. They take your money and disappear.\n\nAlways use the official app to track orders or contact support.",
      hi: "ई-कॉमर्स और डिलीवरी स्कैम कई तरह से हो सकते हैं:\n\n1. फेक कस्टमर केयर: आप गूगल पर नंबर खोजते हैं, और वे आपको AnyDesk ऐप डाउनलोड करने को कहते हैं।\n2. कैश ऑन डिलीवरी स्कैम: एक पार्सल आता है जिसे आपने ऑर्डर नहीं किया था।\n3. फेक वेबसाइट: भारी छूट देने वाली वेबसाइटें पैसे लेकर गायब हो जाती हैं।\n\nहमेशा आधिकारिक ऐप का उपयोग करें।",
      quickRepliesEn: ['Check a website', 'Fake delivery boy called'],
      quickRepliesHi: ['एक वेबसाइट की जाँच करें', 'फर्जी डिलीवरी बॉय का फोन आया'],
      toolButtonEn: { label: 'E-commerce Fraud Shield', route: '/tools/ecommerce-fraud', icon: '🛒' },
      toolButtonHi: { label: 'ई-कॉमर्स फ्रॉड शील्ड', route: '/tools/ecommerce-fraud', icon: '🛒' }
    },
    WIFI_SAFETY: {
      keywords: ['wifi', 'public network', 'airport wifi', 'free wifi', 'वाईफ़ाई'],
      en: "Public Wi-Fi (at airports, cafes, or stations) is often unsecure. Hackers can intercept your data.\n\n- Do not perform banking transactions or enter passwords on free public Wi-Fi.\n- Use a VPN (Virtual Private Network) if you must use public Wi-Fi.\n- Turn off 'Auto-connect to Wi-Fi' on your phone to prevent it from joining malicious networks silently.",
      hi: "सार्वजनिक वाई-फ़ाई अक्सर असुरक्षित होता है। हैकर्स आपका डेटा चुरा सकते हैं।\n\n- मुफ्त वाई-फ़ाई पर बैंकिंग लेनदेन या पासवर्ड दर्ज न करें।\n- यदि आपको सार्वजनिक वाई-फ़ाई का उपयोग करना ही है तो वीपीएन का उपयोग करें।\n- अपने फोन पर 'ऑटो-कनेक्ट' बंद करें।",
      quickRepliesEn: ['Is mobile data safe?', 'What is a VPN?'],
      quickRepliesHi: ['क्या मोबाइल डेटा सुरक्षित है?', 'वीपीएन क्या है?'],
      toolButtonEn: { label: 'Wi-Fi Safety Tool', route: '/tools/wifi-safety', icon: '📶' },
      toolButtonHi: { label: 'वाईफाई सुरक्षा उपकरण', route: '/tools/wifi-safety', icon: '📶' }
    },
    DEEPFAKE: {
      keywords: ['deepfake', 'voice clone', 'ai video', 'ai voice', 'fake video', 'डीपफेक'],
      en: "AI Deepfakes and Voice Clones are being used for fraud.\n\n- Voice Clones: Scammers take 3 seconds of audio from social media and clone a family member's voice to call you asking for urgent money (e.g., 'I am in hospital').\n- Video Deepfakes: Used for fake celebrity endorsements or video-call blackmail.\n\nDefense: Set up a 'Safe Word' with your family. If someone calls in an emergency, ask for the safe word. If they don't know it, hang up.",
      hi: "एआई डीपफेक और वॉयस क्लोन का उपयोग धोखाधड़ी के लिए किया जा रहा है।\n\n- वॉयस क्लोन: स्कैमर परिवार के सदस्य की आवाज की नकल करते हैं और तत्काल पैसे मांगते हैं।\n- वीडियो डीपफेक: नकली सेलिब्रिटी विज्ञापनों या ब्लैकमेल के लिए उपयोग किया जाता है।\n\nबचाव: अपने परिवार के साथ एक 'सुरक्षित शब्द' (Safe Word) तय करें।",
      quickRepliesEn: ['How to spot a deepfake?', 'Set up safe word'],
      quickRepliesHi: ['डीपफेक को कैसे पहचानें?', 'सेफ वर्ड सेट करें'],
      toolButtonEn: { label: 'Deepfake Awareness', route: '/learn/deepfake-awareness', icon: '🤖' },
      toolButtonHi: { label: 'डीपफेक जागरूकता', route: '/learn/deepfake-awareness', icon: '🤖' }
    },
    LOST_PHONE: {
      keywords: ['stolen phone', 'lost phone', 'imei', 'block sim', 'फोन चोरी'],
      en: "If your phone is stolen, your bank accounts are at high risk. Act fast:\n\n1. Call your telecom provider (Jio, Airtel, Vi) immediately and BLOCK THE SIM. This stops OTPs.\n2. Erase device remotely via android.com/find or icloud.com/find.\n3. Call your bank to block UPI and mobile banking.\n4. File a police complaint, then block the phone's IMEI at ceir.gov.in so it cannot be used anywhere in India.",
      hi: "यदि आपका फोन चोरी हो गया है, तो तुरंत कार्य करें:\n\n1. अपने टेलीकॉम प्रदाता को कॉल करें और सिम ब्लॉक करें। यह ओटीपी रोकता है।\n2. android.com/find के माध्यम से डिवाइस का डेटा मिटाएं।\n3. यूपीआई ब्लॉक करने के लिए बैंक को कॉल करें।\n4. पुलिस शिकायत दर्ज करें, फिर ceir.gov.in पर फोन का IMEI ब्लॉक करें।",
      quickRepliesEn: ['How to find IMEI number', 'What is CEIR?'],
      quickRepliesHi: ['IMEI नंबर कैसे खोजें', 'CEIR क्या है?'],
      toolButtonEn: { label: 'Incident Playbooks', route: '/tools/incident-response', icon: '📱' },
      toolButtonHi: { label: 'इंसीडेंट प्लेबुक्स', route: '/tools/incident-response', icon: '📱' }
    },
    LOAN_APP_SCAM: {
      keywords: ['loan app', 'contact list', 'recovery agent', 'harassment', 'loan scam', 'लोन ऐप'],
      en: "Instant Loan App scams are very dangerous. They offer quick loans but steal your contact list and photos. When you delay payment, they harass your family and morph your photos.\n\n1. Do not pay them—they will keep extorting you.\n2. Uninstall the app immediately.\n3. Inform your contacts that your phone was hacked and to ignore abusive messages.\n4. Report the app to the Google Play Store and file a complaint on cybercrime.gov.in.",
      hi: "इंस्टेंट लोन ऐप के घोटाले बहुत खतरनाक हैं। वे त्वरित ऋण देते हैं लेकिन आपकी संपर्क सूची और तस्वीरें चुरा लेते हैं।\n\n1. उन्हें भुगतान न करें—वे आपको ब्लैकमेल करते रहेंगे।\n2. ऐप को तुरंत अनइंस्टॉल करें।\n3. अपने संपर्कों को सूचित करें कि आपका फोन हैक हो गया है।\n4. cybercrime.gov.in पर शिकायत दर्ज करें।",
      quickRepliesEn: ['They have my photos', 'How to stop harassment'],
      quickRepliesHi: ['उनके पास मेरी तस्वीरें हैं', 'उत्पीड़न कैसे रोकें'],
      toolButtonEn: { label: 'App Permissions Check', route: '/tools/app-permissions', icon: '🔐' },
      toolButtonHi: { label: 'ऐप परमिशन चेक', route: '/tools/app-permissions', icon: '🔐' }
    },
    CREDIT_CARD_FRAUD: {
      keywords: ['credit card', 'debit card', 'cvv', 'atm pin', 'unauthorized transaction', 'क्रेडिट कार्ड'],
      en: "If you see an unauthorized transaction on your card:\n\n1. Block the card immediately using your mobile banking app or by calling the bank's toll-free number.\n2. Note the transaction amount, time, and merchant name.\n3. File a chargeback dispute with your bank within 3 days. By RBI rules, if you report promptly, your liability is zero.\n4. Register a complaint on cybercrime.gov.in.",
      hi: "यदि आप अपने कार्ड पर कोई अनधिकृत लेनदेन देखते हैं:\n\n1. अपने मोबाइल बैंकिंग ऐप का उपयोग करके या बैंक को कॉल करके तुरंत कार्ड ब्लॉक करें।\n2. लेनदेन की राशि और समय नोट करें।\n3. 3 दिनों के भीतर अपने बैंक में विवाद दर्ज करें। आरबीआई के नियमों के अनुसार, यदि आप तुरंत रिपोर्ट करते हैं, तो आपकी देयता शून्य है।\n4. cybercrime.gov.in पर शिकायत दर्ज करें।",
      quickRepliesEn: ['How to file chargeback', 'What is zero liability?'],
      quickRepliesHi: ['चार्जबैक कैसे फाइल करें', 'जीरो लायबिलिटी क्या है?'],
      toolButtonEn: { label: 'Incident Playbooks', route: '/tools/incident-response', icon: '💳' },
      toolButtonHi: { label: 'इंसीडेंट प्लेबुक्स', route: '/tools/incident-response', icon: '💳' }
    }
  };

  private fallbackResponse: IntentResponse = {
    keywords: [],
    en: "I am not entirely sure about that. Could you please provide more details? Are you asking about a suspicious message, a hacked account, or reporting a fraud? You can also explore CySafeClick's tools for specific checks.",
    hi: "मुझे इसके बारे में पूरी तरह से यकीन नहीं है। क्या आप कृपया अधिक जानकारी दे सकते हैं? क्या आप किसी संदिग्ध संदेश, हैक किए गए खाते, या धोखाधड़ी की रिपोर्ट करने के बारे में पूछ रहे हैं?",
    quickRepliesEn: ['Help me report fraud', 'Check a suspicious link', 'Open tools menu'],
    quickRepliesHi: ['धोखाधड़ी की रिपोर्ट करने में मेरी मदद करें', 'एक संदिग्ध लिंक की जाँच करें', 'टूल मेनू खोलें']
  };

  constructor() {}

  processMessage(userText: string, currentLang: 'en' | 'hi' = 'en'): Observable<ChatMessage> {
    return new Observable<ChatMessage>(observer => {
      const lowerText = userText.toLowerCase();
      
      let matchedIntent = this.fallbackResponse;
      
      for (const key of Object.keys(this.INTENTS)) {
        const intent = this.INTENTS[key];
        if (intent.keywords.some(kw => lowerText.includes(kw))) {
          matchedIntent = intent;
          break;
        }
      }

      const responseContent = currentLang === 'hi' ? matchedIntent.hi : matchedIntent.en;

      const reply: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        quickReplies: currentLang === 'hi' ? matchedIntent.quickRepliesHi : matchedIntent.quickRepliesEn,
        actionButtons: currentLang === 'hi' 
          ? (matchedIntent.toolButtonHi ? [matchedIntent.toolButtonHi] : undefined)
          : (matchedIntent.toolButtonEn ? [matchedIntent.toolButtonEn] : undefined)
      };

      // Add a realistic 800ms delay
      setTimeout(() => {
        observer.next(reply);
        observer.complete();
      }, 800);
    });
  }

  getHistory(): ChatMessage[] {
    return [];
  }

  saveHistory(messages: ChatMessage[]) {
    return;
  }

  clearHistory() {
    return;
  }
}
