const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  requirement_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requirement_value: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'achievements',
  underscored: true,
  timestamps: true
});

module.exports = Achievement;
