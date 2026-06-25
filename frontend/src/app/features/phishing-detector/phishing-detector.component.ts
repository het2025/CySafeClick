import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-phishing-detector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container phishing-page">
      <h1>Phishing Detector</h1>
      
      <div class="scanner">
        <div class="tabs">
          <button [class.active]="mode() === 'url'" (click)="mode.set('url')">URL Scan</button>
          <button [class.active]="mode() === 'msg'" (click)="mode.set('msg')">Message Scan</button>
        </div>

        <textarea [ngModel]="input()" (ngModelChange)="input.set($event)"
                 [placeholder]="mode() === 'url' ? 'Paste URL here...' : 'Paste message here...'"></textarea>
        
        <button class="btn-scan" (click)="scan()" [disabled]="!input().trim()">Analyze Risk</button>

        @if (showResults()) {
          <div class="results" [style.border-color]="riskColor()">
            <h2 [style.color]="riskColor()">{{ riskLevel() }}</h2>
            <ul>
              @for (finding of findings(); track finding) {
                <li>{{ finding }}</li>
              }
              @if (findings().length === 0) {
                <li>No major red flags found. Still verify the sender and destination manually.</li>
              }
            </ul>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .phishing-page { padding: 40px 0; }
    .scanner { background: var(--surface); padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
    .tabs button { padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border); background: none; color: var(--text); }
    .tabs button.active { background: var(--primary); color: white; }
    textarea { width: 100%; height: 120px; padding: 16px; border-radius: 8px; border: 2px solid var(--border); margin-bottom: 20px; }
    .btn-scan { width: 100%; padding: 16px; background: var(--primary); color: white; border-radius: 8px; font-weight: bold; }
    .btn-scan:disabled { opacity: .55; cursor: not-allowed; }
    .results { margin-top: 32px; padding: 24px; border: 2px solid; border-radius: 12px; background: rgba(0,0,0,0.02); }
  `]
})
export class PhishingDetectorComponent {
  private t = inject(TranslationService);

  mode = signal<'url' | 'msg'>('url');
  input = signal('');
  showResults = signal(false);
  findings = signal<string[]>([]);
  riskLevel = signal('LOW RISK');
  riskColor = signal('var(--safe)');

  private getList(key: string, fallback: string[]): string[] {
    const val = this.t.translateData(key);
    return Array.isArray(val) && val.length > 0 ? val : fallback;
  }

  scan() {
    const text = this.input().toLowerCase();
    const checks: string[] = [];
    let score = 0;

    if (this.mode() === 'url') {
      if (text.startsWith('http://')) { checks.push('Unsecured HTTP connection.'); score += 25; }

      const shorteners = this.getList('PHISHING_DETECTOR.URL_SHORTENERS', ['bit.ly', 'tinyurl', 't.co', 'cutt.ly', 'rebrand.ly', 'is.gd', 'shorturl']);
      if (shorteners.some(s => text.includes(s))) { checks.push('URL shortener hides the final destination.'); score += 25; }

      if (/https?:\/\/\d{1,3}(\.\d{1,3}){3}/.test(text)) { checks.push('Uses an IP address instead of a real domain.'); score += 35; }
      if (/xn--/.test(text)) { checks.push('Contains punycode, often used for lookalike domains.'); score += 35; }

      const tlds = this.getList('PHISHING_DETECTOR.URL_SUSPICIOUS_TLDS', ['.xyz', '.top', '.click', '.link', '.buzz', '.loan', '.work']);
      if (tlds.some(ext => text.includes(ext))) { checks.push('Suspicious domain extension commonly abused in scams.'); score += 20; }

      const brands = this.getList('PHISHING_DETECTOR.MSG_BRAND_NAMES', ['paytm', 'phonepe', 'gpay', 'sbi', 'hdfc', 'icici', 'axis', 'amazon', 'flipkart']);
      const officialDomains = ['paytm.com', 'phonepe.com', 'google.com', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com', 'amazon.in', 'flipkart.com'];
      if (brands.some(b => text.includes(b)) && !officialDomains.some(d => text.includes(d))) {
        checks.push('Brand name appears without the official domain.');
        score += 40;
      }

      const keywords = this.getList('PHISHING_DETECTOR.URL_KEYWORDS', ['login', 'verify', 'kyc', 'refund', 'reward', 'free', 'prize', 'cashback']);
      if (keywords.some(k => text.includes(k))) { checks.push('Contains phishing-style action words such as verify, refund, reward, or KYC.'); score += 20; }
    } else {
      const sensitiveWords = this.getList('PHISHING_DETECTOR.MSG_SENSITIVE_WORDS', ['otp', 'pin', 'cvv', 'password', 'aadhaar', 'pan']);
      if (sensitiveWords.some(k => text.includes(k))) { checks.push('Requests sensitive credentials or identity details.'); score += 45; }

      const urgencyWords = this.getList('PHISHING_DETECTOR.MSG_URGENCY_WORDS', ['immediately', 'blocked', 'suspended', 'arrest', 'last chance', 'within 24 hours']);
      if (urgencyWords.some(k => text.includes(k))) { checks.push('High-urgency or fear language.'); score += 30; }

      if (/(pay|transfer|upi|wallet|refund fee|processing fee|tax|unlock)/.test(text)) { checks.push('Payment pressure or fee demand detected.'); score += 30; }
      if (/(click|open|download|install|anydesk|screen share|remote access)/.test(text)) { checks.push('Pushes risky links, downloads, or remote access apps.'); score += 30; }

      const prizeWords = this.getList('PHISHING_DETECTOR.MSG_PRIZE_WORDS', ['lottery', 'prize', 'free recharge', 'cashback', 'job offer', 'task']);
      if (prizeWords.some(k => text.includes(k))) { checks.push('Common scam lure detected.'); score += 20; }

      if (/(police|cbi|trai|rbi|customs|courier)/.test(text) && /(pay|arrest|case|parcel|illegal)/.test(text)) { checks.push('Impersonates authority or courier services.'); score += 35; }
    }

    this.findings.set(checks);
    this.showResults.set(true);
    
    if (score >= 60) { this.riskLevel.set('VERY HIGH RISK'); this.riskColor.set('var(--danger)'); }
    else if (score >= 30) { this.riskLevel.set('MEDIUM RISK'); this.riskColor.set('var(--warning)'); }
    else { this.riskLevel.set('LOW RISK'); this.riskColor.set('var(--safe)'); }
  }
}
