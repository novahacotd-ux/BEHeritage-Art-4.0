const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createUserValidation, updateUserValidation, assignRolesValidation } = require('../utils/validators');

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination and search)
 * @access  Private (ADMIN only)
 */
router.get('/',
  authenticate,
  authorize('ADMIN'),
  userController.getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (ADMIN only)
 */
router.get('/:id',
  authenticate,
  authorize('ADMIN'),
  userController.getUserById
);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (ADMIN only)
 */
router.post('/',
  authenticate,
  authorize('ADMIN'),
  createUserValidation,
  validate,
  userController.createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (ADMIN only)
 */
router.put('/:id',
  authenticate,
  authorize('ADMIN'),
  updateUserValidation,
  validate,
  userController.updateUser
);

/**
 * @route   PUT /api/users/:id/roles
 * @desc    Assign roles to user
 * @access  Private (ADMIN only)
 */
router.put('/:id/roles',
  authenticate,
  authorize('ADMIN'),
  assignRolesValidation,
  validate,
  userController.assignRoles
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (ADMIN only)
 */
router.delete('/:id',
  authenticate,
  authorize('ADMIN'),
  userController.deleteUser
);

module.exports = router;
