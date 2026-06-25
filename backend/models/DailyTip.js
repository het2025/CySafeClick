const mongoose = require('mongoose');

const dailyTipSchema = new mongoose.Schema({
  id:            { type: String, unique: true },
  category:      { type: String, default: '' },
  title:         { type: String, default: '' },
  titleHindi:    { type: String, default: '' },
  content:       { type: String, default: '' },
  contentHindi:  { type: String, default: '' },
  icon:          { type: String, default: '' },
  severity:      { type: String, default: 'info' },
  tags:          [{ type: String }]
}, { timestamps: true, strict: false });

module.exports = mongoose.model('DailyTip', dailyTipSchema);
