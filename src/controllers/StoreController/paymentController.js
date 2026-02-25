const { Payment, Order, User } = require('../../models');
const { Op } = require('sequelize');

/**
 * Get all payments (Admin only)
 */
const getAllPayments = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, user_id, status, payment_method } = req.query;
        const offset = (page - 1) * limit;

        const where = {};

        if (status) {
            where.status = status;
        }

        if (payment_method) {
            where.payment_method = payment_method;
        }

        // Include filter for user_id through order
        const include = [{
            model: Order,
            as: 'order',
            attributes: ['order_id', 'user_id', 'total_price', 'status'],
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }],
            ...(user_id && { where: { user_id } })
        }];

        const { count, rows: payments } = await Payment.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                payments,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user's payments
 */
const getMyPayments = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const payments = await Payment.findAll({
            include: [{
                model: Order,
                as: 'order',
                where: { user_id: userId },
                attributes: ['order_id', 'total_price', 'status', 'order_date']
            }],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: { payments }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get payment by ID
 */
const getPaymentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles.map(r => r.role_code);

        const payment = await Payment.findByPk(id, {
            include: [{
                model: Order,
                as: 'order',
                attributes: ['order_id', 'user_id', 'total_price', 'status'],
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }]
            }]
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check ownership or admin
        if (payment.order.user_id !== userId && !userRoles.includes('ADMIN')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: { payment }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create payment for order
 */
const createPayment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { order_id, payment_method, amount } = req.body;

        // Verify order exists and belongs to user
        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Order does not belong to you'
            });
        }

        // Check if payment already exists for this order
        const existingPayment = await Payment.findOne({
            where: { order_id }
        });

        if (existingPayment) {
            return res.status(409).json({
                success: false,
                message: 'Payment already exists for this order'
            });
        }

        // Validate amount matches order total
        if (parseFloat(amount) !== parseFloat(order.total_price)) {
            return res.status(400).json({
                success: false,
                message: `Payment amount must match order total: ${order.total_price}`
            });
        }

        const payment = await Payment.create({
            order_id,
            payment_method,
            amount,
            payment_date: new Date(),
            status: 'Pending'
        });

        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            data: { payment }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update payment status (Admin only)
 */
const updatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const payment = await Payment.findByPk(id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        await payment.update({ status });

        // Fetch updated payment with order details
        const updatedPayment = await Payment.findByPk(id, {
            include: [{
                model: Order,
                as: 'order',
                attributes: ['order_id', 'user_id', 'total_price', 'status'],
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }]
            }]
        });

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            data: { payment: updatedPayment }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPayments,
    getMyPayments,
    getPaymentById,
    createPayment,
    updatePaymentStatus
};
