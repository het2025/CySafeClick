document.addEventListener('DOMContentLoaded', () => {
  const urlEl = document.getElementById('site-url');
  const statusTitle = document.getElementById('site-status-title');
  const riskFill = document.getElementById('risk-fill');
  const scanBtn = document.getElementById('scan-btn');
  const tipText = document.getElementById('tip-text');

  let lastUrl = '';

  function init() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url) {
        try {
          lastUrl = currentTab.url;
          urlEl.innerText = new URL(currentTab.url).hostname;
          analyzeUrl(currentTab.url);
          updateTip();
        } catch(e) {}
      }
    });
  }

  // Wait for translator
  if (window.cysafeclickTranslator) {
    init();
  } else {
    document.addEventListener('translatorReady', init);
  }

  scanBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        files: ['content.js']
      });
    });
    const t = window.cysafeclickTranslator;
    statusTitle.innerText = t ? t.translate('EXTENSION.RESCANNING') : "Re-scanning...";
    setTimeout(() => window.close(), 1000);
  });

  function analyzeUrl(url) {
    let risk = 10;
    let statusKey = 'EXTENSION.STATUS_SAFE';
    let color = '#22c55e';

    if (url.includes('.xyz') || url.includes('free') || url.includes('win')) {
      risk = 90;
      statusKey = 'EXTENSION.STATUS_DANGER';
      color = '#ef4444';
    } else if (!url.includes('google') && !url.includes('amazon') && !url.includes('localhost')) {
      risk = 40;
      statusKey = 'EXTENSION.STATUS_CAUTION';
      color = '#f59e0b';
    }

    const t = window.cysafeclickTranslator;
    statusTitle.innerText = t ? t.translate(statusKey) : statusKey;
    statusTitle.style.color = color;
    riskFill.style.width = risk + '%';
    riskFill.style.backgroundColor = color;
  }

  function updateTip() {
    const t = window.cysafeclickTranslator;
    if (!t) return;
    
    // Simple rotation based on date
    const tips = t.translate('PWD_LAB.TIPS'); // Use existing tips from web app
    const tipKeys = Object.keys(tips);
    const day = new Date().getDate() % tipKeys.length;
    tipText.innerText = tips[tipKeys[day]];
  }

  // Listen for language changes
  window.addEventListener('languageChanged', () => {
    if (lastUrl) analyzeUrl(lastUrl);
    updateTip();
  });
});
