'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('historical_events', {
      event_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID
      },
      period_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'historical_periods',
          key: 'period_id',
        },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      start_year: {
        type: Sequelize.INTEGER
      },
      end_year: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      thumbnail_url: {
        type: Sequelize.STRING
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('historical_events')
  }
};
