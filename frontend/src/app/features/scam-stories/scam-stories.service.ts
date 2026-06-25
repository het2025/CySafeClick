import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ScamStory {
  id: string;
  title: string;
  subtitle: string;
  victim: {
    firstName: string;
    city: string;
    age: number;
    occupation: string;
  };
  scamType: string;
  amountLost: number;
  howItStarted: string;
  howItUnfolded: string;
  redFlags: string[];
  howItEnded: string;
  lesson: string;
  couldHaveBeenPrevented: string;
  wasMoneyRecovered: boolean;
  recoverySteps: string;
}

@Injectable({ providedIn: 'root' })
export class ScamStoriesService {
  constructor(private http: HttpClient) {}

  getStories(): Observable<ScamStory[]> {
    return this.http.get<ScamStory[]>(`${environment.apiUrl}/stories`).pipe(
      catchError(err => {
        console.error('Failed to load stories', err);
        return of([]);
      })
    );
  }
}
