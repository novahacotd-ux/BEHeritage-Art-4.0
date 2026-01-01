const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Region = sequelize.define('Region', {
  region_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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