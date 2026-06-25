import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { PushNotificationService } from './push-notification.service';
import { AlertDataService, ScamAlert } from './alert-data.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulerService {
  private intervalId: any;
  private readonly LAST_CHECKED_KEY = 'Cycysafeclick_last_alert_check';
  private readonly STATS_KEY = 'Cycysafeclick_alert_stats';
  private readonly HISTORY_KEY = 'Cycysafeclick_alert_history';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private pushService: PushNotificationService,
    private alertDataService: AlertDataService,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopScheduler();
        } else {
          this.scheduleAlertCheck();
        }
      });
    }
  }

  scheduleAlertCheck(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Check immediately on resume/start
    this.checkForNewAlerts();

    // Check every 30 minutes (30 * 60 * 1000)
    // Note: This relies on the tab being open. For fully background push, FCM is required.
    this.intervalId = setInterval(() => {
      this.checkForNewAlerts();
    }, 1800000); 
  }

  stopScheduler(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  checkForNewAlerts(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const status = this.pushService.getSubscriptionStatus();
    if (!status.permissionGranted || status.subscribedCategories.length === 0) return;

    const lastCheckedStr = localStorage.getItem(this.LAST_CHECKED_KEY);
    // If first time, we check from now
    const lastChecked = lastCheckedStr ? new Date(lastCheckedStr) : new Date(Date.now() - 86400000); // 1 day lookback max

    this.alertDataService.getAlerts().subscribe({
      next: (alerts) => {
        const newAlerts = alerts.filter(a => {
          const pubDate = new Date(a.publishedAt);
          return pubDate > lastChecked && (status.subscribedCategories.includes(a.category) || a.severity === 'critical');
        });

        newAlerts.forEach(alert => this.showNotification(alert));

        localStorage.setItem(this.LAST_CHECKED_KEY, new Date().toISOString());
      },
      error: (err) => console.error('Failed to fetch alerts for notifications', err)
    });
  }

  showNotification(alert: ScamAlert): void {
    if (!isPlatformBrowser(this.platformId) || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    // We don't want to duplicate tags
    const notification = new Notification('⚠️ Cycysafeclick Alert: ' + alert.title, {
      body: alert.summary.length > 100 ? alert.summary.substring(0, 97) + '...' : alert.summary,
      icon: '/assets/icons/Cycysafeclick-shield-192.png',
      badge: '/assets/icons/Cycysafeclick-badge-72.png',
      tag: alert.id,
      requireInteraction: alert.severity === 'critical'
    });

    notification.onclick = (event) => {
      event.preventDefault(); // prevent the browser from focusing the Notification's tab
      window.focus();
      this.router.navigate(['/threats'], { queryParams: { alertId: alert.id } });
      notification.close();
    };

    this.updateStatsAndHistory(alert);
  }

  private updateStatsAndHistory(alert: ScamAlert) {
    // Update Stats
    try {
      const s = localStorage.getItem(this.STATS_KEY);
      let stats = s ? JSON.parse(s) : { lastNotificationAt: null, totalReceived: 0 };
      stats.lastNotificationAt = new Date().toISOString();
      stats.totalReceived += 1;
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch(e) {}

    // Update History (last 20)
    try {
      const h = localStorage.getItem(this.HISTORY_KEY);
      let history: any[] = h ? JSON.parse(h) : [];
      history.unshift({
        id: alert.id,
        title: alert.title,
        severity: alert.severity,
        receivedAt: new Date().toISOString()
      });
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch(e) {}
  }
}
