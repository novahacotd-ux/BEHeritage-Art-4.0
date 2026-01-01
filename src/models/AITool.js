const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const AITool = sequelize.define('AITool', {
  tool_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  website_link: { // Link tới tool (nội bộ hoặc bên ngoài)
    type: DataTypes.STRING
  },
  avg_rating: { // Điểm trung bình (tự động tính)
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  total_reviews: { // Tổng số lượt review
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'ai_tools',
  timestamps: true
});

module.exports = AITool;