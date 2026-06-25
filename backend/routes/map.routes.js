const router = require('express').Router();
const { getStateThreatData, getStateThreatById } = require('../controllers/map.controller');

router.get('/', getStateThreatData);
router.get('/:stateId', getStateThreatById);

module.exports = router;
