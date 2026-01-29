const { Achievement, UserAchievement } = require('../models');

async function getAllAchievements(req, res) {
  try {
    const achievements = await Achievement.findAll();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserAchievements(req, res) {
  try {
    const userId = req.user.id;

    const userAchievements = await UserAchievement.findAll({
      where: { user_id: userId },
      include: [{ model: Achievement }]
    });

    res.json(userAchievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllAchievements, getUserAchievements };
