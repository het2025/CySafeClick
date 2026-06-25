document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const urlArea = document.getElementById('url-input-area');
    const msgArea = document.getElementById('msg-input-area');
    const scanBtn = document.getElementById('scan-btn');
    const resultsArea = document.getElementById('results-area');
    const riskDisplay = document.getElementById('risk-display');
    const checksList = document.getElementById('checks-list');
    const adviceText = document.getElementById('advice-text');

    let currentMode = 'url';

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMode = tab.getAttribute('data-tab');
            urlArea.style.display = currentMode === 'url' ? 'block' : 'none';
            msgArea.style.display = currentMode === 'msg' ? 'block' : 'none';
            resultsArea.style.display = 'none';
        });
    });

    scanBtn.addEventListener('click', () => {
        const input = currentMode === 'url' ? document.getElementById('url-text').value : document.getElementById('msg-text').value;
        if (!input.trim()) return;

        resultsArea.style.display = 'block';
        if (currentMode === 'url') {
            analyzeURL(input);
        } else {
            analyzeMessage(input);
        }
    });

    function analyzeURL(url) {
        const checks = [];
        let riskScore = 0;
        const t = window.safeclickTranslator;

        // Helper to get i18n array with fallback
        function getList(key, fallback) {
            const val = t.translate(key);
            return Array.isArray(val) ? val : fallback;
        }

        // 1. HTTP vs HTTPS
        if (url.startsWith('http://')) {
            checks.push({ label: t.translate('PHISHING_DETECTOR.CHECKS.HTTP.LABEL'), risk: 'high', desc: t.translate('PHISHING_DETECTOR.CHECKS.HTTP.DESC') });
            riskScore += 30;
        }

        // 2. Suspicious Keywords (from i18n)
        const keywords = getList('PHISHING_DETECTOR.URL_KEYWORDS', ['login', 'verify', 'update', 'secure', 'bank', 'paytm', 'upi', 'aadhaar', 'kyc', 'reward', 'winner', 'free', 'sbi', 'hdfc']);
        const foundKeywords = keywords.filter(k => url.toLowerCase().includes(k));
        if (foundKeywords.length > 0) {
            checks.push({ label: t.translate('PHISHING_DETECTOR.CHECKS.KEYWORDS.LABEL'), risk: 'med', desc: t.translate('PHISHING_DETECTOR.CHECKS.KEYWORDS.DESC') + foundKeywords.join(', ') });
            riskScore += 15 * foundKeywords.length;
        }

        // 3. TLD Check (from i18n)
        const suspiciousTLDs = getList('PHISHING_DETECTOR.URL_SUSPICIOUS_TLDS', ['.xyz', '.top', '.click', '.online', '.site', '.link', '.info']);
        if (suspiciousTLDs.some(tld => url.toLowerCase().endsWith(tld) || url.toLowerCase().includes(tld + '/'))) {
            checks.push({ label: t.translate('PHISHING_DETECTOR.CHECKS.TLD.LABEL'), risk: 'med', desc: t.translate('PHISHING_DETECTOR.CHECKS.TLD.DESC') });
            riskScore += 20;
        }

        // 4. IP instead of Domain
        const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        if (ipPattern.test(url)) {
            checks.push({ label: t.translate('PHISHING_DETECTOR.CHECKS.IP.LABEL'), risk: 'high', desc: t.translate('PHISHING_DETECTOR.CHECKS.IP.DESC') });
            riskScore += 40;
        }

        // 5. URL Shorteners (from i18n)
        const shorteners = getList('PHISHING_DETECTOR.URL_SHORTENERS', ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'is.gd']);
        if (shorteners.some(s => url.toLowerCase().includes(s))) {
            checks.push({ label: t.translate('PHISHING_DETECTOR.CHECKS.SHORTENER.LABEL'), risk: 'med', desc: t.translate('PHISHING_DETECTOR.CHECKS.SHORTENER.DESC') });
            riskScore += 10;
        }

        displayResults(riskScore, checks);
    }

    function analyzeMessage(text) {
        const checks = [];
        let riskScore = 0;
        const t = window.safeclickTranslator;

        // Helper to get i18n array with fallback
        function getList(key, fallback) {
            const val = t.translate(key);
            return Array.isArray(val) ? val : fallback;
        }

        // 1. Urgency/Fear (from i18n)
        const urgency = getList('PHISHING_DETECTOR.MSG_URGENCY_WORDS', ['immediately', 'blocked', 'suspended', '24 hours', 'tonight', 'last chance', 'kyc pending']);
        if (urgency.some(u => text.toLowerCase().includes(u))) {
            checks.push({ label: t.translate('PHISHING_DETECTOR.CHECKS.URGENCY.LABEL'), risk: 'high', desc: t.translate('PHISHING_DETECTOR.CHECKS.URGENCY.DESC') });
            riskScore += 30;
        }

        // 2. Prize/Money (from i18n)
        const prizes = getList('PHISHING_DETECTOR.MSG_PRIZE_WORDS', ['won', 'prize', 'lottery', 'reward', 'cashback', 'gift', 'iphone', 'crore', 'lakh']);
        if (prizes.some(p => text.toLowerCase().includes(p))) {
            checks.push({ label: t.translate('PHISHING_DETECTOR.CHECKS.PRIZE.LABEL'), risk: 'high', desc: t.translate('PHISHING_DETECTOR.CHECKS.PRIZE.DESC') });
            riskScore += 30;
        }

        // 3. Sensitive requests (from i18n)
        const sensitive = getList('PHISHING_DETECTOR.MSG_SENSITIVE_WORDS', ['otp', 'pin', 'cvv', 'password', 'share']);
        if (sensitive.some(s => text.toLowerCase().includes(s))) {
            checks.push({ label: t.translate('PHISHING_DETECTOR.CHECKS.SENSITIVE.LABEL'), risk: 'high', desc: t.translate('PHISHING_DETECTOR.CHECKS.SENSITIVE.DESC') });
            riskScore += 40;
        }

        // 4. Brand Impersonation (from i18n)
        const brands = getList('PHISHING_DETECTOR.MSG_BRAND_NAMES', ['sbi', 'paytm', 'hdfc', 'icici', 'axis', 'rbi', 'income tax', 'trai', 'amazon', 'flipkart']);
        const foundBrands = brands.filter(b => text.toLowerCase().includes(b));
        if (foundBrands.length > 0) {
            checks.push({ label: t.translate('PHISHING_DETECTOR.CHECKS.BRAND.LABEL'), risk: 'low', desc: t.translate('PHISHING_DETECTOR.CHECKS.BRAND.DESC') + foundBrands.join(', ') + "." });
            riskScore += 10;
        }

        displayResults(riskScore, checks);
    }

    function displayResults(score, checks) {
        checksList.innerHTML = '';
        const t = window.safeclickTranslator;
        let level = t.translate('PHISHING_DETECTOR.RISK_LEVELS.LOW');
        let color = 'var(--safe)';

        if (score >= 60) {
            level = t.translate('PHISHING_DETECTOR.RISK_LEVELS.HIGH');
            color = 'var(--danger)';
        } else if (score >= 30) {
            level = t.translate('PHISHING_DETECTOR.RISK_LEVELS.MEDIUM');
            color = 'var(--warning)';
        }

        riskDisplay.textContent = level;
        riskDisplay.style.background = color;
        riskDisplay.style.color = 'white';

        checks.forEach(check => {
            const div = document.createElement('div');
            div.className = 'check-item';
            const icon = check.risk === 'high' ? '🛑' : (check.risk === 'med' ? '⚠️' : 'ℹ️');
            div.innerHTML = `
                <span class="check-icon">${icon}</span>
                <div>
                    <strong>${check.label}</strong>
                    <p style="font-size: 0.85rem; color: var(--muted);">${check.desc}</p>
                </div>
            `;
            checksList.appendChild(div);
        });

        if (score >= 30) {
            adviceText.innerHTML = t.translate('PHISHING_DETECTOR.ADVICE.DANGER');
        } else {
            adviceText.textContent = t.translate('PHISHING_DETECTOR.ADVICE.SAFE');
        }
    }

    // Listen for language changes
    window.addEventListener('languageChanged', () => {
        const urlInput = document.getElementById('url-text');
        const msgInput = document.getElementById('msg-text');
        const input = currentMode === 'url' ? (urlInput ? urlInput.value : '') : (msgInput ? msgInput.value : '');
        if (input.trim() && resultsArea.style.display !== 'none') {
            scanBtn.click();
        }
    });

    // Check for translator ready
    if (!window.safeclickTranslator) {
        document.addEventListener('translatorReady', () => {
            // Initial translation if needed
        });
    }
});
