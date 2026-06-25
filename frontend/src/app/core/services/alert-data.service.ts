import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type AlertCategory = 'upi-fraud' | 'phishing' | 'malware' | 'advisory' | 'scam-call' | 'breaking';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertSource = 'CERT-In' | 'Cyber Dost' | 'MHA' | 'RBI' | 'TRAI' | 'CySafeClick Community';

export interface ScamAlert {
  id: string;
  title: string;
  titleHindi: string;
  severity: AlertSeverity;
  category: AlertCategory;
  source: AlertSource;
  publishedAt: string;
  summary: string;
  summaryHindi: string;
  affectedStates: string[];
  affectedPlatforms: string[];
  actionRequired: string;
  actionRequiredHindi: string;
  referenceUrl: string | null;
  tags: string[];
  isBreaking: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertDataService {

  private dataUrl = `${environment.apiUrl}/alerts`;

  constructor(private http: HttpClient) { }

  getAlerts(): Observable<ScamAlert[]> {
    return this.http.get<ScamAlert[]>(this.dataUrl);
  }
}
