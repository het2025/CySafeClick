/**
 * SafeClick Translation System for Static HTML Pages
 * This script handles switching between English and Hindi.
 * It fetches translation data from src/assets/i18n/ folder.
 */

class StaticTranslator {
    constructor() {
        this.currentLang = localStorage.getItem('preferred-lang') || 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadLanguage(this.currentLang);
        this.applyTranslations();
        this.setupEventListeners();
    }

    async loadLanguage(lang) {
        if (this.translations[lang]) return;

        try {
            // Path adjustment: static files are in root, json files are in assets/i18n
            // Note: In local development, you might need a local server to fetch JSON
            const response = await fetch(`src/assets/i18n/${lang}.json`);
            if (!response.ok) throw new Error('Failed to load');
            this.translations[lang] = await response.json();
        } catch (error) {
            console.error(`Error loading language ${lang}:`, error);
            // Fallback to minimal hardcoded if necessary
            if (!this.translations[lang]) this.translations[lang] = {};
        }
    }

    applyTranslations() {
        const langData = this.translations[this.currentLang];
        if (!langData) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.getValueByKey(langData, key);
            
            if (translation) {
                if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'password' || el.type === 'search')) {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = this.getValueByKey(langData, key);
            if (translation) {
                el.title = translation;
            }
        });

        // Update document lang attribute
        document.documentElement.lang = this.currentLang;

        // Update toggle button text
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.textContent = this.currentLang === 'en' ? 'हिंदी' : 'English';
        }
    }

    getValueByKey(obj, key) {
        if (!obj) return null;
        return key.split('.').reduce((o, i) => (o ? o[i] : null), obj);
    }

    translate(key) {
        const langData = this.translations[this.currentLang];
        return this.getValueByKey(langData, key) || key;
    }

    async toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
        localStorage.setItem('preferred-lang', this.currentLang);
        await this.loadLanguage(this.currentLang);
        this.applyTranslations();
        
        // Notify other parts of the app that language has changed
        console.log('Language changed to:', this.currentLang);
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: this.currentLang } 
        }));
    }

    setupEventListeners() {
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => this.toggleLanguage());
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.safeclickTranslator = new StaticTranslator();
    // Dispatch event for other scripts to know translator is ready
    document.dispatchEvent(new CustomEvent('translatorReady'));
});
