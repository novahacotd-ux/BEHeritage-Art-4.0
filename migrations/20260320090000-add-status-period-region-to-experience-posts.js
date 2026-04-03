'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'experience_posts';
    const tableDefinition = await queryInterface.describeTable(tableName);

    if (!tableDefinition.period_id) {
      await queryInterface.addColumn(tableName, 'period_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'historical_periods',
          key: 'period_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      });
    }

    if (!tableDefinition.region_id) {
      await queryInterface.addColumn(tableName, 'region_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'regions',
          key: 'region_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      });
    }

    if (!tableDefinition.status) {
      await queryInterface.addColumn(tableName, 'status', {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      });
    }

    try {
      await queryInterface.addIndex(tableName, ['period_id']);
    } catch (error) {
      // Ignore if index already exists.
    }

    try {
      await queryInterface.addIndex(tableName, ['region_id']);
    } catch (error) {
      // Ignore if index already exists.
    }

    try {
      await queryInterface.addIndex(tableName, ['status']);
    } catch (error) {
      // Ignore if index already exists.
    }
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'experience_posts';
    const tableDefinition = await queryInterface.describeTable(tableName);

    try {
      await queryInterface.removeIndex(tableName, ['period_id']);
    } catch (error) {
      // Ignore if index does not exist.
    }

    try {
      await queryInterface.removeIndex(tableName, ['region_id']);
    } catch (error) {
      // Ignore if index does not exist.
    }

    try {
      await queryInterface.removeIndex(tableName, ['status']);
    } catch (error) {
      // Ignore if index does not exist.
    }

    if (tableDefinition.period_id) {
      await queryInterface.removeColumn(tableName, 'period_id');
    }

    if (tableDefinition.region_id) {
      await queryInterface.removeColumn(tableName, 'region_id');
    }

    if (tableDefinition.status) {
      await queryInterface.removeColumn(tableName, 'status');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_experience_posts_status";');
    }
  },
};
