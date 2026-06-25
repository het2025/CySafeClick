let scams = [];
let scenarios = [];
let currentScenario = 0;

async function loadLocalizedData() {
    const t = window.safeclickTranslator;
    // Wait for translations to be loaded if they aren't yet
    if (!t.translations[t.currentLang]) {
        await t.loadLanguage(t.currentLang);
    }
    
    scams = t.translate('SCAM_AWARENESS.SCAMS');
    scenarios = t.translate('SCAM_AWARENESS.SCENARIOS');
    
    renderScamGrid();
    updateStaticText();
    nextScenario();
}

function updateStaticText() {
    const t = window.safeclickTranslator;
    // Update any static text that might not be covered by data-i18n if needed
}

function renderScamGrid() {
    const grid = document.getElementById('scam-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    scams.forEach((scam, i) => {
        const div = document.createElement('div');
        div.className = 'scam-card';
        div.innerHTML = `
            <span class="scam-icon">${scam.ICON}</span>
            <h3>${scam.TITLE}</h3>
            <p style="font-size: 0.85rem; color: var(--muted);">${scam.HOW.substring(0, 60)}...</p>
        `;
        div.onclick = () => showScamDetail(i);
        grid.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if translator is already initialized
    if (window.safeclickTranslator) {
        loadLocalizedData();
    } else {
        // Fallback for race conditions
        document.addEventListener('translatorReady', loadLocalizedData);
    }

    // Modal close
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById('scam-modal').style.display = 'none';
        };
    }
});

function showScamDetail(i) {
    const scam = scams[i];
    const t = window.safeclickTranslator;
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <h2>${scam.ICON} ${scam.TITLE}</h2>
        <div class="scam-detail-section">
            <h4>${t.translate('SCAM_AWARENESS.MODAL_HOW')}</h4>
            <p>${scam.HOW}</p>
        </div>
        <div class="scam-detail-section">
            <h4>${t.translate('SCAM_AWARENESS.MODAL_SAYS')}</h4>
            <blockquote style="font-style: italic; border-left: 3px solid #ccc; padding-left: 10px; margin: 10px 0;">"${scam.SCRIPT}"</blockquote>
        </div>
        <div class="scam-detail-section">
            <h4>${t.translate('SCAM_AWARENESS.MODAL_FLAGS')}</h4>
            <ul class="red-flags-list">
                ${scam.RED_FLAGS.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>
        <div class="scam-detail-section">
            <h4>${t.translate('SCAM_AWARENESS.MODAL_TODO')}</h4>
            <p style="font-weight: bold; color: var(--safe);">${scam.TODO}</p>
        </div>
    `;
    document.getElementById('scam-modal').style.display = 'flex';
}

function nextScenario() {
    if (!scenarios || scenarios.length === 0) return;
    const s = scenarios[currentScenario];
    document.getElementById('scenario-text').textContent = s.TEXT;
    document.getElementById('scenario-feedback').textContent = '';
}

function checkScenario(choice) {
    const s = scenarios[currentScenario];
    const feedback = document.getElementById('scenario-feedback');
    const t = window.safeclickTranslator;
    
    if (choice === s.TYPE) {
        feedback.innerHTML = `<span style="color: var(--safe);">${t.translate('SCAM_AWARENESS.FEEDBACK.CORRECT')}</span> ${s.REASON}`;
    } else {
        feedback.innerHTML = `<span style="color: var(--danger);">${t.translate('SCAM_AWARENESS.FEEDBACK.INCORRECT')}</span> ${s.REASON}`;
    }

    currentScenario = (currentScenario + 1) % scenarios.length;
    setTimeout(nextScenario, 4000);
}

// Listen for language changes to update dynamic content
window.addEventListener('languageChanged', () => {
    loadLocalizedData();
});
