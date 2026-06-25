import { Injectable } from '@angular/core';

export interface ScamAnalysisResult {
  score: number;
  verdict: 'Safe to Apply' | 'Verify Before Applying' | 'Likely Scam' | 'Confirmed Scam Pattern';
  redFlags: string[];
  legitSignals: string[];
}

@Injectable({
  providedIn: 'root'
})
export class JobScamDetectorService {

  analyzeJobPost(text: string): ScamAnalysisResult {
    let score = 0;
    const redFlags: string[] = [];
    const legitSignals: string[] = [];
    const lowerText = text.toLowerCase();

    // High-risk patterns (+20 pts each)
    if (/(security deposit|registration fee|processing fee|interview fee)/.test(lowerText)) {
      score += 20;
      redFlags.push("Asks for upfront payment (security deposit / registration fee)");
    }
    if (/work from home/.test(lowerText) && /(daily|earn ₹[1-9]\d{3,})/.test(lowerText) && /no experience/.test(lowerText)) {
      score += 20;
      redFlags.push("Unrealistic daily earnings for a work-from-home job with no experience");
    }
    if (/data entry/.test(lowerText) && /(just need phone|only laptop)/.test(lowerText)) {
      score += 20;
      redFlags.push("Data entry job promising high pay with minimal equipment requirements");
    }
    if (/whatsapp number/.test(lowerText) && !/@[a-z0-9-]+\.[a-z]{2,}/.test(lowerText)) {
      score += 20;
      redFlags.push("Contact only via WhatsApp without an official email address");
    }
    if (/without interview/.test(lowerText)) {
      score += 20;
      redFlags.push("Job offer without a formal interview process");
    }
    if (/immediate joining/.test(lowerText) && /no documents required/.test(lowerText)) {
      score += 20;
      redFlags.push("Immediate joining with no background or document check");
    }
    if (/refer friends/.test(lowerText) && /earn commission/.test(lowerText)) {
      score += 20;
      redFlags.push("MLM or pyramid scheme recruitment structure");
    }
    if (/(like videos|share videos|watch videos) to earn/.test(lowerText) || /task based/.test(lowerText)) {
      score += 20;
      redFlags.push("Task-based scam (like/share videos to earn)");
    }

    // Medium-risk patterns (+10 pts each)
    if (/(@gmail\.com|@yahoo\.com|@outlook\.com)/.test(lowerText)) {
      score += 10;
      redFlags.push("Uses free email (Gmail/Yahoo) instead of a company domain");
    }
    if (/(limited spots|urgent hiring|apply today only)/.test(lowerText)) {
      score += 10;
      redFlags.push("Uses high-pressure urgency tactics ('Limited spots')");
    }
    if (/(send aadhaar|send pan|bank details before)/.test(lowerText)) {
      score += 10;
      redFlags.push("Requires sensitive personal documents upfront before joining");
    }

    // Legitimate signal bonuses (-10 pts each)
    if (/(www\.|http)/.test(lowerText) && !/@gmail/.test(lowerText)) {
      score -= 10;
      legitSignals.push("Mentions a company website URL");
    }
    if (/linkedin\.com\/company/.test(lowerText) || /naukri\.com|indeed\.com/.test(lowerText)) {
      score -= 10;
      legitSignals.push("References a verified professional platform (LinkedIn, Naukri, Indeed)");
    }
    if (/cin:? ?[lu][0-9]{5}[a-z]{2}[0-9]{4}[a-z]{3}[0-9]{6}/.test(lowerText)) {
      score -= 10;
      legitSignals.push("Provides a Corporate Identification Number (CIN)");
    }
    if (/(responsibilities|requirements|qualifications|experience required)/.test(lowerText)) {
      score -= 10;
      legitSignals.push("Lists specific job responsibilities and requirements");
    }

    // Bound score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    let verdict: ScamAnalysisResult['verdict'];
    if (score >= 60) {
      verdict = 'Confirmed Scam Pattern';
    } else if (score >= 30) {
      verdict = 'Likely Scam';
    } else if (score >= 10) {
      verdict = 'Verify Before Applying';
    } else {
      verdict = 'Safe to Apply';
    }

    return { score, verdict, redFlags, legitSignals };
  }
}
