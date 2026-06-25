import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUnreadCount, selectAlerts, markAllRead, loadAlerts } from '../../../store/notification.store';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="bell-wrapper" (click)="toggleDropdown()">
      <div class="bell-icon" [class.ringing]="unreadCount > 0">
        🔔
      </div>
      <span class="badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
      
      <div class="dropdown-menu" *ngIf="isOpen" (click)="$event.stopPropagation()">
        <div class="dropdown-header">
          <h3>{{ 'NOTIFICATIONS.HISTORY_TITLE' | translate }}</h3>
          <button class="text-btn" (click)="markRead()">{{ 'NOTIFICATIONS.MARK_ALL_READ' | translate }}</button>
        </div>
        
        <div class="dropdown-content">
          <ng-container *ngIf="alerts.length > 0; else noAlerts">
            <!-- Show only top 5 recent -->
            <div class="alert-item" *ngFor="let alert of alerts.slice(0, 5)" [routerLink]="['/threats']" [queryParams]="{alertId: alert.id}" (click)="closeDropdown()">
              <span class="severity-dot" [ngClass]="alert.severity"></span>
              <div class="alert-text">
                <strong>{{ alert.title }}</strong>
                <small>{{ alert.publishedAt | date:'short' }}</small>
              </div>
            </div>
          </ng-container>
          <ng-template #noAlerts>
            <div class="empty-state">{{ 'NOTIFICATIONS.NO_ALERTS' | translate }}</div>
          </ng-template>
        </div>
        
        <div class="dropdown-footer">
          <a routerLink="/threats" (click)="closeDropdown()">{{ 'NOTIFICATIONS.VIEW_ALL' | translate }}</a>
          <a routerLink="/settings/notifications" (click)="closeDropdown()">⚙️ Settings</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bell-wrapper { position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); }
    .bell-wrapper:hover { background: rgba(255,255,255,0.2); }
    .bell-icon { font-size: 1.2rem; }
    
    @keyframes ring {
      0% { transform: rotate(0); }
      10% { transform: rotate(15deg); }
      20% { transform: rotate(-10deg); }
      30% { transform: rotate(5deg); }
      40% { transform: rotate(-5deg); }
      50% { transform: rotate(0); }
      100% { transform: rotate(0); }
    }
    .ringing { animation: ring 2s infinite; }
    
    .badge { position: absolute; top: -2px; right: -2px; background: var(--danger); color: white; font-size: 0.7rem; font-weight: bold; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    
    .dropdown-menu { position: absolute; top: 50px; right: 0; width: 320px; background: var(--surface); color: var(--text); border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); border: 1px solid var(--border); z-index: 1000; overflow: hidden; cursor: default; }
    .dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border); background: var(--bg); }
    .dropdown-header h3 { margin: 0; font-size: 1rem; }
    .text-btn { background: none; border: none; color: var(--primary); font-size: 0.8rem; cursor: pointer; }
    
    .dropdown-content { max-height: 300px; overflow-y: auto; }
    .alert-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s; }
    .alert-item:hover { background: rgba(0,0,0,0.02); }
    [data-theme="dark"] .alert-item:hover { background: rgba(255,255,255,0.05); }
    
    .severity-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
    .severity-dot.critical { background: var(--danger); box-shadow: 0 0 5px var(--danger); }
    .severity-dot.high { background: var(--warning); }
    .severity-dot.medium { background: #fde047; }
    .severity-dot.low { background: var(--safeclick-green); }
    
    .alert-text { display: flex; flex-direction: column; }
    .alert-text strong { font-size: 0.9rem; margin-bottom: 4px; line-height: 1.3; }
    .alert-text small { font-size: 0.75rem; color: var(--muted); }
    
    .empty-state { padding: 30px; text-align: center; color: var(--muted); }
    
    .dropdown-footer { display: flex; justify-content: space-between; padding: 12px 16px; background: var(--bg); border-top: 1px solid var(--border); }
    .dropdown-footer a { color: var(--primary); font-size: 0.9rem; text-decoration: none; font-weight: bold; }
  `]
})
export class NotificationBellComponent implements OnInit {
  isOpen = false;
  unreadCount = 0;
  alerts: any[] = [];

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadAlerts());
    this.store.select(selectUnreadCount).subscribe(c => this.unreadCount = c);
    this.store.select(selectAlerts).subscribe(a => {
      // Sort newest first
      this.alerts = [...a].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    });

    // Close dropdown on outside click
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.unreadCount > 0) {
      this.markRead();
    }
  }

  closeDropdown() {
    this.isOpen = false;
  }

  markRead() {
    this.store.dispatch(markAllRead());
  }

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.bell-wrapper')) {
      this.isOpen = false;
    }
  }
}
