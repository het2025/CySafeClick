import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScamAlert } from '../../../core/services/alert-data.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-alert-detail-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        
        <button class="close-btn" (click)="close()">&times;</button>
        
        <div class="modal-header">
          <div class="badges">
            <span class="severity-badge" [ngClass]="alert.severity">{{ alert.severity | uppercase }}</span>
            <span class="source-badge">Source: {{ alert.source }}</span>
          </div>
          
          <div class="lang-toggle">
            <button [class.active]="showHindi" (click)="showHindi = !showHindi">
              {{ showHindi ? 'View English' : 'हिंदी देखें' }}
            </button>
          </div>
        </div>

        <h2 class="title">{{ showHindi ? alert.titleHindi : alert.title }}</h2>
        <p class="date">{{ alert.publishedAt | date:'medium' }}</p>

        <div class="summary-box">
          <p>{{ showHindi ? alert.summaryHindi : alert.summary }}</p>
        </div>

        <div class="pills-section">
          <div>
            <strong>Affected States:</strong>
            <div class="pills">
              <span class="pill outline" *ngFor="let state of alert.affectedStates">{{ state }}</span>
            </div>
          </div>
          
          <div>
            <strong>Platforms:</strong>
            <div class="pills">
              <span class="pill fill" *ngFor="let plat of alert.affectedPlatforms">{{ plat }}</span>
            </div>
          </div>
        </div>

        <div class="action-box">
          <h3>⚠️ {{ showHindi ? 'क्या करें?' : 'Action Required' }}</h3>
          <p>{{ showHindi ? alert.actionRequiredHindi : alert.actionRequired }}</p>
        </div>

        <div class="modal-footer">
          <a *ngIf="alert.referenceUrl" [href]="alert.referenceUrl" target="_blank" class="ref-link">
            Official Reference ↗
          </a>
          
          <div class="actions">
            <a routerLink="/report-cybercrime" class="report-btn" (click)="close()">Report Similar</a>
            <button class="share-btn" (click)="share()">Share on WhatsApp</button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
    .modal-content { background: var(--surface); color: var(--text); padding: 30px; border-radius: 12px; max-width: 600px; width: 100%; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .close-btn { position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 1.5rem; color: var(--muted); cursor: pointer; }
    
    .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-right: 20px; }
    .badges { display: flex; gap: 10px; flex-wrap: wrap; }
    
    .severity-badge { padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
    .severity-badge.critical { background: var(--danger); color: white; }
    .severity-badge.high { background: var(--warning); color: black; }
    .severity-badge.medium { background: #fde047; color: black; }
    .severity-badge.low { background: var(--Cycysafeclick-green); color: white; }
    
    .source-badge { padding: 4px 10px; border-radius: 4px; background: rgba(0,0,0,0.05); border: 1px solid var(--border); font-size: 0.8rem; color: var(--muted); }
    [data-theme="dark"] .source-badge { background: rgba(255,255,255,0.05); }

    .lang-toggle button { background: none; border: 1px solid var(--primary); color: var(--primary); padding: 4px 12px; border-radius: 20px; cursor: pointer; font-size: 0.8rem; font-weight: bold; }
    .lang-toggle button.active { background: var(--primary); color: white; }

    .title { font-size: 1.5rem; margin-bottom: 5px; color: var(--Cycysafeclick-navy); line-height: 1.3; }
    .date { color: var(--muted); font-size: 0.9rem; margin-bottom: 20px; }

    .summary-box { font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px; }

    .pills-section { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
    .pills-section strong { font-size: 0.9rem; color: var(--muted); margin-bottom: 5px; display: block; }
    .pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .pill { padding: 4px 12px; border-radius: 16px; font-size: 0.85rem; }
    .pill.outline { border: 1px solid var(--border); color: var(--text); }
    .pill.fill { background: rgba(10, 22, 40, 0.1); color: var(--Cycysafeclick-navy); font-weight: bold; }
    [data-theme="dark"] .pill.fill { background: rgba(255,255,255,0.1); color: white; }

    .action-box { background: rgba(255, 153, 51, 0.1); border-left: 4px solid var(--Cycysafeclick-saffron); padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; }
    .action-box h3 { margin: 0 0 10px 0; font-size: 1.1rem; color: #b45309; }
    [data-theme="dark"] .action-box h3 { color: #fcd34d; }
    .action-box p { margin: 0; line-height: 1.5; font-weight: 500; }

    .modal-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
    .ref-link { color: var(--primary); text-decoration: none; font-weight: bold; font-size: 0.9rem; }
    .ref-link:hover { text-decoration: underline; }
    
    .actions { display: flex; gap: 10px; }
    .report-btn { padding: 10px 16px; border-radius: 8px; background: transparent; border: 2px solid var(--danger); color: var(--danger); text-decoration: none; font-weight: bold; font-size: 0.9rem; cursor: pointer; }
    .share-btn { padding: 10px 16px; border-radius: 8px; background: #25D366; color: white; border: none; font-weight: bold; font-size: 0.9rem; cursor: pointer; }
  `]
})
export class AlertDetailModalComponent {
  @Input() alert!: ScamAlert;
  @Output() closeEvent = new EventEmitter<void>();

  showHindi = false;

  constructor(public t: TranslationService) {
    if (this.t.currentLang() === 'hi') {
      this.showHindi = true;
    }
  }

  close() {
    this.closeEvent.emit();
  }

  share() {
    const text = encodeURIComponent(`⚠️ Cycysafeclick Alert: ${this.alert.title}\n\n${this.alert.summary}\n\nStay safe! Check Cycysafeclick App for details.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }
}
