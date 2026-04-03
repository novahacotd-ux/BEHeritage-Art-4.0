const { Topic, Product } = require('../../models');
const { Op } = require('sequelize');

/**
 * Get all topics
 */
const getAllTopics = async (req, res, next) => {
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

        const { count, rows: topics } = await Topic.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                topics,
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
 * Get all topics for admin (shows both Active and Inactive)
 */
const getAllTopicsAdmin = async (req, res, next) => {
    try {
        const { page = 1, limit = 100, search } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause - no status filter for admin
        const where = {};

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        const { count, rows: topics } = await Topic.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['status', 'ASC'], ['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                topics,
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
 * Get topic by ID
 */
const getTopicById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const topic = await Topic.findByPk(id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { topic }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new topic (Admin only)
 */
const createTopic = async (req, res, next) => {
    try {
        const { name, status } = req.body;

        // Check if topic name already exists
        const existingTopic = await Topic.findOne({
            where: { name }
        });

        if (existingTopic) {
            return res.status(409).json({
                success: false,
                message: 'Topic name already exists'
            });
        }

        const topic = await Topic.create({
            name,
            status: status || 'Active'
        });

        res.status(201).json({
            success: true,
            message: 'Topic created successfully',
            data: { topic }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update topic (Admin only)
 */
const updateTopic = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const topic = await Topic.findByPk(id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        // Check if updating name to existing one
        if (name && name !== topic.name) {
            const existingTopic = await Topic.findOne({
                where: {
                    topic_id: { [Op.ne]: id },
                    name
                }
            });

            if (existingTopic) {
                return res.status(409).json({
                    success: false,
                    message: 'Topic name already exists'
                });
            }
        }

        await topic.update({
            ...(name && { name }),
            ...(status !== undefined && { status })
        });

        res.status(200).json({
            success: true,
            message: 'Topic updated successfully',
            data: { topic }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete topic (Admin only)
 */
const deleteTopic = async (req, res, next) => {
    try {
        const { id } = req.params;

        const topic = await Topic.findByPk(id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        // Check if topic has products
        const productCount = await Product.count({
            where: { topic_id: id }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete topic. It has ${productCount} product(s) associated with it.`
            });
        }

        await topic.destroy();

        res.status(200).json({
            success: true,
            message: 'Topic deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTopics,
    getAllTopicsAdmin,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic
};
