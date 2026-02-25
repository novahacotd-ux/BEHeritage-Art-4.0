"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove updated_at column from payments table
    // await queryInterface.removeColumn('payments', 'updated_at');
    // Remove updated_at column from orders table
    // await queryInterface.removeColumn('orders', 'updated_at');
  },

  async down(queryInterface, Sequelize) {
    // Add back updated_at column to payments table
    await queryInterface.addColumn("payments", "updated_at", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // Add back updated_at column to orders table
    await queryInterface.addColumn("orders", "updated_at", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },
};
