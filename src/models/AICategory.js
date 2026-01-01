const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const AICategory = sequelize.define('AICategory', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: { // Ví dụ: 'IMAGE_GEN', 'TEXT_GEN'
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'ai_categories',
  timestamps: false
});

module.exports = AICategory;