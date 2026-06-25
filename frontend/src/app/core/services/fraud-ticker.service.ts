import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ToastService } from './toast.service'; // Assuming there's a toast service as implied
import { environment } from '../../../environments/environment';

export interface TickerItem {
  id: string;
  text: string;
  textHindi: string;
  severity: 'info' | 'warning' | 'alert' | 'critical';
  category: string;
  targetState: string;
  date: string;
  isBreaking: boolean;
  actionUrl: string | null;
  actionLabel: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class FraudTickerService {
  private readonly JSON_URL = `${environment.apiUrl}/news/alerts`;
  private readonly STATE_KEY = 'Cycysafeclick_user_state';
  private refreshIntervalId: any = null;

  public activeState$ = new BehaviorSubject<string>(this.getUserState() || 'All India');

  constructor(private http: HttpClient, private toastService: ToastService) {}

  loadTickerItems(): Observable<TickerItem[]> {
    return this.http.get<TickerItem[]>(this.JSON_URL).pipe(
      map(items => {
        // Merge with any community submitted if needed (omitted here as per spec)
        // Filter last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        return items.filter(item => new Date(item.date) >= thirtyDaysAgo);
      }),
      map(items => {
        const severityOrder = { 'critical': 0, 'alert': 1, 'warning': 2, 'info': 3 };
        return items.sort((a, b) => {
          if (severityOrder[a.severity] !== severityOrder[b.severity]) {
            return severityOrder[a.severity] - severityOrder[b.severity];
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }),
      catchError(err => {
        console.error('Failed to load ticker data', err);
        return of([]);
      })
    );
  }

  getActiveItems(items: TickerItem[], state?: string): TickerItem[] {
    let filtered = items;
    if (state && state !== 'All India') {
      filtered = items.filter(i => i.targetState === state || i.targetState === 'All India');
    }
    
    // Ensure breaking items are first
    return filtered.sort((a, b) => {
      if (a.isBreaking && !b.isBreaking) return -1;
      if (!a.isBreaking && b.isBreaking) return 1;
      return 0;
    });
  }

  getUserState(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.STATE_KEY);
    }
    return null;
  }

  setUserState(state: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STATE_KEY, state);
    }
    this.activeState$.next(state);
  }

  getItemAge(item: TickerItem): string {
    const publishedAt = new Date(item.date).getTime();
    const now = new Date().getTime();
    const diffHours = (now - publishedAt) / (1000 * 60 * 60);

    if (diffHours < 24) return 'Today';
    if (diffHours < 24 * 7) return 'This week';
    if (diffHours < 24 * 30) return 'This month';
    return new Date(item.date).toLocaleDateString();
  }

  startAutoRefresh(intervalMinutes: number = 60, currentItemsCallback: (items: TickerItem[]) => void): void {
    this.stopAutoRefresh();
    this.refreshIntervalId = setInterval(() => {
      this.loadTickerItems().subscribe(newItems => {
        // Here we could diff and show toast
        const newBreaking = newItems.filter(n => n.isBreaking);
        if (newBreaking.length > 0) {
          // Toast implementation (assuming standard toast interface)
          // this.toastService.show(`New scam alert: ${newBreaking[0].category}`);
        }
        currentItemsCallback(newItems);
      });
    }, intervalMinutes * 60 * 1000);
  }

  stopAutoRefresh(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
  }
}
