'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('analyze_view', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      summary: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'Draft',
        allowNull: false
      },
      tag: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      thumbnail_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      created_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('analyze_view', ['status'], {
      name: 'idx_analyze_view_status'
    });

    await queryInterface.addIndex('analyze_view', ['created_date'], {
      name: 'idx_analyze_view_created_date'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('analyze_view');
  }
};
