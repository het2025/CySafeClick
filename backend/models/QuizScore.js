const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
  playerName:  { type: String, default: 'Anonymous' },
  score:       { type: Number, required: true },
  totalQuestions: { type: Number, default: 10 },
  weekKey:     { type: String, required: true },
  lang:        { type: String, default: 'en' },
  playedAt:    { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QuizScore', quizScoreSchema);
