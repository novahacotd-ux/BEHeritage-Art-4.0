const { Address, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all addresses (Admin only)
 */
const getAllAddresses = async (req, res, next) => {
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

        const { count, rows: addresses } = await Address.findAndCountAll({
            where,
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['address_id', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                addresses,
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
 * Get current user's addresses
 */
const getUserAddresses = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const addresses = await Address.findAll({
            where: { user_id: userId },
            order: [['is_default', 'DESC'], ['address_id', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: { addresses }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get address by ID
 */
const getAddressById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles.map(r => r.role_code);

        const address = await Address.findByPk(id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }]
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Check ownership or admin
        if (address.user_id !== userId && !userRoles.includes('ADMIN')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: { address }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new address
 */
const createAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { address, phone, is_default, status } = req.body;

        // If setting as default, unset other defaults
        if (is_default) {
            await Address.update(
                { is_default: false },
                { where: { user_id: userId, is_default: true } }
            );
        }

        const newAddress = await Address.create({
            user_id: userId,
            address,
            phone,
            is_default: is_default || false,
            status: status || 'Active'
        });

        res.status(201).json({
            success: true,
            message: 'Address created successfully',
            data: { address: newAddress }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update address
 */
const updateAddress = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles.map(r => r.role_code);
        const { address, phone, is_default, status } = req.body;

        const addressRecord = await Address.findByPk(id);

        if (!addressRecord) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Check ownership or admin
        if (addressRecord.user_id !== userId && !userRoles.includes('ADMIN')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // If setting as default, unset other defaults for this user
        if (is_default && !addressRecord.is_default) {
            await Address.update(
                { is_default: false },
                { where: { user_id: addressRecord.user_id, is_default: true } }
            );
        }

        await addressRecord.update({
            ...(address && { address }),
            ...(phone && { phone }),
            ...(is_default !== undefined && { is_default }),
            ...(status !== undefined && { status })
        });

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: { address: addressRecord }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Set address as default
 */
const setDefaultAddress = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const address = await Address.findByPk(id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Check ownership
        if (address.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Unset other defaults
        await Address.update(
            { is_default: false },
            { where: { user_id: userId, is_default: true } }
        );

        // Set this as default
        await address.update({ is_default: true });

        res.status(200).json({
            success: true,
            message: 'Default address updated successfully',
            data: { address }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete address
 */
const deleteAddress = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles.map(r => r.role_code);

        const address = await Address.findByPk(id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Check ownership or admin
        if (address.user_id !== userId && !userRoles.includes('ADMIN')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Store if this was the default address
        const wasDefault = address.is_default;
        const addressUserId = address.user_id;

        await address.destroy();

        // If deleted address was default, set next address as default
        if (wasDefault) {
            const nextAddress = await Address.findOne({
                where: { user_id: addressUserId },
                order: [['address_id', 'ASC']]
            });

            if (nextAddress) {
                await nextAddress.update({ is_default: true });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAddresses,
    getUserAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress
};
