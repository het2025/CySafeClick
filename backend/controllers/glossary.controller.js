const GlossaryTerm = require('../models/GlossaryTerm');
const { asyncHandler } = require('../utils/helpers');

// GET /api/glossary
exports.getGlossary = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { term: { $regex: search, $options: 'i' } },
      { termHindi: { $regex: search, $options: 'i' } },
      { definition: { $regex: search, $options: 'i' } }
    ];
  }

  const terms = await GlossaryTerm.find(filter).sort({ term: 1 }).lean();
  res.json(terms);
});
