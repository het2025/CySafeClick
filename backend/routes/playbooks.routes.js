const router = require('express').Router();
const { getPlaybooks } = require('../controllers/playbooks.controller');

router.get('/:lang', getPlaybooks);

module.exports = router;
