import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyAuditService, PrivacyPlatform, PrivacyCheckItem } from './privacy-audit.service';
import { ProgressRingComponent } from '../../shared/components/progress-ring/progress-ring.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-privacy-audit',
  standalone: true,
  imports: [CommonModule, ProgressRingComponent, RiskBadgeComponent],
  template: `
    <div class="container audit-page">
      <div class="header-section">
        <h1>Social Media Privacy Audit</h1>
        <p>Review and lock down your social media settings to protect your personal data.</p>
      </div>

      <div class="platform-tabs">
        @for (platform of service.PLATFORMS; track platform.id) {
          <button [class.active]="selectedPlatformId() === platform.id" (click)="selectPlatform(platform.id)">
            <span class="icon">{{ platform.icon }}</span>
            {{ platform.name }}
          </button>
        }
      </div>

      @if (currentPlatform()) {
        <div class="audit-dashboard">
          
          <div class="overview-card card">
            <div class="score-section">
              <app-progress-ring [progress]="completionPercentage()" [size]="120" 
                  [color]="completionPercentage() === 100 ? 'var(--safe)' : (completionPercentage() >= 50 ? 'var(--warning)' : 'var(--danger)')">
                  <span class="score-text">{{ completionPercentage() | number:'1.0-0' }}%</span>
              </app-progress-ring>
              <div class="score-details">
                <h3>{{ currentPlatform()!.name }} Safety Score</h3>
                <p>You have secured {{ safeItemsCount() }} out of {{ currentPlatform()!.checklist.length }} critical settings.</p>
                <button class="btn-secondary" (click)="resetAudit()">Reset Audit</button>
              </div>
            </div>
          </div>

          <div class="checklist-section card">
            <div class="list-header">
              <h3>Security Checklist</h3>
              <div class="filter-toggles">
                <button [class.active]="filter() === 'all'" (click)="filter.set('all')">All</button>
                <button [class.active]="filter() === 'risky'" (click)="filter.set('risky')">At Risk ({{ riskyItemsCount() }})</button>
              </div>
            </div>

            <div class="items-list">
              @for (item of filteredChecklist(); track item.id) {
                <div class="audit-item" [ngClass]="item.currentStatus">
                  
                  <div class="item-header">
                    <div class="item-title">
                      <span class="severity-dot" [ngClass]="item.severity" [title]="'Severity: ' + item.severity"></span>
                      <h4>{{ item.title }}</h4>
                    </div>
                    <div class="item-actions">
                      <button class="btn-status safe" [class.active]="item.currentStatus === 'safe'" (click)="setStatus(item.id, 'safe')">✓ Safe</button>
                      <button class="btn-status risky" [class.active]="item.currentStatus === 'risky'" (click)="setStatus(item.id, 'risky')">✗ Risky</button>
                    </div>
                  </div>

                  <div class="item-body">
                    <p class="description">{{ item.description }}</p>
                    
                    @if (item.currentStatus === 'risky') {
                      <div class="fix-box">
                        <div class="risk-warning">
                          <strong>⚠️ Risk:</strong> {{ item.riskIfIgnored }}
                        </div>
                        <div class="how-to-fix">
                          <strong>How to fix:</strong>
                          <ol>
                            @for (step of item.howToFix; track step) {
                              <li>{{ step }}</li>
                            }
                          </ol>
                        </div>
                      </div>
                    }
                  </div>

                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .audit-page { padding: 40px 0; }
    .header-section { text-align: center; margin-bottom: 32px; }
    
    .platform-tabs { display: flex; gap: 16px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap; }
    .platform-tabs button { display: flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 30px; border: 2px solid var(--border); background: var(--surface); color: var(--text); font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: all 0.2s; }
    .platform-tabs button:hover { border-color: var(--accent-saffron); }
    .platform-tabs button.active { background: var(--accent-saffron); color: var(--primary); border-color: var(--accent-saffron); }
    .icon { font-size: 1.5rem; }

    .audit-dashboard { display: flex; flex-direction: column; gap: 24px; max-width: 900px; margin: 0 auto; }
    .card { background: var(--surface); padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }

    .score-section { display: flex; gap: 32px; align-items: center; }
    @media (max-width: 600px) { .score-section { flex-direction: column; text-align: center; } }
    .score-text { font-size: 1.5rem; font-weight: bold; }
    .score-details h3 { margin: 0 0 8px 0; font-size: 1.5rem; }
    .score-details p { color: var(--muted); margin-bottom: 16px; }
    .btn-secondary { background: var(--border); color: var(--text); padding: 8px 16px; border-radius: 6px; font-weight: bold; border: none; cursor: pointer; }

    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
    .filter-toggles { display: flex; gap: 8px; }
    .filter-toggles button { padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--text); cursor: pointer; }
    .filter-toggles button.active { background: var(--primary); color: white; border-color: var(--primary); }

    .items-list { display: flex; flex-direction: column; gap: 16px; }
    .audit-item { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--bg); transition: border-color 0.3s; }
    .audit-item.safe { border-left: 6px solid var(--safe); }
    .audit-item.risky { border-left: 6px solid var(--danger); }
    
    .item-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border); background: var(--surface); }
    @media (max-width: 600px) { .item-header { flex-direction: column; align-items: flex-start; gap: 12px; } }
    
    .item-title { display: flex; align-items: center; gap: 12px; }
    .item-title h4 { margin: 0; font-size: 1.1rem; }
    
    .severity-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .severity-dot.critical { background: #7f1d1d; box-shadow: 0 0 5px #7f1d1d; }
    .severity-dot.high { background: var(--danger); }
    .severity-dot.medium { background: var(--warning); }
    .severity-dot.low { background: #3b82f6; }

    .item-actions { display: flex; gap: 8px; }
    .btn-status { padding: 6px 16px; border-radius: 6px; font-weight: bold; border: 1px solid var(--border); background: transparent; color: var(--text); cursor: pointer; transition: all 0.2s; }
    .btn-status.safe:hover, .btn-status.safe.active { background: rgba(34, 197, 94, 0.1); border-color: var(--safe); color: var(--safe); }
    .btn-status.risky:hover, .btn-status.risky.active { background: rgba(239, 68, 68, 0.1); border-color: var(--danger); color: var(--danger); }

    .item-body { padding: 16px; }
    .description { margin: 0 0 16px 0; font-size: 0.95rem; }
    
    .fix-box { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px; animation: slideDown 0.3s ease-out; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .risk-warning { color: var(--danger); margin-bottom: 12px; font-size: 0.9rem; }
    .how-to-fix strong { display: block; margin-bottom: 8px; color: var(--text); }
    .how-to-fix ol { padding-left: 20px; font-size: 0.9rem; margin: 0; color: var(--text); }
    .how-to-fix li { margin-bottom: 4px; }
  `]
})
export class PrivacyAuditComponent {
  selectedPlatformId = signal<string>('whatsapp');
  userState = signal<Record<string, Record<string, 'unknown' | 'safe' | 'risky'>>>({});
  filter = signal<'all' | 'risky'>('all');

