const Playbook = require('../models/Playbook');
const { asyncHandler } = require('../utils/helpers');

// GET /api/playbooks/:lang
exports.getPlaybooks = asyncHandler(async (req, res) => {
  const lang = req.params.lang || 'en';
  const playbooks = await Playbook.find({ lang }).lean();
  res.json({ playbooks });
});
