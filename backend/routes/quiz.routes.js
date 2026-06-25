const router = require('express').Router();
const { getQuizQuestions, submitScore, getLeaderboard } = require('../controllers/quiz.controller');
const { writeLimiter } = require('../middleware/rateLimiter');

router.get('/leaderboard', getLeaderboard);
router.get('/:lang', getQuizQuestions);
router.post('/score', writeLimiter, submitScore);

module.exports = router;
