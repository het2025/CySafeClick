const QuizQuestion = require('../models/QuizQuestion');
const { asyncHandler } = require('../utils/helpers');

// GET /api/quiz/:lang
exports.getQuizQuestions = asyncHandler(async (req, res) => {
  const lang = req.params.lang || 'en';
  const count = parseInt(req.query.count) || 10;

  // Get random questions using MongoDB aggregation
  const questions = await QuizQuestion.aggregate([
    { $match: { lang } },
    { $sample: { size: count } }
  ]);

  res.json({ questions });
});

// POST /api/quiz/score
exports.submitScore = asyncHandler(async (req, res) => {
  res.status(410).json({
    success: false,
    disabled: true,
    error: 'Public quiz score storage is disabled to avoid collecting personal data.'
  });
});

// GET /api/quiz/leaderboard
exports.getLeaderboard = asyncHandler(async (req, res) => {
  res.json([]);
});
