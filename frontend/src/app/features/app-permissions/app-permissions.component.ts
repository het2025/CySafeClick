import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppPermissionsService, Permission, AppCategory, PermissionScanResult } from './app-permissions.service';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { ProgressRingComponent } from '../../shared/components/progress-ring/progress-ring.component';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';

@Component({
  selector: 'app-app-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, RiskBadgeComponent, ProgressRingComponent, AccordionComponent],
  template: `
    <div class="container permissions-page">
      <div class="header-section">
        <h1>App Permission Checker</h1>
        <p>Select an app category and the permissions it requests to see if it's risky.</p>
      </div>

      <div class="main-grid">
        <!-- Configuration -->
        <div class="card config-section">
          <div class="form-group">
            <label>1. What type of app is this?</label>
            <select [(ngModel)]="selectedCategoryId" (change)="analyze()">
              @for (cat of categories; track cat.id) {
                <option [value]="cat.id">{{ cat.name }}</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label>2. What permissions does it ask for?</label>
            <div class="permission-groups">
              @for (group of permissionGroups; track group.name) {
                <div class="perm-group">
                  <h4>{{ group.name }}</h4>
                  @for (perm of group.perms; track perm.id) {
                    <label class="checkbox-label">
                      <input type="checkbox" [checked]="isSelected(perm.id)" (change)="togglePermission(perm.id)">
                      <div>
                        <strong>{{ perm.name }}</strong>
                        <small>{{ perm.description }}</small>
                      </div>
                    </label>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Results -->
        <div class="card results-section">
          @if (result()) {
            <div class="sticky-results">
              <div class="risk-overview">
                <app-progress-ring [progress]="result()!.overallRisk" [size]="120" 
                  [color]="result()!.riskLevel === 'dangerous' ? 'var(--danger)' : (result()!.riskLevel === 'suspicious' ? 'var(--warning)' : 'var(--safe)')">
                  <span class="score-text">{{ result()!.overallRisk }}/100</span>
                </app-progress-ring>
                <div class="risk-details">
                  <app-risk-badge [level]="result()!.riskLevel"></app-risk-badge>
                  <h3>Risk Score</h3>
                </div>
              </div>

              @if (result()!.dangerousCombos.length > 0) {
                <div class="alert danger-alert">
                  <h4>⚠️ Dangerous Combinations Detected</h4>
                  @for (combo of result()!.dangerousCombos; track combo.name) {
                    <div class="combo-item">
                      <strong>{{ combo.name }}</strong>
                      <p>{{ combo.description }}</p>
                    </div>
                  }
                </div>
              }

              @if (result()!.highRiskPermissions.length > 0) {
                <div class="alert warning-alert">
                  <h4>Critical Permissions Requested</h4>
                  <ul>
                    @for (p of result()!.highRiskPermissions; track p.id) {
                      <li><strong>{{ p.name }}</strong>: {{ p.description }}</li>
                    }
                  </ul>
                </div>
              }

              @if (result()!.categoryMismatches.length > 0) {
                <div class="alert info-alert">
                  <h4>Unusual for this Category</h4>
                  <ul>
                    @for (m of result()!.categoryMismatches; track m.permission) {
                      <li>{{ m.reason }}</li>
                    }
                  </ul>
                </div>
              }

              <div class="recommendations">
                <h4>Recommendations:</h4>
                <ul>
                  @for (rec of result()!.recommendations; track rec) {
                    <li>{{ rec }}</li>
                  }
                </ul>
              </div>
            </div>
          } @else {
            <div class="empty-state">
              <p>Select some permissions to see the risk analysis.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .permissions-page { padding: 40px 0; }
    .header-section { margin-bottom: 32px; text-align: center; }
    .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    @media (max-width: 992px) { .main-grid { grid-template-columns: 1fr; } }
    
    .card { background: var(--surface); padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    
    .form-group { margin-bottom: 24px; }
    .form-group label { display: block; font-weight: bold; margin-bottom: 8px; }
    select { width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem; background: var(--bg); color: var(--text); }
    
    .permission-groups { display: flex; flex-direction: column; gap: 24px; }
    .perm-group h4 { color: var(--accent-saffron); border-bottom: 1px solid var(--border); padding-bottom: 4px; margin-bottom: 12px; }
    
    .checkbox-label { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 8px; transition: background 0.2s; }
    .checkbox-label:hover { background: var(--bg); }
    .checkbox-label input { margin-top: 4px; width: 18px; height: 18px; }
    .checkbox-label div { display: flex; flex-direction: column; }
    .checkbox-label small { color: var(--muted); font-size: 0.85rem; }

    .sticky-results { position: sticky; top: 100px; }
    .risk-overview { display: flex; gap: 32px; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
    .score-text { font-size: 1.5rem; font-weight: bold; }
    
    .alert { padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid; }
    .alert h4 { margin-bottom: 8px; }
    .alert ul { padding-left: 20px; }
    .danger-alert { background: rgba(239, 68, 68, 0.05); border-color: var(--danger); color: #b91c1c; }
    .warning-alert { background: rgba(245, 158, 11, 0.05); border-color: var(--warning); color: #b45309; }
    .info-alert { background: rgba(59, 130, 246, 0.05); border-color: #3b82f6; color: #1d4ed8; }
    
    [data-theme="dark"] .danger-alert { color: #fca5a5; }
    [data-theme="dark"] .warning-alert { color: #fcd34d; }
    [data-theme="dark"] .info-alert { color: #93c5fd; }

    .combo-item { margin-bottom: 12px; }
    .combo-item p { font-size: 0.9rem; margin-top: 4px; }
    
    .recommendations { background: var(--bg); padding: 24px; border-radius: 8px; margin-top: 24px; }
    .recommendations ul { padding-left: 20px; margin-top: 12px; }
    .recommendations li { margin-bottom: 8px; }
    
    .empty-state { text-align: center; color: var(--muted); padding: 40px 0; }
  `]
})
export class AppPermissionsComponent {
  categories: AppCategory[] = [];
  selectedCategoryId = 'flashlight';
  selectedPermIds = signal<string[]>([]);
  result = signal<PermissionScanResult | null>(null);

  permissionGroups: { name: string, perms: Permission[] }[] = [];

  constructor(private service: AppPermissionsService) {
    this.categories = this.service.CATEGORIES;
    
    const groups = new Set(this.service.PERMISSIONS.map(p => p.group));
    groups.forEach(g => {
      this.permissionGroups.push({
        name: g,
        perms: this.service.PERMISSIONS.filter(p => p.group === g)
      });
    });
  }

  isSelected(id: string) {
    return this.selectedPermIds().includes(id);
  }

  togglePermission(id: string) {
    this.selectedPermIds.update(ids => {
      if (ids.includes(id)) {
        return ids.filter(i => i !== id);
      } else {
        return [...ids, id];
      }
    });
    this.analyze();
  }

  analyze() {
    if (this.selectedPermIds().length === 0) {
      this.result.set(null);
      return;
    }
    this.result.set(this.service.analyze(this.selectedCategoryId, this.selectedPermIds()));
  }
}
