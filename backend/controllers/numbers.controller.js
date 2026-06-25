const { asyncHandler } = require('../utils/helpers');
const ScamNumber = require('../models/ScamNumber');

// GET /api/numbers/lookup/:number
exports.lookupNumber = asyncHandler(async (req, res) => {
  const normalized = normalizeNumber(req.params.number);

  if (!normalized) {
    return res.status(400).json({ found: false, entry: null, relatedNumbers: [] });
  }

  const entry = await ScamNumber.findOne({ normalizedNumber: normalized }).lean();

  if (!entry) {
    return res.json({ found: false, entry: null, relatedNumbers: [] });
  }

  const relatedNumbers = await ScamNumber.find({
    scamType: entry.scamType,
    _id: { $ne: entry._id }
  })
    .limit(5)
    .lean();

  res.json({ found: true, entry, relatedNumbers });
});

// GET /api/numbers/related/:scamType
exports.getRelatedNumbers = asyncHandler(async (req, res) => {
  const numbers = await ScamNumber.find({ scamType: req.params.scamType })
    .limit(20)
    .lean();

  res.json({ numbers });
});

// GET /api/numbers/all — full database (for bulk operations)
exports.getAllNumbers = asyncHandler(async (req, res) => {
  const numbers = await ScamNumber.find()
    .sort({ reportCount: -1 })
    .limit(100)
    .lean();

  res.json({ numbers });
});

// ─── Helper ──────────────────────────────────────────────
function normalizeNumber(input) {
  if (!input) return '';
  let normalized = input.replace(/\D/g, '');
  if (normalized.length === 12 && normalized.startsWith('91')) {
    normalized = normalized.substring(2);
  } else if (normalized.length === 11 && normalized.startsWith('0')) {
    normalized = normalized.substring(1);
  }
  return normalized;
}
