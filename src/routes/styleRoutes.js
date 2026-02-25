const express = require('express');
const router = express.Router();
const styleController = require('../controllers/StoreController/styleController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createStyleValidation, updateStyleValidation } = require('../utils/validators');

/**
 * @route   GET /api/styles
 * @desc    Get all styles (with pagination and search)
 * @access  Public
 */
router.get('/',
    styleController.getAllStyles
);

/**
 * @route   GET /api/styles/:id
 * @desc    Get style by ID
 * @access  Public
 */
router.get('/:id',
    styleController.getStyleById
);

/**
 * @route   POST /api/styles
 * @desc    Create new style
 * @access  Private (ADMIN only)
 */
router.post('/',
    authenticate,
    authorize('ADMIN'),
    createStyleValidation,
    validate,
    styleController.createStyle
);

/**
 * @route   PUT /api/styles/:id
 * @desc    Update style
 * @access  Private (ADMIN only)
 */
router.put('/:id',
    authenticate,
    authorize('ADMIN'),
    updateStyleValidation,
    validate,
    styleController.updateStyle
);

/**
 * @route   DELETE /api/styles/:id
 * @desc    Delete style
 * @access  Private (ADMIN only)
 */
router.delete('/:id',
    authenticate,
    authorize('ADMIN'),
    styleController.deleteStyle
);

module.exports = router;
