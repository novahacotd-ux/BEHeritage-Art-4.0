'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ai_tools', {
      tool_id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      website_link: { type: Sequelize.STRING },
      avg_rating: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      total_reviews: { type: Sequelize.INTEGER, defaultValue: 0 },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'ai_categories', key: 'category_id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('ai_tools'); }
};