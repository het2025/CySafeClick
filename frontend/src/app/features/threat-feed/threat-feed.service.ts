import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ThreatAlert {
  id: string;
  date: string;
  source: 'CERT-In' | 'Cyber Dost' | 'MHA' | 'RBI';
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'phishing' | 'malware' | 'ransomware' | 'scam' | 'vulnerability' | 'advisory';
  title: string;
  summary: string;
  affectedSystems: string[];
  actionRequired: string;
  referenceUrl: string;
}

export interface ThreatFeedData {
  lastUpdated: string;
  alerts: ThreatAlert[];
}

@Injectable({ providedIn: 'root' })
export class ThreatFeedService {
  constructor(private http: HttpClient) {}

  getFeed(): Observable<ThreatFeedData | null> {
    return this.http.get<ThreatFeedData>(`${environment.apiUrl}/threats/feed`).pipe(
      catchError(err => {
        console.error('Failed to load threat feed', err);
        return of(null);
      })
    );
  }
}
