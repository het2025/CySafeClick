import { Injectable } from '@angular/core';

export interface SenderInfo {
  from: string;
  replyTo: string;
  returnPath: string;
  messageId: string;
}

export interface AuthResults {
  spf: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none';
  dkim: 'pass' | 'fail' | 'none';
  dmarc: 'pass' | 'fail' | 'none';
  spfDomain: string;
  dkimDomain: string;
  dmarcDomain: string;
  explanation: string;
}

export interface HopInfo {
  from: string;
  by: string;
  timestamp: string;
  suspicious: boolean;
  reason?: string;
}

export interface HeaderFlag {
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
}

export interface EmailAnalysis {
  senderInfo: SenderInfo;
  authResults: AuthResults;
  routingPath: HopInfo[];
  riskAssessment: 'safe' | 'suspicious' | 'dangerous';
  flags: HeaderFlag[];
  summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailHeaderService {

  parseHeaders(rawHeaders: string): EmailAnalysis {
    const headers = this.parseRawHeaders(rawHeaders);
    
    const senderInfo = this.extractSenderInfo(headers);
    const authResults = this.extractAuthResults(headers);
    const routingPath = this.extractRoutingPath(headers);
    const flags: HeaderFlag[] = [];

    // Analyze Sender Info
    const fromDomain = this.extractDomain(senderInfo.from);
    const replyToDomain = this.extractDomain(senderInfo.replyTo);
    const returnPathDomain = this.extractDomain(senderInfo.returnPath);

    if (senderInfo.replyTo && fromDomain && replyToDomain && fromDomain !== replyToDomain) {
      flags.push({
        severity: 'high',
        title: 'Reply-To Mismatch',
        description: `The email claims to be from ${fromDomain} but replies will go to ${replyToDomain}. This is a classic phishing technique.`
      });
    }

    if (fromDomain && returnPathDomain && fromDomain !== returnPathDomain) {
      flags.push({
        severity: 'medium',
        title: 'Return-Path Mismatch',
        description: `The visible 'From' domain (${fromDomain}) does not match the actual 'Return-Path' domain (${returnPathDomain}).`
      });
    }

    // Analyze Auth Results
    if (authResults.spf === 'fail' || authResults.spf === 'softfail') {
      flags.push({
        severity: 'high',
        title: 'SPF Failure',
        description: 'The server that sent this email was not authorized by the domain owner. High chance of spoofing.'
      });
    }

    if (authResults.dmarc === 'fail') {
      flags.push({
        severity: 'high',
        title: 'DMARC Failure',
        description: 'The email failed DMARC policy checks, meaning it is likely fraudulent.'
      });
    }

    if (authResults.dkim === 'fail') {
      flags.push({
        severity: 'medium',
        title: 'DKIM Failure',
        description: 'The email signature is invalid, meaning the email may have been tampered with or forged.'
      });
    }

    // Subject checks
    const subject = headers.get('subject')?.[0]?.toLowerCase() || '';
    if (/(urgent|immediate|account suspended|verify your|password reset|invoice|payment)/.test(subject)) {
       flags.push({
         severity: 'low',
         title: 'Suspicious Subject Line',
         description: 'The subject contains common phishing keywords designed to create urgency.'
       });
    }

    let riskAssessment: 'safe' | 'suspicious' | 'dangerous' = 'safe';
    if (flags.some(f => f.severity === 'high')) {
      riskAssessment = 'dangerous';
    } else if (flags.some(f => f.severity === 'medium') || authResults.spf === 'none' || authResults.dmarc === 'none') {
      riskAssessment = 'suspicious';
    }

    let summary = '';
    if (riskAssessment === 'dangerous') {
      summary = 'This email appears to have been sent from a server not authorized by the domain it claims to be from. This is a strong indicator of spoofing or phishing. Do not click any links or download attachments.';
    } else if (riskAssessment === 'suspicious') {
      summary = 'This email lacks strong authentication or has mismatched return addresses. Treat it with caution.';
    } else {
      summary = 'This email passes basic authentication checks (SPF, DKIM, DMARC) and shows no obvious signs of spoofing. However, always remain vigilant against sophisticated social engineering.';
    }

    return {
      senderInfo,
      authResults,
      routingPath,
      riskAssessment,
      flags,
      summary
    };
  }

  private parseRawHeaders(raw: string): Map<string, string[]> {
    const headerMap = new Map<string, string[]>();
    const lines = raw.split(/\r?\n/);
    
    let currentKey = '';
    let currentValue = '';

    for (const line of lines) {
      if (line.match(/^\s+/)) {
        currentValue += ' ' + line.trim();
      } else {
        if (currentKey) {
          const existing = headerMap.get(currentKey) || [];
          existing.push(currentValue);
          headerMap.set(currentKey, existing);
        }
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
          currentKey = match[1].toLowerCase();
          currentValue = match[2];
        }
      }
    }
    
    if (currentKey) {
      const existing = headerMap.get(currentKey) || [];
      existing.push(currentValue);
      headerMap.set(currentKey, existing);
    }

    return headerMap;
  }

  private extractSenderInfo(headers: Map<string, string[]>): SenderInfo {
    return {
      from: headers.get('from')?.[0] || 'Unknown',
      replyTo: headers.get('reply-to')?.[0] || '',
      returnPath: headers.get('return-path')?.[0] || '',
      messageId: headers.get('message-id')?.[0] || ''
    };
  }

  private extractAuthResults(headers: Map<string, string[]>): AuthResults {
    const results: AuthResults = {
      spf: 'none', dkim: 'none', dmarc: 'none',
      spfDomain: '', dkimDomain: '', dmarcDomain: '',
      explanation: ''
    };

    const authHeaders = headers.get('authentication-results') || [];
    const authHeaderStr = authHeaders.join(' ').toLowerCase();

    // Simple parsing
    if (authHeaderStr.includes('spf=pass')) results.spf = 'pass';
    else if (authHeaderStr.includes('spf=fail')) results.spf = 'fail';
    else if (authHeaderStr.includes('spf=softfail')) results.spf = 'softfail';
    else if (authHeaderStr.includes('spf=neutral')) results.spf = 'neutral';

    if (authHeaderStr.includes('dkim=pass')) results.dkim = 'pass';
    else if (authHeaderStr.includes('dkim=fail')) results.dkim = 'fail';

    if (authHeaderStr.includes('dmarc=pass')) results.dmarc = 'pass';
    else if (authHeaderStr.includes('dmarc=fail')) results.dmarc = 'fail';

    return results;
  }

  private extractRoutingPath(headers: Map<string, string[]>): HopInfo[] {
    const received = headers.get('received') || [];
    const hops: HopInfo[] = [];

    // Received headers are usually prepended, so they are in reverse chronological order.
    // We reverse them to get chronological order.
    for (const rec of received.reverse()) {
      const fromMatch = rec.match(/from\s+([^\s]+)/i);
      const byMatch = rec.match(/by\s+([^\s]+)/i);
      const timeMatch = rec.split(';'); // Time is usually after the semicolon
      
      hops.push({
        from: fromMatch ? fromMatch[1] : 'Unknown',
        by: byMatch ? byMatch[1] : 'Unknown',
        timestamp: timeMatch.length > 1 ? timeMatch[timeMatch.length - 1].trim() : 'Unknown',
        suspicious: false
      });
    }

    return hops;
  }

  private extractDomain(emailStr: string): string {
    if (!emailStr) return '';
    const match = emailStr.match(/@([^>\s]+)/);
    return match ? match[1].toLowerCase() : '';
  }
}
