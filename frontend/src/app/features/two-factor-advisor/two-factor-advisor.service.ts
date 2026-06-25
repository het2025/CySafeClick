import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type TwoFAMethod = 'none' | 'sms' | 'app' | 'biometric' | 'hardware';

export interface Platform2FAInfo {
  id: string;
  name: string;
  category: 'email' | 'social' | 'banking' | 'payment' | 'investment' | 'government' | 'shopping';
  supportedMethods: TwoFAMethod[];
  recommendedMethod: TwoFAMethod;
  setupInstructions: { [method in TwoFAMethod]?: string[] };
  riskIfCompromised: string;
  indianSpecificNote?: string;
}

@Injectable({ providedIn: 'root' })
export class TwoFactorAdvisorService {
  constructor(private http: HttpClient) {}

  getPlatforms(): Observable<Platform2FAInfo[]> {
    return this.http.get<Platform2FAInfo[]>(`${environment.apiUrl}/platforms/2fa`).pipe(
      catchError(err => {
        console.error('Failed to load platforms', err);
        return of([]);
      })
    );
  }

  getMethodRank(method: TwoFAMethod): number {
    switch (method) {
      case 'none': return 1;
      case 'sms': return 2;
      case 'app': return 3;
      case 'biometric': return 4;
      case 'hardware': return 5;
      default: return 1;
    }
  }

  getMethodName(method: TwoFAMethod): string {
    switch (method) {
      case 'none': return 'No 2FA (Password only)';
      case 'sms': return 'SMS OTP';
      case 'app': return 'Authenticator App';
      case 'biometric': return 'Biometrics (Fingerprint/Face)';
      case 'hardware': return 'Hardware Key';
      default: return 'Unknown';
    }
  }
}
