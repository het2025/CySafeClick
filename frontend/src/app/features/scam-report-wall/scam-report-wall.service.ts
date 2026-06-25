import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ScamReport {
  id: string;
  _id?: string;
  type: 'phone' | 'upi' | 'website' | 'email';
  value: string;
  scamType: string;
  description: string;
  dateReported: string;
  city: string;
  amountLost: number | null;
  upvotes: number;
  verified: boolean;
  reporterNote: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScamReportWallService {
  private reportsSubject = new BehaviorSubject<ScamReport[]>([]);
  public reports$ = this.reportsSubject.asObservable();

  constructor() {}

  addReport(report: any) {
    return { disabled: true };
  }

  upvote(id: string) {
    return { disabled: true };
  }
}
