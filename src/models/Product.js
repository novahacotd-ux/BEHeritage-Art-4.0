const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'category_id'
        }
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'topics',
            key: 'topic_id'
        }
    },
    style_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'styles',
            key: 'style_id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'Active',
        validate: {
            isIn: [['Active', 'Inactive', 'Out of Stock']]
        }
    }
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Product;
