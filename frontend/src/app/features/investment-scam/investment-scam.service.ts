import { Injectable } from '@angular/core';

export interface PonziResult {
  annualReturn: number;
  verdict: string;
  isScam: boolean;
}

export interface InvestmentAnalysisResult {
  redFlags: string[];
  isHighRisk: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InvestmentScamService {

  analyzeText(text: string): InvestmentAnalysisResult {
    const redFlags: string[] = [];
    const lower = text.toLowerCase();

    if (/(guarantee|100% safe|no risk|risk-free|sure profit)/.test(lower)) {
      redFlags.push("Promises 'Guaranteed' or 'Risk-Free' returns. (SEBI: No legitimate investment guarantees returns).");
    }
    if (/(recruit|invite friends|refer [0-9]+ people|build a team)/.test(lower)) {
      redFlags.push("Requires recruitment to earn money (Classic Pyramid/MLM structure).");
    }
    if (/(sebi registered|rbi approved)/.test(lower) === false && /(crypto|bitcoin|trading|forex|option)/.test(lower)) {
      redFlags.push("Does not mention SEBI/RBI registration, which is mandatory for Indian financial operations.");
    }
    if (/(whatsapp group|telegram group|telegram channel|whatsapp admin)/.test(lower)) {
      redFlags.push("Operates primarily via WhatsApp or Telegram groups (Very common in 'Task' and 'Trading Signal' scams).");
    }
    if (/(double your money|triple your money|[2-5]x in|returns in (7|15|30) days)/.test(lower)) {
      redFlags.push("Promises to multiply money in a very short timeframe (e.g., 7/15/30 days).");
    }
    if (/(trading signals group|proof of earnings|screenshots of profit)/.test(lower)) {
      redFlags.push("Uses 'trading signals' and shares 'proof of earnings' screenshots (These are easily faked).");
    }
    if (/(ai trading|trading bot|algorithm generates|auto trading bot)/.test(lower)) {
      redFlags.push("Claims an 'AI/algorithm' generates guaranteed profit automatically.");
    }

    return {
      redFlags,
      isHighRisk: redFlags.length > 0
    };
  }

  calculatePonzi(promisedReturn: number, period: 'day' | 'week' | 'month' | 'year'): PonziResult {
    let annualReturn = 0;
    
    switch(period) {
      case 'day': annualReturn = promisedReturn * 365; break;
      case 'week': annualReturn = promisedReturn * 52; break;
      case 'month': annualReturn = promisedReturn * 12; break;
      case 'year': annualReturn = promisedReturn; break;
    }

    let verdict = "";
    let isScam = false;

    if (annualReturn <= 15) {
      verdict = "Realistic. Comparable to FD (~7%) or Nifty 50 average (~12-15%).";
      isScam = false;
    } else if (annualReturn > 15 && annualReturn <= 24) {
      verdict = "Aggressive. Higher than average market returns. Proceed with caution.";
      isScam = false;
    } else if (annualReturn > 24 && annualReturn <= 100) {
      verdict = "Extremely suspicious. Consistently beating the market by this much is nearly impossible.";
      isScam = true;
    } else {
      verdict = "Almost certainly a scam. No legitimate investment can sustain over 100% annual returns.";
      isScam = true;
    }

    return { annualReturn, verdict, isScam };
  }
}
