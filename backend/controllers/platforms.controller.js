const Platform2FA = require('../models/Platform2FA');
const { asyncHandler } = require('../utils/helpers');

// GET /api/platforms/2fa
exports.getPlatforms = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;

  const platforms = await Platform2FA.find(filter).sort({ name: 1 }).lean();
  res.json(platforms);
});
