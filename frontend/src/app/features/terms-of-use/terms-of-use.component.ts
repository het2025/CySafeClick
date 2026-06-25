import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container legal-page">
      <h1>Terms of Use</h1>
      <p>SafeClick provides educational cybersecurity awareness content only. By using this site, you agree to the terms below.</p>

      <h2>Educational purpose</h2>
      <p>Content and tools are for awareness and self‑help only. They do not constitute legal, financial, or professional advice.</p>

      <h2>No affiliation</h2>
      <p>SafeClick is not affiliated with, sponsored by, or endorsed by any government body, bank, telecom operator, payment platform, CERT-In, RBI, TRAI, police, or law‑enforcement agency. Names and links are provided only to help users find official resources.</p>

      <h2>No allegations database</h2>
      <p>Do not use SafeClick to publish accusations, phone numbers, UPI IDs, emails, websites, or other identifiers of alleged scammers. Community reporting and public identifier lookup features are disabled.</p>

      <h2>Accuracy limits</h2>
      <p>Risk scores and detectors are heuristic educational tools. A “safe” result does not guarantee safety, and a warning does not prove wrongdoing by any person or organization.</p>

      <h2>Use at your own risk</h2>
      <p>We provide tools on an “as‑is” basis without warranties. You are responsible for how you use the information.</p>

      <h2>Official reporting</h2>
      <p>For financial fraud or cybercrime reporting in India, use official channels such as 1930, cybercrime.gov.in, your bank, and local police. Preserve evidence privately and avoid public accusations.</p>

      <h2>Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, SafeClick and its contributors shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this platform or reliance on its content. This includes but is not limited to financial losses, data breaches, or decisions made based on tool outputs.</p>

      <h2>Governing Law & Jurisdiction</h2>
      <p>These terms are governed by the laws of India, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
    </div>
  `,
  styles: [`
    .legal-page { padding: 40px 0; max-width: 820px; }
    h2 { margin-top: 24px; }
  `]
})
export class TermsOfUseComponent {}
