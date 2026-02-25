const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const AnalyzeViewImage = sequelize.define('AnalyzeViewImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  analyze_view_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'analyze_view',
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
  tableName: 'analyze_view_images',
  timestamps: false
});

module.exports = AnalyzeViewImage;
