const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const ExperiencePost = sequelize.define('ExperiencePost', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
   user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  period_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'historical_periods',
      key: 'period_id',
    },
  },
  region_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'regions',
      key: 'region_id',
    },
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: true,
  },
  cloudinary_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cloudinary_public_id: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  tableName: 'experience_posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ExperiencePost;
