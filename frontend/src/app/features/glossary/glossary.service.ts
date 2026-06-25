import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface GlossaryTerm {
  term: string;
  hindiTerm: string;
  category: 'attacks' | 'concepts' | 'technology' | 'legal' | 'india-specific';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  simpleDefinition: string;
  detailedExplanation: string;
  indianAnalogy: string;
  realWorldExample: string;
  relatedTerms: string[];
  preventionTip: string;
}

@Injectable({ providedIn: 'root' })
export class GlossaryService {
  constructor(private http: HttpClient) {}

  getTerms(): Observable<GlossaryTerm[]> {
    return this.http.get<GlossaryTerm[]>(`${environment.apiUrl}/glossary`).pipe(
      catchError(err => {
        console.error('Failed to load glossary', err);
        return of([]);
      })
    );
  }
}
