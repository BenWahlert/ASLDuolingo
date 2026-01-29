const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { injectDefaultUser } = require('../middleware/defaultUser');

router.post('/register', register);
router.post('/login', login);
router.get('/me', injectDefaultUser, getMe);

module.exports = router;
