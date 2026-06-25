const router = require('express').Router();
const { getAlerts } = require('../controllers/alerts.controller');

router.get('/', getAlerts);

module.exports = router;
