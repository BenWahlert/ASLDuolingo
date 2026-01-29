const { User } = require('../models');
const { LEVEL_THRESHOLDS } = require('../config/constants');

function calculateLevel(totalXp) {
  let level = 1;
  const levels = Object.entries(LEVEL_THRESHOLDS).sort((a, b) => b[1] - a[1]);

  for (const [lvl, threshold] of levels) {
    if (totalXp >= threshold) {
      level = parseInt(lvl);
      break;
    }
  }

  return level;
}

async function addXp(userId, xpAmount) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const oldLevel = user.current_level;
  user.total_xp += xpAmount;
  user.current_level = calculateLevel(user.total_xp);

  await user.save();

  const leveledUp = user.current_level > oldLevel;

  return {
    newTotalXp: user.total_xp,
    newLevel: user.current_level,
    leveledUp,
    xpAdded: xpAmount
  };
}

function getXpForNextLevel(currentXp) {
  const currentLevel = calculateLevel(currentXp);
  const nextLevel = currentLevel + 1;
  const nextLevelThreshold = LEVEL_THRESHOLDS[nextLevel];

  if (!nextLevelThreshold) {
    return null;
  }

  return nextLevelThreshold - currentXp;
}

module.exports = { calculateLevel, addXp, getXpForNextLevel };
