const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Topic = sequelize.define('Topic', {
    topic_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
