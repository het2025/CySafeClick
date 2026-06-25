import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatrimonialSafetyService, MatrimonialAnalysis } from './matrimonial-safety.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-matrimonial-safety',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matrimonial-safety.component.html',
  styleUrls: ['./matrimonial-safety.component.css']
})
export class MatrimonialSafetyComponent {
  activeTab: 'profile' | 'chat' | 'checklist' = 'profile';

  profileText = '';
  chatText = '';
  
  profileResult: MatrimonialAnalysis | null = null;
  chatResult: MatrimonialAnalysis | null = null;

  get checklist() {
    const isHi = this.t.currentLang() === 'hi';
    return [
      { text: isHi ? "क्या आप उनसे व्यक्तिगत रूप से मिले हैं?" : "Have you met them in person?", value: null as 'yes'|'no'|'unsure'|null },
      { text: isHi ? "क्या आपने उन्हें वीडियो कॉल किया है (और उनका चेहरा फोटो से मेल खाता है)?" : "Have you video called them (and their face matched the photos)?", value: null },
      { text: isHi ? "क्या उन्होंने किसी भी कारण से (चिकित्सा, व्यवसाय, यात्रा) पैसे मांगे हैं?" : "Have they asked for money for ANY reason (medical, business, travel)?", value: null },
      { text: isHi ? "क्या उन्होंने 'कैमरा खराब है' या 'खराब इंटरनेट' कहकर वीडियो कॉल करने से मना कर दिया?" : "Did they refuse a video call saying 'camera is broken' or 'poor internet'?", value: null },
      { text: isHi ? "क्या उन्होंने आपको बताया कि उन्होंने एक महंगा उपहार भेजा है जो कस्टम में फंस गया है?" : "Have they told you they sent an expensive gift that is stuck at customs?", value: null },
      { text: isHi ? "क्या आपने लिंक्डइन पर उनके कार्यस्थल या नौकरी को स्वतंत्र रूप से सत्यापित किया है?" : "Have you independently verified their workplace or job on LinkedIn?", value: null },
      { text: isHi ? "क्या उन्होंने बातचीत के पहले कुछ दिनों के भीतर ही गहरा प्यार जताया?" : "Did they profess intense love within the first few days of chatting?", value: null },
      { text: isHi ? "क्या वे लगातार क्रिप्टो, स्टॉक या निवेश के बारे में बात कर रहे हैं?" : "Are they constantly talking about crypto, stocks, or investments?", value: null },
      { text: isHi ? "क्या उनकी कहानी समय के साथ बदलती है या उसमें अजीब असंगतियां हैं?" : "Does their story change or have weird inconsistencies over time?", value: null },
      { text: isHi ? "क्या उन्होंने आपसे निजी फोटो मांगी हैं?" : "Have they asked you for intimate/private photos?", value: null },
    ];
  }

  // To track values across getter refreshes
  checklistValues: any[] = new Array(10).fill(null);

  constructor(private matService: MatrimonialSafetyService, public t: TranslationService) {}

  analyzeProfile() {
    if (!this.profileText.trim()) return;
    this.profileResult = this.matService.analyzeProfile(this.profileText);
  }

  analyzeChat() {
    if (!this.chatText.trim()) return;
    this.chatResult = this.matService.analyzeChat(this.chatText);
  }

  getChecklistScore() {
    let risk = 0;
    const list = this.checklist;
    for (let i = 0; i < list.length; i++) {
      const val = this.checklistValues[i];
      const text = list[i].text;
      if (text.includes("asked for money") || text.includes("पैसे मांगे")) { if (val === 'yes') risk += 50; }
      if (text.includes("customs") || text.includes("कस्टम")) { if (val === 'yes') risk += 50; }
      if (text.includes("intimate photos") || text.includes("निजी फोटो")) { if (val === 'yes') risk += 40; }
    }
    return Math.min(100, risk);
  }
}
