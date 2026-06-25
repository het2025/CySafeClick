import { Component, input } from '@angular/core';

@Component({
  selector: 'app-share-card',
  standalone: true,
  template: `
    <div class="share-card-wrapper" id="share-card-container">
      <div class="share-card">
        <div class="header">
          <span class="logo">CySafeClick Shield</span>
        </div>
        <div class="content">
          <h3>{{ title() }}</h3>
          <p>{{ description() }}</p>
        </div>
        <div class="footer">
          <span>apni digital suraksha, apne haath mein</span>
        </div>
      </div>
      <button class="btn-primary" (click)="share()" aria-label="Share this card">Share</button>
    </div>
  `,
  styles: [`
    .share-card-wrapper { display: flex; flex-direction: column; gap: 16px; align-items: center; }
    .share-card { width: 300px; background: linear-gradient(135deg, var(--primary) 0%, #1e293b 100%); color: white; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2); border: 2px solid var(--accent-saffron); }
    .header { margin-bottom: 16px; font-weight: bold; color: var(--accent-saffron); }
    .content h3 { font-size: 1.5rem; margin-bottom: 8px; }
    .content p { font-size: 0.9rem; color: #cbd5e1; }
    .footer { margin-top: 24px; font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; text-align: center; }
    .btn-primary { background: var(--accent-saffron); color: var(--primary); padding: 8px 24px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; }
  `]
})
export class ShareCardComponent {
  title = input.required<string>();
  description = input.required<string>();

  share() {
    if (navigator.share) {
      navigator.share({
        title: 'CySafeClick Security Awareness',
        text: `${this.title()} - ${this.description()}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      alert('Sharing is not supported on this browser. Try copying the link!');
    }
  }
}
