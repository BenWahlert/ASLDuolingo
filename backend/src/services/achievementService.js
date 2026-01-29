const { Achievement, UserAchievement, User, Progress, Lesson } = require('../models');

async function checkAndAwardAchievements(userId) {
  const user = await User.findByPk(userId);
  const userAchievements = await UserAchievement.findAll({
    where: { user_id: userId }
  });

  const earnedAchievementIds = userAchievements.map(ua => ua.achievement_id);
  const allAchievements = await Achievement.findAll();

  const newlyEarned = [];

  for (const achievement of allAchievements) {
    if (earnedAchievementIds.includes(achievement.id)) {
      continue;
    }

    const earned = await checkAchievementRequirement(
      userId,
      user,
      achievement
    );

    if (earned) {
      await UserAchievement.create({
        user_id: userId,
        achievement_id: achievement.id
      });
      newlyEarned.push(achievement);
    }
  }

  return newlyEarned;
}

async function checkAchievementRequirement(userId, user, achievement) {
  switch (achievement.requirement_type) {
    case 'total_xp':
      return user.total_xp >= achievement.requirement_value;

    case 'streak_days':
      return user.current_streak >= achievement.requirement_value;

    case 'lessons_completed':
      const completedCount = await Progress.count({
        where: {
          user_id: userId,
          status: 'completed'
        }
      });
      return completedCount >= achievement.requirement_value;

    case 'category_complete':
      const categoryLessons = await Progress.findAll({
        where: { user_id: userId, status: 'completed' },
        include: [{
          model: Lesson,
          where: { category: achievement.requirement_value }
        }]
      });
      return categoryLessons.length >= achievement.requirement_value;

    default:
      return false;
  }
}

module.exports = { checkAndAwardAchievements };
