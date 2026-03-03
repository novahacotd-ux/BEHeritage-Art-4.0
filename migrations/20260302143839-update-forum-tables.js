'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('forum_posts','dislikes', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }) 
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.removeColumn('forum_posts','dislikes'); 
  }
};
