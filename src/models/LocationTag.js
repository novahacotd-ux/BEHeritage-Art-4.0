const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const LocationTag = sequelize.define('LocationTag', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  location_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'locations',
      key: 'id',
    },
  },
  period_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'historical_periods',
      key: 'period_id',
    },
  },
  region_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'regions',
      key: 'region_id',
    },
  },
}, {
  tableName: 'location_tags',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = LocationTag;
