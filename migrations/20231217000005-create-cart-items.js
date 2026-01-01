'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cart_items', {
            cart_item_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            cart_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'carts',
                    key: 'cart_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'product_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            status: {
                type: Sequelize.STRING(20),
                defaultValue: 'Active'
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Add indexes
        await queryInterface.addIndex('cart_items', ['cart_id']);
        await queryInterface.addIndex('cart_items', ['product_id']);

        // Add unique constraint to prevent duplicate products in same cart
        await queryInterface.addIndex('cart_items', ['cart_id', 'product_id'], {
            unique: true,
            name: 'unique_product_per_cart'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('cart_items');
    }
};
