const express = require('express');
const router = express.Router();
const { injectDefaultUser } = require('../middleware/defaultUser');
const { getAllAchievements, getUserAchievements } = require('../controllers/achievementController');

router.get('/', injectDefaultUser, getAllAchievements);
router.get('/user', injectDefaultUser, getUserAchievements);

module.exports = router;
