const DailyTip = require('../models/DailyTip');
const { asyncHandler } = require('../utils/helpers');

// GET /api/tips
exports.getTips = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;

  const tips = await DailyTip.find(filter).lean();
  res.json(tips);
});
