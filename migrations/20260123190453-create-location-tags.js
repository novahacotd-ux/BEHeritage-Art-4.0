'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('location_tags', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      location_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      period_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'historical_periods',
          key: 'period_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      region_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'regions',
          key: 'region_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('location_tags', ['location_id', 'period_id', 'region_id'], {
      unique: true,
      name: 'location_tags_unique_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('location_tags');
  },
};
