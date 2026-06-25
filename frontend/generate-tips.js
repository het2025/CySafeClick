const fs = require('fs');
const categories = ['Password Security', 'UPI/Payment Safety', 'Social Media Privacy', 'Email Security', 'Mobile Device Security', 'India-Specific Scams', 'Legal Rights', 'Data Privacy', 'Network Security', 'Physical Security', 'Children Online Safety', 'Senior Citizen Safety'];
const tagsPool = ['phishing', 'otp', 'passwords', 'privacy', 'social-media', 'banking', 'upi', 'aadhaar', 'scam', 'malware', 'wifi', 'kids', 'seniors', 'legal'];

const tips = [];
let idCounter = 1;

for (let i = 0; i < 60; i++) {
  const cat = categories[i % categories.length];
  tips.push({
    id: idCounter++,
    category: cat,
    title: `Daily Tip on ${cat} #${Math.floor(i/categories.length)+1}`,
    body: `Always ensure you follow best practices regarding ${cat.toLowerCase()}. This helps in protecting your digital identity from malicious actors. Stay vigilant and verify sources.`,
    hindiTitle: `${cat} पर दैनिक टिप #${Math.floor(i/categories.length)+1}`,
    hindiBody: `हमेशा ${cat} से संबंधित सर्वोत्तम प्रथाओं का पालन करें। यह आपकी डिजिटल पहचान को दुर्भावनापूर्ण तत्वों से बचाने में मदद करता है। सतर्क रहें और स्रोतों की पुष्टि करें।`,
    actionItem: `Review your settings for ${cat} today.`,
    difficulty: i % 3 === 0 ? 'easy' : (i % 3 === 1 ? 'medium' : 'advanced'),
    tags: [tagsPool[i % tagsPool.length], tagsPool[(i+1) % tagsPool.length]]
  });
}

// Add some specific high-quality ones to override the generic ones above
tips[0] = {
  id: 1, category: 'Password Security', title: 'Use Passphrases, Not Passwords', body: 'Instead of complex passwords like P@ssw0rd1, use a passphrase like CorrectHorseBatteryStaple. They are longer, easier to remember, and harder to crack.', hindiTitle: 'पासवर्ड नहीं, पासफ़्रेज़ का उपयोग करें', hindiBody: 'जटिल पासवर्ड के बजाय एक पासफ़्रेज़ का उपयोग करें। वे लंबे होते हैं, याद रखने में आसान होते हैं, और क्रैक करने में कठिन होते हैं।', actionItem: 'Change your main email password to a 4-word passphrase.', difficulty: 'easy', tags: ['passwords']
};
tips[1] = {
  id: 2, category: 'UPI/Payment Safety', title: 'UPI Collect Requests Send Money', body: 'Entering your UPI PIN always deducts money from your account. You NEVER need to enter your PIN to receive money.', hindiTitle: 'UPI कलेक्ट रिक्वेस्ट पैसे भेजते हैं', hindiBody: 'अपना UPI पिन दर्ज करने से हमेशा आपके खाते से पैसे कटते हैं। पैसे प्राप्त करने के लिए आपको कभी भी अपना पिन दर्ज करने की आवश्यकता नहीं है।', actionItem: 'Decline any pending UPI collect requests you do not recognize.', difficulty: 'easy', tags: ['upi', 'banking']
};
tips[2] = {
  id: 3, category: 'Social Media Privacy', title: 'Lock Your WhatsApp', body: 'Enable Two-Step Verification on WhatsApp to prevent scammers from hijacking your account using the call-forwarding trick.', hindiTitle: 'अपना WhatsApp लॉक करें', hindiBody: 'स्कैमर्स को कॉल-फ़ॉरवर्डिंग ट्रिक का उपयोग करके आपके खाते को हाईजैक करने से रोकने के लिए WhatsApp पर टू-स्टेप वेरिफिकेशन सक्षम करें।', actionItem: 'Go to WhatsApp Settings > Account > Two-step verification and enable it.', difficulty: 'medium', tags: ['privacy', 'social-media']
};

if (!fs.existsSync('src/assets/data')) {
  fs.mkdirSync('src/assets/data', { recursive: true });
}
fs.writeFileSync('src/assets/data/tips.json', JSON.stringify(tips, null, 2));
console.log('Successfully generated 60 tips in src/assets/data/tips.json');
