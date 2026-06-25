document.addEventListener('DOMContentLoaded', () => {
    const pwdInput = document.getElementById('pwd-input');
    const toggleEye = document.getElementById('toggle-eye');
    const clearPwd = document.getElementById('clear-pwd');
    const strengthMeter = document.getElementById('strength-meter');
    const strengthLabel = document.getElementById('strength-label');
    const crackOnline = document.getElementById('crack-online');
    const crackSlow = document.getElementById('crack-slow');
    const crackFast = document.getElementById('crack-fast');
    const badgeRow = document.getElementById('badge-row');
    const tipsList = document.getElementById('tips-list');
    const variantsContainer = document.getElementById('variants-container');
    const refreshBtn = document.getElementById('refresh-variants');

    const segments = strengthMeter.querySelectorAll('.strength-segment');

    function updateAnalysis() {
        const password = pwdInput.value;
        if (!password) {
            resetUI();
            return;
        }

        const result = zxcvbn(password);
        const score = result.score; // 0-4

        // Update Meter
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e'];
        const labels = window.safeclickTranslator.translate('PWD_LAB.STRENGTH_LABELS');
        
        segments.forEach((seg, i) => {
            if (i <= score) {
                seg.style.background = colors[score];
            } else {
                seg.style.background = '#e2e8f0';
            }
        });
        strengthLabel.textContent = `${window.safeclickTranslator.translate('PWD_LAB.STRENGTH')}: ${labels[score]}`;
        strengthLabel.style.color = colors[score];

        // Crack Times
        crackOnline.textContent = result.crack_times_display.online_no_throttling_10_per_second;
        crackSlow.textContent = result.crack_times_display.offline_slow_hashing_1e4_per_second;
        crackFast.textContent = result.crack_times_display.offline_fast_hashing_1e10_per_second;

        // Badges
        updateBadges(password);

        // Tips
        updateTips(result, password);

        // Variants
        generateVariants(password);
    }

    function resetUI() {
        const t = window.safeclickTranslator;
        segments.forEach(seg => seg.style.background = '#e2e8f0');
        strengthLabel.textContent = `${t.translate('PWD_LAB.STRENGTH')}: -`;
        strengthLabel.style.color = 'inherit';
        crackOnline.textContent = '-';
        crackSlow.textContent = '-';
        crackFast.textContent = '-';
        badgeRow.innerHTML = '';
        tipsList.innerHTML = '';
        variantsContainer.innerHTML = `<p style="color: var(--muted);">${t.translate('PWD_LAB.VARIANTS_EMPTY')}</p>`;
    }

    function updateBadges(pwd) {
        badgeRow.innerHTML = '';
        const t = window.safeclickTranslator;
        const checks = [
            { label: t.translate('COMMON.LENGTH') || 'Length', value: pwd.length, met: pwd.length >= 8 },
            { label: t.translate('COMMON.UPPERCASE') || 'Uppercase', met: /[A-Z]/.test(pwd) },
            { label: t.translate('COMMON.LOWERCASE') || 'Lowercase', met: /[a-z]/.test(pwd) },
            { label: t.translate('COMMON.NUMBERS') || 'Numbers', met: /[0-9]/.test(pwd) },
            { label: t.translate('COMMON.SYMBOLS') || 'Symbols', met: /[^A-Za-z0-9]/.test(pwd) }
        ];

        checks.forEach(check => {
            const span = document.createElement('span');
            span.className = `badge ${check.met ? 'badge-safe' : 'badge-danger'}`;
            span.textContent = `${check.label}${check.value ? ': ' + check.value : ''} ${check.met ? '✓' : '✗'}`;
            badgeRow.appendChild(span);
        });
    }

    function updateTips(result, pwd) {
        tipsList.innerHTML = '';
        const tips = [];
        const t = window.safeclickTranslator;
        
        if (result.feedback.warning) tips.push(result.feedback.warning);
        result.feedback.suggestions.forEach(s => tips.push(s));

        // India Specific Tips
        if (/^[6-9]\d{9}$/.test(pwd)) tips.push(t.translate('PWD_LAB.TIPS.MOBILE'));
        if (/(19|20)\d{2}/.test(pwd)) tips.push(t.translate('PWD_LAB.TIPS.YEAR'));
        const indianWords = t.translate('PWD_LAB.INDIAN_WORDS') || ['india', 'bharat', 'sachin', 'dhoni', 'ipl', 'rahul', 'priya', 'delhi', 'mumbai'];
        const indianWordsList = Array.isArray(indianWords) ? indianWords : ['india', 'bharat', 'sachin', 'dhoni', 'ipl', 'rahul', 'priya', 'delhi', 'mumbai'];
        if (indianWordsList.some(w => pwd.toLowerCase().includes(w))) {
            tips.push(t.translate('PWD_LAB.TIPS.COMMON_NAME'));
        }

        if (tips.length === 0 && result.score === 4) {
            tips.push(t.translate('PWD_LAB.TIPS.EXCELLENT'));
        }

        tips.forEach(tip => {
            const li = document.createElement('li');
            li.className = 'india-tip';
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }

    function generateVariants(pwd) {
        variantsContainer.innerHTML = '';
        const t = window.safeclickTranslator;
        const techniques = [
            { name: t.translate('PWD_LAB.VARIANTS.ADD_SYMBOL'), func: p => p + Math.floor(Math.random()*90 + 10) + "!" },
            { name: t.translate('PWD_LAB.VARIANTS.LEET'), func: p => p.replace(/a/gi, '@').replace(/e/gi, '3').replace(/i/gi, '!').replace(/o/gi, '0') },
            { name: t.translate('PWD_LAB.VARIANTS.CAPITALIZE'), func: p => p.charAt(0).toUpperCase() + p.slice(1) + "#2024" },
            { name: t.translate('PWD_LAB.VARIANTS.WORD_MIX'), func: p => {
                const rawWords = t.translate('PWD_LAB.VARIANT_WORDS');
                const words = Array.isArray(rawWords) ? rawWords : ['Mera', 'Apna', 'Suraksha', 'SafeClick', 'Sher'];
                return words[Math.floor(Math.random()*words.length)] + "-" + p;
            }},
            { name: t.translate('PWD_LAB.VARIANTS.REVERSE'), func: p => "*" + p.split('').reverse().join('') + "99" },
            { name: t.translate('PWD_LAB.VARIANTS.PASSPHRASE'), func: p => {
                const rawWords = t.translate('PWD_LAB.PASSPHRASE_WORDS');
                const words = Array.isArray(rawWords) ? rawWords : ['apple', 'mountain', 'river', 'delta', 'tiger'];
                return words[Math.floor(Math.random()*words.length)] + "-" + p.slice(0,3) + "-" + Math.floor(Math.random()*100);
            }}
        ];

        techniques.forEach(tech => {
            const variant = tech.func(pwd);
            const vRes = zxcvbn(variant);
            
            const div = document.createElement('div');
            div.className = 'variant-card';
            div.innerHTML = `
                <div class="variant-info">
                    <div class="variant-pwd">${variant.slice(0, 4)}****</div>
                    <small>${tech.name} | Crack: ${vRes.crack_times_display.offline_fast_hashing_1e10_per_second}</small>
                </div>
                <div style="display:flex; gap: 5px;">
                    <button class="btn-action copy-btn" data-pwd="${variant}">${t.translate('PWD_LAB.VARIANTS.COPY')}</button>
                    <button class="btn-action analyze-btn" data-pwd="${variant}">${t.translate('PWD_LAB.VARIANTS.TEST')}</button>
                </div>
            `;
            variantsContainer.appendChild(div);
        });

        // Add event listeners to buttons
        variantsContainer.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(btn.getAttribute('data-pwd'));
                const originalText = btn.textContent;
                btn.textContent = t.translate('PWD_LAB.VARIANTS.COPIED');
                setTimeout(() => btn.textContent = originalText, 2000);
            });
        });

        variantsContainer.querySelectorAll('.analyze-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pwdInput.value = btn.getAttribute('data-pwd');
                pwdInput.type = 'text';
                updateAnalysis();
            });
        });
    }

    pwdInput.addEventListener('input', updateAnalysis);

    toggleEye.addEventListener('click', () => {
        pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
        toggleEye.textContent = pwdInput.type === 'password' ? '👁️' : '🔒';
    });

    clearPwd.addEventListener('click', () => {
        pwdInput.value = '';
        resetUI();
    });

    refreshBtn.addEventListener('click', () => {
        if (pwdInput.value) generateVariants(pwdInput.value);
    });

    // Accordion Logic
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = content.style.display === 'block';
            content.style.display = isOpen ? 'none' : 'block';
            header.querySelector('span').textContent = isOpen ? '+' : '-';
        });
    });

    // Listen for language changes to update dynamic content
    window.addEventListener('languageChanged', () => {
        if (pwdInput.value) {
            updateAnalysis();
        } else {
            resetUI();
        }
    });
});
