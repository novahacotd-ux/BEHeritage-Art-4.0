const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const HistoricalSite = sequelize.define('HistoricalSite', {
  site_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
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
    type: DataTypes.UUID
  },
  period_id: {
    type: DataTypes.UUID
  }
}, {
  tableName: 'historical_sites',
  timestamps: true // Thường bảng chính nên có timestamps
});

module.exports = HistoricalSite;