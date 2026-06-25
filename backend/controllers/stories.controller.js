const ScamStory = require('../models/ScamStory');
const { asyncHandler } = require('../utils/helpers');

// GET /api/stories
exports.getStories = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;

  const stories = await ScamStory.find(filter).lean();
  res.json(stories);
});
