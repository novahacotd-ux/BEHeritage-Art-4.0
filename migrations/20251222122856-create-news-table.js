'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('news', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      created_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('news', ['status'], {
      name: 'idx_news_status'
    });

    await queryInterface.addIndex('news', ['created_date'], {
      name: 'idx_news_created_date'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('news');
  }
};
