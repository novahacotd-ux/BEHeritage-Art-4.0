const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  revoked_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

/**
 * Check if refresh token is expired
 */
RefreshToken.prototype.isExpired = function () {
  return new Date() > this.expires_at;
};

/**
 * Check if refresh token is revoked
 */
RefreshToken.prototype.isRevoked = function () {
  return this.revoked_at !== null;
};

/**
 * Check if refresh token is valid
 */
RefreshToken.prototype.isValid = function () {
  return !this.isExpired() && !this.isRevoked();
};

module.exports = RefreshToken;
