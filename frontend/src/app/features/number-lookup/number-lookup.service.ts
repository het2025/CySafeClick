import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type ScamCallType = 
  'digital-arrest' | 'fake-trai' | 'fake-police' | 
  'fake-bank' | 'fake-kyc' | 'investment-scam' | 
  'job-scam' | 'lottery-scam' | 'courier-scam' | 
  'tech-support' | 'aadhaar-misuse' | 
  'electricity-bill' | 'insurance-fraud' | 
  'income-tax' | 'other';

export interface QuickReport {
  date: string;
  city: string;
  state: string;
  description: string;
}

export interface ScamNumberEntry {
  id: string;
  number: string;
  normalizedNumber: string;
  type: 'mobile' | 'landline' | 'toll-free' | 'unknown';
  scamType: ScamCallType;
  reportCount: number;
  firstReported: string;
  lastReported: string;
  state: string;
  telecom: string;
  description: string;
  scriptUsed: string;
  totalLossReported: number;
  verified: boolean;
  active: boolean;
  upvotes: number;
  reports: QuickReport[];
}

export interface UserReport {
  number: string;
  scamType: ScamCallType;
  description: string;
  city: string;
  state: string;
  date: string;
  amountLost?: number;
}

export interface LookupResult {
  found: boolean;
  entry: ScamNumberEntry | null;
  sourceConfidence: 'official-channel' | 'local-guidance' | 'unknown';
  riskLevel: 'unknown' | 'low' | 'medium' | 'high' | 'critical';
  message: string;
  messageHindi: string;
  suggestedAction: string;
  suggestedActionHindi: string;
  relatedNumbers: ScamNumberEntry[];
  safetyTips: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NumberLookupService {
  constructor() {}

  public loadDatabase(): Observable<ScamNumberEntry[]> {
    return of([]);
  }

  public normalizeNumber(input: string): string {
    if (!input) return '';
    let normalized = input.replace(/\D/g, '');
    if (normalized.length === 12 && normalized.startsWith('91')) {
      normalized = normalized.substring(2);
    } else if (normalized.length === 11 && normalized.startsWith('0')) {
      normalized = normalized.substring(1);
    }
    return normalized;
  }

  public validateIndianNumber(number: string): boolean {
    if (!number) return false;
    const normalized = this.normalizeNumber(number);
    // basic 10 digit check
    if (normalized.length !== 10) return false;
    // Mobile starts with 6-9, landlines can be anything technically but let's stick to basic check
    return /^[2-9]\d{9}$/.test(normalized); 
  }

  public getTelecomFromNumber(number: string): string {
    const normalized = this.normalizeNumber(number);
    if (normalized.length !== 10) return 'Unknown';
    
    const prefix = parseInt(normalized.substring(0, 4));
    if ((prefix >= 6000 && prefix <= 6099) || (prefix >= 7000 && prefix <= 7099) || (prefix >= 8000 && prefix <= 8099)) {
      return 'Jio';
    } else if (prefix >= 9800 && prefix <= 9899 || prefix >= 7200 && prefix <= 7299) {
      return 'Airtel';
    } else if (prefix >= 9400 && prefix <= 9499) {
      return 'BSNL';
    } else if (prefix >= 9600 && prefix <= 9699) {
      return 'Vi';
    }
    return 'Unknown';
  }

  public getStateFromNumber(number: string): string {
    const normalized = this.normalizeNumber(number);
    if (normalized.length !== 10) return 'Unknown';
    
    // Very simplified approximation
    const prefix = parseInt(normalized.substring(0, 2));
    if (prefix >= 98) return 'Delhi';
    if (prefix >= 94) return 'Maharashtra';
    if (prefix >= 90) return 'Karnataka';
    if (prefix >= 80) return 'Tamil Nadu';
    if (prefix >= 70) return 'Uttar Pradesh';
    
    return 'Unknown';
  }

  public async lookupNumber(input: string): Promise<LookupResult> {
    const normalized = this.normalizeNumber(input);
    const isValid = this.validateIndianNumber(normalized);

    const tips = [
      "Never answer calls from unknown numbers if you're not expecting them",
      "Any call demanding immediate money = scam",
      "Government agencies don't call asking for UPI payment",
      "Use DND (Do Not Disturb) — SMS DND to 1909"
    ];

    return {
      found: false,
      entry: null,
      sourceConfidence: 'unknown',
      riskLevel: 'unknown',
      message: isValid
        ? 'CySafeClick does not publish a public scam-number database. Use official channels to verify or report fraud.'
        : 'Please enter a valid 10-digit Indian phone number.',
      messageHindi: isValid
        ? 'CySafeClick सार्वजनिक स्कैम-नंबर डेटाबेस प्रकाशित नहीं करता। सत्यापन/रिपोर्टिंग के लिए आधिकारिक चैनलों का उपयोग करें।'
        : 'कृपया एक मान्य 10-अंकों का भारतीय फोन नंबर दर्ज करें।',
      suggestedAction: 'Do not share OTP, PIN, Aadhaar, card details, or money on a call. If you lost money, call 1930 immediately.',
      suggestedActionHindi: 'कॉल पर ओटीपी, पिन, आधार, कार्ड विवरण या पैसे साझा न करें। यदि पैसे कटे हैं तो तुरंत 1930 पर कॉल करें।',
      relatedNumbers: [],
      safetyTips: tips
    };
  }

  public getRelatedNumbers(scamType: ScamCallType, excludeId: string, db: ScamNumberEntry[]): ScamNumberEntry[] {
    return [];
  }

  public getCommunityReports(normalizedNumber?: string): UserReport[] {
    return [];
  }

  public addCommunityReport(number: string, report: UserReport): void {
    return;
  }

  /** Public community-report sync is disabled for privacy and moderation safety. */
  public syncLocalReportsToServer(): Observable<any> {
    return of({ synced: 0, disabled: true });
  }
}
