import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-cybercrime',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container report-page">
      <section class="hero">
        <p class="eyebrow">Emergency Cybercrime Help</p>
        <h1>Report fast. Preserve evidence. Reduce damage.</h1>
        <p class="hero-copy">For financial fraud in India, call 1930 immediately and file the official complaint on the National Cyber Crime Portal.</p>
        <div class="hero-actions">
          <a href="tel:1930" class="btn danger">Call 1930 Now</a>
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" class="btn primary">Open cybercrime.gov.in</a>
          <a routerLink="/tools/incident-response" class="btn secondary">Start Incident Checklist</a>
        </div>
      </section>

      <section class="notice">
        <strong>Important:</strong> CySafeClick gives educational guidance only. Complaints are officially filed through 1930, cybercrime.gov.in, your bank, or your local police station.
      </section>

      <section class="quick-flow">
        <h2>What happened?</h2>
        <div class="flow-grid">
          <button *ngFor="let flow of flows" [class.active]="selectedFlow() === flow.id" (click)="selectedFlow.set(flow.id)">
            <span>{{ flow.icon }}</span>
            {{ flow.title }}
          </button>
        </div>

        <div class="flow-card" *ngIf="activeFlow() as flow">
          <div>
            <p class="priority">{{ flow.priority }}</p>
            <h3>{{ flow.title }}</h3>
          </div>
          <ol>
            <li *ngFor="let step of flow.steps">{{ step }}</li>
          </ol>
          <div class="flow-actions">
            <a href="tel:1930" class="btn danger small" *ngIf="flow.call1930">Call 1930</a>
            <a routerLink="/tools/incident-response" class="btn secondary small">Open Playbook</a>
          </div>
        </div>
      </section>

      <section class="evidence">
        <h2>Evidence checklist</h2>
        <p>Collect these before or while filing. Do not delete chats, SMS, emails, or transaction messages.</p>
        <div class="check-grid">
          <label *ngFor="let item of evidenceItems">
            <input type="checkbox">
            <span>{{ item }}</span>
          </label>
        </div>
      </section>

      <section class="guide">
        <h2>How to file on the official portal</h2>
        <ol>
          <li>Open cybercrime.gov.in and choose <strong>File a Complaint</strong>.</li>
          <li>Pick the right category. For money loss, select financial fraud and call 1930 first.</li>
          <li>Enter incident details, suspect identifiers, and upload evidence.</li>
          <li>Save the acknowledgement number and share it with your bank or police officer if needed.</li>
        </ol>
      </section>
    </div>
  `,
  styles: [`
    .report-page { padding: 40px 0; max-width: 1100px; }
    .hero { background: linear-gradient(135deg, var(--primary), #1e293b); color: white; padding: 48px; border-radius: 12px; }
    .eyebrow { color: var(--accent-saffron); text-transform: uppercase; letter-spacing: .08em; font-weight: 800; margin: 0 0 8px; }
    .hero h1 { font-size: 2.6rem; max-width: 760px; margin: 0 0 12px; }
    .hero-copy { color: #dbe4ef; max-width: 720px; font-size: 1.1rem; }
    .hero-actions, .flow-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 12px 18px; border-radius: 8px; font-weight: 800; text-decoration: none; border: 1px solid transparent; cursor: pointer; }
    .btn.danger { background: var(--danger); color: white; }
    .btn.primary { background: var(--accent-saffron); color: var(--primary); }
    .btn.secondary { background: var(--surface); color: var(--text); border-color: var(--border); }
    .btn.small { min-height: 38px; padding: 8px 14px; }
    .notice, .quick-flow, .evidence, .guide { margin-top: 24px; background: var(--surface); border: 1px solid var(--border); padding: 28px; border-radius: 12px; }
    .notice { border-left: 5px solid var(--accent-saffron); }
    .flow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin: 18px 0; }
    .flow-grid button { display: flex; align-items: center; gap: 10px; text-align: left; padding: 14px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); cursor: pointer; font-weight: 700; }
    .flow-grid button.active { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(255,153,51,.25); }
    .flow-card { background: var(--bg); border-radius: 10px; padding: 22px; }
    .priority { color: var(--danger); font-weight: 900; margin: 0 0 4px; }
    .check-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px; margin-top: 18px; }
    .check-grid label { display: flex; gap: 10px; align-items: flex-start; padding: 12px; background: var(--bg); border-radius: 8px; }
    ol li { margin-bottom: 12px; font-weight: 500; }
    @media (max-width: 640px) {
      .hero { padding: 28px; }
      .hero h1 { font-size: 2rem; }
      .btn { width: 100%; }
    }
  `]
})
export class ReportCybercrimeComponent {
  selectedFlow = signal('upi');

  evidenceItems = [
    'Screenshots of chats, SMS, emails, or call logs',
    'Phone number, UPI ID, email, website URL, or profile link',
    'UTR / transaction ID / bank reference number',
    'Bank SMS and account statement entry',
    'Date, time, amount, and sequence of events',
    'Any downloaded file, QR code, invoice, or fake notice',
    'Names used by the caller or account',
    'Acknowledgement numbers from bank, 1930, or police'
  ];

  flows = [
    {
      id: 'upi',
      icon: 'UPI',
      title: 'UPI or bank fraud',
      priority: 'Golden hour: act immediately',
      call1930: true,
      steps: ['Call 1930 and ask for transaction freezing support.', 'Call your bank and request debit freeze / beneficiary freeze.', 'Collect UTR, screenshots, phone number, UPI ID, and bank SMS.', 'File the official complaint and save the acknowledgement number.']
    },
    {
      id: 'hacked',
      icon: 'ACC',
      title: 'Hacked account',
      priority: 'Secure recovery channels first',
      call1930: false,
      steps: ['Change email password from a clean device.', 'Sign out all sessions and enable 2FA.', 'Recover the hacked platform account.', 'Warn contacts not to trust messages from the account.']
    },
    {
      id: 'blackmail',
      icon: 'SOS',
      title: 'Blackmail or sextortion',
      priority: 'Do not pay or negotiate',
      call1930: true,
      steps: ['Save evidence and stop replying.', 'Block the suspect after evidence is saved.', 'Report on cybercrime.gov.in under appropriate women/child/other category.', 'Visit local police immediately if there is physical threat.']
    },
    {
      id: 'job',
      icon: 'JOB',
      title: 'Fake job scam',
      priority: 'Stop further payments',
      call1930: true,
      steps: ['Do not pay registration, task, tax, or unlock fees.', 'Save offer letter, chat, payment proof, and recruiter details.', 'Call 1930 if money was transferred.', 'Report the number/profile and warn other applicants.']
    },
    {
      id: 'investment',
      icon: 'INV',
      title: 'Investment scam',
      priority: 'Do not add more money',
      call1930: true,
      steps: ['Stop investing, even if the app shows profit.', 'Collect app URL, Telegram/WhatsApp group, wallet, bank, and payment details.', 'Call 1930 for recent transfers.', 'File complaint with all transaction IDs.']
    },
    {
      id: 'phone',
      icon: 'SIM',
      title: 'Lost phone or SIM risk',
      priority: 'Block SIM and accounts',
      call1930: false,
      steps: ['Call telecom provider and block the SIM.', 'Use Find My Device / iCloud to lock or erase the phone.', 'Call bank to block UPI and mobile banking.', 'File police complaint and block IMEI through CEIR.']
    }
  ];

  activeFlow() {
    return this.flows.find(flow => flow.id === this.selectedFlow());
  }
}
