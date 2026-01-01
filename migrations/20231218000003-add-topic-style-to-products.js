'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add topic_id column to products table
        await queryInterface.addColumn('products', 'topic_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'topics',
                key: 'topic_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Add style_id column to products table
        await queryInterface.addColumn('products', 'style_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'styles',
                key: 'style_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Add indexes
        await queryInterface.addIndex('products', ['topic_id']);
        await queryInterface.addIndex('products', ['style_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('products', 'style_id');
        await queryInterface.removeColumn('products', 'topic_id');
    }
};
