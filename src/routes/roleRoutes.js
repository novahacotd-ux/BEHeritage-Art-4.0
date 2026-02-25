const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { roleValidation } = require('../utils/validators');

router.get('/',
  authenticate,
  authorize('ADMIN'),
  roleController.getAllRoles
);

router.get('/:id',
  authenticate,
  authorize('ADMIN'),
  roleController.getRoleById
);

router.post('/',
  authenticate,
  authorize('ADMIN'),
  roleValidation,
  validate,
  roleController.createRole
);

router.put('/:id',
  authenticate,
  authorize('ADMIN'),
  roleValidation,
  validate,
  roleController.updateRole
);

router.delete('/:id',
  authenticate,
  authorize('ADMIN'),
  roleController.deleteRole
);

module.exports = router;
