const router = require('express').Router();
const { getPlatforms } = require('../controllers/platforms.controller');

router.get('/2fa', getPlatforms);

module.exports = router;
