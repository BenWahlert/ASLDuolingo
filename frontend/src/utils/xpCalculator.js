const LEVEL_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 3500,
  8: 5500,
  9: 8000,
  10: 11000,
  11: 14500,
  12: 18500,
  13: 23000,
  14: 28000,
  15: 33500
};

export function getXpForNextLevel(currentXp, currentLevel) {
  const nextLevel = currentLevel + 1;
  const nextLevelThreshold = LEVEL_THRESHOLDS[nextLevel];

  if (!nextLevelThreshold) {
    return null;
  }

  return nextLevelThreshold - currentXp;
}

export function getCurrentLevelProgress(currentXp, currentLevel) {
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel + 1];

  if (!nextThreshold) {
    return 100;
  }

  const xpIntoLevel = currentXp - currentThreshold;
  const xpNeededForLevel = nextThreshold - currentThreshold;

  return (xpIntoLevel / xpNeededForLevel) * 100;
}
