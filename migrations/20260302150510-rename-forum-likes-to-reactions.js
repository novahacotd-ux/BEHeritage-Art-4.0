'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('forum_likes', 'forum_reactions')

    await queryInterface.addColumn('forum_reactions', 'reaction_type', {
      type: Sequelize.STRING,
      allowNull:false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('forum_reactions', 'reaction_type');

    await queryInterface.renameTable('forum_reactions', 'forum_likes');
  }
};
