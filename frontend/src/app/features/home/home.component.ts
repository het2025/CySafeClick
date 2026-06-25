import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { FraudTickerComponent } from '../../shared/components/fraud-ticker/fraud-ticker.component';
import { FraudTickerService } from '../../core/services/fraud-ticker.service';
import { ThreatMapWidgetComponent } from '../../shared/components/threat-map-widget/threat-map-widget.component';
import { WeeklyDigestWidgetComponent } from '../../shared/components/weekly-digest-widget/weekly-digest-widget.component';
import { PersonalizedAlertBannerComponent } from '../../shared/components/personalized-alert-banner/personalized-alert-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslatePipe, FraudTickerComponent, ThreatMapWidgetComponent, WeeklyDigestWidgetComponent, PersonalizedAlertBannerComponent],
  template: `
    <safeclick-fraud-ticker></safeclick-fraud-ticker>
    <section class="hero">
      <div class="container">
        <h1>{{ 'HERO.TITLE' | translate }}</h1>
        <p>{{ 'HERO.SUBTITLE' | translate }}</p>
        <a routerLink="/tools/safety-score" class="btn-cta">{{ 'HERO.CTA' | translate }}</a>
        

        <div class="counter-box">
          <span class="counter-value">{{ counter().toLocaleString() }}</span>
          <p>Visitors on SafeClick 🇮🇳</p>
        </div>
      </div>
    </section>

    <section class="container featured-section">
      <h2 class="section-title">⭐ {{ 'FEATURED.TITLE' | translate }}</h2>
      <p class="section-desc">{{ 'FEATURED.DESC' | translate }}</p>
      <div class="featured-grid">
        <!-- SafeClick AI Tools Hub -->
        <a routerLink="/ai-tools" class="featured-card ai-feature" style="grid-column: 1 / -1; border-color: #a855f7; background: linear-gradient(135deg, rgba(255,153,51,0.05), rgba(168,85,247,0.05));">
          <div class="card-icon">🤖✨</div>
          <div class="card-content" style="max-width: 600px; margin: 0 auto;">
            <span style="background: linear-gradient(135deg, var(--accent-saffron), #a855f7); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; margin-bottom: 10px; display: inline-block;">NEW: Advanced AI Powered Tools</span>
            <h3>SafeClick AI Tools Hub</h3>
            <p>Access our next-generation cyber safety features: Scam Message Analyzer, Cyber Mitra Chatbot, and Transaction Risk Checker.</p>
          </div>
          <span class="btn-go" style="max-width: 200px; margin: 0 auto;">Explore AI Tools →</span>
        </a>

        <a routerLink="/tools/upi-scanner" class="featured-card">
          <div class="card-icon">📱</div>
          <div class="card-content">
            <h3>{{ 'FEATURED.UPI.TITLE' | translate }}</h3>
            <p>{{ 'FEATURED.UPI.DESC' | translate }}</p>
          </div>
          <span class="btn-go">{{ 'FEATURED.UPI.BTN' | translate }}</span>
        </a>
        
        <a routerLink="/tools/privacy-audit" class="featured-card">
          <div class="card-icon">🔒</div>
          <div class="card-content">
            <h3>{{ 'FEATURED.PRIVACY.TITLE' | translate }}</h3>
            <p>{{ 'FEATURED.PRIVACY.DESC' | translate }}</p>
          </div>
          <span class="btn-go">{{ 'FEATURED.PRIVACY.BTN' | translate }}</span>
        </a>
        
        <a routerLink="/learn/30-day-plan" class="featured-card roadmap-feature">
          <div class="card-icon">📅</div>
          <div class="card-content">
            <h3>{{ 'FEATURED.ROADMAP.TITLE' | translate }}</h3>
            <p>{{ 'FEATURED.ROADMAP.DESC' | translate }}</p>
          </div>
          <span class="btn-go">{{ 'FEATURED.ROADMAP.BTN' | translate }}</span>
        </a>
      </div>
    </section>

    <section class="container tools-section">
      <h2 class="section-title">{{ 'TOOLS.TITLE' | translate }}</h2>
      
      <div class="category-tabs">
        <button [class.active]="selectedCategory() === 'all'" (click)="selectedCategory.set('all')">All</button>
        <button [class.active]="selectedCategory() === 'emergency'" (click)="selectedCategory.set('emergency')">Emergency Help</button>
        <button [class.active]="selectedCategory() === 'tools'" (click)="selectedCategory.set('tools')">Scam Checkers</button>
        <button [class.active]="selectedCategory() === 'learn'" (click)="selectedCategory.set('learn')">{{ 'TOOLS.CAT_LEARN' | translate }}</button>
        <button [class.active]="selectedCategory() === 'community'" (click)="selectedCategory.set('community')">Community Reports</button>
        <button [class.active]="selectedCategory() === 'modes'" (click)="selectedCategory.set('modes')">Senior / Student / Business</button>
      </div>

      <div class="tool-grid">
        <ng-container *ngFor="let tool of filteredTools()">
          <a [routerLink]="tool.link" class="tool-card">
            <div class="tool-icon">{{ tool.icon }}</div>
            <h3>{{ tool.titleKey | translate }}</h3>
            <span class="btn-tool">{{ 'TOOLS.OPEN' | translate }}</span>
          </a>
        </ng-container>
      </div>
    </section>

    <div class="container">
      <safeclick-personalized-alert-banner></safeclick-personalized-alert-banner>
      <safeclick-weekly-digest-widget></safeclick-weekly-digest-widget>
    </div>

    <section class="container map-section">
      <safeclick-threat-map-widget></safeclick-threat-map-widget>
    </section>
  `,
  styles: [`
    .hero {
      padding: 80px 0;
      text-align: center;
      background: linear-gradient(135deg, var(--primary) 0%, #1e293b 100%);
      color: white;
    }
    .hero h1 { font-size: 3.5rem; margin-bottom: 16px; }
    .hero p { font-size: 1.2rem; color: #cbd5e1; max-width: 600px; margin: 0 auto 32px; line-height: 1.6; }
    .btn-cta {
      display: inline-block;
      background: var(--accent-saffron);
      color: var(--primary);
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 153, 51, 0.3); }
    .counter-box { margin-top: 48px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px; max-width: 300px; margin-left: auto; margin-right: auto; }
    .counter-value { font-size: 3rem; color: var(--accent-saffron); font-weight: 900; line-height: 1; }
    .counter-box p { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-top: 8px; }
    
    .alert-counter {
      display: inline-flex; align-items: center; gap: 8px;
      margin: 24px auto 0; padding: 12px 24px; border-radius: 8px;
      font-weight: bold; font-size: 1.1rem;
      background: rgba(255,255,255,0.1); color: white;
      
      &.critical { background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; }
      &.alert { background: rgba(249, 115, 22, 0.2); border: 1px solid #f97316; color: #fdba74; }
      &.warning { background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #fcd34d; }
    }
    
    .section-title { text-align: center; color: var(--text); margin-bottom: 8px; font-size: 2rem; }
    .section-desc { text-align: center; color: var(--muted); margin-bottom: 40px; font-size: 1.1rem; }
    
    .featured-section { padding: 64px 0; border-bottom: 1px solid var(--border); }
    .featured-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .featured-card {
      background: var(--surface); border: 2px solid var(--border); border-radius: 12px; padding: 32px; display: flex; flex-direction: column; align-items: center; text-align: center; text-decoration: none; color: var(--text) !important; transition: all 0.3s;
      
      &:hover { border-color: var(--primary); transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
      
      &.roadmap-feature { background: var(--surface); border-color: rgba(255, 153, 51, 0.3); }
      
      .card-icon { font-size: 3rem; margin-bottom: 16px; }
      h3 { margin: 0 0 12px 0; color: var(--text); }
      p { color: var(--muted); line-height: 1.5; margin-bottom: 24px; flex: 1; }
      .btn-go { color: var(--text); font-weight: bold; background: var(--bg); padding: 8px 16px; border-radius: 6px; width: 100%; border: 1px solid var(--border); }
      &:hover .btn-go { background: var(--primary); color: white; }
    }

    .tools-section { padding: 64px 0; }
    
    .category-tabs {
      display: flex; justify-content: center; gap: 12px; margin-bottom: 40px; flex-wrap: wrap;
      button { padding: 10px 24px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-weight: bold; cursor: pointer; transition: all 0.2s; }
      button:hover { background: var(--bg); }
      button.active { background: var(--primary); color: white; border-color: var(--primary); }
    }
    
    .tool-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    .tool-card {
      background: var(--surface);
      padding: 24px;
      border-radius: 12px;
      text-decoration: none;
      color: var(--text) !important;
      border: 1px solid var(--border);
      transition: all 0.2s;
      display: flex; align-items: center; gap: 16px;
      
      &:hover { transform: translateX(4px); border-color: var(--primary); background: var(--bg); }
      
      .tool-icon { font-size: 2rem; }
      h3 { margin: 0; font-size: 1.1rem; flex: 1; color: var(--text); }
      .btn-tool { color: var(--muted); font-size: 0.9rem; font-weight: bold; }
      &:hover .btn-tool { color: var(--primary); }
    }

    .map-section {
      padding: 0 0 64px 0;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  counter = signal(0);
  selectedCategory = signal<'all'|'emergency'|'tools'|'learn'|'community'|'modes'>('all');
  private counterInterval: any;

  tools = [
    { category: 'emergency', link: '/report-cybercrime', icon: '🚔', titleKey: 'TOOLS.REPORT_CYBERCRIME' },
    { category: 'emergency', link: '/tools/incident-response', icon: '📖', titleKey: 'TOOLS.INCIDENT_RESPONSE' },
    { category: 'emergency', link: '/tools/cyber-mitra', icon: '🤖', titleKey: 'TOOLS.CYBER_MITRA' },
    { category: 'emergency', link: '/tools/citizen-safety-toolkit', icon: '🛟', titleKey: 'TOOLS.CITIZEN_TOOLKIT' },

    { category: 'tools', link: '/password-lab', icon: '🔑', titleKey: 'TOOLS.PASSWORD_LAB' },
    { category: 'tools', link: '/phishing-detector', icon: '🎣', titleKey: 'TOOLS.PHISHING_DETECTOR' },
    { category: 'tools', link: '/breach-check', icon: '🔓', titleKey: 'TOOLS.DATA_BREACH' },
    { category: 'tools', link: '/tools/upi-scanner', icon: '📱', titleKey: 'TOOLS.UPI_SCANNER' },
    { category: 'tools', link: '/tools/safety-score', icon: '🛡️', titleKey: 'TOOLS.SAFETY_SCORE' },
    { category: 'tools', link: '/tools/osint-check', icon: '🕵️', titleKey: 'TOOLS.OSINT_CHECK' },
    { category: 'tools', link: '/tools/app-permissions', icon: '📱', titleKey: 'TOOLS.APP_PERMISSIONS' },
    { category: 'tools', link: '/tools/email-header', icon: '📧', titleKey: 'TOOLS.EMAIL_HEADER' },
    { category: 'tools', link: '/tools/privacy-audit', icon: '🔒', titleKey: 'TOOLS.PRIVACY_AUDIT' },
    { category: 'tools', link: '/tools/2fa-advisor', icon: '🔑', titleKey: 'TOOLS.TWO_FA_ADVISOR' },
    { category: 'tools', link: '/tools/wifi-safety', icon: '📶', titleKey: 'TOOLS.WIFI_SAFETY' },
    { category: 'tools', link: '/tools/number-lookup', icon: '📞', titleKey: 'TOOLS.NUMBER_LOOKUP' },
    
    { category: 'tools', link: '/tools/fact-check', icon: '✅', titleKey: 'TOOLS.FACT_CHECKER' },
    { category: 'learn', link: '/learn/deepfake-awareness', icon: '🎭', titleKey: 'TOOLS.DEEPFAKE_HUB' },

    { category: 'tools', link: '/tools/job-scam-detector', icon: '💼', titleKey: 'TOOLS.JOB_SCAM' },
    { category: 'tools', link: '/tools/investment-scam', icon: '📈', titleKey: 'TOOLS.INVESTMENT_SCAM' },
    { category: 'tools', link: '/tools/matrimonial-safety', icon: '❤️', titleKey: 'TOOLS.MATRIMONIAL_SAFETY' },
    { category: 'tools', link: '/tools/ecommerce-fraud', icon: '🛒', titleKey: 'TOOLS.ECOMMERCE_FRAUD' },

    { category: 'community', link: '/community/quiz-championship', icon: '🏆', titleKey: 'TOOLS.QUIZ' },

    { category: 'modes', link: '/senior', icon: '👵', titleKey: 'TOOLS.SENIOR_MODE' },
    { category: 'modes', link: '/learn/students', icon: '🎒', titleKey: 'TOOLS.STUDENT_MODULE' },
    { category: 'modes', link: '/learn/business-security', icon: '🏬', titleKey: 'TOOLS.BUSINESS_SECURITY' },
    { category: 'modes', link: '/learn/child-safety', icon: '👨‍👩‍👧', titleKey: 'TOOLS.CHILD_SAFETY' },

    { category: 'tools', link: '/tools/secure-vault', icon: '🔐', titleKey: 'TOOLS.SECURE_VAULT' },
    { category: 'tools', link: '/tools/qr-tools', icon: '🔳', titleKey: 'TOOLS.QR_TOOLS' },
    { category: 'learn', link: '/stats', icon: '📊', titleKey: 'TOOLS.STATS' },

    { category: 'learn', link: '/learn/senior-guide', icon: '👴', titleKey: 'TOOLS.SENIOR_GUIDE' },
    { category: 'learn', link: '/learn/tips', icon: '💡', titleKey: 'TOOLS.TIPS' },
    { category: 'learn', link: '/scam-awareness', icon: '🧠', titleKey: 'TOOLS.SCAM_AWARENESS' },
    { category: 'learn', link: '/learn/scam-stories', icon: '📖', titleKey: 'TOOLS.SCAM_STORIES' },
    { category: 'learn', link: '/learn/cyber-law', icon: '⚖️', titleKey: 'TOOLS.CYBER_LAW' },
    { category: 'learn', link: '/threats', icon: '🚨', titleKey: 'TOOLS.THREAT_FEED' },
    { category: 'learn', link: '/learn/glossary', icon: '📚', titleKey: 'TOOLS.GLOSSARY' },
    { category: 'learn', link: '/learn/30-day-plan', icon: '📅', titleKey: 'TOOLS.ROADMAP' },
    { category: 'learn', link: '/learn/aadhaar-safety', icon: '🪪', titleKey: 'TOOLS.AADHAAR_SAFETY' }
  ];

  filteredTools() {
    if (this.selectedCategory() === 'all') return this.tools;
    return this.tools.filter(t => t.category === this.selectedCategory());
  }

  alertCount = signal(0);
  alertSeverityClass = signal('');
  
  constructor(public t: TranslationService, private fraudTickerService: FraudTickerService) {}

  ngOnInit() {
    this.incrementVisitorCount();
    
    // Load ticker items for the hero section counter
    this.fraudTickerService.loadTickerItems().subscribe(items => {
      const state = this.fraudTickerService.getUserState() || 'All India';
      const activeItems = this.fraudTickerService.getActiveItems(items, state);
      this.alertCount.set(activeItems.length);
      
      if (activeItems.some(i => i.severity === 'critical')) {
        this.alertSeverityClass.set('critical');
      } else if (activeItems.some(i => i.severity === 'alert')) {
        this.alertSeverityClass.set('alert');
      } else {
        this.alertSeverityClass.set('warning');
      }
    });
  }

  ngOnDestroy() {
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
  }

  incrementVisitorCount() {
    const COUNT_KEY = 'safeclick_visitor_count';
    const SESSION_KEY = 'safeclick_has_interacted';
    let currentCount = Number(localStorage.getItem(COUNT_KEY)) || 0;
    if (!sessionStorage.getItem(SESSION_KEY)) {
      currentCount++;
      localStorage.setItem(COUNT_KEY, currentCount.toString());
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
    this.animateCounter(currentCount);
  }

  animateCounter(target: number) {
    if (target === 0) {
      this.counter.set(0);
      return;
    }
    let current = 0;
    const duration = 1000;
    const frameRate = 50;
    const totalFrames = duration / frameRate;
    const step = target / totalFrames;

    if (this.counterInterval) clearInterval(this.counterInterval);

    this.counterInterval = setInterval(() => {
      current += step;
      if (current >= target) {
        this.counter.set(target);
        clearInterval(this.counterInterval);
      } else {
        this.counter.set(Math.floor(current));
      }
    }, frameRate);
  }
}
