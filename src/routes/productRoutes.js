const express = require('express');
const router = express.Router();
const productController = require('../controllers/StoreController/productController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createProductValidation, updateProductValidation, updateStockValidation } = require('../utils/validators');

/**
 * @route   GET /api/products
 * @desc    Get all products (with pagination, search, and filters)
 * @access  Public
 */
router.get('/',
    productController.getAllProducts
);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id',
    productController.getProductById
);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private (ADMIN only)
 */
router.post('/',
    authenticate,
    authorize('ADMIN'),
    createProductValidation,
    validate,
    productController.createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private (ADMIN only)
 */
router.put('/:id',
    authenticate,
    authorize('ADMIN'),
    updateProductValidation,
    validate,
    productController.updateProduct
);

/**
 * @route   PUT /api/products/:id/stock
 * @desc    Update product stock quantity
 * @access  Private (ADMIN only)
 */
router.put('/:id/stock',
    authenticate,
    authorize('ADMIN'),
    updateStockValidation,
    validate,
    productController.updateStock
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (soft delete - set to Inactive)
 * @access  Private (ADMIN only)
 */
router.delete('/:id',
    authenticate,
    authorize('ADMIN'),
    productController.deleteProduct
);

module.exports = router;
