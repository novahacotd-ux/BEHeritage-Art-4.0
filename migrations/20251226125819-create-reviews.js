'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      review_id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      tool_id: {
        type: Sequelize.INTEGER,
        references: { model: 'ai_tools', key: 'tool_id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('reviews'); }
};