import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpiScannerService, UpiScanResult } from './upi-scanner.service';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { ProgressRingComponent } from '../../shared/components/progress-ring/progress-ring.component';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';

@Component({
  selector: 'app-upi-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, RiskBadgeComponent, ProgressRingComponent, AccordionComponent],
  template: `
    <div class="container scanner-page">
      <div class="header-section">
        <h1>UPI Fraud Scanner</h1>
        <p>Analyze a UPI ID or payment link before you send money.</p>
      </div>

      <div class="scanner-card">
        <div class="tabs">
          <button [class.active]="mode() === 'id'" (click)="mode.set('id')">UPI ID</button>
          <button [class.active]="mode() === 'link'" (click)="mode.set('link')">UPI Link / QR Text</button>
        </div>

        <textarea [ngModel]="input()" (ngModelChange)="input.set($event)"
                  [placeholder]="mode() === 'id' ? 'e.g. 9876543210@ybl' : 'e.g. upi://pay?pa=...'"></textarea>
        
        <button class="btn-scan" (click)="scan()" [disabled]="!input().trim()">Scan Now</button>

        @if (result()) {
          <div class="results-section">
            <div class="risk-overview">
              <div class="gauge-container">
                <app-progress-ring [progress]="result()!.riskScore" [size]="120" 
                  [color]="result()!.riskLevel === 'dangerous' ? 'var(--danger)' : (result()!.riskLevel === 'suspicious' ? 'var(--warning)' : 'var(--safe)')">
                  <span class="score-text">{{ result()!.riskScore }}/100</span>
                </app-progress-ring>
              </div>
              <div class="risk-details">
                <app-risk-badge [level]="result()!.riskLevel"></app-risk-badge>
                <h3>{{ verdictTitle() }}</h3>
                <p>{{ verdictCopy() }}</p>
                <p><strong>Detected bank/handle:</strong> {{ result()!.vpaAnalysis.bank }}</p>
              </div>
            </div>

            @if (result()!.flags.length > 0) {
              <div class="flags-container">
                <h4>Red Flags Detected:</h4>
                @for (flag of result()!.flags; track flag.type) {
                  <div class="flag-card" [ngClass]="flag.severity">
                    <strong>{{ flag.type }}</strong>
                    <p>{{ flag.description }}</p>
                    <small>{{ flag.detail }}</small>
                  </div>
                }
              </div>
            }

            <div class="recommendations">
              <h4>What to do:</h4>
              <ul>
                @for (rec of result()!.recommendations; track rec) {
                  <li>{{ rec }}</li>
                }
              </ul>
              <div class="action-row">
                <a href="tel:1930" class="action danger" *ngIf="result()!.riskLevel !== 'safe'">Call 1930</a>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" class="action report">Report Cybercrime</a>
                <button type="button" class="action secondary" (click)="copyEvidenceChecklist()">
                  {{ copied() ? 'Checklist Copied' : 'Copy Evidence Checklist' }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="education-section">
        <app-accordion title="How UPI Collect Scams Work">
          <p>Scammers use the "Collect Request" feature to steal money. They will send you a request that looks like you are receiving money (e.g., for an OLX sale, or a prize), but when you enter your UPI PIN, money is actually DEDUCTED from your account.</p>
          <br>
          <p><strong>Golden Rule:</strong> You NEVER need to enter your UPI PIN to receive money. PIN is only for SENDING money or checking your balance.</p>
          <br>
          <p><strong>Common fake collect request:</strong> "I am sending you ₹10,000. Accept the request and enter PIN to receive." Entering the PIN sends money from your account.</p>
        </app-accordion>
      </div>
    </div>
  `,
  styles: [`
    .scanner-page { padding: 40px 0; max-width: 800px; margin: 0 auto; }
    .header-section { margin-bottom: 32px; text-align: center; }
    .scanner-card { background: var(--surface); padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
    .tabs button { padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border); background: none; color: var(--text); cursor: pointer; font-weight: bold; }
    .tabs button.active { background: var(--primary); color: white; border-color: var(--primary); }
    textarea { width: 100%; height: 100px; padding: 16px; border-radius: 8px; border: 2px solid var(--border); margin-bottom: 20px; font-family: monospace; resize: vertical; }
    .btn-scan { width: 100%; padding: 16px; background: var(--accent-saffron); color: var(--primary); border-radius: 8px; font-weight: bold; font-size: 1.1rem; border: none; cursor: pointer; transition: all 0.3s; }
    .btn-scan:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .results-section { margin-top: 40px; border-top: 1px solid var(--border); padding-top: 32px; }
    .risk-overview { display: flex; gap: 32px; align-items: center; margin-bottom: 32px; }
    .score-text { font-size: 1.5rem; font-weight: bold; }
    .risk-details h3 { margin: 10px 0; }
    
    .flags-container { margin-bottom: 32px; }
    .flags-container h4 { margin-bottom: 16px; }
    .flag-card { padding: 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid; background: var(--bg); }
    .flag-card.high { border-left-color: var(--danger); background: rgba(239, 68, 68, 0.05); }
    .flag-card.medium { border-left-color: var(--warning); background: rgba(245, 158, 11, 0.05); }
    .flag-card.low { border-left-color: var(--safe); background: rgba(34, 197, 94, 0.05); }
    .flag-card strong { display: block; margin-bottom: 4px; }
    .flag-card p { margin-bottom: 8px; font-size: 0.95rem; }
    .flag-card small { color: var(--muted); font-size: 0.85rem; }
    
    .recommendations { background: #f1f5f9; padding: 24px; border-radius: 8px; }
    [data-theme="dark"] .recommendations { background: #1e293b; }
    .recommendations h4 { margin-bottom: 12px; }
    .recommendations ul { padding-left: 20px; }
    .recommendations li { margin-bottom: 8px; }
    .action-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; }
    .action { border: none; border-radius: 8px; padding: 10px 14px; font-weight: 800; text-decoration: none; cursor: pointer; }
    .action.danger { background: var(--danger); color: white; }
    .action.report { background: var(--primary); color: white; }
    .action.secondary { background: var(--surface); color: var(--text); border: 1px solid var(--border); }

    .education-section { margin-top: 40px; }
    @media (max-width: 640px) {
      .scanner-card { padding: 20px; }
      .risk-overview { flex-direction: column; align-items: flex-start; }
      .action { width: 100%; text-align: center; }
    }
  `]
})
export class UpiScannerComponent {
  mode = signal<'id' | 'link'>('id');
  input = signal('');
  result = signal<UpiScanResult | null>(null);
  copied = signal(false);

