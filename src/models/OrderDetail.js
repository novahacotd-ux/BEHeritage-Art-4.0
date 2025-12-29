const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const OrderDetail = sequelize.define('OrderDetail', {
    order_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'order_id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'product_id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'Active',
        validate: {
            isIn: [['Active', 'Cancelled', 'Refunded']]
        }
    }
}, {
    tableName: 'order_details',
    timestamps: false
});

module.exports = OrderDetail;
