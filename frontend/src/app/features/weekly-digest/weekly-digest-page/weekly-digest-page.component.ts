import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { PatternDetailComponent } from '../pattern-detail/pattern-detail.component';
import { WeeklyDigestService, WeeklyDigest, ScamPattern } from '../weekly-digest.service';
import { selectAllDigests, selectDigestByWeekId, loadDigests, selectWeek } from '../../../store/digest.store';
import { AppState } from '../../../store';
import * as QRCode from 'qrcode';

@Component({
  selector: 'Cycysafeclick-weekly-digest-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, PatternDetailComponent],
  template: `
    <div class="page-container">
      <div class="sidebar hide-print">
        <div class="archive-nav">
          <h3>{{ 'DIGEST.ARCHIVE.TITLE' | translate }}</h3>
          <ul class="archive-list">
            <li *ngFor="let digest of (allDigests$ | async)" 
                [class.active]="selectedWeekId() === digest.weekId"
                (click)="selectWeekEntry(digest.weekId)">
              <span class="week-name">{{ getWeekLabel(digest) }}</span>
              <span class="date">{{ digest.publishedAt | date:'MMM d, y' }}</span>
            </li>
          </ul>
        </div>
        
        <div class="safety-box">
          <h4>💡 Safety Reminder</h4>
          <p>{{ safetyReminder() }}</p>
        </div>
        
        <a routerLink="/settings/notifications" class="btn-subscribe">
          🔔 {{ 'DIGEST.ARCHIVE.SUBSCRIBE' | translate }}
        </a>
      </div>

      <div class="main-content" *ngIf="selectedDigest() as digest">
        <div class="page-header">
          <div class="header-top">
            <span class="week-badge">{{ getWeekLabel(digest) }}</span>
            <button class="btn-print hide-print" (click)="printPage()">
              🖨️ {{ 'DIGEST.DOWNLOAD_PDF' | translate }}
            </button>
          </div>
          <h1>{{ 'DIGEST.SECTION_TITLE' | translate }}</h1>
          
          <div class="stats-bar">
            <div class="stat-item">
              <span class="value">{{ digest.reportedThisWeek | number }}</span>
              <span class="label">{{ 'DIGEST.STATS.COMPLAINTS' | translate }}</span>
            </div>
            <div class="stat-item">
              <span class="value">₹{{ digest.totalLossThisWeek }}</span>
              <span class="label">{{ 'DIGEST.STATS.LOSS' | translate }}</span>
            </div>
            <div class="stat-item">
              <span class="value">{{ digest.risingState }}</span>
              <span class="label">{{ 'DIGEST.STATS.TOP_STATE' | translate }}</span>
            </div>
          </div>
          
          <div class="editor-note">
            <p><strong>Editor's Note:</strong> {{ editorNote() }}</p>
          </div>
        </div>

        <div class="patterns-list">
          <Cycysafeclick-pattern-detail 
            *ngFor="let pattern of sortedPatterns(digest)" 
            [pattern]="pattern"
            class="pattern-block">
          </Cycysafeclick-pattern-detail>
        </div>
        
        <div class="print-footer show-print-only">
          <hr>
          <div class="footer-content">
            <p><strong>Cycysafeclick Digital Safety Platform</strong> | Government of India initiative</p>
            <p>Stay updated with live alerts at <strong>Cycysafeclick.in</strong> or call <strong>1930</strong></p>
            <div class="qr-container">
              <canvas id="qr-code-canvas"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: 'Inter', sans-serif;
    }
    
    .sidebar {
      width: 300px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .archive-nav {
      background: #f8fafc;
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }
    
    .archive-nav h3 { margin: 0 0 1rem 0; font-size: 1.1rem; color: var(--Cycysafeclick-navy); }
    
    .archive-list {
      list-style: none;
      padding: 0; margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .archive-list li {
      padding: 0.75rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .archive-list li:hover { background: #e2e8f0; }
    .archive-list li.active { background: var(--Cycysafeclick-navy); color: white; }
    .archive-list li.active .week-name { color: white; }
    .archive-list li.active .date { color: #cbd5e1; }
    
    .week-name { font-weight: 600; font-size: 0.95rem; color: #334155; }
    .date { font-size: 0.8rem; color: #64748b; }
    
    .safety-box {
      background: #fef9c3;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #eab308;
    }
    .safety-box h4 { margin: 0 0 0.5rem 0; color: #854d0e; }
    .safety-box p { margin: 0; font-size: 0.95rem; line-height: 1.5; color: #422006; }
    
    .btn-subscribe {
      display: block;
      text-align: center;
      background: #f1f5f9;
      color: var(--Cycysafeclick-navy);
      padding: 12px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 700;
      border: 1px solid #cbd5e1;
      transition: background 0.2s;
    }
    .btn-subscribe:hover { background: #e2e8f0; }
    
    .main-content {
      flex-grow: 1;
      max-width: 800px;
    }
    
    .page-header { margin-bottom: 3rem; }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .week-badge {
      background: #e0e7ff;
      color: #4338ca;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.9rem;
    }
    
    .btn-print {
      background: none;
      border: 1px solid #cbd5e1;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
    }
    .btn-print:hover { background: #f1f5f9; }
    
    .page-header h1 {
      font-size: 2.5rem;
      color: var(--Cycysafeclick-navy);
      margin: 0 0 2rem 0;
      font-weight: 900;
      line-height: 1.2;
    }
    
    .stats-bar {
      display: flex;
      gap: 1.5rem;
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      border: 1px solid #e2e8f0;
    }
    
    .stat-item { flex: 1; display: flex; flex-direction: column; }
    .stat-item .value { font-size: 1.8rem; font-weight: 800; color: var(--Cycysafeclick-saffron); }
    .stat-item .label { font-size: 0.9rem; color: #475569; text-transform: uppercase; font-weight: 600; margin-top: 0.25rem; }
    
    .editor-note {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #334155;
      padding-left: 1rem;
      border-left: 4px solid var(--Cycysafeclick-navy);
    }
    
    .patterns-list {
      display: flex;
      flex-direction: column;
      gap: 4rem;
    }
    
    .pattern-block {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      border: 1px solid #f1f5f9;
      display: block;
    }
    
    .show-print-only { display: none; }
    
    @media (max-width: 900px) {
      .page-container { flex-direction: column; }
      .sidebar { width: 100%; order: 2; }
      .main-content { order: 1; }
      .stats-bar { flex-direction: column; gap: 1rem; }
    }
    
    @media print {
      .hide-print { display: none !important; }
      .show-print-only { display: block; margin-top: 2rem; }
      
      .page-container {
        display: block;
        padding: 0;
        margin: 0;
        max-width: 100%;
      }
      
      .main-content { max-width: 100%; }
      
      .page-header h1 { font-size: 24pt; color: black; margin-bottom: 10pt; }
      .week-badge { border: 1px solid black; background: none; color: black; }
      .stats-bar {
        border: 2px solid black;
        background: none;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .stat-item .value { color: black; font-size: 20pt; }
      
      .pattern-block {
        box-shadow: none;
        border: none;
        border-bottom: 2px dashed #ccc;
        padding: 0 0 20pt 0;
        margin-bottom: 20pt;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      .print-footer {
        break-inside: avoid;
        text-align: center;
        font-size: 12pt;
      }
      .qr-container { margin-top: 10pt; }
      
      /* Base font size for readability */
      body, p, li, span, h2, h3, h4, blockquote { font-size: 14pt !important; color: black !important; }
      .title { font-size: 20pt !important; }
    }
  `]
})
export class WeeklyDigestPageComponent implements OnInit {
  store = inject(Store<AppState>);
  route = inject(ActivatedRoute);
  router = inject(Router);
  translationService = inject(TranslationService);
  
