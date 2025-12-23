'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('news', 'thumbnail_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'URL of the thumbnail image for the news article'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('news', 'thumbnail_url');
  }
};
