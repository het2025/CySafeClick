import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ToolkitSection {
  id: string;
  title: string;
  desc: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ComplaintRecord {
  id: string;
  acknowledgement: string;
  bankTicket: string;
  policeContact: string;
  followUpDate: string;
  note: string;
}

@Component({
  selector: 'app-citizen-safety-toolkit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="toolkit-page">
      <section class="hero">
        <p class="eyebrow">Citizen Cyber Safety Toolkit</p>
        <h1>Practical tools for fraud response, prevention, and reporting.</h1>
        <p>Use this page during a cyber emergency or as a weekly safety check for your family, bank accounts, phone, and online identity.</p>
        <div class="hero-actions">
          <a href="tel:1930" class="btn danger">Call 1930</a>
          <a routerLink="/report-cybercrime" class="btn primary">Report Guide</a>
          <a routerLink="/tools/incident-response" class="btn secondary">Incident Playbooks</a>
        </div>
      </section>

      <nav class="section-nav" aria-label="Toolkit sections">
        <button *ngFor="let section of sections" [class.active]="activeSection() === section.id" (click)="activeSection.set(section.id)">
          <strong>{{ section.title }}</strong>
          <span>{{ section.desc }}</span>
        </button>
      </nav>

      <section class="panel" *ngIf="activeSection() === 'golden-hour'">
        <h2>Golden Hour Fraud Recovery Assistant</h2>
        <p>Choose the fraud type and time since transfer. The first hour is critical for freezing funds.</p>
        <div class="form-grid">
          <label>Fraud type
            <select [(ngModel)]="fraudType">
              <option value="upi">UPI fraud</option>
              <option value="card">Card fraud</option>
              <option value="bank">Bank transfer</option>
              <option value="investment">Investment scam</option>
              <option value="job">Job scam</option>
            </select>
          </label>
          <label>Time since payment
            <select [(ngModel)]="fraudWindow">
              <option value="hour">Under 1 hour</option>
              <option value="day">Same day</option>
              <option value="late">More than 24 hours</option>
            </select>
          </label>
        </div>
        <div class="result-card urgent">
          <h3>{{ goldenHourResult().title }}</h3>
          <ol>
            <li *ngFor="let step of goldenHourResult().steps">{{ step }}</li>
          </ol>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'evidence-builder'">
        <h2>Evidence Builder</h2>
        <p>Generate a clean complaint summary for cybercrime.gov.in, your bank, or police station.</p>
        <div class="form-grid">
          <label>Scam number <input [(ngModel)]="evidence.number"></label>
          <label>UPI ID / account / URL <input [(ngModel)]="evidence.identifier"></label>
          <label>Transaction ID / UTR <input [(ngModel)]="evidence.utr"></label>
          <label>Amount lost <input type="number" [(ngModel)]="evidence.amount"></label>
          <label>Date and time <input [(ngModel)]="evidence.dateTime"></label>
          <label class="wide">Description <textarea rows="4" [(ngModel)]="evidence.description"></textarea></label>
        </div>
        <div class="summary-box">
          <h3>Generated complaint summary</h3>
          <pre>{{ complaintSummary() }}</pre>
          <button class="btn primary" (click)="copyText(complaintSummary())">Copy Summary</button>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'message-analyzer'">
        <h2>Scam Message Screenshot/Text Analyzer</h2>
        <p>Paste SMS, WhatsApp, or email text. For screenshots, type or OCR the message text first.</p>
        <textarea rows="6" [(ngModel)]="messageText" placeholder="Paste suspicious message here..."></textarea>
        <div class="result-card" [class.urgent]="messageAnalysis().risk === 'High risk'">
          <h3>{{ messageAnalysis().risk }}</h3>
          <ul>
            <li *ngFor="let item of messageAnalysis().findings">{{ item }}</li>
          </ul>
          <p><strong>Next action:</strong> {{ messageAnalysis().action }}</p>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'digital-arrest'">
        <h2>Digital Arrest Scam Defender</h2>
        <div class="two-col">
          <div>
            <h3>Red flags</h3>
            <ul>
              <li>Police, CBI, TRAI, customs, or courier officer asks for video call.</li>
              <li>They say you are under "digital arrest".</li>
              <li>They demand secrecy or money to clear your name.</li>
              <li>They send fake ID cards, FIRs, or court notices on WhatsApp.</li>
            </ul>
          </div>
          <div>
            <h3>What to do</h3>
            <ol>
              <li>Disconnect the call. Real police do not arrest people on video call.</li>
              <li>Do not transfer money or share screen.</li>
              <li>Save number, chat, notice, and payment demand.</li>
              <li>Call 1930 if money was paid; otherwise report at cybercrime.gov.in.</li>
            </ol>
          </div>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'bank-safety'">
        <h2>Bank Account Safety Checklist</h2>
        <div class="score-line"><strong>Bank safety score:</strong> {{ checklistScore(bankChecklist) }}%</div>
        <div class="check-list">
          <label *ngFor="let item of bankChecklist">
            <input type="checkbox" [(ngModel)]="item.checked">
            {{ item.label }}
          </label>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'lost-phone'">
        <h2>Lost Phone Emergency Lockdown</h2>
        <p>If your phone is lost, protect OTPs, UPI, WhatsApp, and bank accounts first.</p>
        <div class="check-list numbered">
          <label *ngFor="let item of lostPhoneChecklist">
            <input type="checkbox" [(ngModel)]="item.checked">
            {{ item.label }}
          </label>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'family-safety'">
        <h2>Family Safety Mode</h2>
        <div class="form-grid">
          <label>Family safe word <input [(ngModel)]="family.safeWord"></label>
          <label>Trusted contact 1 <input [(ngModel)]="family.contact1"></label>
          <label>Trusted contact 2 <input [(ngModel)]="family.contact2"></label>
          <label class="wide">Family rule <textarea rows="3" [(ngModel)]="family.rule"></textarea></label>
        </div>
        <div class="summary-box">
          <pre>{{ familyPlan() }}</pre>
          <button class="btn primary" (click)="copyText(familyPlan())">Copy Family Plan</button>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'scam-scripts'">
        <h2>Scam Call Script Library</h2>
        <div class="script-grid">
          <article *ngFor="let script of scamScripts">
            <h3>{{ script.title }}</h3>
            <blockquote>{{ script.script }}</blockquote>
            <p><strong>Response:</strong> {{ script.response }}</p>
          </article>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'weekly-plan'">
        <h2>Cyber Hygiene Weekly Plan</h2>
        <div class="score-line"><strong>Progress:</strong> {{ checklistScore(weeklyPlan) }}%</div>
        <div class="check-list">
          <label *ngFor="let item of weeklyPlan">
            <input type="checkbox" [(ngModel)]="item.checked">
            {{ item.label }}
          </label>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'complaint-tracker'">
        <h2>Complaint Status Tracker</h2>
        <p>Saved only in this browser. Do not store passwords or full bank details here.</p>
        <div class="form-grid">
          <label>Acknowledgement no. <input [(ngModel)]="trackerForm.acknowledgement"></label>
          <label>Bank ticket no. <input [(ngModel)]="trackerForm.bankTicket"></label>
          <label>Police contact <input [(ngModel)]="trackerForm.policeContact"></label>
          <label>Follow-up date <input type="date" [(ngModel)]="trackerForm.followUpDate"></label>
          <label class="wide">Note <textarea rows="3" [(ngModel)]="trackerForm.note"></textarea></label>
        </div>
        <button class="btn primary" (click)="saveComplaintRecord()">Save Tracker Entry</button>
        <div class="records" *ngIf="complaintRecords().length">
          <article *ngFor="let record of complaintRecords()">
            <strong>{{ record.acknowledgement || 'No acknowledgement added' }}</strong>
            <p>Bank: {{ record.bankTicket || 'N/A' }} | Follow-up: {{ record.followUpDate || 'N/A' }}</p>
            <p>{{ record.note }}</p>
          </article>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'app-permission'">
        <h2>Fake App Permission Risk Checker</h2>
        <div class="form-grid">
          <label>App type
            <select [(ngModel)]="appType">
              <option value="loan">Loan app</option>
              <option value="calculator">Calculator / utility</option>
              <option value="shopping">Shopping app</option>
              <option value="banking">Banking app</option>
            </select>
          </label>
        </div>
        <div class="check-list compact">
          <label *ngFor="let permission of permissions">
            <input type="checkbox" [checked]="selectedPermissions().has(permission)" (change)="togglePermission(permission)">
            {{ permission }}
          </label>
        </div>
        <div class="result-card" [class.urgent]="permissionRisk().level === 'High risk'">
          <h3>{{ permissionRisk().level }}</h3>
          <ul><li *ngFor="let reason of permissionRisk().reasons">{{ reason }}</li></ul>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'shop-qr'">
        <h2>UPI QR Tampering Checker For Shops</h2>
        <div class="score-line"><strong>Shop QR safety:</strong> {{ checklistScore(shopQrChecklist) }}%</div>
        <div class="check-list">
          <label *ngFor="let item of shopQrChecklist">
            <input type="checkbox" [(ngModel)]="item.checked">
            {{ item.label }}
          </label>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'student-contract'">
        <h2>Children And Student Safety Contract</h2>
        <div class="form-grid">
          <label>Student name <input [(ngModel)]="student.name"></label>
          <label>Parent/teacher name <input [(ngModel)]="student.guardian"></label>
        </div>
        <div class="summary-box">
          <pre>{{ studentContract() }}</pre>
          <button class="btn primary" (click)="copyText(studentContract())">Copy Contract</button>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'loss-calculator'">
        <h2>Fraud Loss Calculator</h2>
        <div class="form-grid">
          <label>Amount lost <input type="number" [(ngModel)]="loss.amount"></label>
          <label>Fraud type
            <select [(ngModel)]="loss.type">
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Investment">Investment</option>
              <option value="Job">Job scam</option>
            </select>
          </label>
          <label>Time since transfer
            <select [(ngModel)]="loss.time">
              <option value="hour">Under 1 hour</option>
              <option value="day">Same day</option>
              <option value="late">More than 24 hours</option>
            </select>
          </label>
        </div>
        <div class="result-card urgent">
          <h3>{{ lossAdvice().title }}</h3>
          <p>{{ lossAdvice().message }}</p>
        </div>
      </section>

      <section class="panel" *ngIf="activeSection() === 'trusted-links'">
        <h2>Trusted Official Links Directory</h2>
        <div class="links-grid">
          <a *ngFor="let link of trustedLinks" [href]="link.url" target="_blank" rel="noopener">
            <strong>{{ link.name }}</strong>
            <span>{{ link.use }}</span>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .toolkit-page { max-width: 1180px; margin: 0 auto; padding: 32px 16px; }
    .hero { background: linear-gradient(135deg, var(--primary), #1e293b); color: white; border-radius: 12px; padding: 42px; }
    .eyebrow { color: var(--accent-saffron); font-weight: 900; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 8px; }
    .hero h1 { font-size: 2.4rem; margin: 0 0 12px; max-width: 760px; }
    .hero p { color: #dbe4ef; max-width: 760px; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
    .btn { display: inline-flex; justify-content: center; align-items: center; border: 1px solid transparent; border-radius: 8px; min-height: 42px; padding: 10px 16px; font-weight: 800; text-decoration: none; cursor: pointer; }
    .btn.danger { background: var(--danger); color: white; }
    .btn.primary { background: var(--accent-saffron); color: var(--primary); }
    .btn.secondary { background: white; color: var(--primary); border-color: #e2e8f0; }
    .section-nav { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin: 24px 0; }
    .section-nav button { text-align: left; border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 10px; padding: 14px; cursor: pointer; }
    .section-nav button.active { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(255,153,51,.25); }
    .section-nav span { display: block; color: var(--muted); margin-top: 4px; font-size: .9rem; }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 28px; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin: 18px 0; }
    label { display: grid; gap: 6px; font-weight: 700; }
    input, select, textarea { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); }
    textarea { resize: vertical; }
    .wide { grid-column: 1 / -1; }
    .result-card, .summary-box { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-top: 18px; }
    .result-card.urgent { border-left: 5px solid var(--danger); }
    pre { white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
    .two-col, .script-grid, .links-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .check-list { display: grid; gap: 10px; margin-top: 16px; }
    .check-list label { display: flex; align-items: flex-start; gap: 10px; background: var(--bg); border-radius: 8px; padding: 12px; }
    .check-list input { width: auto; margin-top: 3px; }
    .check-list.compact { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
    .score-line { margin: 12px 0; padding: 12px; background: var(--bg); border-radius: 8px; }
    blockquote { margin: 10px 0; padding: 12px; border-left: 4px solid var(--accent-saffron); background: var(--bg); }
    .records article, .script-grid article { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px; }
    .records { display: grid; gap: 10px; margin-top: 16px; }
    .links-grid a { display: grid; gap: 6px; text-decoration: none; color: var(--text); background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
    .links-grid a:hover { border-color: var(--primary); }
    .links-grid span { color: var(--muted); }
    @media (max-width: 640px) {
      .hero { padding: 26px; }
      .hero h1 { font-size: 1.9rem; }
      .btn { width: 100%; }
      .panel { padding: 20px; }
    }
  `]
})
export class CitizenSafetyToolkitComponent {
  activeSection = signal('golden-hour');
  fraudType = 'upi';
  fraudWindow = 'hour';
  messageText = '';
  appType = 'loan';
  selectedPermissions = signal(new Set<string>());
  complaintRecords = signal<ComplaintRecord[]>(this.loadComplaintRecords());

  evidence = {
    number: '',
    identifier: '',
    utr: '',
    amount: null as number | null,
    dateTime: '',
    description: ''
  };

  family = {
    safeWord: '',
    contact1: '',
    contact2: '',
    rule: 'No family member will transfer money on an urgent call without confirming the safe word.'
  };

  trackerForm: Omit<ComplaintRecord, 'id'> = {
    acknowledgement: '',
    bankTicket: '',
    policeContact: '',
    followUpDate: '',
    note: ''
  };

  student = { name: '', guardian: '' };
  loss = { amount: null as number | null, type: 'UPI', time: 'hour' };

  sections: ToolkitSection[] = [
    { id: 'golden-hour', title: 'Golden Hour Recovery', desc: 'First 60-minute fraud steps' },
    { id: 'evidence-builder', title: 'Evidence Builder', desc: 'Complaint summary generator' },
    { id: 'message-analyzer', title: 'Message Analyzer', desc: 'SMS and WhatsApp risk check' },
    { id: 'digital-arrest', title: 'Digital Arrest Defender', desc: 'Fake police call guidance' },
    { id: 'bank-safety', title: 'Bank Safety Checklist', desc: 'UPI, cards, alerts, limits' },
    { id: 'lost-phone', title: 'Lost Phone Lockdown', desc: 'SIM, UPI, device, IMEI steps' },
    { id: 'family-safety', title: 'Family Safety Mode', desc: 'Safe word and trusted contacts' },
    { id: 'scam-scripts', title: 'Scam Script Library', desc: 'Common call scripts' },
    { id: 'weekly-plan', title: 'Weekly Hygiene Plan', desc: '7-day security checklist' },
    { id: 'complaint-tracker', title: 'Complaint Tracker', desc: 'Local follow-up tracker' },
    { id: 'app-permission', title: 'App Permission Risk', desc: 'Fake app permission check' },
    { id: 'shop-qr', title: 'Shop QR Tampering', desc: 'UPI QR safety for shops' },
    { id: 'student-contract', title: 'Student Contract', desc: 'Family and school rules' },
    { id: 'loss-calculator', title: 'Fraud Loss Calculator', desc: 'Urgency by amount and time' },
    { id: 'trusted-links', title: 'Trusted Links', desc: 'Official safety portals' }
  ];

  bankChecklist: ChecklistItem[] = [
    { id: 'b1', label: 'UPI daily limit reviewed and reduced where possible.', checked: false },
    { id: 'b2', label: 'International card transactions disabled unless needed.', checked: false },
    { id: 'b3', label: 'Card tap-to-pay and online limits reviewed.', checked: false },
    { id: 'b4', label: 'SMS/email alerts enabled for every transaction.', checked: false },
    { id: 'b5', label: 'Banking app protected with biometric/PIN app lock.', checked: false },
    { id: 'b6', label: 'No banking OTP visible on lock screen.', checked: false }
  ];

  lostPhoneChecklist: ChecklistItem[] = [
    { id: 'l1', label: 'Call telecom provider and block the SIM immediately.', checked: false },
    { id: 'l2', label: 'Use Google Find My Device or iCloud Find Devices to lock/erase phone.', checked: false },
    { id: 'l3', label: 'Call bank to block UPI and mobile banking.', checked: false },
    { id: 'l4', label: 'Log out Gmail, WhatsApp, Instagram, and payment apps from other devices.', checked: false },
    { id: 'l5', label: 'File police complaint and block IMEI on CEIR/Sanchar Saathi.', checked: false }
  ];

  weeklyPlan: ChecklistItem[] = [
    { id: 'w1', label: 'Day 1: Turn on 2FA for email and WhatsApp.', checked: false },
    { id: 'w2', label: 'Day 2: Review UPI and card transaction limits.', checked: false },
    { id: 'w3', label: 'Day 3: Lock social media privacy settings.', checked: false },
    { id: 'w4', label: 'Day 4: Update phone, browser, and banking apps.', checked: false },
    { id: 'w5', label: 'Day 5: Remove unused apps and permissions.', checked: false },
    { id: 'w6', label: 'Day 6: Back up important photos and contacts.', checked: false },
    { id: 'w7', label: 'Day 7: Teach family the safe word and 1930 rule.', checked: false }
  ];

  shopQrChecklist: ChecklistItem[] = [
    { id: 'q1', label: 'QR sticker physically checked for tampering today.', checked: false },
    { id: 'q2', label: 'UPI ID in QR matches shop/bank account.', checked: false },
    { id: 'q3', label: 'Staff know to verify payment received in official app only.', checked: false },
    { id: 'q4', label: 'Old/damaged QR stickers removed from counter.', checked: false },
    { id: 'q5', label: 'Customer-facing QR is laminated or placed behind clear cover.', checked: false }
  ];

  permissions = ['Contacts', 'SMS', 'Call logs', 'Camera', 'Microphone', 'Location', 'Files/photos', 'Accessibility', 'Notification access'];

  scamScripts = [
    { title: 'Parcel contains illegal items', script: 'Your courier has drugs/passports. You are under digital arrest.', response: 'Disconnect. Real agencies do not clear cases through UPI or video calls.' },
    { title: 'SIM will be blocked', script: 'TRAI will block your number in two hours. Press 9.', response: 'Do not press buttons. Call your telecom operator through the official app or number.' },
    { title: 'KYC update required', script: 'Your bank wallet KYC is expired. Install this app to update.', response: 'Never install remote access apps. Use official app or branch only.' },
    { title: 'Part-time task job', script: 'Like videos and earn daily income. Pay fee to unlock premium task.', response: 'Stop immediately. Real jobs do not ask candidates to pay.' },
    { title: 'Investment guarantee', script: 'Double your money in 15 days with expert trading signals.', response: 'No legitimate investment guarantees returns. Verify SEBI registration.' }
  ];

  trustedLinks = [
    { name: 'National Cyber Crime Portal', use: 'File official cybercrime complaints', url: 'https://cybercrime.gov.in' },
    { name: '1930 Cybercrime Helpline', use: 'Call immediately for financial fraud', url: 'tel:1930' },
    { name: 'Sanchar Saathi / CEIR', use: 'Block lost phone IMEI and check mobile connections', url: 'https://sancharsaathi.gov.in' },
    { name: 'UIDAI My Aadhaar', use: 'Lock biometrics and manage Aadhaar safety', url: 'https://myaadhaar.uidai.gov.in' },
    { name: 'RBI Sachet', use: 'Report suspicious deposits and financial schemes', url: 'https://sachet.rbi.org.in' },
    { name: 'SEBI Investor Alerts', use: 'Check investment warnings and investor resources', url: 'https://investor.sebi.gov.in' },
    { name: 'CERT-In', use: 'Indian computer emergency advisories', url: 'https://www.cert-in.org.in' }
  ];

  goldenHourResult() {
    const common = [
      'Call 1930 and request transaction freeze support.',
      'Call your bank/card issuer official helpline and ask for freeze or dispute.',
      'Collect UTR, screenshots, phone number, UPI ID, bank SMS, and timeline.',
      'File complaint on cybercrime.gov.in and save acknowledgement number.'
    ];
    if (this.fraudWindow === 'hour') return { title: 'Act immediately. This is the highest recovery window.', steps: common };
    if (this.fraudWindow === 'day') return { title: 'Act today. Freezing may still be possible.', steps: common };
    return { title: 'Still report. Focus on evidence and follow-up.', steps: common.slice(1) };
  }

  messageAnalysis() {
    const text = this.messageText.toLowerCase();
    const findings: string[] = [];
    if (!text.trim()) return { risk: 'No message entered', findings: ['Paste a suspicious message to analyze it.'], action: 'No action yet.' };
    if (/(otp|pin|cvv|password|aadhaar|pan)/.test(text)) findings.push('Requests sensitive identity or banking information.');
    if (/(kyc|blocked|suspended|last chance|immediately|arrest)/.test(text)) findings.push('Uses urgency, fear, or account-blocking pressure.');
    if (/(courier|parcel|customs|police|cbi|trai)/.test(text)) findings.push('Matches common authority/courier impersonation scams.');
    if (/(pay|upi|fee|tax|unlock|refund|processing)/.test(text)) findings.push('Mentions payment, fee, refund, or transfer pressure.');
    if (/(job|task|telegram|investment|guaranteed|double)/.test(text)) findings.push('Matches job, task, or investment scam patterns.');
    return {
      risk: findings.length >= 2 ? 'High risk' : findings.length === 1 ? 'Verify carefully' : 'No major pattern found',
      findings: findings.length ? findings : ['No strong scam pattern detected. Unknown does not mean safe.'],
      action: findings.length ? 'Do not click, pay, or share OTP. Preserve evidence and report if money was lost.' : 'Verify through official channels before trusting it.'
    };
  }

  permissionRisk() {
    const selected = this.selectedPermissions();
    const reasons: string[] = [];
    if (this.appType === 'loan' && (selected.has('Contacts') || selected.has('Files/photos') || selected.has('SMS'))) reasons.push('Loan apps abusing contacts, SMS, or photos are high extortion risk.');
    if (this.appType === 'calculator' && (selected.has('Camera') || selected.has('Microphone') || selected.has('Contacts'))) reasons.push('Utility apps should not need camera, microphone, or contacts.');
    if (selected.has('Accessibility')) reasons.push('Accessibility access can let malicious apps read screens and control actions.');
    if (selected.has('Notification access')) reasons.push('Notification access can expose OTPs and private alerts.');
    return { level: reasons.length ? 'High risk' : 'Lower risk', reasons: reasons.length ? reasons : ['Selected permissions look reasonable for the chosen app type.'] };
  }

  lossAdvice() {
    const amount = this.loss.amount || 0;
    if (this.loss.time === 'hour') return { title: 'Immediate action needed', message: `For ${this.loss.type} loss of Rs ${amount}, call 1930 now and contact your bank before doing anything else.` };
    if (this.loss.time === 'day') return { title: 'Same-day reporting is still urgent', message: `For Rs ${amount}, contact bank, collect evidence, and file cybercrime complaint today.` };
    return { title: 'Report and preserve evidence', message: `For Rs ${amount}, recovery may be harder, but complaint and evidence are still important.` };
  }

  checklistScore(items: ChecklistItem[]): number {
    if (!items.length) return 0;
    return Math.round((items.filter(item => item.checked).length / items.length) * 100);
  }

  complaintSummary(): string {
    return [
      'Cybercrime complaint summary',
      `Scam number: ${this.evidence.number || 'Not provided'}`,
      `UPI/account/URL/profile: ${this.evidence.identifier || 'Not provided'}`,
      `UTR / transaction ID: ${this.evidence.utr || 'Not provided'}`,
      `Amount lost: Rs ${this.evidence.amount || 0}`,
      `Date/time: ${this.evidence.dateTime || 'Not provided'}`,
      `Description: ${this.evidence.description || 'Not provided'}`,
      'Evidence attached/available: screenshots, bank SMS, chat history, call logs, and transaction proof.'
    ].join('\n');
  }

  familyPlan(): string {
    return [
      'Family cyber safety plan',
      `Safe word: ${this.family.safeWord || 'Set a private safe word'}`,
      `Trusted contact 1: ${this.family.contact1 || 'Not set'}`,
      `Trusted contact 2: ${this.family.contact2 || 'Not set'}`,
      `Rule: ${this.family.rule}`,
      'Emergency rule: If money is lost, call 1930 immediately.'
    ].join('\n');
  }

  studentContract(): string {
    return [
      'Student cyber safety contract',
      `Student: ${this.student.name || 'Student name'}`,
      `Parent/teacher: ${this.student.guardian || 'Guardian name'}`,
      '1. I will not share OTP, passwords, private photos, or location with strangers.',
      '2. I will tell a trusted adult about bullying, blackmail, or suspicious chats.',
      '3. I will ask before paying, downloading unknown apps, or joining unknown groups.',
      '4. I understand that online threats should be reported, not hidden.'
    ].join('\n');
  }

  togglePermission(permission: string): void {
    const next = new Set(this.selectedPermissions());
    next.has(permission) ? next.delete(permission) : next.add(permission);
    this.selectedPermissions.set(next);
  }

  async copyText(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
  }

  saveComplaintRecord(): void {
    const record: ComplaintRecord = { id: Date.now().toString(), ...this.trackerForm };
    const records = [record, ...this.complaintRecords()].slice(0, 10);
    this.complaintRecords.set(records);
    localStorage.setItem('safeclick_complaint_tracker', JSON.stringify(records));
    this.trackerForm = { acknowledgement: '', bankTicket: '', policeContact: '', followUpDate: '', note: '' };
  }

  private loadComplaintRecords(): ComplaintRecord[] {
    try {
      const raw = localStorage.getItem('safeclick_complaint_tracker');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
