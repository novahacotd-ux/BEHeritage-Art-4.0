const { SiteImage, HistoricalSite, User, Region, HistoricalPeriod, sequelize } = require('../models');
const { Op } = require('sequelize');

// Upload new site image (Authenticated users)
exports.uploadSiteImage = async (req, res) => {
    try {
        const { site_id, img_url, caption, is_featured, media_type } = req.body;
        const user_id = req.user.id; // From authentication middleware

        // Validate that site exists
        const site = await HistoricalSite.findByPk(site_id);
        if (!site) {
            return res.status(404).json({
                success: false,
                message: 'Historical site not found'
            });
        }

        // Create new image with pending status
        const newImage = await SiteImage.create({
            site_id,
            img_url,
            caption: caption || null,
            is_featured: is_featured || false,
            media_type: media_type || 'image',
            user_id,
            status: 'pending' // Default status for user uploads
        });

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully. Waiting for admin approval.',
            data: newImage
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
};

// Get pending images (Admin only)
exports.getPendingImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows: images } = await SiteImage.findAndCountAll({
            where: { status: 'pending' },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email', 'full_name']
                },
                {
                    model: HistoricalSite,
                    attributes: ['site_id', 'name', 'province'],
                    include: [
                        { model: Region, attributes: ['name'] },
                        { model: HistoricalPeriod, attributes: ['name'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            success: true,
            data: images,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching pending images:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending images',
            error: error.message
        });
    }
};

// Approve image (Admin only)
exports.approveImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await SiteImage.findByPk(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        await image.update({ status: 'approved' });

        res.json({
            success: true,
            message: 'Image approved successfully',
            data: image
        });
    } catch (error) {
        console.error('Error approving image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve image',
            error: error.message
        });
    }
};

// Reject image (Admin only)
exports.rejectImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await SiteImage.findByPk(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        await image.update({ status: 'rejected' });

        res.json({
            success: true,
            message: 'Image rejected successfully',
            data: image
        });
    } catch (error) {
        console.error('Error rejecting image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject image',
            error: error.message
        });
    }
};

// Get current user's images (Authenticated users)
exports.getUserImages = async (req, res) => {
    try {
        const user_id = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows: images } = await SiteImage.findAndCountAll({
            where: { user_id },
            include: [
                {
                    model: HistoricalSite,
                    attributes: ['site_id', 'name', 'province']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            success: true,
            data: images,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching user images:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user images',
            error: error.message
        });
    }
};

// Get gallery images with filters (Public)
exports.getGalleryImages = async (req, res) => {
    try {
        const { site_id, region_id, period_id } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Build where clause for filtering
        const whereClause = { status: 'approved' };
        if (site_id) {
            whereClause.site_id = site_id;
        }

        // Build include for site filtering
        const siteInclude = {
            model: HistoricalSite,
            attributes: ['site_id', 'name', 'province', 'lat', 'lng'],
            include: [
                { model: Region, attributes: ['region_id', 'name'] },
                { model: HistoricalPeriod, attributes: ['period_id', 'name', 'start_year', 'end_year'] }
            ]
        };

        // Add filters for region and period
        if (region_id || period_id) {
            siteInclude.where = {};
            if (region_id) siteInclude.where.region_id = region_id;
            if (period_id) siteInclude.where.period_id = period_id;
        }

        const { count, rows: images } = await SiteImage.findAndCountAll({
            where: whereClause,
            include: [siteInclude],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            success: true,
            data: images,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch gallery images',
            error: error.message
        });
    }
};

module.exports = exports;
