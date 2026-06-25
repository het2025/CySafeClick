import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface CrimeStats {
  yearOverYear: ChartData;
  topStates: ChartData;
  fraudTypes: ChartData;
  financialLoss: ChartData;
  timeToReport: ChartData;
}

@Injectable({
  providedIn: 'root'
})
export class StatsDashboardService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<CrimeStats> {
    return this.http.get<CrimeStats>(`${environment.apiUrl}/stats`);
  }
}
