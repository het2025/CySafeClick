const mongoose = require('mongoose');

const scamTypeStatSchema = new mongoose.Schema({
  type:           { type: String },
  count:          { type: Number, default: 0 },
  percentOfTotal: { type: Number, default: 0 }
}, { _id: false });

const stateThreatSchema = new mongoose.Schema({
  stateId:            { type: String, required: true, unique: true },
  stateName:          { type: String, required: true },
  threatLevel:        { type: Number, min: 1, max: 5, default: 1 },
  weeklyReportCount:  { type: Number, default: 0 },
  topScamTypes:       [scamTypeStatSchema],
  activeAlerts:       [{ type: String }],
  totalLossThisMonth: { type: Number, default: 0 },
  mostTargetedCity:   { type: String, default: '' },
  mostTargetedAgeGroup: { type: String, default: '' },
  trendDirection:     { type: String, enum: ['rising', 'falling', 'stable'], default: 'stable' },
  lastUpdated:        { type: String }
}, { timestamps: true });

module.exports = mongoose.model('StateThreat', stateThreatSchema);
