const PHISHING_PATTERNS = [
  /free.*(recharge|gift|iphone)/i,
  /spin.*win/i,
  /pm-(kisan|yojana|scheme).*(online|claim)/i,
  /(jio|airtel|vi).*(free|tower)/i,
  /kbc.*(lottery|winner)/i
];

const KNOWN_DOMAINS = [
  'amazon.in', 'flipkart.com', 'google.com', 'youtube.com', 'facebook.com', 'instagram.com'
];

function analyzePage() {
  const url = window.location.href;
  const domain = window.location.hostname;
  const pageText = document.body.innerText;
  
  let status = 'safe';
  let reason = '';

  if (domain.endsWith('.xyz') || domain.endsWith('.top') || domain.endsWith('.club')) {
    status = 'suspicious';
    reason = 'Suspicious domain extension.';
  }

  for (let pattern of PHISHING_PATTERNS) {
    if (pattern.test(pageText) || pattern.test(url)) {
      status = 'dangerous';
      reason = 'Detected common phishing/scam keywords on this page.';
      break;
    }
  }

  if (!KNOWN_DOMAINS.includes(domain) && document.querySelector('input[type="password"]')) {
    if (status !== 'dangerous') {
      status = 'suspicious';
      reason += ' This site is asking for a password but is not a widely known domain.';
    }
  }

  chrome.runtime.sendMessage({ type: 'updateBadge', status });

  if (status !== 'safe') {
    showWarningBanner(status, reason);
  }
  
  detectUPIIframes();
  interceptFormSubmissions(status);
}

function showWarningBanner(status, reason) {
  if (document.getElementById('safeclick-guard-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'safeclick-guard-banner';
  banner.style.position = 'fixed';
  banner.style.top = '0';
  banner.style.left = '0';
  banner.style.width = '100%';
  banner.style.padding = '15px';
  banner.style.zIndex = '99999999';
  banner.style.color = 'white';
  banner.style.fontWeight = 'bold';
  banner.style.textAlign = 'center';
  banner.style.fontFamily = 'sans-serif';
  
  if (status === 'dangerous') {
    banner.style.backgroundColor = '#ef4444';
    banner.innerText = `⚠️ SafeClick DANGER: ${reason} Do not enter any details.`;
  } else {
    banner.style.backgroundColor = '#f59e0b';
    banner.innerText = `⚠️ SafeClick WARNING: ${reason} Proceed with caution.`;
  }

  const closeBtn = document.createElement('span');
  closeBtn.innerText = ' ✖';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.marginLeft = '20px';
  closeBtn.onclick = () => banner.remove();
  banner.appendChild(closeBtn);

  document.body.appendChild(banner);
}

function detectUPIIframes() {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    if (iframe.src && iframe.src.includes('upi://pay')) {
      iframe.style.border = '5px solid #ef4444';
      const warning = document.createElement('div');
      warning.style.color = '#ef4444';
      warning.style.fontWeight = 'bold';
      warning.innerText = '⚠️ SafeClick: Hidden UPI Collect Request detected here!';
      iframe.parentNode.insertBefore(warning, iframe);
    }
  });
}

function interceptFormSubmissions(pageStatus) {
  if (pageStatus === 'dangerous') {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!confirm("SafeClick GUARD: This site is highly suspicious. Are you sure you want to submit your data?")) {
          e.preventDefault();
        }
      });
    });
  }
}

document.addEventListener('mouseover', (e) => {
  if (e.target && e.target.tagName === 'A') {
    const href = e.target.getAttribute('href');
    if (href && !href.startsWith('/') && !href.includes(window.location.hostname)) {
      e.target.title = `SafeClick: Links to external site -> ${href}`;
      e.target.style.outline = '1px dashed #f59e0b';
    }
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target && e.target.tagName === 'A') {
    e.target.style.outline = 'none';
  }
});

// ─── Real-Time Scanning with MutationObserver ─────────────────
// Debounce to avoid excessive scans during rapid DOM changes
let _safeclickScanTimer = null;
function debouncedScan() {
  if (_safeclickScanTimer) clearTimeout(_safeclickScanTimer);
  _safeclickScanTimer = setTimeout(() => {
    analyzePage();
  }, 800);
}

// Initial scan when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => debouncedScan());
} else {
  debouncedScan();
}

// Watch for dynamically loaded content (WhatsApp Web, Facebook, etc.)
const safeclickObserver = new MutationObserver((mutations) => {
  let shouldScan = false;
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && !node.closest('#safeclick-guard-banner')) {
          shouldScan = true;
          break;
        }
      }
    }
    if (shouldScan) break;
  }
  if (shouldScan) debouncedScan();
});

safeclickObserver.observe(document.body || document.documentElement, {
  childList: true,
  subtree: true
});
