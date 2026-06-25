document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

    // Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('show');
            menuToggle.textContent = navLinks.classList.contains('show') ? '✕' : '☰';
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                menuToggle.textContent = '☰';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('show');
                menuToggle.textContent = '☰';
            }
        });
    }

    // Privacy Banner
    const privacyBanner = document.getElementById('privacy-banner');
    const closeBanner = document.getElementById('close-privacy');
    
    if (privacyBanner && !localStorage.getItem('privacy-accepted')) {
        privacyBanner.classList.add('show');
    }
    
    if (closeBanner) {
        closeBanner.addEventListener('click', () => {
            privacyBanner.classList.remove('show');
            localStorage.setItem('privacy-accepted', 'true');
        });
    }

    // Active Link Highlighting
    const currentLocation = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
});

// Helper for animations (Counter)
function animateCounter(id, target, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    
    let start = 0;
    const increment = target / (duration / 16);
    
    const update = () => {
        start += increment;
        if (start < target) {
            el.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString();
        }
    };
    
    update();
}
