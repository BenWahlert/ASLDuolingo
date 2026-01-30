const sequelize = require('../src/config/db');
const { Lesson, Exercise, Achievement } = require('../src/models');
const { XP_VALUES, LEVEL_THRESHOLDS } = require('../src/config/constants');
const fs = require('fs');
const path = require('path');

async function exportData() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    const lessons = await Lesson.findAll({ order: [['order_index', 'ASC']] });
    const exercises = await Exercise.findAll({ order: [['lesson_id', 'ASC'], ['order_index', 'ASC']] });
    const achievements = await Achievement.findAll();

    const lessonIdMap = {};
    const lessonsJson = lessons.map((l, idx) => {
      const lessonId = `lesson-${idx + 1}`;
      lessonIdMap[l.id] = lessonId;
      return {
        id: lessonId,
        title: l.title,
        description: l.description,
        category: l.category,
        order_index: l.order_index,
        required_xp: l.required_xp,
        xp_reward: l.xp_reward
      };
    });

    let exerciseCounter = 1;
    const exercisesJson = exercises.map(e => {
      let options = e.options;
      try {
        if (typeof options === 'string') {
          options = JSON.parse(options);
        }
      } catch (err) {
        console.error('Failed to parse options for exercise:', e.id, err);
        options = [];
      }

      return {
        id: `exercise-${exerciseCounter++}`,
        lesson_id: lessonIdMap[e.lesson_id],
        type: e.type,
        question_text: e.question_text,
        image_url: e.image_url,
        correct_answer: e.correct_answer,
        options: options,
        order_index: e.order_index
      };
    });

    const achievementsJson = achievements.map((a, idx) => ({
      id: `achievement-${idx + 1}`,
      name: a.name,
      description: a.description,
      icon: a.icon,
      requirement_type: a.requirement_type,
      requirement_value: a.requirement_value
    }));

    const constantsJson = {
      xpValues: {
        exerciseCorrectFirstTry: XP_VALUES.EXERCISE_CORRECT_FIRST_TRY,
        exerciseCorrectSecondTry: XP_VALUES.EXERCISE_CORRECT_SECOND_TRY,
        exerciseCorrectThirdPlus: XP_VALUES.EXERCISE_CORRECT_THIRD_PLUS,
        lessonCompletionBonus: XP_VALUES.LESSON_COMPLETION_BONUS,
        dailyStreakBonus: XP_VALUES.DAILY_STREAK_BONUS,
        perfectLessonBonus: XP_VALUES.PERFECT_LESSON_BONUS
      },
      levelThresholds: LEVEL_THRESHOLDS
    };

    const outputDir = path.join(__dirname, '../../frontend/src/data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outputDir, 'lessons.json'), JSON.stringify(lessonsJson, null, 2));
    fs.writeFileSync(path.join(outputDir, 'exercises.json'), JSON.stringify(exercisesJson, null, 2));
    fs.writeFileSync(path.join(outputDir, 'achievements.json'), JSON.stringify(achievementsJson, null, 2));
    fs.writeFileSync(path.join(outputDir, 'constants.json'), JSON.stringify(constantsJson, null, 2));

    console.log('✓ Data exported successfully to frontend/src/data/');
    console.log(`  - ${lessonsJson.length} lessons`);
    console.log(`  - ${exercisesJson.length} exercises`);
    console.log(`  - ${achievementsJson.length} achievements`);
    console.log('  - Constants (XP values and level thresholds)');

    process.exit(0);
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

exportData();
