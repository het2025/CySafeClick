const router = require('express').Router();
const { getStories } = require('../controllers/stories.controller');

router.get('/', getStories);

module.exports = router;
