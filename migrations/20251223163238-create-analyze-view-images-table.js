'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('analyze_view_images', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      analyze_view_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'analyze_view',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      created_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    });

    // Add index for foreign key for better query performance
    await queryInterface.addIndex('analyze_view_images', ['analyze_view_id'], {
      name: 'idx_analyze_view_images_analyze_view_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('analyze_view_images');
  }
};
