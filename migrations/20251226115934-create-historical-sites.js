'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('historical_sites', {
      site_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      province: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      lat: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false
      },
      lng: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false
      },
      year_built: {
        type: Sequelize.INTEGER
      },
      // Khóa ngoại Region
      region_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'regions', 
          key: 'region_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Khóa ngoại Period
      period_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'historical_periods',
          key: 'period_id'
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
    await queryInterface.dropTable('historical_sites');
  }
};