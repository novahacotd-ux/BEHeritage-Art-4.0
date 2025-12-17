const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { roleValidation } = require('../utils/validators');

/**
 * @route   GET /api/roles
 * @desc    Get all roles
 * @access  Private (ADMIN only)
 */
router.get('/',
  authenticate,
  authorize('ADMIN'),
  roleController.getAllRoles
);

/**
 * @route   GET /api/roles/:id
 * @desc    Get role by ID
 * @access  Private (ADMIN only)
 */
router.get('/:id',
  authenticate,
  authorize('ADMIN'),
  roleController.getRoleById
);

/**
 * @route   POST /api/roles
 * @desc    Create new role
 * @access  Private (ADMIN only)
 */
router.post('/',
  authenticate,
  authorize('ADMIN'),
  roleValidation,
  validate,
  roleController.createRole
);

/**
 * @route   PUT /api/roles/:id
 * @desc    Update role
 * @access  Private (ADMIN only)
 */
router.put('/:id',
  authenticate,
  authorize('ADMIN'),
  roleValidation,
  validate,
  roleController.updateRole
);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Delete role
 * @access  Private (ADMIN only)
 */
router.delete('/:id',
  authenticate,
  authorize('ADMIN'),
  roleController.deleteRole
);

module.exports = router;
