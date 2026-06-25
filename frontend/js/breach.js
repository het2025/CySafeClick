document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const emailArea = document.getElementById('email-area');
    const pwdArea = document.getElementById('pwd-area');
    const emailInput = document.getElementById('email-input');
    const pwdInput = document.getElementById('pwd-input');
    const emailBtn = document.getElementById('email-btn');
    const pwdBtn = document.getElementById('pwd-btn');
    const loading = document.getElementById('loading');
    const resultBanner = document.getElementById('result-banner');
    const breachResults = document.getElementById('breach-results');
    const actionChecklist = document.getElementById('action-checklist');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const mode = tab.getAttribute('data-tab');
            emailArea.style.display = mode === 'email' ? 'block' : 'none';
            pwdArea.style.display = mode === 'pwd' ? 'block' : 'none';
            resetResults();
        });
    });

    function resetResults() {
        resultBanner.style.display = 'none';
        breachResults.innerHTML = '';
        actionChecklist.style.display = 'none';
    }

    // Password Check (Pwned Passwords API - No key needed)
    pwdBtn.addEventListener('click', async () => {
        const pwd = pwdInput.value;
        if (!pwd) return;

        resetResults();
        loading.style.display = 'block';

        try {
            const hash = await sha1(pwd);
            const prefix = hash.substring(0, 5);
            const suffix = hash.substring(5).toUpperCase();

            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            const data = await response.text();
            
            const lines = data.split('\n');
            let count = 0;
            for (let line of lines) {
                const [h, c] = line.split(':');
                if (h === suffix) {
                    count = parseInt(c);
                    break;
                }
            }

            const t = window.safeclickTranslator;
            loading.style.display = 'none';
            resultBanner.style.display = 'block';
            if (count > 0) {
                resultBanner.className = 'result-banner banner-danger';
                resultBanner.textContent = t.translate('BREACH_CHECK.RESULT_PWD_DANGER').replace('{{ count }}', count.toLocaleString());
                actionChecklist.style.display = 'block';
            } else {
                resultBanner.className = 'result-banner banner-safe';
                resultBanner.textContent = t.translate('BREACH_CHECK.RESULT_PWD_SAFE');
            }
        } catch (err) {
            loading.style.display = 'none';
            alert("Error checking password. Please try again later.");
        }
    });

    // Email Check is disabled for privacy
    emailBtn.addEventListener('click', () => {
        resetResults();
        loading.style.display = 'none';
        resultBanner.style.display = 'block';
        const t = window.safeclickTranslator;
        resultBanner.className = 'result-banner banner-safe';
        resultBanner.textContent = t.translate('BREACH_CHECK.EMAIL_DISABLED_NOTE');
    });

    async function sha1(str) {
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Listen for language changes
    window.addEventListener('languageChanged', () => {
        if (resultBanner && resultBanner.style.display === 'block') {
            // Re-trigger the active check button if input is present
            const activeTabEl = document.querySelector('.tab.active');
            if (activeTabEl) {
                const activeTab = activeTabEl.getAttribute('data-tab');
                if (activeTab === 'email' && emailInput.value) emailBtn.click();
                if (activeTab === 'pwd' && pwdInput.value) pwdBtn.click();
            }
        }
    });

    // Check for translator ready
    if (!window.safeclickTranslator) {
        document.addEventListener('translatorReady', () => {
            // Initial translation if needed
        });
    }
});
