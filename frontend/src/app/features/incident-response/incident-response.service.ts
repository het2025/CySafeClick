import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';
import { environment } from '../../../environments/environment';

export interface PlaybookStep {
  title: string;
  action: string;
  why: string;
  time: string;
}

export interface Playbook {
  id: string;
  category: string;
  title: string;
  urgency: string; // Changed from enum to string to handle translated values
  estimatedTime: string;
  steps: PlaybookStep[];
  whatNotToDo: string[];
}

export interface PlaybooksData {
  playbooks: Playbook[];
}

@Injectable({
  providedIn: 'root'
})
export class IncidentResponseService {
  constructor(private http: HttpClient, private t: TranslationService) {}

  getPlaybooks(): Observable<PlaybooksData> {
    const lang = this.t.currentLang();
    return this.http.get<PlaybooksData>(`${environment.apiUrl}/playbooks/${lang}`);
  }

  getCompletedSteps(playbookId: string): number[] {
    const data = localStorage.getItem(`Cycysafeclick_pb_${playbookId}`);
    return data ? JSON.parse(data) : [];
  }

  saveCompletedSteps(playbookId: string, steps: number[]): void {
    localStorage.setItem(`Cycysafeclick_pb_${playbookId}`, JSON.stringify(steps));
  }

  clearProgress(playbookId: string): void {
    localStorage.removeItem(`Cycysafeclick_pb_${playbookId}`);
  }
}
