const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/StoreController/categoryController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createCategoryValidation, updateCategoryValidation } = require('../utils/validators');

/**
 * @route   GET /api/categories
 * @desc    Get all categories (with pagination and search)
 * @access  Public
 */
router.get('/',
    categoryController.getAllCategories
);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id',
    categoryController.getCategoryById
);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private (ADMIN only)
 */
router.post('/',
    authenticate,
    authorize('ADMIN'),
    createCategoryValidation,
    validate,
    categoryController.createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private (ADMIN only)
 */
router.put('/:id',
    authenticate,
    authorize('ADMIN'),
    updateCategoryValidation,
    validate,
    categoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (ADMIN only)
 */
router.delete('/:id',
    authenticate,
    authorize('ADMIN'),
    categoryController.deleteCategory
);

module.exports = router;
