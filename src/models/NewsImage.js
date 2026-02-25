const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const NewsImage = sequelize.define('NewsImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  news_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'news',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true,
      isUrl: true
    }
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_date'
  }
}, {
  tableName: 'news_images',
  timestamps: false
});

module.exports = NewsImage;
