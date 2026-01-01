const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Style = sequelize.define('Style', {
    style_id: {
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
    tableName: 'styles',
    timestamps: false
});

module.exports = Style;
