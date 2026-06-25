import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { PushNotificationService } from '../../core/services/push-notification.service';
import { AlertCategory } from '../../core/services/alert-data.service';
import {
  selectPermissionStatus,
  selectSubscribedCategories,
  selectFrequency,
  updatePermission,
  updateCategories,
  updateFrequency,
  initPermissions
} from '../../store/notification.store';
import { NotificationSchedulerService } from '../../core/services/notification-scheduler.service';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  template: `
    <div class="settings-container">
      <h1>{{ 'NOTIFICATIONS.TITLE' | translate }}</h1>
      
      <!-- Section A: Permission Status -->
      <div class="status-card" [ngClass]="permissionStatus">
        <ng-container *ngIf="permissionStatus === 'default'">
          <div class="cta-content">
            <h2>{{ 'NOTIFICATIONS.ENABLE_CTA' | translate }}</h2>
            <p>{{ 'NOTIFICATIONS.ENABLE_DESC' | translate }}</p>
            <button class="primary-btn saffron" (click)="requestPermission()">
              {{ 'NOTIFICATIONS.ENABLE_BTN' | translate }}
            </button>
          </div>
        </ng-container>

        <ng-container *ngIf="permissionStatus === 'granted'">
          <div class="active-content">
            <span class="icon-check">✅</span>
            <h2>{{ 'NOTIFICATIONS.ACTIVE' | translate }}</h2>
            <p *ngIf="lastAlert">{{ 'NOTIFICATIONS.LAST_ALERT' | translate }}: {{ lastAlert | date:'medium' }}</p>
            <p>{{ 'NOTIFICATIONS.TOTAL_ALERTS' | translate }}: {{ totalAlerts }}</p>
          </div>
        </ng-container>

        <ng-container *ngIf="permissionStatus === 'denied'">
          <div class="denied-content">
            <span class="icon-error">❌</span>
            <h2>{{ 'NOTIFICATIONS.BLOCKED' | translate }}</h2>
            <p>{{ 'NOTIFICATIONS.PERMISSION_DENIED_HELP' | translate }}</p>
          </div>
        </ng-container>
      </div>

      <!-- Section B: Category Subscriptions -->
      <div class="categories-section" *ngIf="permissionStatus === 'granted'">
        <h2>{{ 'NOTIFICATIONS.CATEGORIES_TITLE' | translate }}</h2>
        
        <form [formGroup]="categoriesForm">
          <div class="category-toggle">
            <div class="text">
              <strong>🔴 {{ 'NOTIFICATIONS.CRITICAL' | translate }}</strong>
              <p>{{ 'NOTIFICATIONS.CRITICAL_DESC' | translate }}</p>
            </div>
            <label class="switch">
              <input type="checkbox" checked disabled>
              <span class="slider round disabled"></span>
            </label>
          </div>

          <div class="category-toggle">
            <div class="text">
              <strong>🟠 {{ 'NOTIFICATIONS.UPI' | translate }}</strong>
              <p>{{ 'NOTIFICATIONS.UPI_DESC' | translate }}</p>
            </div>
            <label class="switch">
              <input type="checkbox" formControlName="upi-fraud" (change)="saveCategories()">
              <span class="slider round"></span>
            </label>
          </div>

          <div class="category-toggle">
            <div class="text">
              <strong>🟡 {{ 'NOTIFICATIONS.PHISHING' | translate }}</strong>
              <p>{{ 'NOTIFICATIONS.PHISHING_DESC' | translate }}</p>
            </div>
            <label class="switch">
              <input type="checkbox" formControlName="phishing" (change)="saveCategories()">
              <span class="slider round"></span>
            </label>
          </div>

          <div class="category-toggle">
            <div class="text">
              <strong>🔵 {{ 'NOTIFICATIONS.MALWARE' | translate }}</strong>
              <p>{{ 'NOTIFICATIONS.MALWARE_DESC' | translate }}</p>
            </div>
            <label class="switch">
              <input type="checkbox" formControlName="malware" (change)="saveCategories()">
              <span class="slider round"></span>
            </label>
          </div>

          <div class="category-toggle">
            <div class="text">
              <strong>🟢 {{ 'NOTIFICATIONS.ADVISORY' | translate }}</strong>
              <p>{{ 'NOTIFICATIONS.ADVISORY_DESC' | translate }}</p>
            </div>
            <label class="switch">
              <input type="checkbox" formControlName="advisory" (change)="saveCategories()">
              <span class="slider round"></span>
            </label>
          </div>

          <div class="category-toggle">
            <div class="text">
              <strong>⚪ {{ 'NOTIFICATIONS.CALLS' | translate }}</strong>
              <p>{{ 'NOTIFICATIONS.CALLS_DESC' | translate }}</p>
            </div>
            <label class="switch">
              <input type="checkbox" formControlName="scam-call" (change)="saveCategories()">
              <span class="slider round"></span>
            </label>
          </div>
        </form>
      </div>

      <!-- Section C: Alert Frequency -->
      <div class="frequency-section" *ngIf="permissionStatus === 'granted'">
        <h2>{{ 'NOTIFICATIONS.FREQUENCY_TITLE' | translate }}</h2>
        <div class="radio-group">
          <label>
            <input type="radio" name="freq" [checked]="freq === 'realtime'" (change)="setFreq('realtime')"> 
            {{ 'NOTIFICATIONS.FREQ_REALTIME' | translate }}
          </label>
          <label>
            <input type="radio" name="freq" [checked]="freq === 'daily'" (change)="setFreq('daily')"> 
            {{ 'NOTIFICATIONS.FREQ_DAILY' | translate }}
          </label>
          <label>
            <input type="radio" name="freq" [checked]="freq === 'weekly'" (change)="setFreq('weekly')"> 
            {{ 'NOTIFICATIONS.FREQ_WEEKLY' | translate }}
          </label>
        </div>
      </div>

      <!-- Section D: Test Notification -->
      <div class="test-section" *ngIf="permissionStatus === 'granted'">
        <button class="secondary-btn" (click)="sendTestNotification()">{{ 'NOTIFICATIONS.TEST_BTN' | translate }}</button>
        <p class="test-msg">{{ 'NOTIFICATIONS.TEST_MSG' | translate }}</p>
      </div>

      <!-- Section E: History -->
      <div class="history-section" *ngIf="permissionStatus === 'granted'">
        <h2>{{ 'NOTIFICATIONS.HISTORY_TITLE' | translate }}</h2>
        <div class="history-list" *ngIf="history.length > 0; else noHistory">
          <div class="history-item" *ngFor="let item of history">
            <span class="badge" [ngClass]="item.severity">{{ item.severity }}</span>
            <div class="details">
              <strong>{{ item.title }}</strong>
              <small>{{ item.receivedAt | date:'short' }}</small>
            </div>
            <a [routerLink]="['/threats']" [queryParams]="{alertId: item.id}">{{ 'NOTIFICATIONS.VIEW_DETAILS' | translate }}</a>
          </div>
        </div>
        <ng-template #noHistory>
          <p class="muted">{{ 'NOTIFICATIONS.NO_ALERTS' | translate }}</p>
        </ng-template>
      </div>

      <div class="privacy-notice">
        <small>{{ 'NOTIFICATIONS.PRIVACY' | translate }}</small>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    h1 { color: var(--Cycysafeclick-navy); margin-bottom: 30px; border-bottom: 2px solid var(--border); padding-bottom: 10px; }
    h2 { font-size: 1.2rem; margin-bottom: 15px; color: var(--text); }
    
    .status-card { padding: 30px; border-radius: 12px; margin-bottom: 40px; text-align: center; border: 1px solid var(--border); background: var(--surface); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .status-card.granted { border-color: var(--Cycysafeclick-green); background: rgba(19, 136, 8, 0.05); }
    .status-card.denied { border-color: var(--danger); background: rgba(239, 68, 68, 0.05); }
    
    .primary-btn.saffron { background: var(--Cycysafeclick-saffron); color: white; padding: 12px 24px; font-size: 1.1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 20px; }
    .secondary-btn { background: var(--surface); border: 2px solid var(--Cycysafeclick-navy); color: var(--Cycysafeclick-navy); padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; }
    
    .icon-check, .icon-error { font-size: 3rem; margin-bottom: 10px; display: block; }
    
    .categories-section { margin-bottom: 40px; }
    .category-toggle { display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 10px; background: var(--surface); }
    .category-toggle p { margin: 5px 0 0 0; color: var(--muted); font-size: 0.9rem; }
    
    /* Switch styling */
    .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
    .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
    input:checked + .slider { background-color: var(--Cycysafeclick-green); }
    input:checked + .slider:before { transform: translateX(22px); }
    .slider.round { border-radius: 34px; }
    .slider.round:before { border-radius: 50%; }
    .slider.disabled { background-color: var(--Cycysafeclick-green); opacity: 0.5; cursor: not-allowed; }
    
    .frequency-section { margin-bottom: 40px; }
    .radio-group { display: flex; gap: 20px; }
    .radio-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
    
    .test-section { margin-bottom: 40px; text-align: center; padding: 20px; background: var(--surface); border-radius: 8px; border: 1px dashed var(--border); }
    .test-msg { margin-top: 10px; color: var(--muted); font-size: 0.9rem; }
    
    .history-section { margin-bottom: 40px; }
    .history-item { display: flex; align-items: center; padding: 15px; border-bottom: 1px solid var(--border); gap: 15px; }
    .history-item .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
    .badge.critical { background: var(--danger); color: white; }
    .badge.high { background: var(--warning); color: black; }
    .badge.medium { background: #fde047; color: black; }
    .badge.low { background: var(--Cycysafeclick-green); color: white; }
    .details { flex: 1; display: flex; flex-direction: column; }
    
    .privacy-notice { text-align: center; color: var(--muted); border-top: 1px solid var(--border); padding-top: 20px; }
  `]
})
export class NotificationSettingsComponent implements OnInit {
  permissionStatus: string = 'default';
  totalAlerts = 0;
  lastAlert: string | null = null;
  freq = 'realtime';
  history: any[] = [];
  
