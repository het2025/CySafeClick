import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-student-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-module.component.html',
  styleUrls: ['./student-module.component.css']
})
export class StudentModuleComponent {
  
  // Scenario Quiz
  currentScenario = 0;
  scenarioScore = 0;
  scenarioFinished = false;
  showFeedback = false;
  selectedOption: number | null = null;

  constructor(public t: TranslationService) {}

  get scenarios() {
    const isHi = this.t.currentLang() === 'hi';
    return [
      {
        context: isHi ? "एक सहपाठी ने दूसरे छात्र की शर्मनाक तस्वीरें पोस्ट करने के लिए एक फर्जी इंस्टाग्राम अकाउंट बनाया।" : "A classmate created a fake Instagram account to post embarrassing photos of another student.",
        question: isHi ? "इसे संभालने का सबसे अच्छा तरीका क्या है?" : "What is the best way to handle this?",
        options: isHi 
          ? ["तस्वीरों को लाइक करें ताकि आप अगले शिकार न बनें।", "सार्वजनिक रूप से छात्र का बचाव करते हुए कमेंट करें।", "इंस्टाग्राम को अकाउंट की रिपोर्ट करें और चुपके से एक शिक्षक को बताएं।", "फर्जी अकाउंट को मैसेज करके रुकने के लिए कहें।"]
          : ["Like the photos so you don't get targeted next.", "Comment defending the student publicly.", "Report the account to Instagram and secretly tell a teacher.", "Message the fake account asking them to stop."],
        correctIndex: 2,
        feedback: isHi ? "अकाउंट की रिपोर्ट करने से इसे सुरक्षित रूप से हटा दिया जाता है। किसी भरोसेमंद वयस्क को बताने से पीड़ित को सहायता मिलती है।" : "Reporting the account gets it removed safely. Telling a trusted adult ensures the victim gets support."
      },
      {
        context: isHi ? "आप डिस्कॉर्ड पर एक बहुत ही अच्छे व्यक्ति से मिले जो वही गेम खेलता है। वे आपके स्कूल का नाम और सेल्फी मांगते हैं।" : "You met a really cool person on Discord who plays the same games. They ask for your school name and selfie.",
        question: isHi ? "आपको क्या करना चाहिए?" : "What should you do?",
        options: isHi
          ? ["इसे भेजें। वे सिर्फ मिलनसार हैं।", "फर्जी स्कूल का नाम दें लेकिन सेल्फी भेजें।", "कभी भी अपनी लोकेशन, स्कूल या चेहरा ऑनलाइन दोस्तों के साथ साझा न करें।", "बदले में उनकी सेल्फी मांगें।"]
          : ["Send it. They are just being friendly.", "Give a fake school name but send the selfie.", "Never share your location, school, or face with online-only friends.", "Ask for their selfie first to make it fair."],
        correctIndex: 2,
        feedback: isHi ? "अपराधी छात्रों को फंसाने के लिए गेमिंग प्लेटफॉर्म का उपयोग करते हैं। कभी भी किसी अजनबी के साथ अपनी पहचान साझा न करें।" : "Predators use gaming platforms to groom students. Never share identifying information with someone you haven't met in real life."
      },
      {
        context: isHi ? "आपको व्हाट्सएप संदेश मिलता है: 'बधाई हो! आपने ₹50,000 की पीएम छात्रवृत्ति जीती है। दावा करने के लिए यहाँ क्लिक करें: bit.ly/pm-schol'" : "You get a WhatsApp message: 'Congratulations! You won the PM Scholarship worth ₹50,000. Click here to claim: bit.ly/pm-schol'",
        question: isHi ? "क्या यह सुरक्षित है?" : "Is this safe?",
        options: isHi
          ? ["हाँ, छात्रवृत्तियाँ इसी तरह दी जाती हैं।", "नहीं, वास्तविक छात्रवृत्तियाँ scholarships.gov.in पर होती हैं। यह एक फिशिंग स्कैम है।", "लिंक पर क्लिक करें लेकिन बैंक विवरण दर्ज न करें।", "इसे अपनी क्लास के ग्रुप में फॉरवर्ड करें।"]
          : ["Yes, scholarships are given out like this.", "No, real scholarships are on scholarships.gov.in. This is a phishing scam.", "Click the link but don't enter bank details.", "Forward it to your class group just in case."],
        correctIndex: 1,
        feedback: isHi ? "सरकार bit.ly जैसे छोटे लिंक का उपयोग करके व्हाट्सएप के माध्यम से छात्रवृत्ति लिंक नहीं भेजती है।" : "The government does not send scholarship links via WhatsApp using shortened URLs like bit.ly."
      }
    ];
  }

  // Digital Rules State
  studentName = '';
  rules = [
    { textEn: "I will never share my passwords with anyone, even my best friends.", textHi: "मैं अपना पासवर्ड कभी किसी के साथ साझा नहीं करूँगा, यहाँ तक कि अपने सबसे अच्छे दोस्तों के साथ भी नहीं।", selected: true },
    { textEn: "I will not post photos that show my school uniform, home address, or location.", textHi: "मैं ऐसी तस्वीरें पोस्ट नहीं करूँगा जिनमें मेरा स्कूल यूनिफॉर्म, घर का पता या स्थान दिखाई दे।", selected: true },
    { textEn: "If someone bullies me online, I will take screenshots and tell an adult.", textHi: "अगर कोई मुझे ऑनलाइन परेशान करता है, तो मैं स्क्रीनशॉट लूँगा और किसी बड़े को बताऊँगा।", selected: true },
    { textEn: "I will never meet an online-only friend in real life.", textHi: "मैं ऑनलाइन मिले दोस्त से असल जिंदगी में कभी नहीं मिलूँगा।", selected: true },
    { textEn: "I will think before I post, knowing the internet is permanent.", textHi: "मैं पोस्ट करने से पहले सोचूँगा, यह जानते हुए कि इंटरनेट पर सब स्थायी है।", selected: true }
  ];
  customRule = '';

  selectOption(index: number) {
    if (this.showFeedback) return;
    this.selectedOption = index;
    this.showFeedback = true;
    if (index === this.scenarios[this.currentScenario].correctIndex) {
      this.scenarioScore++;
    }
  }

  nextScenario() {
    this.selectedOption = null;
    this.showFeedback = false;
    if (this.currentScenario < this.scenarios.length - 1) {
      this.currentScenario++;
    } else {
      this.scenarioFinished = true;
    }
  }

  resetScenarios() {
    this.currentScenario = 0;
    this.scenarioScore = 0;
    this.scenarioFinished = false;
    this.selectedOption = null;
    this.showFeedback = false;
  }

  addCustomRule() {
    if (this.customRule.trim()) {
      this.rules.push({ textEn: this.customRule.trim(), textHi: this.customRule.trim(), selected: true });
      this.customRule = '';
    }
  }

  printRules() {
    window.print();
  }
}
