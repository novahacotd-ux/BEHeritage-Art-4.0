const {HistoricalEvents, HistoricalPeriod }= require('../models');
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


const getHistoryEvent = async(req, res, next)=> {
    const {id}= req.params
    try {
         const historicalEvent = await HistoricalEvents.findAll({
           where: {event_id: id},
           include: [{
                model: HistoricalPeriod,
                as: 'period',
                attributes: ['period_id', 'name','start_year', 'end_year']
            }]
        });
        if(!historicalEvent) {
            return res.status(404).json({
            success: false,
            message: 'historical Event not found'
        });
        }
         res.json({
            success: true,       
            data: historicalEvent
        });
    }catch(error) {
        console.error('Error fetching historical Event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch historical Event',
            error: error.message
        });
    }
};

const createHistoryEvent = async(req, res)=>  {
    const { id }= req.params;
    const { name, start_year, end_year, description} = req.body;
    const media= req.file;
    const start=parseYear(start_year)
    const end= parseYear(end_year)
    try{
        const period = await HistoricalPeriod.findByPk(id)
        if(!period) {
            return res.status(404).json({
                success: false,
                message: 'period not found'
            });
        }
        let thumbnail_url=null
        if(media) {
            const uploadMedia= await uploadToCloudinary(media)
            thumbnail_url= uploadMedia.secure_url;
        }

        if(start> end) {
            return res.status(400).json({
                success: false,
                message: 'start_year must be less than or equal to end_year'
            });
        }

        if(start < period.start_year ||end> period.end_year ) {
            return res.status(400).json({
                success: false,
                message: `Event years must be within period (${period.start_year} - ${period.end_year})`
            });
        }

        const newHistoryEvent= await HistoricalEvents.create({
            period_id: id,
            name,
            start_year:start,
            end_year:end,
            description,
            thumbnail_url
        });
        res.status(201).json({
            success: true,
            message: 'Historical event added successfully',
            data: newHistoryEvent
        });
    }catch(error) {
        console.error('Error creating historical Event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create historical Event',
            error: error.message
        });
    }
}
const updateHistoryEvent = async(req, res)=> {
    const { id }= req.params;
    const { name, start_year, end_year, description, period_id } = req.body; 
    const media= req.file;
    const start=parseYear(start_year)
    const end= parseYear(end_year)

    try{
        const HistoryEvents= await HistoricalEvents.findByPk(id)

        if(!HistoryEvents) {
            return res.status(404).json({
            success: false,
            message: 'historical Event not found'});
        }
        let thumbnail_url = HistoricalEvents.thumbnail_url

        if(media) {
            const uploadMeida= await uploadToCloudinary(media)
            thumbnail_url=uploadMeida.secure_url   
        }
        await HistoryEvents.update({
            name: name ?? HistoryEvents.name,
            start_year: start ?? HistoryEvents.start_year,
            end_year: end ?? HistoryEvents.end_year,
            description: description ?? HistoryEvents.description,
            thumbnail_url: thumbnail_url ?? HistoryEvents.thumbnail_url,
            period_id: period_id ?? HistoryEvents.period_id
        });
        res.json({
            success: true,
            message: 'Historical event updated successfully',
            data: HistoryEvents
        });

    }catch(error) {
        console.error('Error updating historical event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update historical event',
            error: error.message
        });
    }
}
const deleteHistoryEvent= async(req, res)=> {
    const { id }= req.params;

    try{
        const HistoryEvents= await HistoricalEvents.findByPk(id)

        if(!HistoryEvents) {
            return res.status(404).json({
            success: false,
            message: 'historical Event not found'});
        }
        await HistoryEvents.destroy()

        res.json({
            success: true,
            message: 'Historical event deleted successfully'
        });


    }catch(error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete historical event',
            error: error.message
        });
    }
}

module.exports = {
    getHistoryEvent,
    createHistoryEvent,
    updateHistoryEvent,
    deleteHistoryEvent
}