const { Style, Product } = require('../../models');
const { Op } = require('sequelize');

/**
 * Get all styles
 */
const getAllStyles = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause
        const where = {};

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        if (status) {
            where.status = status;
        }

        const { count, rows: styles } = await Style.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['style_id', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                styles,
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
 * Get all styles for admin (shows both Active and Inactive)
 */
const getAllStylesAdmin = async (req, res, next) => {
    try {
        const { page = 1, limit = 100, search } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause - no status filter for admin
        const where = {};

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        const { count, rows: styles } = await Style.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['status', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: {
                styles,
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
 * Get style by ID
 */
const getStyleById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const style = await Style.findByPk(id);

        if (!style) {
            return res.status(404).json({
                success: false,
                message: 'Style not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { style }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new style (Admin only)
 */
const createStyle = async (req, res, next) => {
    try {
        const { name, status } = req.body;

        // Check if style name already exists
        const existingStyle = await Style.findOne({
            where: { name }
        });

        if (existingStyle) {
            return res.status(409).json({
                success: false,
                message: 'Style name already exists'
            });
        }

        const style = await Style.create({
            name,
            status: status || 'Active'
        });

        res.status(201).json({
            success: true,
            message: 'Style created successfully',
            data: { style }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update style (Admin only)
 */
const updateStyle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const style = await Style.findByPk(id);

        if (!style) {
            return res.status(404).json({
                success: false,
                message: 'Style not found'
            });
        }

        // Check if updating name to existing one
        if (name && name !== style.name) {
            const existingStyle = await Style.findOne({
                where: {
                    style_id: { [Op.ne]: id },
                    name
                }
            });

            if (existingStyle) {
                return res.status(409).json({
                    success: false,
                    message: 'Style name already exists'
                });
            }
        }

        await style.update({
            ...(name && { name }),
            ...(status !== undefined && { status })
        });

        res.status(200).json({
            success: true,
            message: 'Style updated successfully',
            data: { style }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete style (Admin only)
 */
const deleteStyle = async (req, res, next) => {
    try {
        const { id } = req.params;

        const style = await Style.findByPk(id);

        if (!style) {
            return res.status(404).json({
                success: false,
                message: 'Style not found'
            });
        }

        // Check if style has products
        const productCount = await Product.count({
            where: { style_id: id }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete style. It has ${productCount} product(s) associated with it.`
            });
        }

        await style.destroy();

        res.status(200).json({
            success: true,
            message: 'Style deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllStyles,
    getAllStylesAdmin,
    getStyleById,
    createStyle,
    updateStyle,
    deleteStyle
};
