const User = require('./User');
const Lesson = require('./Lesson');
const Exercise = require('./Exercise');
const Progress = require('./Progress');
const Achievement = require('./Achievement');
const UserAchievement = require('./UserAchievement');

Lesson.hasMany(Exercise, { foreignKey: 'lesson_id', as: 'exercises' });
Exercise.belongsTo(Lesson, { foreignKey: 'lesson_id' });

User.hasMany(Progress, { foreignKey: 'user_id', as: 'progress' });
Progress.belongsTo(User, { foreignKey: 'user_id' });
Progress.belongsTo(Lesson, { foreignKey: 'lesson_id' });

User.belongsToMany(Achievement, { through: UserAchievement, foreignKey: 'user_id', as: 'achievements' });
Achievement.belongsToMany(User, { through: UserAchievement, foreignKey: 'achievement_id', as: 'users' });

module.exports = {
  User,
  Lesson,
  Exercise,
  Progress,
  Achievement,
  UserAchievement
};