  categoriesForm: FormGroup;

  constructor(
    private store: Store,
    private pushService: PushNotificationService,
    private scheduler: NotificationSchedulerService,
    private fb: FormBuilder,
    public t: TranslationService
  ) {
    this.categoriesForm = this.fb.group({
      'upi-fraud': [false],
      'phishing': [false],
      'malware': [false],
      'advisory': [false],
      'scam-call': [false]
    });
  }

  ngOnInit() {
    this.store.dispatch(initPermissions());
    
    this.store.select(selectPermissionStatus).subscribe(s => this.permissionStatus = s);
    this.store.select(selectFrequency).subscribe(f => this.freq = f);
    this.store.select(selectSubscribedCategories).subscribe(cats => {
      this.categoriesForm.patchValue({
        'upi-fraud': cats.includes('upi-fraud'),
        'phishing': cats.includes('phishing'),
        'malware': cats.includes('malware'),
        'advisory': cats.includes('advisory'),
        'scam-call': cats.includes('scam-call')
      }, { emitEvent: false });
    });

    const status = this.pushService.getSubscriptionStatus();
    this.totalAlerts = status.totalReceived;
    this.lastAlert = status.lastNotificationAt;

    try {
      const h = localStorage.getItem('Cycysafeclick_alert_history');
      if (h) this.history = JSON.parse(h);
    } catch(e) {}
  }

