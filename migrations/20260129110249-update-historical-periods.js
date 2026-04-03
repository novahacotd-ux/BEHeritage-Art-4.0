'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('historical_periods','description', {
      type: Sequelize.STRING,
    })
    await queryInterface.addColumn('historical_periods','thumbnail_url', {
      type: Sequelize.STRING,
    })
    await queryInterface.addColumn('historical_periods','created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('historical_periods', 'description');
    await queryInterface.removeColumn('historical_periods', 'thumbnail_url');
    await queryInterface.removeColumn('historical_periods', 'created_at');
  }
};
