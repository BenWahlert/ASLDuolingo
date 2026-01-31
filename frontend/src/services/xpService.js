import constantsData from '../data/constants.js';

const { levelThresholds } = constantsData;

/**
 * Calculates user level based on total XP using threshold array
 * @param {number} totalXp - User's total accumulated XP
 * @returns {number} Current level (1-15)
 */
export function calculateLevel(totalXp) {
  let level = 1;
  const levels = Object.entries(levelThresholds).sort((a, b) => b[1] - a[1]);

  for (const [lvl, threshold] of levels) {
    if (totalXp >= threshold) {
      level = parseInt(lvl);
      break;
    }
  }

  return level;
}

/**
 * Adds XP to user and checks for level up
 * @param {Object} userData - User data object (modified in place)
 * @param {number} xpAmount - Amount of XP to add
 * @returns {Object} Result with newTotalXp, newLevel, leveledUp, xpAdded
 */
export function addXp(userData, xpAmount) {
  const oldLevel = userData.current_level;
  userData.total_xp += xpAmount;
  userData.current_level = calculateLevel(userData.total_xp);

  const leveledUp = userData.current_level > oldLevel;

  return {
    newTotalXp: userData.total_xp,
    newLevel: userData.current_level,
    leveledUp,
    xpAdded: xpAmount
  };
}

/**
 * Calculates XP needed to reach next level
 * @param {number} currentXp - User's current total XP
 * @returns {number|null} XP needed for next level, or null if at max level
 */
export function getXpForNextLevel(currentXp) {
  const currentLevel = calculateLevel(currentXp);
  const nextLevel = currentLevel + 1;
  const nextLevelThreshold = levelThresholds[nextLevel];

  if (!nextLevelThreshold) {
    return null;
  }

  return nextLevelThreshold - currentXp;
}
