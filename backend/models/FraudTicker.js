const mongoose = require('mongoose');

const fraudTickerSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  text:        { type: String, required: true },
  textHindi:   { type: String, default: '' },
  severity:    { type: String, enum: ['info', 'warning', 'alert', 'critical'], default: 'info' },
  category:    { type: String, default: '' },
  targetState: { type: String, default: 'All India' },
  date:        { type: Date, default: Date.now },
  isBreaking:  { type: Boolean, default: false },
  actionUrl:   { type: String, default: null },
  actionLabel: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('FraudTicker', fraudTickerSchema);
