const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { registerValidation, loginValidation } = require('../utils/validators');

router.post('/register', registerValidation, validate, authController.register);

router.post('/login', loginValidation, validate, authController.login);

router.post('/refresh-token', authController.refreshToken);

router.get('/profile', authenticate, authController.getProfile);

router.post('/logout', authenticate, authController.logout);

router.put('/profile', authenticate, authController.updateProfile);

router.put('/change-password', authenticate, authController.changePassword);

module.exports = router;
