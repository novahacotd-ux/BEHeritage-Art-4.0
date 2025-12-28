'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payments', {
            payment_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'order_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            method: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: 'COD, Credit Card, Bank Transfer, E-Wallet, etc.'
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            response: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Payment gateway response'
            },
            date: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            status: {
                type: Sequelize.STRING(20),
                defaultValue: 'Pending',
                comment: 'Pending, Success, Failed, Refunded'
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
        await queryInterface.addIndex('payments', ['order_id']);
        await queryInterface.addIndex('payments', ['status']);
        await queryInterface.addIndex('payments', ['date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('payments');
    }
};
