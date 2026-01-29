const express = require('express');
const router = express.Router();
const { injectDefaultUser } = require('../middleware/defaultUser');
const { getAllLessons, getLessonById, getLessonExercises } = require('../controllers/lessonController');

router.get('/', injectDefaultUser, getAllLessons);
router.get('/:id', injectDefaultUser, getLessonById);
router.get('/:id/exercises', injectDefaultUser, getLessonExercises);

module.exports = router;
