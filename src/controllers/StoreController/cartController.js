const { Cart, CartItem, Product } = require('../../models');
const { sequelize } = require('../../../config/db');

/**
 * Get current user's cart with items
 */
const getMyCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Find or create cart for user
        let cart = await Cart.findOne({
            where: { user_id: userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['product_id', 'name', 'price', 'image', 'stock_quantity', 'status']
                }]
            }]
        });

        if (!cart) {
            cart = await Cart.create({ user_id: userId });
            cart.items = [];
        }

        // Add total for each item
        const itemsWithTotal = cart.items.map(item => {
            const itemTotal = parseFloat(item.quantity) * parseFloat(item.product.price);
            return {
                ...item.toJSON(),
                total: itemTotal.toFixed(2)
            };
        });

        // Calculate cart total
        const cartTotal = itemsWithTotal.reduce((sum, item) => {
            return sum + parseFloat(item.total);
        }, 0);

        res.status(200).json({
            success: true,
            data: {
                cart: {
                    ...cart.toJSON(),
                    items: itemsWithTotal
                },
                total: cartTotal.toFixed(2)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add product to cart
 */
const addToCart = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;

        // Verify product exists and has stock
        const product = await Product.findByPk(product_id);
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.status !== 'Active') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Product is not available'
            });
        }

        if (product.stock_quantity < quantity) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Only ${product.stock_quantity} available.`
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({
            where: { user_id: userId },
            transaction
        });

        if (!cart) {
            cart = await Cart.create({ user_id: userId }, { transaction });
        }

        // Check if item already in cart
        let cartItem = await CartItem.findOne({
            where: {
                cart_id: cart.cart_id,
                product_id
            },
            transaction
        });

        if (cartItem) {
            // Update quantity
            const newQuantity = cartItem.quantity + quantity;

            if (product.stock_quantity < newQuantity) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock. Only ${product.stock_quantity} available.`
                });
            }

            await cartItem.update({ quantity: newQuantity }, { transaction });
        } else {
            // Create new cart item
            cartItem = await CartItem.create({
                cart_id: cart.cart_id,
                product_id,
                quantity
            }, { transaction });
        }

        await transaction.commit();

        // Fetch updated cart
        const updatedCart = await Cart.findOne({
            where: { user_id: userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['product_id', 'name', 'price', 'image', 'stock_quantity', 'status']
                }]
            }]
        });

        res.status(200).json({
            success: true,
            message: 'Product added to cart',
            data: { cart: updatedCart }
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

/**
 * Update cart item quantity
 */
const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.params;
        const { quantity } = req.body;

        // Find user's cart
        const cart = await Cart.findOne({
            where: { user_id: userId }
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find cart item
        const cartItem = await CartItem.findOne({
            where: {
                cart_id: cart.cart_id,
                product_id
            },
            include: [{
                model: Product,
                as: 'product'
            }]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Check stock
        if (cartItem.product.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Only ${cartItem.product.stock_quantity} available.`
            });
        }

        await cartItem.update({ quantity });

        // Fetch updated cart
        const updatedCart = await Cart.findOne({
            where: { user_id: userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['product_id', 'name', 'price', 'image', 'stock_quantity', 'status']
                }]
            }]
        });

        res.status(200).json({
            success: true,
            message: 'Cart item updated',
            data: { cart: updatedCart }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove item from cart
 */
const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.params;

        // Find user's cart
        const cart = await Cart.findOne({
            where: { user_id: userId }
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find and delete cart item
        const cartItem = await CartItem.findOne({
            where: {
                cart_id: cart.cart_id,
                product_id
            }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        await cartItem.destroy();

        // Fetch updated cart
        const updatedCart = await Cart.findOne({
            where: { user_id: userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['product_id', 'name', 'price', 'image', 'stock_quantity', 'status']
                }]
            }]
        });

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: { cart: updatedCart }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Clear entire cart
 */
const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Find user's cart
        const cart = await Cart.findOne({
            where: { user_id: userId }
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Delete all cart items
        await CartItem.destroy({
            where: { cart_id: cart.cart_id }
        });

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
