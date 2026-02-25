const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/StoreController/paymentController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createPaymentValidation, updatePaymentStatusValidation } = require('../utils/validators');

/**
 * @route   GET /api/payments
 * @desc    Get all payments (Admin only)
 * @access  Private (ADMIN only)
 */
router.get('/',
    authenticate,
    authorize('ADMIN'),
    paymentController.getAllPayments
);

/**
 * @route   GET /api/payments/me
 * @desc    Get current user's payments
 * @access  Private (Authenticated)
 */
router.get('/me',
    authenticate,
    paymentController.getMyPayments
);

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 * @access  Private (Owner or ADMIN)
 */
router.get('/:id',
    authenticate,
    paymentController.getPaymentById
);

/**
 * @route   POST /api/payments
 * @desc    Create payment for order
 * @access  Private (Authenticated)
 */
router.post('/',
    authenticate,
    createPaymentValidation,
    validate,
    paymentController.createPayment
);

/**
 * @route   PUT /api/payments/:id/status
 * @desc    Update payment status
 * @access  Private (ADMIN only)
 */
router.put('/:id/status',
    authenticate,
    authorize('ADMIN'),
    updatePaymentStatusValidation,
    validate,
    paymentController.updatePaymentStatus
);

module.exports = router;
