const mongoose = require('mongoose');

const scamAlertSchema = new mongoose.Schema({
  id:                   { type: String, required: true, unique: true },
  title:                { type: String, required: true },
  titleHindi:           { type: String, default: '' },
  severity:             { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  category:             { type: String, enum: ['upi-fraud', 'phishing', 'malware', 'advisory', 'scam-call', 'breaking'], default: 'advisory' },
  source:               { type: String, default: '' },
  publishedAt:          { type: Date, default: Date.now },
  summary:              { type: String, default: '' },
  summaryHindi:         { type: String, default: '' },
  affectedStates:       [{ type: String }],
  affectedPlatforms:    [{ type: String }],
  actionRequired:       { type: String, default: '' },
  actionRequiredHindi:  { type: String, default: '' },
  referenceUrl:         { type: String, default: null },
  tags:                 [{ type: String }],
  isBreaking:           { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ScamAlert', scamAlertSchema);
