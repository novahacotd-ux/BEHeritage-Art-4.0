const express = require('express');
const router = express.Router();
const cartController = require('../controllers/StoreController/cartController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { addToCartValidation, updateCartItemValidation } = require('../utils/validators');

/**
 * @route   GET /api/cart
 * @desc    Get current user's cart with items
 * @access  Private (Authenticated)
 */
router.get('/',
    authenticate,
    cartController.getMyCart
);

/**
 * @route   POST /api/cart/items
 * @desc    Add product to cart
 * @access  Private (Authenticated)
 */
router.post('/items',
    authenticate,
    addToCartValidation,
    validate,
    cartController.addToCart
);

/**
 * @route   PUT /api/cart/items/:product_id
 * @desc    Update cart item quantity
 * @access  Private (Authenticated)
 */
router.put('/items/:product_id',
    authenticate,
    updateCartItemValidation,
    validate,
    cartController.updateCartItem
);

/**
 * @route   DELETE /api/cart/items/:product_id
 * @desc    Remove item from cart
 * @access  Private (Authenticated)
 */
router.delete('/items/:product_id',
    authenticate,
    cartController.removeFromCart
);

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Private (Authenticated)
 */
router.delete('/',
    authenticate,
    cartController.clearCart
);

module.exports = router;
