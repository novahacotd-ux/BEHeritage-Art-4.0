const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const HistoricalEvent = sequelize.define(
    'HistoricalEvent',
    {
    event_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    period_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'historical_periods',
            key: 'period_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    },
    description: {
        type: DataTypes.TEXT
    },
    },
    {
        tableName: 'historical_events',
        timestamps: false
    }
);

module.exports = HistoricalEvent;
