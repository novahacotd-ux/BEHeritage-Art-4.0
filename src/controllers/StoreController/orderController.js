const { Order, OrderDetail, Cart, CartItem, Product, Address, User } = require('../../models');
const { sequelize } = require('../../../config/db');
const { Op } = require('sequelize');

/**
 * Get all orders (Admin only)
 */
const getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, user_id, status } = req.query;
        const offset = (page - 1) * limit;

        const where = {};

        if (user_id) {
            where.user_id = user_id;
        }

        if (status) {
            where.status = status;
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Address,
                    as: 'address',
                    attributes: ['address_id', 'address', 'phone']
                },
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['product_id', 'name', 'price', 'image']
                    }]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                orders,
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
 * Get current user's orders
 */
const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Address,
                    as: 'address',
                    attributes: ['address_id', 'address', 'phone']
                },
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['product_id', 'name', 'price', 'image']
                    }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: { orders }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get order by ID
 */
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles.map(r => r.role_code);

        const order = await Order.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Address,
                    as: 'address',
                    attributes: ['address_id', 'address', 'phone']
                },
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['product_id', 'name', 'price', 'image']
                    }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check ownership or admin
        if (order.user_id !== userId && !userRoles.includes('ADMIN')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create order from cart (with automatic stock countdown)
 */
const createOrder = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id;
        const { address_id, note } = req.body;

        // Verify address exists and belongs to user
        const address = await Address.findByPk(address_id, { transaction });
        if (!address) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        if (address.user_id !== userId) {
            await transaction.rollback();
            return res.status(403).json({
                success: false,
                message: 'Address does not belong to you'
            });
        }

        // Get user's cart with items
        const cart = await Cart.findOne({
            where: { user_id: userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }],
            transaction
        });

        if (!cart || !cart.items || cart.items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate stock availability for all items
        for (const item of cart.items) {
            if (item.product.stock_quantity < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock_quantity} available.`
                });
            }

            if (item.product.status !== 'Active') {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Product ${item.product.name} is not available`
                });
            }
        }

        // Calculate total price
        const totalPrice = cart.items.reduce((sum, item) => {
            return sum + (parseFloat(item.quantity) * parseFloat(item.product.price));
        }, 0);

        // Calculate receive date (5 days from order date)
        const orderDate = new Date();
        const receiveDate = new Date(orderDate);
        receiveDate.setDate(receiveDate.getDate() + 5);

        // Create order
        const order = await Order.create({
            user_id: userId,
            address_id,
            order_date: orderDate,
            receive_date: receiveDate,
            total_price: totalPrice,
            note,
            status: 'Pending'
        }, { transaction });

        // Create order details and decrement stock
        for (const item of cart.items) {
            // Create order detail
            await OrderDetail.create({
                order_id: order.order_id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.product.price
            }, { transaction });

            // Decrement product stock (AUTO STOCK COUNTDOWN)
            const newStock = item.product.stock_quantity - item.quantity;
            await item.product.update({
                stock_quantity: newStock,
                // Auto-update status if out of stock
                ...(newStock === 0 && { status: 'Out of Stock' })
            }, { transaction });
        }

        // Clear cart items
        await CartItem.destroy({
            where: { cart_id: cart.cart_id },
            transaction
        });

        await transaction.commit();

        // Fetch created order with details
        const createdOrder = await Order.findByPk(order.order_id, {
            include: [
                {
                    model: Address,
                    as: 'address',
                    attributes: ['address_id', 'address', 'phone']
                },
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['product_id', 'name', 'price', 'image']
                    }]
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: { order: createdOrder }
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

/**
 * Update order status (Admin only)
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, receive_date } = req.body;

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await order.update({
            status,
            ...(receive_date && { receive_date })
        });

        // Fetch updated order
        const updatedOrder = await Order.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Address,
                    as: 'address',
                    attributes: ['address_id', 'address', 'phone']
                },
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['product_id', 'name', 'price', 'image']
                    }]
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: { order: updatedOrder }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel order (with automatic stock restoration)
 */
const cancelOrder = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles.map(r => r.role_code);

        const order = await Order.findByPk(id, {
            include: [{
                model: OrderDetail,
                as: 'orderDetails',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }],
            transaction
        });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check ownership or admin
        if (order.user_id !== userId && !userRoles.includes('ADMIN')) {
            await transaction.rollback();
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if order can be cancelled
        if (['Delivered', 'Cancelled'].includes(order.status)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.status}`
            });
        }

        // Restore stock for all order items (AUTO STOCK RESTORATION)
        for (const detail of order.orderDetails) {
            const newStock = detail.product.stock_quantity + detail.quantity;
            await detail.product.update({
                stock_quantity: newStock,
                // Restore status if was out of stock
                ...(detail.product.status === 'Out of Stock' && newStock > 0 && { status: 'Active' })
            }, { transaction });
        }

        // Update order status
        await order.update({ status: 'Cancelled' }, { transaction });

        await transaction.commit();

        // Fetch updated order
        const cancelledOrder = await Order.findByPk(id, {
            include: [
                {
                    model: Address,
                    as: 'address',
                    attributes: ['address_id', 'address', 'phone']
                },
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['product_id', 'name', 'price', 'image', 'stock_quantity']
                    }]
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully. Stock has been restored.',
            data: { order: cancelledOrder }
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

module.exports = {
    getAllOrders,
    getMyOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder
};
