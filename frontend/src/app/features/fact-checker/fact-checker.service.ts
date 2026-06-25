import { Injectable } from '@angular/core';

export interface VerificationSource {
  name: string;
  url: string;
  description: string;
}

export interface FactCheckResult {
  credibilityScore: number;
  verdict: 'likely-true' | 'unverified' | 'likely-false' | 'known-misinformation';
  redFlags: string[];
  greenFlags: string[];
  checkingTips: string[];
  verificationLinks: VerificationSource[];
}

@Injectable({
  providedIn: 'root'
})
export class FactCheckerService {

  private readonly VERIFICATION_LINKS: VerificationSource[] = [
    { name: "PIB Fact Check", url: "https://pib.gov.in/factcheck", description: "Official Govt of India fact check" },
    { name: "Vishvas News", url: "https://www.vishvasnews.com/", description: "Certified Indian fact-checker" },
    { name: "Alt News", url: "https://www.altnews.in/", description: "Independent fact-checking website" },
    { name: "Boom Live", url: "https://www.boomlive.in/", description: "Digital journalism and fact-checking" },
    { name: "Factly", url: "https://factly.in/", description: "Data journalism and fact-checking" }
  ];

  analyzeText(text: string): FactCheckResult {
    let score = 100;
    const redFlags: string[] = [];
    const greenFlags: string[] = [];
    const lowerText = text.toLowerCase();

    // Structural Red Flags
    if (/(forward to|send this to) \d+ (people|groups)/.test(lowerText)) {
      score -= 40;
      redFlags.push("Chain message pattern ('Forward to X people') - almost always false.");
    }
    if (/(whatsapp will be shut down|account will be deleted if not forwarded|whatsapp is going to charge)/.test(lowerText)) {
      score -= 30;
      redFlags.push("Fake WhatsApp policy/shutdown threat.");
    }
    if (/(free recharge|free data|free iphone|spin the wheel to win)/.test(lowerText)) {
      score -= 40;
      redFlags.push("Classic 'Freebie' scam link pattern.");
    }
    if (/(doctors don't want you to know|government hiding this|secret cure|drink .* to cure)/.test(lowerText)) {
      score -= 30;
      redFlags.push("Conspiracy theory or unverified medical claim.");
    }
    if (text.match(/[A-Z]{5,}/g)?.length && (text.match(/[A-Z]{5,}/g)?.length || 0) > 3) {
      score -= 10;
      redFlags.push("Excessive use of ALL CAPS, a common tactic to artificially create urgency/panic.");
    }
    if (/(forwarded many times|forwarded as received)/.test(lowerText)) {
      score -= 10;
      redFlags.push("Message admits it is a forward, meaning the sender has not verified it.");
    }

    // India-Specific Red Flags
    if (/(ayushman bharat|pm-kisan|free laptop scheme|modi government gives ₹)/.test(lowerText) && !/(pmindia\.gov\.in|mygov\.in|gov\.in)/.test(lowerText)) {
      score -= 30;
      redFlags.push("Mentions a government scheme but lacks an official '.gov.in' link.");
    }
    if (/(rbi order|sebi order|trai rule)/.test(lowerText) && !/(rbi\.org\.in|sebi\.gov\.in|trai\.gov\.in)/.test(lowerText)) {
      score -= 20;
      redFlags.push("Claims a regulatory order without citing the official regulatory website.");
    }

    // Green Flags
    if (/(pib\.gov\.in|thehindu\.com|indianexpress\.com|ndtv\.com|timesofindia\.com)/.test(lowerText)) {
      score += 20;
      greenFlags.push("Links to a recognized news or government source.");
    }
    if (/https?:\/\//.test(lowerText) && !/(free|win|gift|spin)/.test(lowerText)) {
      greenFlags.push("Contains a URL (Should still be manually verified).");
    }

    score = Math.max(0, Math.min(100, score));

    let verdict: FactCheckResult['verdict'] = 'unverified';
    if (score >= 80) verdict = 'likely-true';
    else if (score >= 50) verdict = 'unverified';
    else if (score >= 20) verdict = 'likely-false';
    else verdict = 'known-misinformation';

    return {
      credibilityScore: score,
      verdict,
      redFlags,
      greenFlags,
      checkingTips: [
        "Google the exact claim in quotes.",
        "Do a reverse image search on any attached photos.",
        "Check if PIB Fact Check has already debunked this."
      ],
      verificationLinks: this.VERIFICATION_LINKS
    };
  }
}
