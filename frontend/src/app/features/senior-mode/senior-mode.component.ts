import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeniorModeService } from './senior-mode.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-senior-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './senior-mode.component.html',
  styleUrls: ['./senior-mode.component.css']
})
export class SeniorModeComponent {
  scamInput: string = '';
  scamResult: 'safe' | 'scam' | null = null;
  synth = window.speechSynthesis;

  constructor(public seniorService: SeniorModeService, public t: TranslationService) {}

  checkScam(): void {
    if (!this.scamInput.trim()) return;
    const lowerInput = this.scamInput.toLowerCase();
    
    // Simple heuristic for demo - these could also be moved to i18n but they are keys
    const redFlags = ['otp', 'password', 'money', 'urgent', 'arrest', 'police', 'hospital', 'lottery', 'prize', 'block', 'suspend', 'पैसे', 'ओटीपी', 'बैंक', 'अरेस्ट'];
    const isScam = redFlags.some(flag => lowerInput.includes(flag));
    
    this.scamResult = isScam ? 'scam' : 'safe';
  }

  readAloud(translationKey: string): void {
    if (!this.synth) return;
    this.synth.cancel();
    const text = this.t.translate(translationKey);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.t.currentLang() === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.85;
    this.synth.speak(utterance);
  }
}