  constructor(private upiScannerService: UpiScannerService) {}

  scan() {
    if (!this.input().trim()) return;
    const analysis = this.upiScannerService.analyze(this.input());
    this.result.set(analysis);
    this.copied.set(false);
  }

  verdictTitle(): string {
    const level = this.result()?.riskLevel;
    if (level === 'dangerous') return 'Dangerous: do not pay';
    if (level === 'suspicious') return 'Verify carefully before paying';
    return 'Looks safer, still verify recipient';
  }

  verdictCopy(): string {
    const level = this.result()?.riskLevel;
    if (level === 'dangerous') return 'This payment text has strong scam indicators. Do not enter your UPI PIN.';
    if (level === 'suspicious') return 'There are warning signs. Confirm the recipient through a trusted phone number first.';
    return 'No major red flags were detected, but UPI payments cannot be reversed easily.';
  }

  async copyEvidenceChecklist() {
    const checklist = [
      'UPI fraud evidence checklist:',
      '- UPI ID or upi://pay link',
      '- Screenshot of payment request / QR code',
      '- UTR or transaction ID',
      '- Bank SMS / account statement entry',
      '- Phone number, chat, and profile details',
      '- Time, amount, and sequence of events'
    ].join('\n');
    await navigator.clipboard.writeText(checklist);
    this.copied.set(true);
  }
}
