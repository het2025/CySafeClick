const ScamAlert = require('../models/ScamAlert');
const { asyncHandler } = require('../utils/helpers');

// GET /api/alerts
exports.getAlerts = asyncHandler(async (req, res) => {
  const { category, severity, state } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (severity) filter.severity = severity;
  if (state) filter.affectedStates = { $in: [state, 'All India'] };

  const alerts = await ScamAlert.find(filter)
    .sort({ isBreaking: -1, publishedAt: -1 })
    .lean();

  res.json(alerts);
});
