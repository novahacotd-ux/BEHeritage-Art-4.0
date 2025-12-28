const { Category, Product } = require('../../models');
const { Op } = require('sequelize');

/**
 * Get all categories
 */
const getAllCategories = async (req, res, next) => {
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

        const { count, rows: categories } = await Category.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                categories,
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
 * Get category by ID
 */
const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new category (Admin only)
 */
const createCategory = async (req, res, next) => {
    try {
        const { name, status } = req.body;

        // Check if category name already exists
        const existingCategory = await Category.findOne({
            where: { name }
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: 'Category name already exists'
            });
        }

        const category = await Category.create({
            name,
            status: status || 'Active'
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update category (Admin only)
 */
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if updating name to existing one
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({
                where: {
                    category_id: { [Op.ne]: id },
                    name
                }
            });

            if (existingCategory) {
                return res.status(409).json({
                    success: false,
                    message: 'Category name already exists'
                });
            }
        }

        await category.update({
            ...(name && { name }),
            ...(status !== undefined && { status })
        });

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete category (Admin only)
 */
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has products
        const productCount = await Product.count({
            where: { category_id: id }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${productCount} product(s) associated with it.`
            });
        }

        await category.destroy();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
