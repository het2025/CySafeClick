import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WeeklyDigestService, WeeklyDigest, ScamPattern } from '../../../features/weekly-digest/weekly-digest.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { PatternDetailComponent } from '../../../features/weekly-digest/pattern-detail/pattern-detail.component';

@Component({
  selector: 'CySafeClick-weekly-digest-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, PatternDetailComponent],
  template: `
    <section class="digest-widget">
      <div class="widget-header">
        <div class="title-area">
          <h2>{{ 'DIGEST.SECTION_TITLE' | translate }}</h2>
          <span class="week-badge">{{ weekLabel() }}</span>
        </div>
        <div class="update-info">
          <span class="icon">📅</span> {{ 'DIGEST.UPDATED_MONDAY' | translate }}
        </div>
      </div>

      <div class="stats-bar" *ngIf="digest()">
        <div class="stat-item">
          <span class="value">{{ digest()?.reportedThisWeek | number }}</span>
          <span class="label">{{ 'DIGEST.STATS.COMPLAINTS' | translate }}</span>
        </div>
        <div class="stat-item">
          <span class="value">₹{{ digest()?.totalLossThisWeek }}</span>
          <span class="label">{{ 'DIGEST.STATS.LOSS' | translate }}</span>
        </div>
        <div class="stat-item">
          <span class="value">{{ digest()?.risingState }}</span>
          <span class="label">{{ 'DIGEST.STATS.TOP_STATE' | translate }}</span>
        </div>
      </div>

      <div class="patterns-grid" *ngIf="digest()">
        <div class="pattern-card" *ngFor="let pattern of sortedPatterns()" (click)="openPattern(pattern)">
          <div class="card-header">
            <span class="rank">#{{ pattern.rank }}</span>
            <span class="trend" *ngIf="pattern.isNew || pattern.isTrending">{{ getTrendBadge(pattern) | translate }}</span>
          </div>
          <span class="category">{{ pattern.category }}</span>
          <h3 class="title">{{ getPatternTitle(pattern) }}</h3>
          <p class="summary">{{ getPatternSummary(pattern) }} <span class="read-more">{{ 'DIGEST.PATTERN.READ_MORE' | translate }}</span></p>
          <div class="red-flags-preview">
            <ul>
              <li *ngFor="let flag of getPatternRedFlags(pattern) | slice:0:2">{{ flag }}</li>
            </ul>
          </div>
          <button class="learn-more-btn">{{ 'DIGEST.PATTERN.LEARN_MORE' | translate }}</button>
        </div>
      </div>

      <div class="widget-footer" *ngIf="digest()">
        <div class="safety-reminder">
          <strong>💡 Editor's Note:</strong> {{ safetyReminder() }}
        </div>
        <a routerLink="/learn/weekly-digest" class="full-digest-link">{{ 'DIGEST.READ_FULL_DIGEST' | translate }}</a>
      </div>

      <!-- Drawer Overlay for Pattern Detail -->
      <div class="drawer-overlay" *ngIf="selectedPattern()" (click)="closePattern()">
        <div class="drawer-content" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closePattern()">×</button>
          <CySafeClick-pattern-detail [pattern]="selectedPattern()!"></CySafeClick-pattern-detail>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .digest-widget {
      background: var(--surface);
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 2rem;
      margin: 2rem 0;
      font-family: 'Inter', sans-serif;
      border: 1px solid var(--border);
    }
    
    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .title-area h2 {
      font-size: 1.5rem;
      color: var(--text);
      margin: 0 0 0.5rem 0;
      font-weight: 800;
    }
    
    .week-badge {
      display: inline-block;
      background: var(--CySafeClick-navy);
      color: white;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .update-info {
      color: var(--muted);
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .stats-bar {
      display: flex;
      gap: 1rem;
      background: var(--bg);
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      border: 1px solid var(--border);
    }
    
    .stat-item {
      flex: 1;
      min-width: 150px;
      display: flex;
      flex-direction: column;
    }
    
    .stat-item .value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--CySafeClick-saffron);
    }
    
    .stat-item .label {
      font-size: 0.85rem;
      color: var(--muted);
      text-transform: uppercase;
      font-weight: 600;
      margin-top: 0.25rem;
    }
    
    .patterns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .pattern-card {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--surface);
      display: flex;
      flex-direction: column;
    }
    
    .pattern-card:hover {
      border-color: var(--CySafeClick-saffron);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .rank {
      font-weight: 800;
      color: #b91c1c;
      background: #fee2e2;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    
    .trend {
      font-size: 0.75rem;
      font-weight: 700;
      color: #b45309;
    }
    
    .category {
      font-size: 0.8rem;
      color: #4338ca;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      display: block;
    }
    
    .pattern-card .title {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: var(--text);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .pattern-card .summary {
      font-size: 0.95rem;
      color: var(--muted);
      line-height: 1.5;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .read-more {
      color: var(--CySafeClick-saffron);
      font-weight: 600;
    }
    
    .red-flags-preview {
      background: rgba(239, 68, 68, 0.08);
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      flex-grow: 1;
      border-left: 3px solid #ef4444;
    }
    
    .red-flags-preview ul {
      margin: 0;
      padding-left: 1.25rem;
      color: #ef4444;
      font-size: 0.85rem;
    }
    
    .red-flags-preview li {
      margin-bottom: 0.25rem;
    }
    
    .learn-more-btn {
      width: 100%;
      padding: 0.75rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .pattern-card:hover .learn-more-btn {
      background: var(--CySafeClick-saffron);
    }
    
    .widget-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .safety-reminder {
      font-size: 0.95rem;
      color: var(--text);
      background: rgba(234, 179, 8, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border-left: 4px solid #eab308;
    }
    
    .full-digest-link {
      color: var(--CySafeClick-saffron);
      text-decoration: none;
      font-weight: 700;
      display: flex;
      align-items: center;
    }
    
    .full-digest-link:hover {
      text-decoration: underline;
    }
    
    /* Drawer Styles */
    .drawer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
      backdrop-filter: blur(4px);
    }
    
    .drawer-content {
      background: var(--surface);
      width: 100%;
      max-width: 600px;
      height: 100vh;
      overflow-y: auto;
      padding: 2rem;
      position: relative;
      animation: slideIn 0.3s ease-out;
      box-shadow: -4px 0 15px rgba(0,0,0,0.1);
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--bg);
      border: 1px solid var(--border);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--muted);
      z-index: 10;
    }
    
    .close-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    @media (max-width: 768px) {
      .patterns-grid {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 1rem;
      }
      .pattern-card {
        min-width: 85vw;
        scroll-snap-align: center;
      }
      .drawer-content {
        max-width: 100vw;
        border-radius: 16px 16px 0 0;
        height: 90vh;
        margin-top: 10vh;
        animation: slideUp 0.3s ease-out;
      }
      .drawer-overlay {
        align-items: flex-end;
        justify-content: center;
      }
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
    }
  `]
})
export class WeeklyDigestWidgetComponent implements OnInit {
  digestService = inject(WeeklyDigestService);
  translationService = inject(TranslationService);
  
