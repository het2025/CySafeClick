import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { environment } from '../../../environments/environment';

export interface DailyTip {
  id: number;
  category: string;
  title: string;
  body: string;
  hindiTitle: string;
  hindiBody: string;
  actionItem: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  tags: string[];
}

@Injectable({ providedIn: 'root' })
export class DailyTipService {
  private completedTipsKey = 'Cycysafeclick-completed-tips';

  constructor(private http: HttpClient, private storage: LocalStorageService) {}

  getAllTips(): Observable<DailyTip[]> {
    return this.http.get<DailyTip[]>(`${environment.apiUrl}/tips`).pipe(
      catchError(err => {
        console.error('Failed to load tips', err);
        return of([]);
      })
    );
  }

  getTodayTip(): Observable<DailyTip | null> {
    return this.getAllTips().pipe(
      map(tips => {
        if (!tips || tips.length === 0) return null;
        const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
        const tipIndex = daysSinceEpoch % tips.length;
        return tips[tipIndex];
      })
    );
  }

  getCompletedTipIds(): number[] {
    return this.storage.getItem<number[]>(this.completedTipsKey) || [];
  }

  markTipAsDone(id: number) {
    const completed = new Set(this.getCompletedTipIds());
    completed.add(id);
    this.storage.setItem(this.completedTipsKey, Array.from(completed));
  }

  isTipCompleted(id: number): boolean {
    const completed = this.getCompletedTipIds();
    return completed.includes(id);
  }
}
