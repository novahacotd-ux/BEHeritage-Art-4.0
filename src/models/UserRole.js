const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  }
}, {
  tableName: 'user_roles',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'role_id']
    }
  ]
});

module.exports = UserRole;
