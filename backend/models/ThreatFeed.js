const mongoose = require('mongoose');

const threatEntrySchema = new mongoose.Schema({
  title:       { type: String },
  severity:    { type: String },
  description: { type: String },
  source:      { type: String },
  date:        { type: String },
  link:        { type: String, default: null }
}, { _id: false });

const threatFeedSchema = new mongoose.Schema({
  lastUpdated: { type: String },
  threats:     [threatEntrySchema]
}, { timestamps: true });

module.exports = mongoose.model('ThreatFeed', threatFeedSchema);
