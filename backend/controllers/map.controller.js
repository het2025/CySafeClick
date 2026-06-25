const StateThreat = require('../models/StateThreat');
const { asyncHandler } = require('../utils/helpers');

// GET /api/map
exports.getStateThreatData = asyncHandler(async (req, res) => {
  const data = await StateThreat.find({}).lean();
  res.json(data);
});

// GET /api/map/:stateId
exports.getStateThreatById = asyncHandler(async (req, res) => {
  const data = await StateThreat.findOne({ stateId: req.params.stateId }).lean();
  if (!data) {
    return res.status(404).json({ success: false, error: 'State not found.' });
  }
  res.json(data);
});
