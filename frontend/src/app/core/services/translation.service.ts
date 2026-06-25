import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

export type Language = 'en' | 'hi';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private http = inject(HttpClient);
  
  currentLang = signal<Language>((localStorage.getItem('preferred-lang') as Language) || 'en');
  
  // Hardcoded fallback data for critical keys to ensure UI is never broken
  private static readonly FALLBACK_DATA: Record<string, any> = {
    'en': {
      'NAV': { 'HOME': 'Home', 'CYBER_MITRA': 'Cyber Mitra', 'SENIOR_MODE': 'Senior Mode' },
      'HERO': { 'TITLE': 'Is Your Digital Life Safe?', 'SUBTITLE': 'Your Free Digital Safety Hub for India', 'CTA': 'Get Your Safety Score', 'COUNTER': 'Citizens Guided' },
      'TOOLS': { 'TITLE': 'All Tools', 'OPEN': 'Open', 'CAT_ALL': 'All', 'CAT_TOOLS': 'Tools', 'CAT_LEARN': 'Learn', 'CAT_COMMUNITY': 'Community', 'CAT_MODES': 'Modes' },
      'TICKER': { 'LIVE_ALERTS': 'LIVE ALERTS' },
      'MAP': { 'TITLE': 'India Cyber Threat Map', 'SUBTITLE': 'Live view of fraud activity across states', 'LEGEND': { 'LOW': 'Low', 'MODERATE': 'Moderate', 'HIGH': 'High', 'VERY_HIGH': 'Very High', 'CRITICAL': 'Critical' }, 'VIEW': { 'THREAT': 'Threat Level', 'COUNT': 'Report Count', 'TREND': 'Trend' }, 'STATE': { 'WEEKLY_REPORTS': 'Weekly Reports', 'MONTHLY_LOSS': 'Monthly Loss' }, 'NO_STATE': 'Click any state on the map to see detailed threat information.', 'NATIONAL': { 'TOTAL_REPORTS': 'Total Reports' } }
    },
    'hi': {
      'NAV': { 'HOME': 'होम', 'CYBER_MITRA': 'साइबर मित्र', 'SENIOR_MODE': 'सीनियर मोड' },
      'HERO': { 'TITLE': 'क्या आपका डिजिटल जीवन सुरक्षित है?', 'SUBTITLE': 'भारत के लिए आपका मुफ्त डिजिटल सुरक्षा केंद्र', 'CTA': 'अपना सुरक्षा स्कोर जानें', 'COUNTER': 'नागरिकों का मार्गदर्शन किया' },
      'TOOLS': { 'TITLE': 'सभी टूल्स', 'OPEN': 'खोलें', 'CAT_ALL': 'सभी', 'CAT_TOOLS': 'टूल्स', 'CAT_LEARN': 'सीखें', 'CAT_COMMUNITY': 'समुदाय', 'CAT_MODES': 'मोड्स' },
      'TICKER': { 'LIVE_ALERTS': 'लाइव अलर्ट' },
      'MAP': { 'TITLE': 'भारत साइबर थ्रेट मैप', 'SUBTITLE': 'राज्यों में धोखाधड़ी गतिविधि का लाइव दृश्य', 'LEGEND': { 'LOW': 'निम्न', 'MODERATE': 'मध्यम', 'HIGH': 'उच्च', 'VERY_HIGH': 'बहुत उच्च', 'CRITICAL': 'गंभीर' }, 'VIEW': { 'THREAT': 'खतरे का स्तर', 'COUNT': 'रिपोर्ट संख्या', 'TREND': 'प्रवृत्ति' }, 'STATE': { 'WEEKLY_REPORTS': 'साप्ताहिक रिपोर्ट', 'MONTHLY_LOSS': 'मासिक नुकसान' }, 'NO_STATE': 'विस्तृत खतरे की जानकारी देखने के लिए मानचित्र पर किसी भी राज्य पर क्लिक करें।', 'NATIONAL': { 'TOTAL_REPORTS': 'कुल रिपोर्ट' } }
    }
  };

  private translationsData = signal<Record<string, any>>(TranslationService.FALLBACK_DATA);
  private loadingState: Record<string, boolean> = {};

  constructor() {
    this.loadTranslations(this.currentLang());
  }

  private loadTranslations(lang: Language) {
    if (this.loadingState[lang]) return;
    this.loadingState[lang] = true;

    // Try multiple paths just in case
    this.http.get(`assets/i18n/${lang}.json`).pipe(
      tap(data => {
        console.log(`Successfully loaded ${lang}.json`);
        this.translationsData.update(prev => ({
          ...prev,
          [lang]: { ...TranslationService.FALLBACK_DATA[lang], ...(data as object) }
        }));
      }),
      catchError(err => {
        console.error(`Failed to load ${lang}.json from primary path`, err);
        return this.http.get(`./assets/i18n/${lang}.json`); // Try relative path
      }),
      catchError(err => {
        console.error(`Failed to load ${lang}.json from secondary path`, err);
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.translationsData.update(prev => ({
          ...prev,
          [lang]: { ...TranslationService.FALLBACK_DATA[lang], ...(data as object) }
        }));
      }
    });
  }

  translate(key: string): string {
    const lang = this.currentLang();
    const data = this.translationsData()[lang] || TranslationService.FALLBACK_DATA[lang];

    const keys = key.split('.');
    let value = data;
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  /**
   * Returns raw translation data (arrays, objects) for structured i18n keys.
   * Use this instead of translate() when the value is not a plain string.
   */
  translateData(key: string): any {
    const lang = this.currentLang();
    const data = this.translationsData()[lang] || TranslationService.FALLBACK_DATA[lang];

    const keys = key.split('.');
    let value = data;

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return [];
      }
    }

    return value;
  }

  toggleLanguage() {
    const newLang = this.currentLang() === 'en' ? 'hi' : 'en';
    this.currentLang.set(newLang);
    localStorage.setItem('preferred-lang', newLang);
    this.loadTranslations(newLang);
  }
}
