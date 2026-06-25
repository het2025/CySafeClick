/**
 * CySafeClick Translation System for Chrome Extension
 */

class ExtensionTranslator {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        // Get saved language from chrome storage
        const result = await chrome.storage.local.get(['preferred-lang']);
        this.currentLang = result['preferred-lang'] || 'en';
        
        await this.loadLanguage(this.currentLang);
        this.applyTranslations();
        this.setupEventListeners();
    }

    async loadLanguage(lang) {
        if (this.translations[lang]) return;

        try {
            // In extension, fetch from local assets folder
            const response = await fetch(chrome.runtime.getURL(`assets/i18n/${lang}.json`));
            if (!response.ok) throw new Error('Failed to load');
            this.translations[lang] = await response.json();
        } catch (error) {
            console.error(`Error loading language ${lang}:`, error);
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

        // Update toggle button text if it exists
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
        await chrome.storage.local.set({ 'preferred-lang': this.currentLang });
        await this.loadLanguage(this.currentLang);
        this.applyTranslations();
        
        // Notify other parts of the extension
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
    window.cysafeclickTranslator = new ExtensionTranslator();
    document.dispatchEvent(new CustomEvent('translatorReady'));
});
