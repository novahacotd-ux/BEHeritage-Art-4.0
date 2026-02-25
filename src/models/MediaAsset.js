const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const MediaAsset = sequelize.define('MediaAsset', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  location_id : {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(50),
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

  display_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

}, {
  tableName: 'media_assets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = MediaAsset;
