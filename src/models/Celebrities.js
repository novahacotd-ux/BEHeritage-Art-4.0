const { DataTypes} = require('sequelize');
const { sequelize } = require('../../config/db');

const Celebrities= sequelize.define("Celebrities", {
    celebrities_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE
    }
    },
    {
        tableName: 'celebrities',
        timestamps: false
    }
);

module.exports = Celebrities