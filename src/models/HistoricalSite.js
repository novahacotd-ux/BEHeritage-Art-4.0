const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const HistoricalSite = sequelize.define('HistoricalSite', {
  site_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  province: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  lat: { // Latitude: Vĩ độ (cần cho Map)
    type: DataTypes.DECIMAL(10, 8), 
    allowNull: false
  },
  lng: { // Longitude: Kinh độ (cần cho Map)
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  year_built: {
    type: DataTypes.INTEGER
  },
  // Foreign keys sẽ được tạo tự động bởi Associations, 
  // nhưng khai báo rõ ràng cũng tốt
  region_id: {
    type: DataTypes.INTEGER
  },
  period_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'historical_sites',
  timestamps: true // Thường bảng chính nên có timestamps
});

module.exports = HistoricalSite;