const router = require('express').Router();
const { getGlossary } = require('../controllers/glossary.controller');

router.get('/', getGlossary);

module.exports = router;
