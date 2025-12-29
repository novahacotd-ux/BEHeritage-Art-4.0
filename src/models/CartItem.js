const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const CartItem = sequelize.define('CartItem', {
    cart_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'carts',
            key: 'cart_id'
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
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'Active',
        validate: {
            isIn: [['Active', 'Removed']]
        }
    }
}, {
    tableName: 'cart_items',
    timestamps: false
});

module.exports = CartItem;
