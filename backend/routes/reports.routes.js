const router = require('express').Router();
const { getReports } = require('../controllers/reports.controller');

router.get('/', getReports);

module.exports = router;
