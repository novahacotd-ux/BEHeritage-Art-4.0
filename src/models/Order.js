const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'addresses',
            key: 'address_id'
        }
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    receive_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']]
        }
    }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Order;
