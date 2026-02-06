const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Region = sequelize.define('Region', {
  region_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'regions',
  timestamps: false // Bảng này trong hình không thấy có created_at
});

module.exports = Region;