const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.post('/submit', authenticateToken, async (req, res) => {
  res.json({ correct: false });
});

module.exports = router;
