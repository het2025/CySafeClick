const router = require('express').Router();
const { getStats } = require('../controllers/stats.controller');

router.get('/', getStats);

module.exports = router;
