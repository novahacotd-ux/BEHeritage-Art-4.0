'use strict';
const bcrypt = require('bcrypt');

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

    // Insert admin user
    const [userId] = await queryInterface.sequelize.query(
      `INSERT INTO users (name, email, password, identity_number, gender, status, create_at) 
       VALUES ('System Administrator', 'admin@heritage-art.com', '${hashedPassword}', 'ADMIN001', 'Male', 'Active', NOW()) 
       RETURNING id;`
    );

    const adminUserId = userId[0].id;

    // Assign ADMIN role to admin user
    await queryInterface.bulkInsert('user_roles', [
      {
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
