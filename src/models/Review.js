const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
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
    type: DataTypes.UUID
  },
  tool_id: {
    type: DataTypes.UUID
  }
}, {
  tableName: 'reviews',
  timestamps: true
});

module.exports = Review;