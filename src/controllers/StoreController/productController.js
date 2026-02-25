const { Product, Category, Topic, Style } = require('../../models');
const { Op } = require('sequelize');

/**
 * Get all products
 */
const getAllProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            category_id,
            topic_id,
            style_id,
            status,
            min_price,
            max_price
        } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause
        const where = {};

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        if (category_id) {
            where.category_id = category_id;
        }

        if (topic_id) {
            where.topic_id = topic_id;
        }

        if (style_id) {
            where.style_id = style_id;
        }

        if (status) {
            where.status = status;
        }

        if (min_price || max_price) {
            where.price = {};
            if (min_price) where.price[Op.gte] = min_price;
            if (max_price) where.price[Op.lte] = max_price;
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name', 'status']
                },
                {
                    model: Topic,
                    as: 'topic',
                    attributes: ['topic_id', 'name', 'status']
                },
                {
                    model: Style,
                    as: 'style',
                    attributes: ['style_id', 'name', 'status']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                products,
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
 * Get product by ID
 */
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name', 'status']
                },
                {
                    model: Topic,
                    as: 'topic',
                    attributes: ['topic_id', 'name', 'status']
                },
                {
                    model: Style,
                    as: 'style',
                    attributes: ['style_id', 'name', 'status']
                }
            ]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new product (Admin only)
 */
const createProduct = async (req, res, next) => {
    try {
        const { category_id, topic_id, style_id, name, price, image, stock_quantity, status } = req.body;

        // Verify category exists
        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Verify topic exists if provided
        if (topic_id) {
            const topic = await Topic.findByPk(topic_id);
            if (!topic) {
                return res.status(404).json({
                    success: false,
                    message: 'Topic not found'
                });
            }
        }

        // Verify style exists if provided
        if (style_id) {
            const style = await Style.findByPk(style_id);
            if (!style) {
                return res.status(404).json({
                    success: false,
                    message: 'Style not found'
                });
            }
        }

        const product = await Product.create({
            category_id,
            topic_id,
            style_id,
            name,
            price,
            image,
            stock_quantity: stock_quantity || 0,
            status: status || 'Active'
        });

        // Fetch product with relations
        const createdProduct = await Product.findByPk(product.product_id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name', 'status']
                },
                {
                    model: Topic,
                    as: 'topic',
                    attributes: ['topic_id', 'name', 'status']
                },
                {
                    model: Style,
                    as: 'style',
                    attributes: ['style_id', 'name', 'status']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product: createdProduct }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update product (Admin only)
 */
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { category_id, topic_id, style_id, name, price, image, status } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Verify category exists if updating
        if (category_id) {
            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }

        // Verify topic exists if updating
        if (topic_id) {
            const topic = await Topic.findByPk(topic_id);
            if (!topic) {
                return res.status(404).json({
                    success: false,
                    message: 'Topic not found'
                });
            }
        }

        // Verify style exists if updating
        if (style_id) {
            const style = await Style.findByPk(style_id);
            if (!style) {
                return res.status(404).json({
                    success: false,
                    message: 'Style not found'
                });
            }
        }

        await product.update({
            ...(category_id && { category_id }),
            ...(topic_id !== undefined && { topic_id }),
            ...(style_id !== undefined && { style_id }),
            ...(name && { name }),
            ...(price !== undefined && { price }),
            ...(image !== undefined && { image }),
            ...(status !== undefined && { status })
        });

        // Fetch updated product with relations
        const updatedProduct = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name', 'status']
                },
                {
                    model: Topic,
                    as: 'topic',
                    attributes: ['topic_id', 'name', 'status']
                },
                {
                    model: Style,
                    as: 'style',
                    attributes: ['style_id', 'name', 'status']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: { product: updatedProduct }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update product stock (Admin only)
 */
const updateStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { stock_quantity } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.update({ stock_quantity });

        // Auto-update status based on stock
        if (stock_quantity === 0 && product.status === 'Active') {
            await product.update({ status: 'Out of Stock' });
        } else if (stock_quantity > 0 && product.status === 'Out of Stock') {
            await product.update({ status: 'Active' });
        }

        res.status(200).json({
            success: true,
            message: 'Stock updated successfully',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete product (Admin only)
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Soft delete by setting status to Inactive
        await product.update({ status: 'Inactive' });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully (set to Inactive)'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateStock,
    deleteProduct
};
