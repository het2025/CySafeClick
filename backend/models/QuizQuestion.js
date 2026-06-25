const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  id:           { type: String },
  category:     { type: String, default: '' },
  question:     { type: String, required: true },
  options:      [{ type: String }],
  correctIndex: { type: Number, required: true },
  explanation:  { type: String, default: '' },
  lang:         { type: String, enum: ['en', 'hi'], default: 'en' }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
