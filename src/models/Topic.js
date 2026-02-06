const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Topic = sequelize.define('Topic', {
    topic_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'Active',
        validate: {
            isIn: [['Active', 'Inactive']]
        }
    }
}, {
    tableName: 'topics',
    timestamps: false
});

module.exports = Topic;
