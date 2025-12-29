const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  tool_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'reviews',
  timestamps: true
});

module.exports = Review;