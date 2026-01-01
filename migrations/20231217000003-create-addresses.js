'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('addresses', {
            address_id: {
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
                onDelete: 'CASCADE'
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            is_default: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        await queryInterface.addIndex('addresses', ['user_id']);
        await queryInterface.addIndex('addresses', ['is_default']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('addresses');
    }
};
