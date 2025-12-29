'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('site_images', {
      image_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      img_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      caption: {
        type: Sequelize.STRING
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      media_type: {
        type: Sequelize.ENUM('image', 'video', 'vr3d'),
        defaultValue: 'image'
      },
      // Khóa ngoại Site
      site_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'historical_sites',
          key: 'site_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Xóa site thì xóa luôn ảnh
      },
      // Khóa ngoại User (Người upload)
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Đảm bảo tên bảng trong DB là 'users'
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('site_images');
  }
};