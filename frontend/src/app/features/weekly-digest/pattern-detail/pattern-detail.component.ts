import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScamPattern, WeeklyDigestService } from '../weekly-digest.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'safeclick-pattern-detail',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="pattern-detail" *ngIf="pattern">
      <!-- Section A: Overview -->
      <div class="header-section">
        <div class="badges">
          <span class="rank-badge">#{{ pattern.rank }} {{ 'DIGEST.PATTERN.RANK' | translate }}</span>
          <span class="category-pill">{{ pattern.category }}</span>
          <span class="trend-badge" [class.new]="pattern.isNew" [class.trending]="pattern.isTrending" *ngIf="pattern.isNew || pattern.isTrending">
            {{ getTrendBadge(pattern) | translate }}
          </span>
        </div>
        <h2 class="title">{{ title() }}</h2>
        <p class="summary">{{ summary() }}</p>
        <a *ngIf="pattern.link" [href]="pattern.link" target="_blank" rel="noopener noreferrer" class="btn-read-more">
          Read Full Article ↗
        </a>
        
        <div class="meta-info">
          <div class="meta-item">
            <strong>{{ 'DIGEST.PATTERN.ACTIVE_IN' | translate }}</strong>
            <div class="pills">
              <span class="pill" *ngFor="let state of pattern.targetedStates">{{ state }}</span>
            </div>
          </div>
          <div class="meta-item">
            <strong>{{ 'DIGEST.PATTERN.TARGETS' | translate }}</strong>
            <span class="text">{{ pattern.targetedAgeGroup }}</span>
          </div>
          <div class="meta-item loss">
            <strong>{{ 'DIGEST.PATTERN.LOSS_THIS_WEEK' | translate }}</strong>
            <span class="loss-amount">₹{{ pattern.estimatedLossThisWeek }} {{ 'DIGEST.PATTERN.LAKH' | translate }}</span>
          </div>
        </div>
      </div>

      <!-- Section B: How It Works -->
      <div class="section how-it-works">
        <h3>{{ 'DIGEST.PATTERN.HOW_IT_WORKS' | translate }}</h3>
        <div class="steps">
          <div class="step" *ngFor="let step of steps(); let i = index">
            <div class="step-icon">
              <span class="icon">{{ getStepIcon(i) }}</span>
            </div>
            <div class="step-content">
              <span class="step-num">Step {{ i + 1 }}</span>
              <p>{{ step }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section C: Real Script -->
      <div class="section real-script">
        <h3>{{ 'DIGEST.PATTERN.WHAT_SCAMMER_SAYS' | translate }}</h3>
        <blockquote class="script-card">
          <p>"{{ pattern.realExampleScript }}"</p>
        </blockquote>
        <p class="script-note"><small>{{ 'DIGEST.PATTERN.SCRIPT_NOTE' | translate }}</small></p>
      </div>

      <!-- Section D: Red Flags -->
      <div class="section red-flags">
        <h3>{{ 'DIGEST.PATTERN.RED_FLAGS' | translate }}</h3>
        <p class="sub">{{ 'DIGEST.PATTERN.RED_FLAGS_SUB' | translate }}</p>
        <ul class="checklist">
          <li *ngFor="let flag of redFlags()">
            <label class="check-item">
              <input type="checkbox">
              <span class="checkmark"></span>
              <span class="text">{{ flag }}</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Section E: What To Do -->
      <div class="section what-to-do">
        <h3>{{ 'DIGEST.PATTERN.WHAT_TO_DO' | translate }}</h3>
        <div class="action-box">
          <div class="action-item">
            <h4>{{ 'DIGEST.PATTERN.IF_NOT_ACTED' | translate }}</h4>
            <p>{{ whatToDo() }}</p>
          </div>
          <div class="action-item critical">
            <h4>{{ 'DIGEST.PATTERN.IF_ACTED' | translate }}</h4>
            <a href="tel:1930" class="btn-red">🚨 {{ 'DIGEST.PATTERN.CALL_1930' | translate }}</a>
          </div>
        </div>
      </div>

      <!-- Section F: Share Warning -->
      <div class="section share-warning">
        <a [href]="shareLink()" target="_blank" class="btn-whatsapp">
          💬 {{ 'DIGEST.PATTERN.SHARE_WARNING' | translate }}
        </a>
      </div>
    </div>
  `,
  styles: [`
    .pattern-detail {
      font-family: 'Inter', sans-serif;
      color: var(--safeclick-navy);
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .rank-badge { background: #fee2e2; color: #b91c1c; padding: 4px 8px; border-radius: 4px; }
    .category-pill { background: #e0e7ff; color: #4338ca; padding: 4px 8px; border-radius: 4px; }
    .trend-badge { background: #fef3c7; color: #b45309; padding: 4px 8px; border-radius: 4px; }
    .trend-badge.new { background: #dcfce7; color: #15803d; }
    
    .title { font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.3; }
    .summary { font-size: 1.1rem; line-height: 1.6; color: #475569; margin-bottom: 1rem; }
    .btn-read-more { display: inline-block; background: #0f172a; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 0.9rem; font-weight: 600; margin-bottom: 1.5rem; transition: background 0.2s; }
    .btn-read-more:hover { background: #334155; }
    
    .meta-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
    }
    .meta-item strong { display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem; text-transform: uppercase; }
    .pills { display: flex; flex-wrap: wrap; gap: 0.25rem; }
    .pill { background: #e2e8f0; font-size: 0.85rem; padding: 2px 8px; border-radius: 12px; }
    .loss-amount { font-size: 1.2rem; font-weight: 700; color: #b91c1c; }
    
    .section h3 { font-size: 1.25rem; font-weight: 700; border-bottom: 2px solid var(--safeclick-saffron); padding-bottom: 0.5rem; margin-bottom: 1rem; display: inline-block; }
    
    .how-it-works .steps { display: flex; flex-direction: column; gap: 1rem; }
    .step { display: flex; gap: 1rem; background: #fff; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; }
    .step-icon {
      width: 40px; height: 40px; background: #f1f5f9; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
      flex-shrink: 0;
    }
    .step-num { font-size: 0.85rem; font-weight: 700; color: var(--safeclick-saffron); text-transform: uppercase; }
    .step p { margin: 0.25rem 0 0 0; line-height: 1.5; }
    
    .real-script .script-card {
      background: #1e293b; color: #f8fafc;
      padding: 1.5rem; border-left: 6px solid var(--safeclick-saffron);
      border-radius: 4px; margin: 0; font-family: 'Courier New', Courier, monospace;
      font-size: 1.05rem; line-height: 1.6;
    }
    .script-note { margin-top: 0.5rem; color: #64748b; font-style: italic; }
    
    .red-flags .sub { margin-bottom: 1rem; color: #dc2626; font-weight: 600; }
    .checklist { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .check-item { display: flex; align-items: flex-start; gap: 0.75rem; cursor: pointer; }
    .check-item input { width: 18px; height: 18px; margin-top: 3px; accent-color: var(--safeclick-saffron); }
    .check-item .text { line-height: 1.5; }
    
    .action-box { display: flex; flex-direction: column; gap: 1rem; background: #fef2f2; border: 1px solid #fca5a5; padding: 1.5rem; border-radius: 8px; }
    .action-item h4 { margin: 0 0 0.5rem 0; color: #991b1b; }
    .action-item.critical { border-top: 1px solid #fca5a5; padding-top: 1rem; }
    .btn-red { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
    .btn-red:hover { background: #b91c1c; }
    
    .btn-whatsapp { display: block; text-align: center; background: #25D366; color: white; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 1.1rem; transition: background 0.2s; }
    .btn-whatsapp:hover { background: #16a34a; }
    
    @media print {
      .btn-whatsapp, .btn-red, .check-item input { display: none; }
      .pattern-detail { color: black; }
      .script-card { background: #f1f5f9; color: black; border-left: 4px solid black; }
    }
  `]
})
export class PatternDetailComponent {
  @Input() pattern!: ScamPattern;
  
  translationService = inject(TranslationService);
  digestService = inject(WeeklyDigestService);
  
  lang = this.translationService.currentLang;

  title = computed(() => this.lang() === 'hi' && this.pattern.titleHindi ? this.pattern.titleHindi : this.pattern.title);
  summary = computed(() => this.lang() === 'hi' && this.pattern.summaryHindi ? this.pattern.summaryHindi : this.pattern.summary);
  
  steps = computed(() => {
    const text = this.lang() === 'hi' && this.pattern.howItWorksHindi ? this.pattern.howItWorksHindi : this.pattern.howItWorks;
    return text.split(/\d+\.\s+/).filter(s => s.trim().length > 0).map(s => s.trim());
  });

  redFlags = computed(() => this.lang() === 'hi' && this.pattern.redFlagsHindi?.length > 0 ? this.pattern.redFlagsHindi : this.pattern.redFlags);
  whatToDo = computed(() => this.lang() === 'hi' && this.pattern.whatToDoHindi ? this.pattern.whatToDoHindi : this.pattern.whatToDo);
  
  shareLink = computed(() => {
    const text = `⚠️ SafeClick Alert: ${this.title()}.\n${this.summary()}\nApne parivaar ko batayein. safeclick.in/digest`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  });

  getTrendBadge(pattern: ScamPattern): string {
    return this.digestService.getTrendBadge(pattern);
  }

  getStepIcon(index: number): string {
    const icons = ['📞', '🤝', '💰', '⏳', '🚨', '📉'];
    return icons[index % icons.length];
  }
}
