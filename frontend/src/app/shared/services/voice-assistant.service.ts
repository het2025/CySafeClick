import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceAssistantService {
  isSupported: boolean = false;
  private recognition: any;
  private synth = window.speechSynthesis;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      this.isSupported = true;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  getRecognition() {
    return this.recognition;
  }

  /**
   * Robust voice selection logic
   */
  private getVoice(lang: string): SpeechSynthesisVoice | null {
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Try exact match (e.g., hi-IN)
    let voice = voices.find(v => v.lang === lang);
    
    // 2. Try partial match (e.g., starts with 'hi')
    if (!voice) {
      const shortLang = lang.split('-')[0];
      voice = voices.find(v => v.lang.startsWith(shortLang));
    }

    // 3. Try specifically looking for "Hindi" in the name (fallback for some browsers)
    if (!voice && lang.startsWith('hi')) {
      voice = voices.find(v => v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('hi'));
    }

    return voice || null;
  }

  speak(text: string, lang: 'en-IN' | 'hi-IN' = 'en-IN') {
    if (!this.synth) return;
    this.synth.cancel(); 
    
    // Clean text for cleaner speech
    const cleanText = text.replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
                          .replace(/[⚠️🚨✅□🔗📋👍👎✔️❌]/g, '')
                          .replace(/[-*#]/g, ' ')
                          .replace(/\(.*\)/g, ''); // remove text in brackets

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Crucial: Manually set the voice object if found, otherwise the browser might stay silent
    const selectedVoice = this.getVoice(lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.lang = lang;
    utterance.rate = 0.85; // Slightly slower for better Hindi clarity
    utterance.pitch = 1.0;
    
    // Debug log to help if it still fails
    console.log(`TTS Attempt: Lang=${lang}, Voice=${selectedVoice?.name || 'Default'}`);

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