  digest = signal<WeeklyDigest | null>(null);
  selectedPattern = signal<ScamPattern | null>(null);
  
  ngOnInit() {
    this.digestService.getLatestDigest().subscribe(data => {
      this.digest.set(data);
    });
  }

  sortedPatterns() {
    return this.digest()?.topPatterns.sort((a, b) => a.rank - b.rank) || [];
  }

  weekLabel() {
    const d = this.digest();
    if (!d) return '';
    return this.translationService.currentLang() === 'hi' && d.weekLabelHindi ? d.weekLabelHindi : d.weekLabel;
  }

  safetyReminder() {
    const d = this.digest();
    if (!d) return '';
    return this.translationService.currentLang() === 'hi' && d.safetyReminderHindi ? d.safetyReminderHindi : d.safetyReminder;
  }

  getPatternTitle(pattern: ScamPattern) {
    return this.translationService.currentLang() === 'hi' && pattern.titleHindi ? pattern.titleHindi : pattern.title;
  }

  getPatternSummary(pattern: ScamPattern) {
    return this.translationService.currentLang() === 'hi' && pattern.summaryHindi ? pattern.summaryHindi : pattern.summary;
  }

  getPatternRedFlags(pattern: ScamPattern) {
    return this.translationService.currentLang() === 'hi' && pattern.redFlagsHindi ? pattern.redFlagsHindi : pattern.redFlags;
  }

  getTrendBadge(pattern: ScamPattern) {
    return this.digestService.getTrendBadge(pattern);
  }

  openPattern(pattern: ScamPattern) {
    this.selectedPattern.set(pattern);
    document.body.style.overflow = 'hidden';
  }

  closePattern() {
    this.selectedPattern.set(null);
    document.body.style.overflow = 'auto';
  }
}
