const router = require('express').Router();
const { getWeeklyDigest, getLiveAlerts } = require('../controllers/news.controller');

// GET /api/news/digest
router.get('/digest', getWeeklyDigest);

// GET /api/news/alerts
router.get('/alerts', getLiveAlerts);

module.exports = router;
