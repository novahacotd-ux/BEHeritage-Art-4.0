const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const HistoricalPeriod = sequelize.define('HistoricalPeriod', {
  period_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_year: {
    type: DataTypes.INTEGER
  },
  end_year: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'historical_periods',
  timestamps: false
});

module.exports = HistoricalPeriod;