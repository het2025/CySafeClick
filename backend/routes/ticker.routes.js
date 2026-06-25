const router = require('express').Router();
const { getTickerItems } = require('../controllers/ticker.controller');

router.get('/', getTickerItems);

module.exports = router;
