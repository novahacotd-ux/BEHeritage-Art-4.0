'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      role_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      role_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'Active'
      }
    });

    // Add index on role_code for faster lookups
    await queryInterface.addIndex('roles', ['role_code']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
