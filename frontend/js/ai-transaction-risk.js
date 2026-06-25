document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('check-btn');
    const loadingState = document.getElementById('loading-state');
    const resultsContainer = document.getElementById('results-container');
    
    checkBtn.addEventListener('click', async () => {
        const upiInput = document.getElementById('upi-input').value.trim();
        const amount = document.getElementById('amount-input').value.trim();
        const purpose = document.getElementById('purpose-input').value;

        if (!upiInput) {
            alert('Please enter a UPI ID or Phone Number.');
            return;
        }

        let upiId = '';
        let phone = '';
        if (upiInput.includes('@')) {
            upiId = upiInput;
        } else if (/^\d{10}$/.test(upiInput)) {
            phone = upiInput;
        } else {
            upiId = upiInput; // send whatever as UPI ID
        }

        resultsContainer.style.display = 'none';
        loadingState.style.display = 'flex';
        checkBtn.disabled = true;

        try {
            const response = await fetch('/api/ai/transaction-risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ upiId, phone, amount: parseFloat(amount) || null, purpose })
            });

            const result = await response.json();
            
            if (result.success && result.data) {
                renderResults(result.data);
            } else {
                alert(result.error || 'Failed to check risk. Please try again.');
                loadingState.style.display = 'none';
            }
        } catch (error) {
            console.error('Error checking transaction risk:', error);
            alert('A network error occurred.');
            loadingState.style.display = 'none';
        } finally {
            checkBtn.disabled = false;
        }
    });

    function renderResults(data) {
        loadingState.style.display = 'none';
        resultsContainer.style.display = 'block';

        const badge = document.getElementById('risk-badge');
        badge.textContent = `${data.riskLevel} RISK`;
        badge.className = 'verdict-badge'; // reset
        
        const riskBar = document.getElementById('risk-bar');
        // Ensure score is 0-100
        const score = Math.max(0, Math.min(100, data.score || 50));
        
        // Trigger animation
        setTimeout(() => {
            riskBar.style.width = `${score}%`;
        }, 50);

        if (data.riskLevel === 'LOW') {
            badge.classList.add('verdict-safe');
            riskBar.style.background = 'var(--safe)';
        } else if (data.riskLevel === 'MEDIUM') {
            badge.classList.add('verdict-suspicious');
            riskBar.style.background = 'var(--warning)';
        } else {
            badge.classList.add('verdict-scam');
            riskBar.style.background = 'var(--danger)';
        }

        document.getElementById('summary-text').textContent = data.summary;
        document.getElementById('recommendation-text').textContent = data.recommendation;

        // Indicators
        const indicatorsList = document.getElementById('indicators-list');
        indicatorsList.innerHTML = '';
        if (data.indicators && data.indicators.length > 0) {
            data.indicators.forEach(ind => {
                const div = document.createElement('div');
                div.className = `check-item-ai ${ind.type}`;
                
                let icon = 'ℹ️';
                if (ind.type === 'positive') icon = '✅';
                else if (ind.type === 'warning') icon = '⚠️';
                else if (ind.type === 'danger') icon = '❌';

                div.innerHTML = `
                    <span style="font-size: 1.2rem;">${icon}</span>
                    <div>
                        <strong>${ind.label}</strong>
                        <div style="font-size: 0.9rem; color: var(--muted); mt-1">${ind.detail}</div>
                    </div>
                `;
                indicatorsList.appendChild(div);
            });
        } else {
            indicatorsList.innerHTML = '<p>No specific indicators found.</p>';
        }

        // Tips
        const tipsList = document.getElementById('tips-list');
        tipsList.innerHTML = '';
        if (data.tips && data.tips.length > 0) {
            data.tips.forEach(tip => {
                const div = document.createElement('div');
                div.className = 'action-step';
                div.innerHTML = `<span>💡</span> <span>${tip}</span>`;
                tipsList.appendChild(div);
            });
        }
    }
});
