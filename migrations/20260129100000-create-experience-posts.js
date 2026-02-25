'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('experience_posts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },

    

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      caption: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      type: {
        type: Sequelize.ENUM('image', 'video'),
        allowNull: true,
      },

      cloudinary_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      cloudinary_public_id: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Indexes (tối ưu query)
    await queryInterface.addIndex('experience_posts', ['user_id']);
    await queryInterface.addIndex('experience_posts', ['type']);
  },

  async down(queryInterface, Sequelize) {
    // Xóa ENUM trước khi drop table trong PostgreSQL tránh lỗi
    await queryInterface.dropTable('experience_posts');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_experience_posts_type";');
  },
};
