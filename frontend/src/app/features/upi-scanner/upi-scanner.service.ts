import { Injectable } from '@angular/core';

export interface UpiScanResult {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  riskScore: number; // 0-100
  flags: UpiFlag[];
  vpaAnalysis: VpaAnalysis;
  recommendations: string[];
}

export interface UpiFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  detail: string;
}

export interface VpaAnalysis {
  username: string;
  bank: string;
  bankRiskLevel: 'legitimate' | 'flagged' | 'unknown';
  isCollectRequest: boolean;
  suspiciousPatterns: string[];
}

const UPI_HANDLE_TO_BANK: { [key: string]: string } = {
  '@okaxis': 'Axis Bank (Google Pay)',
  '@oksbi': 'SBI (Google Pay)',
  '@okicici': 'ICICI Bank (Google Pay)',
  '@okhdfcbank': 'HDFC Bank (Google Pay)',
  '@ybl': 'Yes Bank (PhonePe)',
  '@ibl': 'IDFC Bank (PhonePe)',
  '@axl': 'Axis Bank (PhonePe)',
  '@paytm': 'Paytm Payments Bank',
  '@ptyes': 'Yes Bank (Paytm)',
  '@icici': 'ICICI Bank',
  '@hdfcbank': 'HDFC Bank',
  '@sbi': 'State Bank of India',
  '@upi': 'NPCI / Generic UPI',
  '@apl': 'Amazon Pay'
};

const FLAGGED_HANDLES = ['@ybl', '@ibl']; // Often misused by scammers
const SUSPICIOUS_USERNAMES = ['reward', 'prize', 'win', 'lucky', 'gift', 'free', 'refund', 'cashback', 'bonus', 'aadhaar', 'pan', 'kyc', 'verify', 'update', 'sbi', 'hdfc', 'icici', 'paytm', 'phonepe', 'gpay'];
const SUSPICIOUS_NOTES = ['otp', 'pin', 'cvv', 'immediately', 'urgent', 'penalty', 'fine', 'blocked', 'last chance'];
const IMPERSONATION_TARGETS = ['amazon', 'flipkart', 'paytm', 'sbi', 'hdfc', 'income tax', 'trai', 'govt', 'irctc'];

@Injectable({
  providedIn: 'root'
})
export class UpiScannerService {