  async requestPermission() {
    const p = await this.pushService.requestPermission();
    this.store.dispatch(updatePermission({ status: p }));
    if (p === 'granted') {
      // Default subscribe to all initially
      const all: AlertCategory[] = ['upi-fraud', 'phishing', 'malware', 'advisory', 'scam-call', 'breaking'];
      this.store.dispatch(updateCategories({ categories: all }));
      this.scheduler.scheduleAlertCheck();
    }
  }

  saveCategories() {
    const val = this.categoriesForm.value;
    const active: AlertCategory[] = ['breaking']; // always on
    if (val['upi-fraud']) active.push('upi-fraud');
    if (val['phishing']) active.push('phishing');
    if (val['malware']) active.push('malware');
    if (val['advisory']) active.push('advisory');
    if (val['scam-call']) active.push('scam-call');
    
    this.store.dispatch(updateCategories({ categories: active }));
  }

  setFreq(f: 'realtime' | 'daily' | 'weekly') {
    this.store.dispatch(updateFrequency({ frequency: f }));
  }

  sendTestNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('✅ Cycysafeclick Alerts Active', {
        body: 'This is a test notification. You will now receive alerts for new scams.',
        icon: '/assets/icons/Cycysafeclick-shield-192.png',
        badge: '/assets/icons/Cycysafeclick-badge-72.png',
        tag: 'test-notification'
      });
      setTimeout(() => notification.close(), 5000);
    }
  }
}
