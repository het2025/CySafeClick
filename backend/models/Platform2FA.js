const mongoose = require('mongoose');

const platform2FASchema = new mongoose.Schema({
  name:           { type: String, required: true },
  category:       { type: String, default: '' },
  supports2FA:    { type: Boolean, default: false },
  methods:        [{ type: String }],
  setupUrl:       { type: String, default: '' },
  difficulty:     { type: String, default: 'easy' },
  recommended:    { type: Boolean, default: false }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Platform2FA', platform2FASchema);
