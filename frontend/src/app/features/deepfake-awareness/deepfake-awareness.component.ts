import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-deepfake-awareness',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deepfake-awareness.component.html',
  styleUrls: ['./deepfake-awareness.component.css']
})
export class DeepfakeAwarenessComponent implements OnInit {
  // Safe Word State
  familySafeWord: string = '';
  isSafeWordSaved: boolean = false;

  // Quiz State
  currentQuizQuestion = 0;
  quizScore = 0;
  quizFinished = false;
  showExplanation = false;
  selectedOption: number | null = null;

  constructor(public t: TranslationService) {
    // Reset quiz if language changes to avoid mixed language state
    effect(() => {
      this.t.currentLang();
      this.resetQuiz();
    });
  }

  // Quiz questions defined as keys for translation
  get quizQuestions() {
    return [
      {
        question: this.t.currentLang() === 'hi' ? "आपके चाचा किसी अज्ञात नंबर से कॉल करते हैं, उनकी आवाज़ बिल्कुल वैसी ही लगती है, कहते हैं कि उनका एक्सीडेंट हो गया है और उन्हें तुरंत ₹20,000 की ज़रूरत है। आप क्या करते हैं?" : "Your uncle calls from an unknown number, sounds exactly like him, says he's been in an accident and needs ₹20,000 immediately. What do you do?",
        options: this.t.currentLang() === 'hi' 
          ? ["पैसे तुरंत भेजें।", "उनसे परिवार का सेफ वर्ड पूछें।", "कॉल को नजरअंदाज करें।", "पहले ₹5000 भेजें।"]
          : ["Send money immediately via UPI to help him.", "Ask him your family's secret safe word.", "Ignore the call completely.", "Send ₹5000 first to check if it reaches."],
        correctIndex: 1,
        explanation: this.t.currentLang() === 'hi' 
          ? "स्कैमर सोशल मीडिया से केवल 3 सेकंड के ऑडियो का उपयोग करके आवाज़ों को क्लोन करते हैं। पैसे भेजने से पहले उनकी पहचान सत्यापित करने के लिए सेफ वर्ड सबसे अच्छा तरीका है।" 
          : "Scammers clone voices using just 3 seconds of audio from social media. A pre-agreed safe word is the best way to verify their identity before sending money."
      },
      {
        question: this.t.currentLang() === 'hi' ? "आप इंस्टाग्राम पर रतन टाटा या मुकेश अंबानी का एक वीडियो देखते हैं जो एक नए ट्रेडिंग प्लेटफॉर्म का प्रचार कर रहे हैं जो 30% मासिक रिटर्न की गारंटी देता है। यह क्या है?" : "You see a video of Ratan Tata or Mukesh Ambani on Instagram promoting a new trading platform that guarantees 30% monthly returns. What is this?",
        options: this.t.currentLang() === 'hi'
          ? ["एक वास्तविक निवेश अवसर।", "एक लीक हुआ गुप्त प्रोजेक्ट।", "एआई डीपफेक सेलिब्रिटी एंडोर्समेंट स्कैम।", "सरकारी योजना।"]
          : ["A genuine investment opportunity.", "A leaked secret project.", "An AI deepfake celebrity endorsement scam.", "A government-backed scheme."],
        correctIndex: 2,
        explanation: this.t.currentLang() === 'hi'
          ? "स्कैमर सेलिब्रिटी चेहरों को मैप करने के लिए डीपफेक एआई का उपयोग करते हैं और उनकी आवाज़ों को क्लोन करते हैं ताकि ऐसा लगे कि वे नकली निवेश प्लेटफार्मों का समर्थन करते हैं।"
          : "Scammers use deepfake AI to map celebrity faces and clone their voices to make it look like they endorse fake investment platforms."
      },
      {
        question: this.t.currentLang() === 'hi' ? "आपको व्हाट्सएप पर किसी अज्ञात नंबर से वीडियो कॉल आती है। पुलिस की वर्दी में एक व्यक्ति दिखाई देता है और कहता है कि आपके नाम पर गिरफ्तारी वारंट है। क्या करना चाहिए?" : "You receive a video call on WhatsApp from an unknown number. A person in police uniform appears and says there's a warrant for your arrest. The background is blurry. What should you do?",
        options: this.t.currentLang() === 'hi'
          ? ["उनकी बातें सुनें और सहयोग करें।", "उनके द्वारा मांगी गई 'जमानत' राशि ट्रांसफर करें।", "तुरंत कॉल काटें और रिपोर्ट करें। असली पुलिस व्हाट्सएप पर वारंट जारी नहीं करती।", "अपनी पहचान साबित करने के लिए आधार विवरण साझा करें।"]
          : ["Listen to their demands and cooperate.", "Transfer the 'bail' amount they request.", "Disconnect immediately and report the number. Real police don't issue warrants over WhatsApp video calls.", "Share your Aadhaar details to prove your innocence."],
        correctIndex: 2,
        explanation: this.t.currentLang() === 'hi'
          ? "यह 'डिजिटल अरेस्ट' स्कैम है। वे अधिकारियों का रूप धारण करने के लिए डीपफेक वीडियो लूप या चोरी किए गए वीडियो का उपयोग करते हैं।"
          : "This is the 'Digital Arrest' scam. They use deepfake video loops or stolen videos to impersonate officers. Hang up and report."
      },
      {
        question: this.t.currentLang() === 'hi' ? "किसी संदिग्ध वीडियो को देखते समय, निम्नलिखित में से कौन सा डीपफेक का सामान्य संकेत है?" : "When watching a suspicious video, which of the following is a common sign of a deepfake?",
        options: this.t.currentLang() === 'hi'
          ? ["व्यक्ति बहुत जोर से बोल रहा है।", "असामान्य पलक झपकना, चेहरे के किनारे धुंधले होना और होठों की गलत गति।", "वीडियो ब्लैक एंड व्हाइट है।", "बैकग्राउंड संगीत बज रहा है।"]
          : ["The person is speaking very loudly.", "Unnatural blinking, facial edges blurring when turning, and out-of-sync lip movements.", "The video is in black and white.", "There is background music playing."],
        correctIndex: 1,
        explanation: this.t.currentLang() === 'hi'
          ? "एआई अक्सर चेहरे के किनारों और पलक झपकने के पैटर्न के साथ संघर्ष करता है। यदि चेहरा घूमने पर गड़बड़ होता है, तो यह संभवतः डीपफेक है।"
          : "AI often struggles with the edges of faces, teeth, and blinking patterns. If the face glitches when they turn their head, it's likely a deepfake."
      },
      {
        question: this.t.currentLang() === 'hi' ? "कोई आपकी मॉर्फ्ड, आपत्तिजनक तस्वीरें ऑनलाइन पोस्ट करने की धमकी देता है जब तक कि आप उन्हें ₹10,000 का भुगतान नहीं करते। सबसे पहले क्या करना चाहिए?" : "Someone threatens to post morphed, explicit photos of you online unless you pay them ₹10,000. What is the very first thing you should do?",
        options: this.t.currentLang() === 'hi'
          ? ["पैसे दे दें ताकि वे इसे हटा दें।", "उन्हें ब्लॉक करें और पूरी तरह नजरअंदाज करें।", "पैसे न दें। सबूत लें और 1930 और stopncii.org पर रिपोर्ट करें।", "उनके साथ बहस करें।"]
          : ["Pay the money so they delete it.", "Block them and ignore the problem completely.", "Do NOT pay. Take screenshots of threats, then report to 1930 and stopncii.org.", "Argue with them and beg them to stop."],
        correctIndex: 2,
        explanation: this.t.currentLang() === 'hi'
          ? "पैसे देना सेक्सटॉर्शन को कभी नहीं रोकता। पैसे न दें। साक्ष्य एकत्र करें और तुरंत अधिकारियों और stopncii.org को रिपोर्ट करें।"
          : "Paying never stops sextortion—they will just ask for more. Do not pay. Collect evidence and report to the authorities and stopncii.org immediately."
      }
    ];
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('CySafeClick_safe_word');
    if (saved) {
      this.familySafeWord = saved;
      this.isSafeWordSaved = true;
    }
  }

  saveSafeWord(): void {
    if (this.familySafeWord.trim()) {
      localStorage.setItem('CySafeClick_safe_word', this.familySafeWord.trim());
      this.isSafeWordSaved = true;
    }
  }

  editSafeWord(): void {
    this.isSafeWordSaved = false;
  }

  selectQuizOption(index: number): void {
    if (this.showExplanation) return;
    this.selectedOption = index;
    this.showExplanation = true;
    if (index === this.quizQuestions[this.currentQuizQuestion].correctIndex) {
      this.quizScore++;
    }
  }

  nextQuizQuestion(): void {
    this.showExplanation = false;
    this.selectedOption = null;
    if (this.currentQuizQuestion < this.quizQuestions.length - 1) {
      this.currentQuizQuestion++;
    } else {
      this.quizFinished = true;
    }
  }

  resetQuiz(): void {
    this.currentQuizQuestion = 0;
    this.quizScore = 0;
    this.quizFinished = false;
    this.showExplanation = false;
    this.selectedOption = null;
  }
}
