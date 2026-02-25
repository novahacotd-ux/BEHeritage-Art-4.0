const { HistoricalPeriod, HistoricalSite, SiteImage,HistoricalEvents, Celebrities  } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Get all historical periods
exports.getAllPeriods = async (req, res) => {
    try {
        const periods = await HistoricalPeriod.findAll({
            attributes: [
                'period_id',
                'name',
                'start_year',
                'end_year',
                'description',
                'thumbnail_url'
            ],
            order: [['start_year', 'ASC']]
        });

        // Manually add site count for each period
        const periodsWithCount = await Promise.all(
            periods.map(async (period) => {
                const siteCount = await HistoricalSite.count({
                    where: { period_id: period.period_id }
                });
                return {
                    ...period.toJSON(),
                    site_count: siteCount.toString()
                };
            })
        );

        res.json({
            success: true,
            count: periodsWithCount.length,
            data: periodsWithCount
        });
    } catch (error) {
        console.error('Error fetching periods:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch periods',
            error: error.message
        });
    }
};

exports.getPeriodByID = async( req, res)=> {
    try {
        const { id } = req.params;
        const period = await HistoricalPeriod.findOne({
            where: { period_id: id },
            attributes: [
                'period_id',
                'name',
                'start_year',
                'end_year',
                'description',
                'thumbnail_url'
            ],
            include: [
                {
                model: Celebrities,
                as: 'celebrities',
                attributes: ['celebrities_id', 'name','bio', 'thumbnail_url']
                },
                {
                    model: HistoricalEvents,
                    as: "historical_event",
                    attributes: ['event_id','name', 'description',  'start_year','end_year',]
                }
            ], 
            order: [['start_year', 'ASC']]

            });

        if (!period) {
        return res.status(404).json({
            success: false,
            message: 'Period not found'
        });
        }

        res.json({
        success: true,
        data: period
        });
        

    }catch(error) {
        console.error('Error fetching period by id:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch period by id:',
            error: error.message
        });
    }
}

// Get period detail with sites
exports.getPeriodDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const period = await HistoricalPeriod.findByPk(id, {
            include: [
                {
                    model: HistoricalSite,
                    attributes: ['site_id', 'name', 'province', 'lat', 'lng', 'year_built'],
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

        if (!period) {
            return res.status(404).json({
                success: false,
                message: 'Period not found'
            });
        }

        res.json({
            success: true,
            data: period
        });
    } catch (error) {
        console.error('Error fetching period detail:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch period detail',
            error: error.message
        });
    }
};

// Create new period (Admin only)
exports.createPeriod = async (req, res) => {
    try {
        const { name, start_year, end_year, description } = req.body;
        const media = req.file

        if (/^\d+$/.test(name.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Period name cannot contain only numbers'
            });
        }
        if(start_year> end_year) {
            return res.status(400).json({
                success: false,
                message: 'start_year must be less than or equal to end_year'
            });
        }

        let thumbnail_url = null
        
        if(media) {
            const uploadResult = await uploadToCloudinary(media);
            thumbnail_url = uploadResult.secure_url;
        }

        const newPeriod = await HistoricalPeriod.create({
            name,
            start_year,
            end_year,
            description,
            thumbnail_url
        });

        res.status(201).json({
            success: true,
            message: 'Period created successfully',
            data: newPeriod
        });
    } catch (error) {
        console.error('Error creating period:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to create period',
            error: error.message
        });
    }
};

// Update period (Admin only)
exports.updatePeriod = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, start_year, end_year, description } = req.body;
        const media = req.file
       
        const period = await HistoricalPeriod.findByPk(id);
        if (!period) {
            return res.status(404).json({
                success: false,
                message: 'Period not found'
            });
        }
        if(start_year> end_year) {
            return res.status(400).json({
                success: false,
                message: 'start_year must be less than or equal to end_year'
            });
        }
        
        let thumbnail_url= period.thumbnail_url

        if(media) {
            const uploadResult = await uploadToCloudinary(media);
            thumbnail_url = uploadResult.secure_url;
        }

        await period.update({
            name: name ?? period.name , 
            start_year: start_year?? period.start_year, 
            end_year: end_year ?? period.end_year, 
            description: description ?? period.description, 
            thumbnail_url: thumbnail_url?? period.thumbnail_url
         });

        res.json({
            success: true,
            message: 'Period updated successfully',
            data: period
        });
        
    } catch (error) {
        console.error('Error updating period:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to update period',
            error: error.message
        });
    }
};

// Delete period (Admin only)
exports.deletePeriod = async (req, res) => {
    try {
        const { id } = req.params;

        const period = await HistoricalPeriod.findByPk(id);
        if (!period) {
            return res.status(404).json({
                success: false,
                message: 'Period not found'
            });
        }

        await period.destroy();

        res.json({
            success: true,
            message: 'Period deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting period:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete period',
            error: error.message
        });
    }
};

module.exports = exports;
