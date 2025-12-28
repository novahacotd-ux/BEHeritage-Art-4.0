'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('topics', {
            topic_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false
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

        // Add index on name for faster searches
        await queryInterface.addIndex('topics', ['name']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('topics');
    }
};
