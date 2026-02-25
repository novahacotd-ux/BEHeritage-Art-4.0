const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const AnalyzeView = sequelize.define('AnalyzeView', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  content: {
    type: DataTypes.TEXT('long'),
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
  tableName: 'analyze_view',
  timestamps: false
});

module.exports = AnalyzeView;
