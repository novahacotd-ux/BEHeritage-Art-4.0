'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.removeColumn('historical_events', 'thumbnail_url');

  },
  async down (queryInterface, Sequelize) {
     await queryInterface.addColumn('historical_events', 'thumbnail_url', {
      type: Sequelize.STRING,
    });
  }
};
