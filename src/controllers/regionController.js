const { Region, HistoricalSite, SiteImage } = require('../models');

// Get all regions
exports.getAllRegions = async (req, res) => {
    try {
        const regions = await Region.findAll({
            attributes: [
                'region_id',
                'name'
            ],
            order: [['region_id', 'ASC']]
        });

        // Manually add site count for each region
        const regionsWithCount = await Promise.all(
            regions.map(async (region) => {
                const siteCount = await HistoricalSite.count({
                    where: { region_id: region.region_id }
                });
                return {
                    ...region.toJSON(),
                    site_count: siteCount.toString()
                };
            })
        );

        res.json({
            success: true,
            count: regionsWithCount.length,
            data: regionsWithCount
        });
    } catch (error) {
        console.error('Error fetching regions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch regions',
            error: error.message
        });
    }
};

// Get region detail with sites
exports.getRegionDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const region = await Region.findByPk(id, {
            include: [
                {
                    model: HistoricalSite,
                    attributes: ['site_id', 'name', 'province', 'lat', 'lng'],
                    include: [
                        {
                            model: SiteImage,
                            as: 'images',
                            where: { is_featured: true, status: 'approved' },
                            required: false,
                            attributes: ['image_id', 'img_url'],
                            limit: 1
                        }
                    ]
                }
            ]
        });

        if (!region) {
            return res.status(404).json({
                success: false,
                message: 'Region not found'
            });
        }

        res.json({
            success: true,
            data: region
        });
    } catch (error) {
        console.error('Error fetching region detail:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch region detail',
            error: error.message
        });
    }
};

// Create new region (Admin only)
exports.createRegion = async (req, res) => {
    try {
        const { name } = req.body;

        const newRegion = await Region.create({ name });

        res.status(201).json({
            success: true,
            message: 'Region created successfully',
            data: newRegion
        });
    } catch (error) {
        console.error('Error creating region:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to create region',
            error: error.message
        });
    }
};

// Update region (Admin only)
exports.updateRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const region = await Region.findByPk(id);
        if (!region) {
            return res.status(404).json({
                success: false,
                message: 'Region not found'
            });
        }

        await region.update({ name });

        res.json({
            success: true,
            message: 'Region updated successfully',
            data: region
        });
    } catch (error) {
        console.error('Error updating region:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to update region',
            error: error.message
        });
    }
};

// Delete region (Admin only)
exports.deleteRegion = async (req, res) => {
    try {
        const { id } = req.params;

        const region = await Region.findByPk(id);
        if (!region) {
            return res.status(404).json({
                success: false,
                message: 'Region not found'
            });
        }

        await region.destroy();

        res.json({
            success: true,
            message: 'Region deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting region:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete region',
            error: error.message
        });
    }
};

module.exports = exports;
