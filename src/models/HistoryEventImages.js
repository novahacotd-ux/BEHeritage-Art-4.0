const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const HistoryEventImages= sequelize.define('history_event_images', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'historical_events',
            key: 'event_id'
        }
    },
}, {
    tableName: 'history_event_images',
    timestamps: false
})

module.exports= HistoryEventImages