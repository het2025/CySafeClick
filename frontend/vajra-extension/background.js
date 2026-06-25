chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('dailyTip', { periodInMinutes: 1440 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyTip') {
    chrome.storage.local.set({ lastTipDate: new Date().toISOString() });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'updateBadge') {
    const colorMap = {
      'safe': '#22c55e',
      'suspicious': '#f59e0b',
      'dangerous': '#ef4444'
    };
    chrome.action.setBadgeBackgroundColor({ color: colorMap[request.status], tabId: sender.tab.id });
    chrome.action.setBadgeText({ text: '!', tabId: sender.tab.id });
  }
});
