const mongoose = require('mongoose');

const playbookStepSchema = new mongoose.Schema({
  title:       { type: String },
  description: { type: String },
  action:      { type: String },
  icon:        { type: String }
}, { _id: false });

const playbookSchema = new mongoose.Schema({
  id:          { type: String },
  title:       { type: String },
  category:    { type: String },
  severity:    { type: String },
  steps:       [playbookStepSchema],
  lang:        { type: String, enum: ['en', 'hi'], default: 'en' }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Playbook', playbookSchema);
