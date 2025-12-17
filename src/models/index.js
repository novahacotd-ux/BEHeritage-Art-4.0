const { sequelize } = require('../../config/db');
const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');

// Define Many-to-Many associations through UserRole
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'user_id',
  otherKey: 'role_id',
  as: 'roles'
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'role_id',
  otherKey: 'user_id',
  as: 'users'
});

// Direct associations for convenience
User.hasMany(UserRole, {
  foreignKey: 'user_id',
  as: 'userRoles'
});

Role.hasMany(UserRole, {
  foreignKey: 'role_id',
  as: 'userRoles'
});

UserRole.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

UserRole.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Role,
  UserRole
};
