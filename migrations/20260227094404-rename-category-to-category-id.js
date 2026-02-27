'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('forum_posts', 'category_id', {
      type: Sequelize.UUID,
      allowNull: true, // tạm thời cho null
    });

    // ⚠️ Nếu bạn có mapping dữ liệu cũ → xử lý ở đây

    // 2. Xóa column cũ
    await queryInterface.removeColumn('forum_posts', 'category');

    // 3. Set NOT NULL + FK
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
