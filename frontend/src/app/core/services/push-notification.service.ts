import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AlertCategory } from './alert-data.service';

export interface SubscriptionStatus {
  permissionGranted: boolean;
  subscribedCategories: AlertCategory[];
  lastNotificationAt: string | null;
  totalReceived: number;
}

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private readonly CATEGORIES_KEY = 'Cycysafeclick_alert_categories';
  private readonly STATS_KEY = 'Cycysafeclick_alert_stats';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isBrowser || !('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    return await Notification.requestPermission();
  }

  async subscribeToAlerts(categories: AlertCategory[]): Promise<boolean> {
    if (!this.isBrowser) return false;
    
    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') return false;
    }

    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  }

  async unsubscribe(): Promise<void> {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.CATEGORIES_KEY);
    // Notification API doesn't have an explicit 'revoke' method for permissions, 
    // user must do it in browser settings. We clear our local config.
  }

  getSubscriptionStatus(): SubscriptionStatus {
    if (!this.isBrowser) {
      return {
        permissionGranted: false,
        subscribedCategories: [],
        lastNotificationAt: null,
        totalReceived: 0
      };
    }

    const permissionGranted = 'Notification' in window && Notification.permission === 'granted';
    
    let subscribedCategories: AlertCategory[] = [];
    try {
      const cats = localStorage.getItem(this.CATEGORIES_KEY);
      if (cats) {
        subscribedCategories = JSON.parse(cats);
      }
    } catch (e) {}

    let stats = { lastNotificationAt: null, totalReceived: 0 };
    try {
      const s = localStorage.getItem(this.STATS_KEY);
      if (s) {
        stats = JSON.parse(s);
      }
    } catch (e) {}

    return {
      permissionGranted,
      subscribedCategories,
      lastNotificationAt: stats.lastNotificationAt,
      totalReceived: stats.totalReceived
    };
  }
}