  allDigests$ = this.store.select(selectAllDigests);
  
  selectedWeekId = signal<string | null>(null);
  selectedDigest = signal<WeeklyDigest | null>(null);

  ngOnInit() {
    this.store.dispatch(loadDigests());
    
    // Listen to query params
    this.route.queryParams.subscribe(params => {
      if (params['week']) {
        this.store.dispatch(selectWeek({ weekId: params['week'] }));
      }
    });

    // Listen to selected digest
    this.store.select(selectDigestByWeekId).subscribe(digest => {
      this.selectedDigest.set(digest);
      if (digest) {
        this.selectedWeekId.set(digest.weekId);
        setTimeout(() => this.generateQR(), 500);
      }
    });
  }

  getWeekLabel(digest: WeeklyDigest) {
    return this.translationService.currentLang() === 'hi' && digest.weekLabelHindi ? digest.weekLabelHindi : digest.weekLabel;
  }

  editorNote() {
    const d = this.selectedDigest();
    if (!d) return '';
    return this.translationService.currentLang() === 'hi' && d.editorNoteHindi ? d.editorNoteHindi : d.editorNote;
  }

  safetyReminder() {
    const d = this.selectedDigest();
    if (!d) return '';
    return this.translationService.currentLang() === 'hi' && d.safetyReminderHindi ? d.safetyReminderHindi : d.safetyReminder;
  }

  sortedPatterns(digest: WeeklyDigest) {
    return digest.topPatterns.sort((a, b) => a.rank - b.rank);
  }

  selectWeekEntry(weekId: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { week: weekId },
      queryParamsHandling: 'merge'
    });
  }

  printPage() {
    window.print();
  }

  generateQR() {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      QRCode.toCanvas(canvas, window.location.href, { width: 150 }, (error) => {
        if (error) console.error(error);
      });
    }
  }
}
