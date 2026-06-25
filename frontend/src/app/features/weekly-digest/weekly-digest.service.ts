import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WeeklyStat {
// ... omitting interfaces to keep it brief
  headline: string;
  headlineHindi: string;
  value: string;
  context: string;
  contextHindi: string;
  source: string;
}

export interface ScamPattern {
  rank: 1 | 2 | 3;
  title: string;
  titleHindi: string;
  category: string;
  isNew: boolean;
  isTrending: boolean;
  summary: string;
  summaryHindi: string;
  howItWorks: string;
  howItWorksHindi: string;
  redFlags: string[];
  redFlagsHindi: string[];
  whatToDo: string;
  whatToDoHindi: string;
  targetedStates: string[];
  targetedAgeGroup: string;
  estimatedLossThisWeek: number;
  realExampleScript: string;
  link?: string;
}

export interface WeeklyDigest {
  weekId: string;
  weekLabel: string;
  weekLabelHindi: string;
  publishedAt: string;
  editorNote: string;
  editorNoteHindi: string;
  topPatterns: ScamPattern[];
  statOfTheWeek: WeeklyStat;
  safetyReminder?: string;
  safetyReminderHindi?: string;
  reportedThisWeek?: number;
  totalLossThisWeek?: number;
  risingState?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeeklyDigestService {
  private dataUrl = `${environment.apiUrl}/news/digest`;

  constructor(private http: HttpClient) {}

  loadAllDigests(): Observable<WeeklyDigest[]> {
    return this.http.get<WeeklyDigest[]>(this.dataUrl).pipe(
      map(digests => digests.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()))
    );
  }

  getLatestDigest(): Observable<WeeklyDigest> {
    return this.loadAllDigests().pipe(
      map(digests => digests[0])
    );
  }

  getDigestByWeekId(weekId: string): Observable<WeeklyDigest | null> {
    return this.loadAllDigests().pipe(
      map(digests => digests.find(d => d.weekId === weekId) || null)
    );
  }

  getWeekProgress(): number {
    const now = new Date();
    // Monday = 1, Sunday = 0
    let day = now.getDay();
    if (day === 0) day = 7;
    return ((day - 1) / 7) * 100;
  }

  getDaysUntilNextDigest(): number {
    const now = new Date();
    let day = now.getDay();
    if (day === 0) day = 7;
    return 8 - day;
  }

  getPatternByRank(digest: WeeklyDigest, rank: 1 | 2 | 3): ScamPattern | undefined {
    return digest.topPatterns.find(p => p.rank === rank);
  }

  getTrendBadge(pattern: ScamPattern): string {
    if (pattern.isNew) return 'NEW THIS WEEK';
    if (pattern.isTrending) return 'TRENDING ↑';
    return 'RECURRING';
  }
}
