'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ai_categories', {
      category_id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      key: { type: Sequelize.STRING, allowNull: false, unique: true },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT }
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('ai_categories'); }
};