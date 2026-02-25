const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const LocationInteraction = sequelize.define('LocationInteraction', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  location_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'locations',
      key: 'id',
    },
  },
  action_type: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'location_interactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = LocationInteraction;
