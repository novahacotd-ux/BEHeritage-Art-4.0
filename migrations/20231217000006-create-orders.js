'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            order_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            address_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'addresses',
                    key: 'address_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            order_date: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            receive_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            total_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },
            note: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            status: {
                type: Sequelize.STRING(20),
                defaultValue: 'Pending',
                comment: 'Pending, Processing, Shipped, Delivered, Cancelled'
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
        await queryInterface.addIndex('orders', ['user_id']);
        await queryInterface.addIndex('orders', ['address_id']);
        await queryInterface.addIndex('orders', ['order_date']);
        await queryInterface.addIndex('orders', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('orders');
    }
};
