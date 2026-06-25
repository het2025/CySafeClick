import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-business-security',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-security.component.html',
  styleUrls: ['./business-security.component.css']
})
export class BusinessSecurityComponent {
  activeTab: 'guide' | 'score' | 'template' = 'guide';

  constructor(public t: TranslationService) {}

  // Business Security Score Quiz
  get quizQuestions() {
    const isHi = this.t.currentLang() === 'hi';
    return [
      { text: isHi ? "क्या आपने अपने GST और आयकर पोर्टल्स पर 2-स्टेप वेरिफिकेशन (2FA) सक्षम किया है?" : "Do you have 2-Factor Authentication (2FA) enabled on your GST and Income Tax portals?", value: 0 },
      { text: isHi ? "क्या आप पैसे ट्रांसफर करने से पहले फोन कॉल के जरिए वेंडर के बैंक अकाउंट विवरण में बदलाव की पुष्टि करते हैं?" : "Do you verify changes to vendor bank account details via a phone call before transferring money?", value: 0 },
      { text: isHi ? "क्या आप नियमित रूप से अपने व्यावसायिक डेटा (इनवॉइस, कस्टमर लिस्ट) का बैकअप लेते हैं?" : "Do you regularly back up your business data (invoices, customer lists) offline or to the cloud?", value: 0 },
      { text: isHi ? "क्या आपके कर्मचारी सभी व्यावसायिक खातों के लिए अलग-अलग, अद्वितीय पासवर्ड का उपयोग करते हैं?" : "Do your employees use separate, unique passwords for all business accounts?", value: 0 },
      { text: isHi ? "क्या आप रोजाना अपनी दुकान के भुगतान QR कोड स्टिकर की छेड़छाड़ के लिए जाँच करते हैं?" : "Do you physically check your shop's payment QR code stickers daily for tampering?", value: 0 },
      { text: isHi ? "क्या आपके पास स्पष्ट नीति है कि आप कभी भी कर्मचारियों से ईमेल के जरिए गिफ्ट कार्ड खरीदने के लिए नहीं कहेंगे?" : "Do you have a clear policy that you will never ask employees to buy gift cards via email?", value: 0 },
      { text: isHi ? "क्या सभी कंपनी कंप्यूटरों पर सक्रिय, अपडेटेड एंटीवायरस सॉफ़्टवेयर चल रहा है?" : "Are all company computers running active, updated antivirus software?", value: 0 },
      { text: isHi ? "क्या आप कंपनी के कंप्यूटरों पर प्रशासनिक पहुंच को प्रतिबंधित करते हैं?" : "Do you restrict administrative access on company computers so employees cannot install unapproved software?", value: 0 },
      { text: isHi ? "क्या आप जानते हैं कि CERT-In को रैंसमवेयर हमले की रिपोर्ट कैसे करनी है?" : "Do you know how to report a ransomware attack to CERT-In?", value: 0 },
      { text: isHi ? "क्या आप नए कर्मचारियों को फिशिंग ईमेल पहचानने के बारे में प्रशिक्षित करते हैं?" : "Do you train new employees on how to spot phishing emails?", value: 0 }
    ];
  }

  // To track values across getter refreshes, we store them in a component property
  questionValues: number[] = new Array(10).fill(0);
  quizScore: number | null = null;

  calculateScore() {
    this.quizScore = this.questionValues.reduce((a, b) => a + Number(b), 0);
  }

  downloadPolicy() {
    const isHi = this.t.currentLang() === 'hi';
    const policyText = isHi ? `
वज्र टेम्पलेट: लघु व्यवसाय सुरक्षा नीति

1. पहुंच और पासवर्ड
- प्रत्येक कर्मचारी का अपना अलग लॉगिन होना चाहिए। पासवर्ड साझा न करें।
- पासवर्ड कम से कम 12 वर्णों का होना चाहिए।
- ईमेल, वित्तीय और GST पोर्टल्स के लिए 2-स्टेप वेरिफिकेशन (2FA) अनिवार्य है।

2. वित्तीय लेनदेन
- वेंडर के बैंक खाते के विवरण में बदलाव का अनुरोध करने वाले किसी भी ईमेल को भुगतान करने से पहले एक ज्ञात नंबर पर फोन कॉल द्वारा सत्यापित किया जाना चाहिए।
- मालिक/निदेशक कभी भी किसी कर्मचारी को ईमेल के जरिए उपहार कार्ड खरीदने या मानक प्रक्रिया के बाहर पैसे भेजने के लिए नहीं कहेंगे।

3. डिवाइस उपयोग
- व्यावसायिक डेटा को व्यक्तिगत, बिना एन्क्रिप्ट किए गए USB ड्राइव पर स्टोर न करें।
- अज्ञात प्रेषकों के लिंक पर क्लिक न करें या अटैचमेंट डाउनलोड न करें।

4. घटना की रिपोर्टिंग
- यदि कोई कर्मचारी संदिग्ध लिंक पर क्लिक करता है, तो उसे बिना डरे तुरंत रिपोर्ट करनी चाहिए।
- रैंसमवेयर हमले के मामले में, फिरौती का भुगतान न करें। कंप्यूटर को नेटवर्क से डिस्कनेक्ट करें और रिपोर्ट करें।

____________________________
हस्ताक्षर और दिनांक
` : `
Cycysafeclick TEMPLATE: SMALL BUSINESS SECURITY POLICY

1. ACCESS & PASSWORDS
- Every employee must have a unique login. No sharing passwords.
- Passwords must be at least 12 characters long.
- 2-Factor Authentication (2FA) is mandatory for email, financial, and GST portals.

2. FINANCIAL TRANSACTIONS
- Any email requesting a change in a vendor's bank account details MUST be verified by a phone call to a known number before processing payment.
- The CEO/Director will NEVER email an employee asking them to urgently purchase gift cards or execute wire transfers outside of standard procedure.

3. DEVICE USAGE
- Business data must not be stored on personal, unencrypted USB drives.
- Do not click links or download attachments from unknown senders.

4. INCIDENT REPORTING
- If an employee clicks a suspicious link or suspects a virus, they must report it immediately without fear of punishment.
- In case of a ransomware attack, DO NOT PAY the ransom. Disconnect the computer from the network and report to the IT lead/owner.

____________________________
Owner Signature & Date
`;

    const blob = new Blob([policyText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = isHi ? 'business-security-policy-hindi.txt' : 'business-security-policy.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