  analyze(input: string): UpiScanResult {
    let riskScore = 0;
    const flags: UpiFlag[] = [];
    const recommendations: string[] = [];
    
    const isUrl = input.toLowerCase().startsWith('upi://pay');
    let vpa = '';
    let amount = '';
    let note = '';
    let name = '';
    let isCollectRequest = false;

    if (isUrl) {
      try {
        const url = new URL(input);
        const params = new URLSearchParams(url.search);
        vpa = params.get('pa') || '';
        name = params.get('pn') || '';
        amount = params.get('am') || '';
        note = params.get('tn') || '';
        
        // Rule 1: Collect Request
        if (params.get('am') && params.get('tr')) {
          isCollectRequest = true;
          flags.push({
            type: 'Collect Request',
            severity: 'high',
            description: 'This is a collect request disguised as a payment link.',
            detail: 'Accepting this will SEND money from your account, not receive it.'
          });
          riskScore += 80;
        }
      } catch (e) {
        // Invalid URL
        return this.getDefaultErrorResult();
      }
    } else {
      vpa = input.trim();
    }

    if (!vpa || !vpa.includes('@')) {
      return this.getDefaultErrorResult();
    }

    const [username, handle] = vpa.toLowerCase().split('@');
    const formattedHandle = '@' + handle;
    const bank = UPI_HANDLE_TO_BANK[formattedHandle] || 'Unknown Bank';

    // Rule 2: Flagged Handles
    let bankRiskLevel: 'legitimate' | 'flagged' | 'unknown' = 'unknown';
    if (FLAGGED_HANDLES.includes(formattedHandle)) {
      bankRiskLevel = 'flagged';
      flags.push({
        type: 'High-Risk Bank Handle',
        severity: 'medium',
        description: 'This bank handle is frequently used by scammers.',
        detail: `The handle ${formattedHandle} allows easy VPA creation and is often exploited.`
      });
      riskScore += 30;
    } else if (UPI_HANDLE_TO_BANK[formattedHandle]) {
      bankRiskLevel = 'legitimate';
    }

    // Rule 3: Username Red Flags
    const suspiciousPatterns: string[] = [];
    for (const keyword of SUSPICIOUS_USERNAMES) {
      if (username.includes(keyword)) {
        suspiciousPatterns.push(keyword);
        flags.push({
          type: 'Suspicious Username',
          severity: 'high',
          description: `Username contains deceptive keyword: "${keyword}"`,
          detail: 'Official entities use verified business accounts, not standard consumer VPAs with these keywords.'
        });
        riskScore += 40;
      }
    }

    if (/^\d{10}$/.test(username)) {
      flags.push({
        type: 'Phone Number VPA',
        severity: 'medium',
        description: 'VPA is based on a 10-digit mobile number.',
        detail: 'This is a personal account, not a verified business account. Use caution.'
      });
      riskScore += 20;
    }

    // Rule 4: Amount Anomaly
    if (amount) {
      const numAmount = parseFloat(amount);
      if ([1, 2, 10, 0.50, 0.01].includes(numAmount)) {
        flags.push({
          type: 'Verification Fee Scam',
          severity: 'high',
          description: `Unusual amount (₹${amount}) requested.`,
          detail: 'Scammers use small amounts to verify your UPI PIN before sending large collect requests.'
        });
        riskScore += 60;
      } else if (numAmount >= 100000 && numAmount % 10000 === 0) {
        flags.push({
          type: 'Unusually Large Amount',
          severity: 'high',
          description: `Extremely large round amount (₹${amount}).`,
          detail: 'Be absolutely certain before authorizing such a large transaction.'
        });
        riskScore += 50;
      }
    }

    // Rule 5: Fake Merchant Name
    if (name) {
      const lowerName = name.toLowerCase();
      let isImpersonation = false;
      for (const target of IMPERSONATION_TARGETS) {
        if (lowerName.includes(target) && !username.includes(target)) {
          isImpersonation = true;
          flags.push({
            type: 'Merchant Impersonation',
            severity: 'high',
            description: `Name claims to be "${target}" but VPA does not match.`,
            detail: 'Scammers can set any display name. Always trust the VPA (username@bank) over the display name.'
          });
          riskScore += 70;
          break;
        }
      }
    }

    // Rule 6: Note Manipulation
    if (note) {
      const lowerNote = note.toLowerCase();
      for (const keyword of SUSPICIOUS_NOTES) {
        if (lowerNote.includes(keyword)) {
          flags.push({
            type: 'Malicious Note Field',
            severity: 'high',
            description: `Note contains high-risk keyword: "${keyword}"`,
            detail: 'Legitimate payment requests never ask for OTPs or use threatening/urgent language in the note.'
          });
          riskScore += 80;
        }
      }
    }

    let riskLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
    if (riskScore >= 70) {
      riskLevel = 'dangerous';
      recommendations.push('Do NOT pay. This appears to be a scam collect request.');
      recommendations.push('Report this VPA on cybercrime.gov.in.');
    } else if (riskScore >= 30) {
      riskLevel = 'suspicious';
      recommendations.push('Proceed with caution. Call the merchant directly on a known number to verify.');
      recommendations.push('Double-check the VPA username, not just the display name.');
    } else {
      recommendations.push('Looks okay. Always verify the recipient name before entering your PIN.');
    }

    return {
      riskLevel,
      riskScore: Math.min(100, riskScore),
      flags,
      vpaAnalysis: {
        username,
        bank,
        bankRiskLevel,
        isCollectRequest,
        suspiciousPatterns
      },
      recommendations
    };
  }

  private getDefaultErrorResult(): UpiScanResult {
    return {
      riskLevel: 'safe',
      riskScore: 0,
      flags: [{
        type: 'Invalid Format',
        severity: 'low',
        description: 'Could not parse UPI ID or Link.',
        detail: 'Please enter a valid format like name@bank or a upi://pay link.'
      }],
      vpaAnalysis: { username: '', bank: '', bankRiskLevel: 'unknown', isCollectRequest: false, suspiciousPatterns: [] },
      recommendations: ['Please verify the format of the text you entered.']
    };
  }
}