  currentPlatform = computed(() => this.service.getPlatform(this.selectedPlatformId()));
  
  platformState = computed(() => {
    return this.userState()[this.selectedPlatformId()] || {};
  });

  checklistWithState = computed(() => {
    const platform = this.currentPlatform();
    if (!platform) return [];
    const state = this.platformState();
    
    return platform.checklist.map(item => ({
      ...item,
      currentStatus: state[item.id] || 'unknown'
    }));
  });

  filteredChecklist = computed(() => {
    const list = this.checklistWithState();
    if (this.filter() === 'risky') {
      return list.filter(i => i.currentStatus === 'risky');
    }
    return list;
  });

  safeItemsCount = computed(() => this.checklistWithState().filter(i => i.currentStatus === 'safe').length);
  riskyItemsCount = computed(() => this.checklistWithState().filter(i => i.currentStatus === 'risky').length);
  
  completionPercentage = computed(() => {
    const total = this.checklistWithState().length;
    if (total === 0) return 0;
    return (this.safeItemsCount() / total) * 100;
  });

  constructor(public service: PrivacyAuditService, private localStorage: LocalStorageService) {
    const saved = this.localStorage.getItem<any>('safeclick-privacy-audit') || {};
    this.userState.set(saved);

    effect(() => {
      this.localStorage.setItem('safeclick-privacy-audit', this.userState());
    });
  }

  selectPlatform(id: string) {
    this.selectedPlatformId.set(id);
    this.filter.set('all');
  }

  setStatus(itemId: string, status: 'safe' | 'risky') {
    this.userState.update(current => {
      const newState = { ...current };
      if (!newState[this.selectedPlatformId()]) {
        newState[this.selectedPlatformId()] = {};
      }
      newState[this.selectedPlatformId()][itemId] = status;
      return newState;
    });
  }

  resetAudit() {
    if (confirm('Are you sure you want to reset your progress for this platform?')) {
      this.userState.update(current => {
        const newState = { ...current };
        newState[this.selectedPlatformId()] = {};
        return newState;
      });
    }
  }
}
