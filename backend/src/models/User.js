const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  current_level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  current_streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  longest_streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_practice_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true
});

User.beforeCreate(async (user) => {
  if (user.password_hash) {
    user.password_hash = await bcrypt.hash(user.password_hash, 10);
  }
});

User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;
