import { Component } from '@angular/core';

@Component({
  selector: 'app-scam-awareness',
  standalone: true,
  template: `
    <div class="container scam-page">
      <h1>Scam Awareness</h1>
      <div class="grid">
        <div class="scam-card">
          <h3>OTP Scams</h3>
          <p>Scammers call claiming to be bank officials to steal your OTP.</p>
          <strong>Rule: Never share OTP with anyone.</strong>
        </div>
        <div class="scam-card">
          <h3>KYC Scams</h3>
          <p>Fake SMS claiming your KYC has expired.</p>
          <strong>Rule: Always use the official bank app.</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scam-page { padding: 40px 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 32px; }
    .scam-card { background: var(--surface); padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  `]
})
export class ScamAwarenessComponent {}
