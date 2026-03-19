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

      period_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'historical_periods',
          key: 'period_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      region_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'regions',
          key: 'region_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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

      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
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
    await queryInterface.addIndex('experience_posts', ['period_id']);
    await queryInterface.addIndex('experience_posts', ['region_id']);
    await queryInterface.addIndex('experience_posts', ['type']);
    await queryInterface.addIndex('experience_posts', ['status']);
  },

  async down(queryInterface, Sequelize) {
    // Xóa ENUM trước khi drop table trong PostgreSQL tránh lỗi
    await queryInterface.dropTable('experience_posts');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_experience_posts_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_experience_posts_status";');
  },
};
