const router = require('express').Router();
const { lookupNumber, getRelatedNumbers, getAllNumbers } = require('../controllers/numbers.controller');

router.get('/all', getAllNumbers);
router.get('/lookup/:number', lookupNumber);
router.get('/related/:scamType', getRelatedNumbers);

module.exports = router;
