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
}, {
  tableName: 'experience_posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ExperiencePost;
