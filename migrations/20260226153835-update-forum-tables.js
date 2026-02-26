'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('forum_posts','title', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('forum_posts', 'category', {
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('forum_posts','title')
    await queryInterface.removeColumn('forum_posts', 'category')
  }
};
