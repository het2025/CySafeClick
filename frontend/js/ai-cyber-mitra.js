document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-chat-btn');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');
    const emergencyBanner = document.getElementById('emergency-banner');

    let history = []; // stores {role: 'user'|'model', text: string}
    let isWaiting = false;

    // Load history from session storage if exists
    const saved = sessionStorage.getItem('cyberMitraHistory');
    if (saved) {
        history = JSON.parse(saved);
        // Clear existing UI except first initial message
        const bubbles = chatContainer.querySelectorAll('.chat-bubble');
        if (bubbles.length > 1) {
            for(let i=1; i<bubbles.length; i++) bubbles[i].remove();
        }
        
        history.forEach(msg => {
            appendMessage(msg.text, msg.role, false);
        });
        scrollToBottom();
    }

    function saveHistory() {
        // Keep last 10 messages max to save storage
        if(history.length > 10) history = history.slice(history.length - 10);
        sessionStorage.setItem('cyberMitraHistory', JSON.stringify(history));
    }

    function appendMessage(text, role, save = true) {
        const div = document.createElement('div');
        div.className = `chat-bubble ${role === 'user' ? 'user' : 'bot'}`;
        
        // Simple text formatting (e.g. bolding)
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\n/g, '<br>');
        
        div.innerHTML = formatted;
        chatContainer.appendChild(div);
        
        if (save) {
            history.push({ role, text });
            saveHistory();
        }
        scrollToBottom();
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'chat-bubble typing';
        div.id = 'typing-indicator';
        div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        chatContainer.appendChild(div);
        scrollToBottom();
    }

    function removeTyping() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function sendMessage(text) {
        if (!text || isWaiting) return;
        
        input.value = '';
        appendMessage(text, 'user');
        isWaiting = true;
        sendBtn.disabled = true;
        showTyping();

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text,
                    history: history.slice(0, -1) // send history excluding the message we just added
                })
            });

            const result = await response.json();
            removeTyping();
            
            if (result.success) {
                if (result.emergency) {
                    emergencyBanner.style.display = 'block';
                }
                appendMessage(result.reply, 'model');
            } else {
                appendMessage("Sorry, I'm having trouble connecting to my servers right now.", 'model', false);
            }
        } catch (error) {
            removeTyping();
            appendMessage("A network error occurred. Please try again later.", 'model', false);
        } finally {
            isWaiting = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }

    sendBtn.addEventListener('click', () => {
        sendMessage(input.value.trim());
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input.value.trim());
        }
    });

    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.textContent);
        });
    });

    clearBtn.addEventListener('click', () => {
        history = [];
        sessionStorage.removeItem('cyberMitraHistory');
        const bubbles = chatContainer.querySelectorAll('.chat-bubble');
        for(let i=1; i<bubbles.length; i++) bubbles[i].remove();
        emergencyBanner.style.display = 'none';
    });
});
