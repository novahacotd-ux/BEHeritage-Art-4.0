const { HistoricalPeriod, HistoricalSite, SiteImage,HistoricalEvents, Celebrities  } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinary');

function parseYear(yearStr) {
  if (!yearStr) return null;

  const str = yearStr.toString().trim().toUpperCase();

  if (str.includes("TCN")) {
    return -parseInt(str.replace("TCN", "").trim());
  }

  if (str.includes("SCN")) {
    return parseInt(str.replace("SCN", "").trim());
  }

  return parseInt(str);
}
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
                const celebrityCount= await Celebrities.count({
                    where: {period_id: period.period_id}
                })
                const eventCount= await HistoricalEvents.count({
                    where: {period_id: period.period_id}
                })
                const siteCount = await HistoricalSite.count({
                    where: { period_id: period.period_id }
                });
                
                return {
                    ...period.toJSON(),
                    celebrity_count: celebrityCount.toString(),
                    site_count: siteCount.toString(),
                    event_count: eventCount.toString()
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
        const period = await HistoricalPeriod.findByPk(id)
        if (!period) {
            return res.status(404).json({
                success: false,
                message: 'Period not found'
            });
        }
        const event= await HistoricalEvents.findAll({
            where: {period_id: id},
            attributes: ['event_id','name','start_year','end_year'],
            order: [['start_year', 'ASC']]
        })
        const celebrities = await Celebrities.findAll({
            where: { period_id: id },
            attributes: ['celebrities_id', 'name', 'bio', 'thumbnail_url']
        });

        res.json({
        success: true,
        data: {
            celebrities,
            event
        }
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
        const start=parseYear(start_year)
        const end= parseYear(end_year)

        if (/^\d+$/.test(name.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Period name cannot contain only numbers'
            });
        }
        if(start> end) {
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
            start_year: start,
            end_year: end,
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
        const start=parseYear(start_year)
        const end= parseYear(end_year)

        const period = await HistoricalPeriod.findByPk(id);
        if (!period) {
            return res.status(404).json({
                success: false,
                message: 'Period not found'
            });
        }
        if(start> end) {
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
            start_year: start?? period.start_year, 
            end_year: end ?? period.end_year, 
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
