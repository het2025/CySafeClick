import { Injectable } from '@angular/core';

export interface DealAnalysis {
  riskScore: number;
  verdict: string;
  flags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EcommerceFraudService {

  analyzeDeal(productName: string, actualPrice: number, dealPrice: number, url: string, hasTimer: boolean, isPrepaidOnly: boolean): DealAnalysis {
    let riskScore = 0;
    const flags: string[] = [];

    // Discount check
    const discountPercent = ((actualPrice - dealPrice) / actualPrice) * 100;
    if (discountPercent > 60) {
      riskScore += 40;
      flags.push(`Extremely high discount (${Math.round(discountPercent)}%). If it's too good to be true, it probably is a scam.`);
    } else if (discountPercent > 40) {
      riskScore += 20;
      flags.push(`High discount (${Math.round(discountPercent)}%). Verify the seller carefully.`);
    }

    // URL check
    const knownSafe = /(amazon\.in|flipkart\.com|meesho\.com|myntra\.com|nykaa\.com|ajio\.com|tatacliq\.com|reliance|croma)/i;
    if (url && !knownSafe.test(url)) {
      riskScore += 30;
      flags.push("Website is not a known major Indian e-commerce platform. High risk of non-delivery.");
    }

    if (hasTimer) {
      riskScore += 15;
      flags.push("Uses a countdown timer (Limited Time Offer). This is a common pressure tactic to prevent you from doing research.");
    }

    if (isPrepaidOnly && (!url || !knownSafe.test(url))) {
      riskScore += 30;
      flags.push("Only allows Prepaid/UPI (No Cash on Delivery) on an unknown website. High risk of losing money.");
    }

    riskScore = Math.min(100, riskScore);
    
    let verdict = '';
    if (riskScore >= 70) verdict = 'HIGH RISK: Likely Scam';
    else if (riskScore >= 40) verdict = 'MEDIUM RISK: Proceed with Caution';
    else verdict = 'LOW RISK: Seems Safe';

    return { riskScore, verdict, flags };
  }
}
