"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("events", "created_date", "start_date");
    await queryInterface.addColumn("events", "end_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("events", "end_date");
    await queryInterface.renameColumn("events", "start_date", "created_date");
  },
};
