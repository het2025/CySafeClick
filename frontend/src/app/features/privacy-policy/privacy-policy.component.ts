import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container legal-page">
      <h1>Privacy Policy</h1>
      <p>SafeClick is an educational cybersecurity awareness portal. The public version is designed to avoid collecting personal data on SafeClick servers.</p>

      <h2>What we process locally</h2>
      <ul>
        <li>Most tools run entirely in your browser.</li>
        <li>Some features store data locally on your device, such as language preference, theme, notification preferences, safety progress, chat history, complaint checklist notes, and encrypted vault notes.</li>
        <li>Local browser storage is not sent to SafeClick servers, but anyone with access to your device or browser profile may be able to access it.</li>
        <li>You can clear this data anytime using your browser settings.</li>
      </ul>

      <h2>Server-side collection</h2>
      <p>Public scam-number, UPI, email, website, and community report submissions are disabled. The backend returns disabled responses for these endpoints and does not create public report records.</p>

      <h2>No public databases</h2>
      <p>We do not publish or maintain a public database of alleged scammer identifiers. Do not submit personal data about yourself or another person through SafeClick tools.</p>

      <h2>Third-party services</h2>
      <p>The password breach checker uses the Pwned Passwords API with k-anonymity. Only a SHA-1 hash prefix is sent to that service; your full password is never transmitted by SafeClick.</p>

      <h2>External links</h2>
      <p>We link to official resources such as cybercrime.gov.in, RBI, CERT-In, and other public authorities. Those sites have their own privacy policies. SafeClick is not affiliated with, sponsored by, or endorsed by those organizations.</p>

      <h2>Browser extension</h2>
      <p>The extension should be distributed only with narrow permissions and clear store disclosures. The current safe configuration does not inject scripts into every website automatically.</p>

      <h2>Not legal advice</h2>
      <p>All content is general information only and should not be treated as legal, financial, law-enforcement, or professional advice. Get local legal review before public launch.</p>

      <h2>Compliance with Indian Data Protection Laws</h2>
      <p>SafeClick is designed to comply with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the <strong>Information Technology Act, 2000</strong>. We follow the principles of purpose limitation, data minimization, and storage limitation.</p>
      <ul>
        <li><strong>Lawful Purpose (Section 4):</strong> Any data processing is for the legitimate purpose of cybersecurity awareness education.</li>
        <li><strong>Notice & Consent (Sections 5-6):</strong> This privacy policy serves as notice. Tools that process data do so only upon explicit user action (e.g., clicking "Analyze").</li>
        <li><strong>Data Retention:</strong> SafeClick does not retain personal data on servers. All client-side data can be cleared via browser settings at any time.</li>
        <li><strong>Data Minimization:</strong> Only the minimum data required for each tool's function is processed, and only in the user's browser.</li>
      </ul>

      <h2>Data Protection Officer</h2>
      <p>For any data protection concerns or requests under the DPDP Act 2023, please contact:</p>
      <ul>
        <li><strong>Email:</strong> dpo&#64;safeclick-project.in</li>
        <li><strong>Subject Line:</strong> "DPDP Act Request — [Your Query]"</li>
        <li>We will respond within 30 days as required under the Act.</li>
      </ul>

      <h2>Grievance Redressal</h2>
      <p>If you have any complaints regarding data handling or content on this platform, you may reach the Grievance Officer at the email above. We are committed to resolving all grievances within the timelines prescribed under the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>.</p>

      <h2>Governing Law & Jurisdiction</h2>
      <p>These policies are governed by and construed in accordance with the laws of India. Any disputes arising from the use of this platform shall be subject to the exclusive jurisdiction of courts in India.</p>
    </div>
  `,
  styles: [`
    .legal-page { padding: 40px 0; max-width: 820px; }
    h2 { margin-top: 24px; }
    ul { padding-left: 20px; }
  `]
})
export class PrivacyPolicyComponent {}
