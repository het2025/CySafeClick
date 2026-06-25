const router = require('express').Router();
const { getThreatFeed } = require('../controllers/threats.controller');

router.get('/feed', getThreatFeed);

module.exports = router;
