import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from './core/services/translation.service';
import { ThemeService } from './core/services/theme.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './core/pipes/translate.pipe';
import { NotificationBellComponent } from './shared/components/notification-bell/notification-bell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TranslatePipe],
  template: `
    <header>
      <div class="container nav-container">
        <a routerLink="/" class="logo">
          <img src="assets/images/logo.png" alt="Cycysafeclick Logo" class="logo-img">
          Cycysafeclick
        </a>

        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">{{ 'NAV.HOME' | translate }}</a>
          <a routerLink="/ai-tools" routerLinkActive="active" style="color: var(--accent-saffron); font-weight: bold;">AI Tools ✨</a>
          <a routerLink="/tools/cyber-mitra" routerLinkActive="active">{{ 'NAV.CYBER_MITRA' | translate }}</a>
          <a routerLink="/senior" routerLinkActive="active" class="senior-link">{{ 'NAV.SENIOR_MODE' | translate }}</a>
        </nav>

        <div class="controls">
          <button (click)="t.toggleLanguage()" class="btn-lang">
            {{ t.currentLang() === 'en' ? 'हिंदी' : 'EN' }}
          </button>
          <button (click)="theme.toggleTheme()" class="btn-icon">
            {{ theme.darkMode() ? '☀️' : '🌙' }}
          </button>
        </div>
      </div>
    </header>
    <main class="content-wrap">
      <router-outlet></router-outlet>
    </main>

    <footer>
      <div class="container footer-bottom">
        <div class="footer-grid">
          <div>
            <strong>Cycysafeclick Cyber Safety</strong>
            <p>Educational guidance for awareness only. We do not collect or store your inputs on our servers. Not affiliated with any government or bank.</p>
            <p>Official complaints must be filed through 1930, cybercrime.gov.in, banks, or police.</p>
          </div>
          <div class="footer-links">
            <a href="tel:1930">Call 1930</a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener">Cybercrime Portal</a>
            <a routerLink="/report-cybercrime">Report Guide</a>
            <a routerLink="/tools/incident-response">Incident Playbooks</a>
            <a routerLink="/privacy">Privacy</a>
            <a routerLink="/terms">Terms</a>
          </div>
        </div>
        <p class="copyright">&copy; 2026 Cybersecurity Awareness Portal</p>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .content-wrap {
      flex: 1;
    }
    header {
      background-color: var(--primary);
      color: white;
      padding: 16px 0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--accent-saffron);
    }
    .logo-img {
      width: 64px;
      height: 64px;
      object-fit: contain;
      filter: drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.9)) drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.4));
      transition: transform 0.2s ease;
    }
    .logo-img:hover {
      transform: scale(1.05);
    }
    .nav-links {
      display: flex;
      gap: 24px;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
    }
    .nav-links a.active {
      color: var(--accent-saffron);
      border-bottom: 2px solid var(--accent-saffron);
    }
    .senior-link {
      background: rgba(255, 255, 255, 0.1);
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: bold;
    }
    .controls {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .btn-lang {
      background: var(--accent-saffron);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      border: none;
    }
    .btn-icon {
      background: transparent;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: white;
    }
    footer {
      background: var(--primary);
      color: white;
      padding: 40px 0;
      margin-top: 60px;
    }
    .footer-bottom {
      text-align: left;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 32px;
      align-items: start;
    }
    .footer-grid p {
      color: #cbd5e1;
      max-width: 680px;
      margin: 8px 0 0;
    }
    .footer-links {
      display: grid;
      gap: 8px;
      min-width: 180px;
    }
    .footer-links a {
      color: white;
      text-decoration: none;
      font-weight: 700;
    }
    .footer-links a:hover {
      color: var(--accent-saffron);
    }
    .copyright {
      text-align: center;
      color: #cbd5e1;
      margin: 28px 0 0;
    }
    @media (max-width: 700px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent {
  constructor(public t: TranslationService, public theme: ThemeService) {}
}
