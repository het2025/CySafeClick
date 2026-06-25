const router = require('express').Router();
const { getReportsForNumber } = require('../controllers/community.controller');

router.get('/reports/:number', getReportsForNumber);

module.exports = router;
