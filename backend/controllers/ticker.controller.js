const FraudTicker = require('../models/FraudTicker');
const { asyncHandler } = require('../utils/helpers');

// GET /api/ticker
exports.getTickerItems = asyncHandler(async (req, res) => {
  const { state, severity } = req.query;
  const filter = {};

  if (state && state !== 'All India') {
    filter.$or = [{ targetState: state }, { targetState: 'All India' }];
  }
  if (severity) {
    filter.severity = severity;
  }

  // Only items from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  filter.date = { $gte: thirtyDaysAgo };

  const items = await FraudTicker.find(filter)
    .sort({ isBreaking: -1, date: -1 })
    .lean();

  res.json(items);
});
