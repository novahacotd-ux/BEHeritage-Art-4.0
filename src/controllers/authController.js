const { User, Role, UserRole } = require('../models');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, identity_number, date_of_birth, gender, intro } = req.body;

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

    // Get default USER role
    const userRole = await Role.findOne({ where: { role_code: 'USER' } });

    if (!userRole) {
      return res.status(500).json({
        success: false,
        message: 'Default role not found. Please run database seeders.'
      });
    }

    // Create new user
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

    // Assign default USER role
    await UserRole.create({
      user_id: user.id,
      role_id: userRole.id
    });

    // Fetch user with roles
    const userWithRoles = await User.findByPk(user.id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'role_name', 'role_code'],
        through: { attributes: [] }
      }]
    });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: userWithRoles.id,
          name: userWithRoles.name,
          email: userWithRoles.email,
          identity_number: userWithRoles.identity_number,
          date_of_birth: userWithRoles.date_of_birth,
          gender: userWithRoles.gender,
          intro: userWithRoles.intro,
          avatar: userWithRoles.avatar,
          status: userWithRoles.status,
          roles: userWithRoles.roles
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'role_name', 'role_code', 'role_description'],
        through: { attributes: [] }
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          identity_number: user.identity_number,
          date_of_birth: user.date_of_birth,
          gender: user.gender,
          intro: user.intro,
          avatar: user.avatar,
          status: user.status,
          roles: user.roles
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user (client-side token removal)
 */
const logout = async (req, res, next) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, identity_number, date_of_birth, gender, intro, avatar } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if updating identity_number to existing one
    if (identity_number && identity_number !== user.identity_number) {
      const existingIdentity = await User.findOne({
        where: {
          id: { [require('sequelize').Op.ne]: userId },
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
      ...(identity_number !== undefined && { identity_number }),
      ...(date_of_birth !== undefined && { date_of_birth }),
      ...(gender !== undefined && { gender }),
      ...(intro !== undefined && { intro }),
      ...(avatar !== undefined && { avatar })
    });

    // Fetch updated user with roles
    const updatedUser = await User.findByPk(userId, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'role_name', 'role_code', 'role_description'],
        through: { attributes: [] }
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    // Validate input
    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Validate new password length
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(current_password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password (will be automatically hashed by the model hook)
    await user.update({ password: new_password });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  updateProfile,
  changePassword
};
