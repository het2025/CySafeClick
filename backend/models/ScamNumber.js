// ⚠️ PII WARNING: This model stores Personally Identifiable Information (phone numbers,
// telecom providers, locations). Activation requires DPDP Act 2023 compliance:
// - Lawful basis for collection (Section 4)
// - User consent mechanism (Section 6)
// - Data Protection Officer appointment
// - Grievance redressal mechanism (Section 13)
// Collections using this model are currently EMPTY by design.
const mongoose = require('mongoose');

const quickReportSchema = new mongoose.Schema({
  date:        { type: String },
  city:        { type: String },
  state:       { type: String },
  description: { type: String }
}, { _id: false });

const scamNumberSchema = new mongoose.Schema({
  id:               { type: String, required: true, unique: true },
  number:           { type: String, required: true },
  normalizedNumber: { type: String, required: true, index: true },
  type:             { type: String, enum: ['mobile', 'landline', 'toll-free', 'unknown'], default: 'mobile' },
  scamType:         { type: String, required: true },
  reportCount:      { type: Number, default: 0 },
  firstReported:    { type: String },
  lastReported:     { type: String },
  state:            { type: String, default: '' },
  telecom:          { type: String, default: '' },
  description:      { type: String, default: '' },
  scriptUsed:       { type: String, default: '' },
  totalLossReported:{ type: Number, default: 0 },
  verified:         { type: Boolean, default: false },
  active:           { type: Boolean, default: true },
  upvotes:          { type: Number, default: 0 },
  reports:          [quickReportSchema]
}, { timestamps: true });

module.exports = mongoose.model('ScamNumber', scamNumberSchema);
