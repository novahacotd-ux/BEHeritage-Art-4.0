'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('news_images', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      news_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'news',
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
    await queryInterface.addIndex('news_images', ['news_id'], {
      name: 'idx_news_images_news_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('news_images');
  }
};
