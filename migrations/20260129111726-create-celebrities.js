'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('celebrities', {
    celebrities_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    },
    period_id: {
      type:Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'historical_periods',
        key: 'period_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    thumbnail_url: {
      type: Sequelize.STRING,
    },
    bio: {
      type: Sequelize.TEXT
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
   })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('celebrities')
  }
};
