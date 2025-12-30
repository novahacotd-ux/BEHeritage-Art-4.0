const { sequelize } = require('../../config/db');
const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');
const Friendship = require('./Friendship');
const Message = require('./Message');

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

// Friendship associations
Friendship.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Friendship.belongsTo(User, {
  foreignKey: 'friend_id',
  as: 'friend'
});

User.hasMany(Friendship, {
  foreignKey: 'user_id',
  as: 'sentRequests'
});

User.hasMany(Friendship, {
  foreignKey: 'friend_id',
  as: 'receivedRequests'
});

// Message associations
Message.belongsTo(User, {
  foreignKey: 'sender_id',
  as: 'sender'
});

Message.belongsTo(User, {
  foreignKey: 'receiver_id',
  as: 'receiver'
});

User.hasMany(Message, {
  foreignKey: 'sender_id',
  as: 'sentMessages'
});

User.hasMany(Message, {
  foreignKey: 'receiver_id',
  as: 'receivedMessages'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Friendship,
  Message
};
