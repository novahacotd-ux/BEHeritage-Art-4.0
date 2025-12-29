const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Payment = sequelize.define('Payment', {
    payment_id: {
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
    method: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['COD', 'Credit Card', 'Bank Transfer', 'E-Wallet', 'PayPal']]
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'Success', 'Failed', 'Refunded']]
        }
    }
}, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Payment;
