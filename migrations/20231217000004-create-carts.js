'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('carts', {
            cart_id: {
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
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            status: {
                type: Sequelize.STRING(20),
                defaultValue: 'Active'
            }
        });

        // Add index on user_id
        await queryInterface.addIndex('carts', ['user_id']);

        // Add unique constraint to ensure one active cart per user
        await queryInterface.addIndex('carts', ['user_id', 'status'], {
            name: 'unique_active_cart_per_user',
            unique: true,
            where: {
                status: 'Active'
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('carts');
    }
};
