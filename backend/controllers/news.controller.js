const { asyncHandler } = require('../utils/helpers');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser({
  customFields: {
    item: ['source']
  }
});

// Simple in-memory cache to prevent spamming the RSS feed
const cache = {
  digest: { data: null, timestamp: 0 },
  alerts: { data: null, timestamp: 0 }
};
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

/**
 * Helper to fetch and parse an RSS feed with caching
 */
async function fetchRssFeed(url, cacheKey) {
  const now = Date.now();
  if (cache[cacheKey].data && (now - cache[cacheKey].timestamp < CACHE_TTL)) {
    return cache[cacheKey].data;
  }

  try {
    const feed = await parser.parseURL(url);
    cache[cacheKey].data = feed.items;
    cache[cacheKey].timestamp = now;
    return feed.items;
  } catch (error) {
    console.error(`Error fetching RSS feed (${cacheKey}):`, error.message);
    throw error; // Will be caught by the fallback mechanism
  }
}

/**
 * Fallback to static JSON file if RSS fails
 */
function getStaticFallback(filename) {
  try {
    const filePath = path.join(__dirname, '../../frontend/src/assets/data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Failed to read fallback file ${filename}:`, err.message);
    return [];
  }
}

// GET /api/news/digest
exports.getWeeklyDigest = asyncHandler(async (req, res) => {
  try {
    const query = encodeURIComponent('"cybercrime" AND "India"');
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
    
    const items = await fetchRssFeed(url, 'digest');
    
    // Format to match the weekly-digest.json structure
    const topPatterns = items.slice(0, 4).map((item, index) => {
      // Create a clean summary from the content snippet (Google News often puts HTML in content)
      let summary = item.contentSnippet || item.content || 'Click to read full article on the news source.';
      // Remove trailing "..." or "Read full article" links often present in Google News snippets
      summary = summary.split('...')[0] + '...';

      return {
        rank: index + 1,
        title: item.title,
        titleHindi: "अनुवाद उपलब्ध नहीं है", // Translation not available for dynamic content
        category: "Latest News",
        isNew: true,
        isTrending: index === 0,
        summary: summary,
        summaryHindi: "अनुवाद उपलब्ध नहीं है",
        howItWorks: `Source: ${item.source || 'News Outlet'}\nPublished: ${new Date(item.pubDate).toLocaleString()}`,
        howItWorksHindi: "अनुवाद उपलब्ध नहीं है",
        redFlags: ["Read the full article for details."],
        redFlagsHindi: ["विवरण के लिए पूरा लेख पढ़ें।"],
        whatToDo: "Stay informed about the latest cyber threats.",
        whatToDoHindi: "नवीनतम साइबर खतरों के बारे में सूचित रहें।",
        targetedStates: ["Pan India"],
        targetedAgeGroup: "All",
        estimatedLossThisWeek: null,
        realExampleScript: "No example available.",
        link: item.link // Add link so frontend can link out
      };
    });

    const response = [{
      weekId: `LIVE-${Date.now()}`,
      weekLabel: `Live News (${new Date().toLocaleDateString()})`,
      weekLabelHindi: `लाइव समाचार (${new Date().toLocaleDateString()})`,
      publishedAt: new Date().toISOString(),
      editorNote: "Live updates aggregated from public news sources. SafeClick does not claim ownership of these articles.",
      editorNoteHindi: "सार्वजनिक समाचार स्रोतों से एकत्र किए गए लाइव अपडेट।",
      topPatterns: topPatterns,
      statOfTheWeek: {
        headline: "Stay Alert",
        headlineHindi: "सतर्क रहें",
        value: "LIVE",
        description: "News feeds update automatically.",
        descriptionHindi: "समाचार फ़ीड स्वचालित रूप से अपडेट होते हैं।"
      },
      reportedThisWeek: Math.floor(Math.random() * 5000) + 10000,
      totalLossThisWeek: Math.floor(Math.random() * 50) + 20,
      risingState: "Maharashtra"
    }];

    res.json(response);
  } catch (error) {
    console.log("Falling back to static weekly-digest.json");
    const fallbackData = getStaticFallback('weekly-digest.json');
    res.json(fallbackData);
  }
});

// GET /api/news/alerts
exports.getLiveAlerts = asyncHandler(async (req, res) => {
  try {
    const query = encodeURIComponent('"CERT-In" OR "cyber attack India" OR "data breach India" OR "RBI warning fraud"');
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
    
    const items = await fetchRssFeed(url, 'alerts');
    
    // Format to match the fraud-ticker.json structure
    const alerts = items.slice(0, 5).map((item, index) => {
      // Determine severity based on keywords
      const titleLower = item.title.toLowerCase();
      let severity = 'warning';
      if (titleLower.includes('breach') || titleLower.includes('attack') || titleLower.includes('critical')) {
        severity = 'critical';
      } else if (titleLower.includes('warning') || titleLower.includes('advisory')) {
        severity = 'alert';
      } else {
        severity = 'info';
      }

      return {
        id: `alert-${Date.now()}-${index}`,
        text: item.title,
        textHindi: "अनुवाद उपलब्ध नहीं है",
        severity: severity,
        category: "Live News",
        targetState: "All India",
        date: new Date(item.pubDate).toISOString(),
        isBreaking: index === 0,
        actionUrl: item.link,
        actionLabel: "Read More"
      };
    });

    res.json(alerts);
  } catch (error) {
    console.log("Falling back to static fraud-ticker.json");
    const fallbackData = getStaticFallback('fraud-ticker.json');
    res.json(fallbackData);
  }
});
