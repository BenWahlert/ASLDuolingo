const { Progress, User, Lesson, Exercise } = require('../models');
const { XP_VALUES } = require('../config/constants');
const { addXp } = require('../services/xpService');
const { updateStreak } = require('../services/streakService');
const { checkAndAwardAchievements } = require('../services/achievementService');

async function getUserProgress(req, res) {
  try {
    const userId = req.user.id;

    const progress = await Progress.findAll({
      where: { user_id: userId },
      include: [{ model: Lesson }]
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getLessonProgress(req, res) {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const progress = await Progress.findOne({
      where: { user_id: userId, lesson_id: lessonId }
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function startLesson(req, res) {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    const lesson = await Lesson.findByPk(lessonId);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (user.total_xp < lesson.required_xp) {
      return res.status(403).json({ error: 'Lesson locked' });
    }

    let progress = await Progress.findOne({
      where: { user_id: userId, lesson_id: lessonId }
    });

    if (!progress) {
      progress = await Progress.create({
        user_id: userId,
        lesson_id: lessonId,
        status: 'in_progress'
      });
    } else {
      progress.status = 'in_progress';
      progress.last_attempted = new Date();
      await progress.save();
    }

    await updateStreak(userId);

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function completeLesson(req, res) {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const progress = await Progress.findOne({
      where: { user_id: userId, lesson_id: lessonId }
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    const lesson = await Lesson.findByPk(lessonId);

    progress.status = 'completed';
    progress.completion_percentage = 100;
    progress.completed_at = new Date();
    await progress.save();

    const xpResult = await addXp(userId, lesson.xp_reward);

    const newAchievements = await checkAndAwardAchievements(userId);

    res.json({
      progress,
      xpEarned: lesson.xp_reward,
      newTotalXp: xpResult.newTotalXp,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      newAchievements
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function submitExercise(req, res) {
  try {
    const { exerciseId, answer, attemptCount } = req.body;
    const userId = req.user.id;

    if (!exerciseId || !answer || !attemptCount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const exercise = await Exercise.findByPk(exerciseId);

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    const correct = exercise.correct_answer.toLowerCase().trim() === answer.toLowerCase().trim();

    let xpEarned = 0;
    if (correct) {
      if (attemptCount === 1) {
        xpEarned = XP_VALUES.EXERCISE_CORRECT_FIRST_TRY;
      } else if (attemptCount === 2) {
        xpEarned = XP_VALUES.EXERCISE_CORRECT_SECOND_TRY;
      } else {
        xpEarned = XP_VALUES.EXERCISE_CORRECT_THIRD_PLUS;
      }

      const xpResult = await addXp(userId, xpEarned);

      return res.json({
        correct: true,
        xpEarned,
        newTotalXp: xpResult.newTotalXp,
        leveledUp: xpResult.leveledUp,
        newLevel: xpResult.newLevel
      });
    }

    res.json({
      correct: false,
      xpEarned: 0,
      correctAnswer: attemptCount >= 3 ? exercise.correct_answer : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getUserProgress,
  getLessonProgress,
  startLesson,
  completeLesson,
  submitExercise
};
