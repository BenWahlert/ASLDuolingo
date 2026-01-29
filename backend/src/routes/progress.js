const express = require('express');
const router = express.Router();
const { injectDefaultUser } = require('../middleware/defaultUser');
const {
  getUserProgress,
  getLessonProgress,
  startLesson,
  completeLesson,
  submitExercise
} = require('../controllers/progressController');

router.get('/', injectDefaultUser, getUserProgress);
router.get('/:lessonId', injectDefaultUser, getLessonProgress);
router.post('/:lessonId/start', injectDefaultUser, startLesson);
router.put('/:lessonId/complete', injectDefaultUser, completeLesson);
router.post('/exercise', injectDefaultUser, submitExercise);

module.exports = router;
