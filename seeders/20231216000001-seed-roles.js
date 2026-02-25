'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      {
        id: uuidv4(),
        role_name: 'Administrator',
        role_code: 'ADMIN',
        role_description: 'Administrator with full system access',
        status: 'Active'
      },
      {
        id: uuidv4(),
        role_name: 'Premium User',
        role_code: 'PREMIUM',
        role_description: 'Premium user with enhanced features',
        status: 'Active'
      },
      {
        id: uuidv4(),
        role_name: 'Art Patron',
        role_code: 'ART_PATRON',
        role_description: 'Art patron with special privileges',
        status: 'Active'
      },
      {
        id: uuidv4(),
        role_name: 'Teacher',
        role_code: 'TEACHER',
        role_description: 'Teacher with educational content access',
        status: 'Active'
      },
      {
        id: uuidv4(),
        role_name: 'Student',
        role_code: 'STUDENT',
        role_description: 'Student with learning access',
        status: 'Active'
      },
      {
        id: uuidv4(),
        role_name: 'Regular User',
        role_code: 'USER',
        role_description: 'Regular user with basic access',
        status: 'Active'
      }
    ];

    await queryInterface.bulkInsert('roles', roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
