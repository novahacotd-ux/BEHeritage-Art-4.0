'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get role IDs
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, role_code FROM roles;`
    );

    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.role_code] = role.id;
    });

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    // Generate UUID for admin user
    const adminUserId = uuidv4();

    // Insert admin user
    await queryInterface.bulkInsert('users', [
      {
        id: adminUserId,
        name: 'System Administrator',
        email: 'admin@heritage-art.com',
        password: hashedPassword,
        identity_number: 'ADMIN001',
        gender: 'Male',
        status: 'Active',
        create_at: new Date()
      }
    ]);

    // Assign ADMIN role to admin user
    await queryInterface.bulkInsert('user_roles', [
      {
        id: uuidv4(),
        user_id: adminUserId,
        role_id: roleMap['ADMIN']
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Delete user_roles first
    await queryInterface.sequelize.query(
      `DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@heritage-art.com');`
    );

    // Delete user
    await queryInterface.bulkDelete('users', { email: 'admin@heritage-art.com' }, {});
  }
};
