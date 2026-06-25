import { Injectable } from '@angular/core';

export interface MatrimonialAnalysis {
  score: number;
  redFlags: string[];
  isCritical: boolean;
}

@Injectable({ providedIn: 'root' })
export class MatrimonialSafetyService {

  analyzeProfile(text: string): MatrimonialAnalysis {
    let score = 0;
    const redFlags: string[] = [];
    const lower = text.toLowerCase();

    if (/(nri|uk|us|usa|canada|dubai|london)/.test(lower) && /(whatsapp|phone number)/.test(lower)) {
      score += 20;
      redFlags.push("Claims to be NRI but quickly provides WhatsApp number (Common tactic to avoid platform monitoring).");
    }
    if (/(army general|navy officer|doctor in uk|nasa engineer|un official|united nations)/.test(lower)) {
      score += 15;
      redFlags.push("Claims a highly prestigious, overseas profession (Often used to build fake authority).");
    }
    if (/(widow|widowed)/.test(lower) && /(millionaire|rich|business owner|ceo)/.test(lower)) {
      score += 15;
      redFlags.push("Classic 'Wealthy Widow(er)' trope designed to attract sympathetic victims.");
    }
    if (/(delete this profile|leaving this app soon|chat on whatsapp directly)/.test(lower)) {
      score += 20;
      redFlags.push("Rushes to move the conversation off the matrimonial platform.");
    }

    return { score: Math.min(100, score), redFlags, isCritical: score >= 40 };
  }

  analyzeChat(text: string): MatrimonialAnalysis {
    let score = 0;
    const redFlags: string[] = [];
    const lower = text.toLowerCase();
    let isCritical = false;

    if (/(send money|need money|financial help|transfer via upi|bank account|paytm|gpay|loan)/.test(lower)) {
      score += 50;
      redFlags.push("CRITICAL: Asking for money for any reason.");
      isCritical = true;
    }
    if (/(customs|custom duty|clearance fee|gift stuck at airport|expensive gift|gold watch|iphone parcel)/.test(lower)) {
      score += 50;
      redFlags.push("CRITICAL: The 'Customs Gift' scam. A fake official will call asking for money to release a non-existent gift.");
      isCritical = true;
    }
    if (/(medical emergency|hospital bill|accident|surgery|sick mother|sick father)/.test(lower) && /(money|pay|help)/.test(lower)) {
      score += 40;
      redFlags.push("Sudden medical emergency requiring immediate funds.");
      isCritical = true;
    }
    if (/(send a photo of you|send intimate|nude|undress|video call alone)/.test(lower)) {
      score += 40;
      redFlags.push("Requests for intimate photos or video calls (High risk of Sextortion blackmail).");
      isCritical = true;
    }
    if (/(i love you|my soulmate|my wife|my husband)/.test(lower)) {
      score += 15;
      redFlags.push("Love-bombing: Excessive affection very early in the conversation to build blind trust.");
    }
    if (/(aadhaar|pan card|bank details|account number|otp)/.test(lower)) {
      score += 30;
      redFlags.push("Asking for sensitive personal or banking documents.");
      isCritical = true;
    }

    return { score: Math.min(100, score), redFlags, isCritical };
  }
}
