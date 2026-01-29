const { User } = require('../models');
const { XP_VALUES } = require('../config/constants');
const { addXp } = require('./xpService');

async function updateStreak(userId) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.last_practice_date) {
    user.current_streak = 1;
    user.last_practice_date = today;
    await user.save();
    return { streakIncreased: true, currentStreak: 1 };
  }

  const lastPractice = new Date(user.last_practice_date);
  lastPractice.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    return { streakIncreased: false, currentStreak: user.current_streak };
  }

  if (daysDiff === 1) {
    user.current_streak += 1;
    if (user.current_streak > user.longest_streak) {
      user.longest_streak = user.current_streak;
    }
    user.last_practice_date = today;
    await user.save();

    await addXp(userId, XP_VALUES.DAILY_STREAK_BONUS);

    return { streakIncreased: true, currentStreak: user.current_streak };
  }

  user.current_streak = 1;
  user.last_practice_date = today;
  await user.save();

  return { streakIncreased: false, currentStreak: 1, streakReset: true };
}

module.exports = { updateStreak };
