'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.removeColumn('forum_posts', 'tag');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('forum_posts', 'tag', {
      type: Sequelize.STRING,
    });
  }
};
