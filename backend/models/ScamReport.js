// ⚠️ PII WARNING: This model stores personal identifiers (phone numbers, UPI IDs,
// emails, websites) and location data. Requires DPDP Act 2023 compliance before activation.
// POST endpoints using this model are DISABLED — see reports.controller.js.
const mongoose = require('mongoose');

const scamReportSchema = new mongoose.Schema({
  type:          { type: String, enum: ['phone', 'upi', 'website', 'email'], required: true },
  value:         { type: String, required: true },
  scamType:      { type: String, default: '' },
  description:   { type: String, default: '' },
  dateReported:  { type: Date, default: Date.now },
  city:          { type: String, default: '' },
  amountLost:    { type: Number, default: null },
  upvotes:       { type: Number, default: 0 },
  verified:      { type: Boolean, default: false },
  reporterNote:  { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ScamReport', scamReportSchema);
