import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailHeaderService, EmailAnalysis } from './email-header.service';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';

@Component({
  selector: 'app-email-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RiskBadgeComponent, AccordionComponent],
  template: `
    <div class="container email-page">
      <div class="header-section">
        <h1>Email Header Analyzer</h1>
        <p>Paste raw email headers to detect spoofing, phishing, and fake senders.</p>
      </div>

      <div class="main-content">
        <div class="input-card">
          <textarea [(ngModel)]="rawHeaders" 
                    placeholder="Paste the full raw email headers here..."></textarea>
          <button class="btn-analyze" (click)="analyze()" [disabled]="!rawHeaders.trim()">Analyze Headers</button>

          <app-accordion title="How to get raw headers?" [initiallyOpen]="false">
            <ul class="help-list">
              <li><strong>Gmail:</strong> Open email → Click 3 dots (More) → Show original → Copy to clipboard</li>
              <li><strong>Outlook:</strong> Open email → File → Properties → Internet Headers</li>
              <li><strong>Yahoo:</strong> Open email → More → View Raw Message</li>
            </ul>
          </app-accordion>
        </div>

        @if (result(); as res) {
          <div class="results-card">
            <div class="risk-banner" [ngClass]="res.riskAssessment">
              <div class="badge-wrapper">
                <app-risk-badge [level]="res.riskAssessment"></app-risk-badge>
              </div>
              <p>{{ res.summary }}</p>
            </div>

            <div class="auth-section">
              <h3>Authentication Results</h3>
              <div class="auth-lights">
                <div class="light" [ngClass]="res.authResults.spf">
                  <span class="dot"></span>
                  <strong>SPF</strong>
                  <span>{{ res.authResults.spf | uppercase }}</span>
                </div>
                <div class="light" [ngClass]="res.authResults.dkim">
                  <span class="dot"></span>
                  <strong>DKIM</strong>
                  <span>{{ res.authResults.dkim | uppercase }}</span>
                </div>
                <div class="light" [ngClass]="res.authResults.dmarc">
                  <span class="dot"></span>
                  <strong>DMARC</strong>
                  <span>{{ res.authResults.dmarc | uppercase }}</span>
                </div>
              </div>
            </div>

            <div class="sender-info">
              <h3>Sender Identity</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Visible From:</label>
                  <span>{{ res.senderInfo.from }}</span>
                </div>
                @if (res.senderInfo.replyTo) {
                  <div class="info-item" [class.highlight]="hasReplyToFlag(res)">
                    <label>Reply-To:</label>
                    <span>{{ res.senderInfo.replyTo }}</span>
                  </div>
                }
                @if (res.senderInfo.returnPath) {
                  <div class="info-item">
                    <label>Return-Path (Envelope From):</label>
                    <span>{{ res.senderInfo.returnPath }}</span>
                  </div>
                }
              </div>
            </div>

            @if (res.flags.length > 0) {
              <div class="flags-section">
                <h3>Red Flags Detected</h3>
                @for (flag of res.flags; track flag.title) {
                  <div class="flag-item" [ngClass]="flag.severity">
                    <strong>{{ flag.title }}</strong>
                    <p>{{ flag.description }}</p>
                  </div>
                }
              </div>
            }

            <div class="routing-section">
              <h3>Email Routing Path</h3>
              <div class="timeline">
                @for (hop of res.routingPath; track hop.timestamp; let i = $index) {
                  <div class="timeline-item">
                    <div class="hop-number">{{ i + 1 }}</div>
                    <div class="hop-content">
                      <strong>By: {{ hop.by }}</strong>
                      <p>From: {{ hop.from }}</p>
                      <small>{{ hop.timestamp | date:'medium' }}</small>
                    </div>
                  </div>
                }
                @if (res.routingPath.length === 0) {
                  <p class="muted">No routing information found.</p>
                }
              </div>
            </div>

          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .email-page { padding: 40px 0; }
    .header-section { text-align: center; margin-bottom: 32px; h1 { color: var(--primary); margin-bottom: 8px; } p { color: var(--muted); } }
    .main-content { display: flex; flex-direction: column; gap: 24px; max-width: 900px; margin: 0 auto; }
    
    .input-card { background: var(--surface); padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    textarea { width: 100%; height: 200px; padding: 16px; border: 2px solid var(--border); border-radius: 8px; font-family: monospace; font-size: 0.9rem; resize: vertical; margin-bottom: 16px; background: var(--bg); color: var(--text); }
    .btn-analyze { width: 100%; padding: 16px; background: var(--accent-saffron); color: var(--primary); font-weight: bold; font-size: 1.1rem; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s; margin-bottom: 16px; }
    .btn-analyze:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .help-list { padding-left: 20px; line-height: 1.8; }
    .help-list li { margin-bottom: 8px; }
    
    .results-card { background: var(--surface); padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 32px; }
    
    .risk-banner { padding: 24px; border-radius: 8px; border-left: 6px solid; }
    .risk-banner.dangerous { background: rgba(239,68,68,0.05); border-left-color: var(--danger); }
    .risk-banner.suspicious { background: rgba(245,158,11,0.05); border-left-color: var(--warning); }
    .risk-banner.safe { background: rgba(34,197,94,0.05); border-left-color: var(--safe); }
    .badge-wrapper { margin-bottom: 12px; }
    .risk-banner p { font-size: 1.05rem; font-weight: 500; }
    
    .auth-lights { display: flex; gap: 16px; margin-top: 16px; }
    .light { flex: 1; padding: 16px; border-radius: 8px; background: var(--bg); display: flex; flex-direction: column; align-items: center; gap: 8px; border: 1px solid var(--border); }
    .dot { width: 16px; height: 16px; border-radius: 50%; background: var(--muted); }
    .light.pass .dot { background: var(--safe); box-shadow: 0 0 10px var(--safe); }
    .light.fail .dot { background: var(--danger); box-shadow: 0 0 10px var(--danger); }
    .light.softfail .dot, .light.neutral .dot { background: var(--warning); }
    
    .info-grid { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
    .info-item { display: flex; flex-direction: column; padding: 12px; background: var(--bg); border-radius: 8px; }
    .info-item label { font-size: 0.85rem; color: var(--muted); font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
    .info-item span { font-family: monospace; word-break: break-all; }
    .info-item.highlight { border: 2px solid var(--danger); background: rgba(239,68,68,0.05); }

    .flags-section h3 { color: var(--danger); margin-bottom: 16px; }
    .flag-item { padding: 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid; background: var(--bg); }
    .flag-item.high { border-left-color: var(--danger); }
    .flag-item.medium { border-left-color: var(--warning); }
    .flag-item.low { border-left-color: var(--safe); }
    .flag-item strong { display: block; margin-bottom: 4px; }
    .flag-item p { font-size: 0.95rem; margin: 0; }
    
    .timeline { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; position: relative; }
    .timeline::before { content: ''; position: absolute; left: 16px; top: 0; bottom: 0; width: 2px; background: var(--border); }
    .timeline-item { display: flex; gap: 16px; position: relative; z-index: 1; }
    .hop-number { width: 34px; height: 34px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
    .hop-content { background: var(--bg); padding: 16px; border-radius: 8px; flex: 1; }
    .hop-content strong { display: block; margin-bottom: 4px; }
    .hop-content p { margin-bottom: 8px; font-size: 0.9rem; font-family: monospace; word-break: break-all; }
    .hop-content small { color: var(--muted); font-size: 0.8rem; }
  `]
})
export class EmailHeaderComponent {
  rawHeaders = '';
  result = signal<EmailAnalysis | null>(null);

  constructor(private service: EmailHeaderService) {}

  analyze() {
    if (!this.rawHeaders.trim()) return;
    this.result.set(this.service.parseHeaders(this.rawHeaders));
  }

  hasReplyToFlag(res: EmailAnalysis): boolean {
    return res.flags.some(f => f.title.includes('Reply-To'));
  }
}
