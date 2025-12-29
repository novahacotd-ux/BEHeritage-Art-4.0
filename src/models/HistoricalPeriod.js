const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const HistoricalPeriod = sequelize.define('HistoricalPeriod', {
  period_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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