// ⚠️ PII WARNING: This model stores phone numbers and location data.
// Requires DPDP Act 2023 compliance before activation.
// POST endpoints using this model are DISABLED — see community.controller.js.
const mongoose = require('mongoose');

const communityReportSchema = new mongoose.Schema({
  number:      { type: String, required: true, index: true },
  scamType:    { type: String, required: true },
  description: { type: String, default: '' },
  city:        { type: String, default: '' },
  state:       { type: String, default: '' },
  date:        { type: Date, default: Date.now },
  amountLost:  { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CommunityReport', communityReportSchema);
