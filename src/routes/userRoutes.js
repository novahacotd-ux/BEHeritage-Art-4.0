const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createUserValidation, updateUserValidation, assignRolesValidation } = require('../utils/validators');

router.get('/',
  authenticate,
  authorize('ADMIN'),
  userController.getAllUsers
);

router.get('/:id',
  authenticate,
  authorize('ADMIN'),
  userController.getUserById
);

router.post('/',
  authenticate,
  authorize('ADMIN'),
  createUserValidation,
  validate,
  userController.createUser
);

router.put('/:id',
  authenticate,
  authorize('ADMIN'),
  updateUserValidation,
  validate,
  userController.updateUser
);

router.put('/:id/roles',
  authenticate,
  authorize('ADMIN'),
  assignRolesValidation,
  validate,
  userController.assignRoles
);

router.delete('/:id',
  authenticate,
  authorize('ADMIN'),
  userController.deleteUser
);

module.exports = router;
