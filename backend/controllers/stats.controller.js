const CrimeStats = require('../models/CrimeStats');
const { asyncHandler } = require('../utils/helpers');

// GET /api/stats
exports.getStats = asyncHandler(async (req, res) => {
  const stats = await CrimeStats.findOne({}).sort({ createdAt: -1 }).lean();
  res.json(stats || {});
});
