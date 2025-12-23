const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT('long'), // Support very long content for articles
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Draft',
    validate: {
      isIn: [['Draft', 'Published', 'Archived', 'Deleted']]
    }
  },
  tag: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_date'
  }
}, {
  tableName: 'news',
  timestamps: false
});

module.exports = News;
