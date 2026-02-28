'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('forum_posts', 'category_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });
    await queryInterface.removeColumn('forum_posts', 'category');

    await queryInterface.changeColumn('forum_posts', 'category_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'forum_category',
        key: 'category_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
  async down (queryInterface, Sequelize) {
     await queryInterface.addColumn('forum_posts', 'category', {
      type: Sequelize.STRING,
    });

    await queryInterface.removeColumn('forum_posts', 'category_id');
  }
};
