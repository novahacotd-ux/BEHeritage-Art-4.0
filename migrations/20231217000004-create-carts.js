'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('carts', {
            cart_id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            user_id: {
                type: Sequelize.UUID,
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
