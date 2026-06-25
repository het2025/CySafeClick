document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('message-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingState = document.getElementById('loading-state');
    const resultsContainer = document.getElementById('results-container');
    
    analyzeBtn.addEventListener('click', async () => {
        const message = input.value.trim();
        if (!message) {
            alert('Please paste a message first.');
            return;
        }

        // UI Reset
        resultsContainer.style.display = 'none';
        loadingState.style.display = 'flex';
        analyzeBtn.disabled = true;

        try {
            const response = await fetch('/api/ai/analyze-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const result = await response.json();
            
            if (result.success && result.data) {
                renderResults(result.data);
            } else {
                alert(result.error || 'Failed to analyze message. Please try again.');
                loadingState.style.display = 'none';
            }
        } catch (error) {
            console.error('Error analyzing message:', error);
            alert('A network error occurred. Is the backend running?');
            loadingState.style.display = 'none';
        } finally {
            analyzeBtn.disabled = false;
        }
    });

    function renderResults(data) {
        loadingState.style.display = 'none';
        resultsContainer.style.display = 'block';

        const badge = document.getElementById('verdict-badge');
        badge.textContent = data.verdict;
        badge.className = 'verdict-badge'; // reset
        if (data.verdict === 'SAFE') badge.classList.add('verdict-safe');
        else if (data.verdict === 'SUSPICIOUS') badge.classList.add('verdict-suspicious');
        else badge.classList.add('verdict-scam');

        document.getElementById('confidence-text').textContent = `AI Confidence: ${data.confidence}%`;
        document.getElementById('summary-text').textContent = data.summary;

        // Red flags
        const flagsList = document.getElementById('red-flags-list');
        flagsList.innerHTML = '';
        if (data.redFlags && data.redFlags.length > 0) {
            data.redFlags.forEach(flag => {
                const div = document.createElement('div');
                div.className = 'flag-item';
                div.innerHTML = `
                    <span style="font-size: 1.2rem;">⚠️</span>
                    <div>
                        <strong>${flag.flag}</strong>
                        <div style="font-size: 0.9rem; color: var(--muted); mt-1">${flag.explanation}</div>
                    </div>
                `;
                flagsList.appendChild(div);
            });
        } else {
            flagsList.innerHTML = '<p style="color: var(--safe);">No major red flags detected.</p>';
        }

        // Action steps
        const actionsList = document.getElementById('action-steps-list');
        actionsList.innerHTML = '';
        if (data.whatToDo && data.whatToDo.length > 0) {
            data.whatToDo.forEach(step => {
                const div = document.createElement('div');
                div.className = 'action-step';
                div.innerHTML = `<span>👉</span> <span>${step}</span>`;
                actionsList.appendChild(div);
            });
        }
    }
});
