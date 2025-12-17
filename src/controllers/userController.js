const { User, Role, UserRole } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role_code, status } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { identity_number: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      where.status = status;
    }

    // Include roles filter
    const include = [{
      model: Role,
      as: 'roles',
      attributes: ['id', 'role_name', 'role_code', 'role_description'],
      through: { attributes: [] },
      ...(role_code && { where: { role_code } })
    }];

    const { count, rows: users } = await User.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['create_at', 'DESC']],
      distinct: true
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'role_name', 'role_code', 'role_description'],
        through: { attributes: [] }
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new user (Admin only)
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, identity_number, date_of_birth, gender, intro, role_ids } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Check identity_number if provided
    if (identity_number) {
      const existingIdentity = await User.findOne({
        where: { identity_number }
      });

      if (existingIdentity) {
        return res.status(409).json({
          success: false,
          message: 'Identity number already exists'
        });
      }
    }

    // Verify all roles exist
    const roles = await Role.findAll({
      where: {
        id: { [Op.in]: role_ids }
      }
    });

    if (roles.length !== role_ids.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more roles not found'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      identity_number,
      date_of_birth,
      gender,
      intro,
      status: 'Active'
    });

    // Assign roles
    await UserRole.bulkCreate(
      role_ids.map(role_id => ({
        user_id: user.id,
        role_id
      }))
    );

    // Fetch user with roles
    const createdUser = await User.findByPk(user.id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'role_name', 'role_code', 'role_description'],
        through: { attributes: [] }
      }]
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: createdUser }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, identity_number, date_of_birth, gender, intro, status } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if updating email to existing one
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: {
          id: { [Op.ne]: id },
          email
        }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Check if updating identity_number to existing one
    if (identity_number && identity_number !== user.identity_number) {
      const existingIdentity = await User.findOne({
        where: {
          id: { [Op.ne]: id },
          identity_number
        }
      });

      if (existingIdentity) {
        return res.status(409).json({
          success: false,
          message: 'Identity number already exists'
        });
      }
    }

    // Update user
    await user.update({
      ...(name && { name }),
      ...(email && { email }),
      ...(identity_number !== undefined && { identity_number }),
      ...(date_of_birth !== undefined && { date_of_birth }),
      ...(gender !== undefined && { gender }),
      ...(intro !== undefined && { intro }),
      ...(status !== undefined && { status })
    });

    // Fetch updated user with roles
    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'role_name', 'role_code', 'role_description'],
        through: { attributes: [] }
      }]
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Assign roles to user
 */
const assignRoles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_ids } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify all roles exist
    const roles = await Role.findAll({
      where: {
        id: { [Op.in]: role_ids }
      }
    });

    if (roles.length !== role_ids.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more roles not found'
      });
    }

    // Remove existing roles
    await UserRole.destroy({
      where: { user_id: id }
    });

    // Assign new roles
    await UserRole.bulkCreate(
      role_ids.map(role_id => ({
        user_id: id,
        role_id
      }))
    );

    // Fetch updated user with roles
    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'role_name', 'role_code', 'role_description'],
        through: { attributes: [] }
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Roles assigned successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting own account
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete user (CASCADE will delete user_roles automatically)
    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  assignRoles,
  deleteUser
};
