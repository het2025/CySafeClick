const mongoose = require('mongoose');

const crimeStatsSchema = new mongoose.Schema({
  year:              { type: Number },
  totalComplaints:   { type: Number, default: 0 },
  financialFraud:    { type: Number, default: 0 },
  socialMediaCrimes: { type: Number, default: 0 },
  ransomware:        { type: Number, default: 0 },
  dataBreaches:      { type: Number, default: 0 },
  totalLoss:         { type: Number, default: 0 }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('CrimeStats', crimeStatsSchema);
