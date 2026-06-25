const ThreatFeed = require('../models/ThreatFeed');
const { asyncHandler } = require('../utils/helpers');

// GET /api/threats/feed
exports.getThreatFeed = asyncHandler(async (req, res) => {
  const feed = await ThreatFeed.findOne({}).sort({ createdAt: -1 }).lean();
  res.json(feed || { lastUpdated: null, alerts: [] });
});
