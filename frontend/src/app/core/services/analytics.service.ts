import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private eventsKey = 'CySafeClick-analytics-events';

  constructor(private localStorageService: LocalStorageService) {}

  trackEvent(eventName: string, data?: any) {
    const events = this.localStorageService.getItem<AnalyticsEvent[]>(this.eventsKey) || [];
    events.push({ eventName, timestamp: new Date().toISOString(), data });
    this.localStorageService.setItem(this.eventsKey, events);
  }

  getEvents(): AnalyticsEvent[] {
    return this.localStorageService.getItem<AnalyticsEvent[]>(this.eventsKey) || [];
  }
}
