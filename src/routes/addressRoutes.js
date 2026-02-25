const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createAddressValidation, updateAddressValidation } = require('../utils/validators');

/**
 * @route   GET /api/addresses
 * @desc    Get all addresses (Admin only)
 * @access  Private (ADMIN only)
 */
router.get('/',
    authenticate,
    authorize('ADMIN'),
    addressController.getAllAddresses
);

/**
 * @route   GET /api/addresses/me
 * @desc    Get current user's addresses
 * @access  Private (Authenticated)
 */
router.get('/me',
    authenticate,
    addressController.getUserAddresses
);

/**
 * @route   GET /api/addresses/:id
 * @desc    Get address by ID
 * @access  Private (Owner or ADMIN)
 */
router.get('/:id',
    authenticate,
    addressController.getAddressById
);

/**
 * @route   POST /api/addresses
 * @desc    Create new address
 * @access  Private (Authenticated)
 */
router.post('/',
    authenticate,
    createAddressValidation,
    validate,
    addressController.createAddress
);

/**
 * @route   PUT /api/addresses/:id
 * @desc    Update address
 * @access  Private (Owner or ADMIN)
 */
router.put('/:id',
    authenticate,
    updateAddressValidation,
    validate,
    addressController.updateAddress
);

/**
 * @route   PUT /api/addresses/:id/default
 * @desc    Set address as default
 * @access  Private (Owner only)
 */
router.put('/:id/default',
    authenticate,
    addressController.setDefaultAddress
);

/**
 * @route   DELETE /api/addresses/:id
 * @desc    Delete address
 * @access  Private (Owner or ADMIN)
 */
router.delete('/:id',
    authenticate,
    addressController.deleteAddress
);

module.exports = router;
