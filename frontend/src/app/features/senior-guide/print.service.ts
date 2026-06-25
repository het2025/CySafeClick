import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  printHindi(): void {
    document.title = 'Cycysafeclick Senior Guide Hindi';
    this.applyPrintStyles('hi');
    window.print();
  }

  printEnglish(): void {
    document.title = 'Cycysafeclick Senior Guide English';
    this.applyPrintStyles('en');
    window.print();
  }

  private applyPrintStyles(lang: 'hi' | 'en'): void {
    const body = document.body;
    body.classList.add('printing-senior-guide');
    body.setAttribute('data-print-lang', lang);

    window.addEventListener('afterprint', () => {
      body.classList.remove('printing-senior-guide');
      body.removeAttribute('data-print-lang');
    }, { once: true });
  }

  generateShareText(): string {
    return `🛡️ बड़ों के लिए Cyber Safety के 3 सबसे जरूरी नियम:

1️⃣ OTP किसी को मत बताओ — बैंक भी नहीं मांगेगा
2️⃣ 'Police/CBI' के नाम पर call आए = SCAM
3️⃣ Lottery जीतने पर fee मांगें = SCAM

🚨 Cyber Crime हो जाए तो: 1930

पूरी guide यहां: Cycysafeclick.in/learn/senior-guide
(Print करके घर में लगाएं)`;
  }
}
