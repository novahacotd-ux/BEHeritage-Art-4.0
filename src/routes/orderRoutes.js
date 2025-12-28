const express = require('express');
const router = express.Router();
const orderController = require('../controllers/StoreController/orderController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createOrderValidation, updateOrderStatusValidation } = require('../utils/validators');

/**
 * @route   GET /api/orders
 * @desc    Get all orders (Admin only)
 * @access  Private (ADMIN only)
 */
router.get('/',
    authenticate,
    authorize('ADMIN'),
    orderController.getAllOrders
);

/**
 * @route   GET /api/orders/me
 * @desc    Get current user's orders
 * @access  Private (Authenticated)
 */
router.get('/me',
    authenticate,
    orderController.getMyOrders
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private (Owner or ADMIN)
 */
router.get('/:id',
    authenticate,
    orderController.getOrderById
);

/**
 * @route   POST /api/orders
 * @desc    Create order from cart
 * @access  Private (Authenticated)
 */
router.post('/',
    authenticate,
    createOrderValidation,
    validate,
    orderController.createOrder
);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private (ADMIN only)
 */
router.put('/:id/status',
    authenticate,
    authorize('ADMIN'),
    updateOrderStatusValidation,
    validate,
    orderController.updateOrderStatus
);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private (Owner or ADMIN)
 */
router.put('/:id/cancel',
    authenticate,
    orderController.cancelOrder
);

module.exports = router;
