"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("events", "status", {
      type: Sequelize.STRING(20),
      defaultValue: "Draft",
      allowNull: true, // Allow null initially to avoid issues with existing data, or set default
    });
    // Update existing records to 'Published' or 'Draft'? Let's default to 'Draft' as per schema definition but maybe update existing to Published if they were live?
    // User didn't specify, but `defaultValue: "Draft"` handles new ones.
    // For existing, let's update them to 'Published' so they don't disappear from frontend if we were filtering (though user said show all).
    // Let's just stick to adding the column.
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("events", "status");
  },
};
