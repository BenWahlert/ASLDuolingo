const { Lesson, Exercise, Progress, User } = require('../models');

async function getAllLessons(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    const lessons = await Lesson.findAll({
      order: [['order_index', 'ASC']]
    });

    const progress = await Progress.findAll({
      where: { user_id: userId }
    });

    const progressMap = {};
    progress.forEach(p => {
      progressMap[p.lesson_id] = p;
    });

    const lessonsWithProgress = lessons.map(lesson => {
      const lessonProgress = progressMap[lesson.id];
      const isUnlocked = user.total_xp >= lesson.required_xp;

      return {
        ...lesson.toJSON(),
        progress: lessonProgress ? lessonProgress.toJSON() : null,
        unlocked: isUnlocked
      };
    });

    res.json(lessonsWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getLessonById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const progress = await Progress.findOne({
      where: { user_id: userId, lesson_id: id }
    });

    const user = await User.findByPk(userId);
    const isUnlocked = user.total_xp >= lesson.required_xp;

    res.json({
      ...lesson.toJSON(),
      progress: progress ? progress.toJSON() : null,
      unlocked: isUnlocked
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getLessonExercises(req, res) {
  try {
    const { id } = req.params;

    const exercises = await Exercise.findAll({
      where: { lesson_id: id },
      order: [['order_index', 'ASC']]
    });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllLessons, getLessonById, getLessonExercises };
