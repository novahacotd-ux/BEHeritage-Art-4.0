const { Role, User, UserRole } = require('../models');

/**
 * Get all roles
 */
const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll({
      order: [['role_code', 'ASC']],
      include: [{
        model: User,
        as: 'users',
        attributes: ['id'],
        through: { attributes: [] },
        required: false
      }]
    });

    // Add user count to each role
    const rolesWithCount = roles.map(role => ({
      id: role.id,
      role_name: role.role_name,
      role_code: role.role_code,
      role_description: role.role_description,
      status: role.status,
      user_count: role.users.length
    }));

    res.status(200).json({
      success: true,
      data: { roles: rolesWithCount }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get role by ID
 */
const getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email', 'identity_number'],
        through: { attributes: [] }
      }]
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { role }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new role
 */
const createRole = async (req, res, next) => {
  try {
    const { role_name, role_code, role_description, status } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { role_code },
          { role_name }
        ]
      }
    });

    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: existingRole.role_code === role_code
          ? 'Role code already exists'
          : 'Role name already exists'
      });
    }

    const role = await Role.create({
      role_name,
      role_code,
      role_description,
      status: status || 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: { role }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update role
 */
const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_name, role_code, role_description, status } = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if updating to existing role name or code
    if (role_name || role_code) {
      const existingRole = await Role.findOne({
        where: {
          id: { [require('sequelize').Op.ne]: id },
          [require('sequelize').Op.or]: [
            ...(role_code ? [{ role_code }] : []),
            ...(role_name ? [{ role_name }] : [])
          ]
        }
      });

      if (existingRole) {
        return res.status(409).json({
          success: false,
          message: existingRole.role_code === role_code
            ? 'Role code already exists'
            : 'Role name already exists'
        });
      }
    }

    await role.update({
      ...(role_name && { role_name }),
      ...(role_code && { role_code }),
      ...(role_description !== undefined && { role_description }),
      ...(status !== undefined && { status })
    });

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: { role }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete role
 */
const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if role is in use
    const userRoleCount = await UserRole.count({ where: { role_id: id } });

    if (userRoleCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. ${userRoleCount} user(s) currently have this role.`
      });
    }

    await role.destroy();

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
