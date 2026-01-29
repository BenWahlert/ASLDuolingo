const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  required_xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  xp_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  }
}, {
  tableName: 'lessons',
  underscored: true,
  timestamps: true
});

module.exports = Lesson;
