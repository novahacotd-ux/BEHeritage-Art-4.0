const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  role_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isUppercase: true,
      isIn: [['ADMIN', 'PREMIUM', 'ART_PATRON', 'TEACHER', 'STUDENT', 'USER']]
    }
  },
  role_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Active',
    validate: {
      isIn: [['Active', 'Inactive']]
    }
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Role;
