const {Celebrities, HistoricalPeriod}= require('../models');
const { uploadToCloudinary } = require('../utils/cloudinary');


const getCelebrity = async(req, res, next)=> {
    const {id}= req.params
    try {
        const Celebritie = await Celebrities.findAll({
            where: {period_id: id},
            include: [{
                    model: HistoricalPeriod,
                    as: 'period',
                    attributes: ['period_id', 'name', 'start_year', 'end_year']
                }]
        });
        if(!Celebritie) {
            return res.status(404).json({
            success: false,
            message: 'Celebritie not found'
        });
        }
        res.json({
            success: true,
            data: Celebritie
        });
    }catch(error) {
        console.error('Error fetching Celebrities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Celebrities',
            error: error.message
        });
    }
};

const createCelebrity = async (req, res)=> {
    const { id } = req.params;
    const {name, bio}= req.body
    const media= req.file

    try{
        const period= await HistoricalPeriod.findByPk(id)
        if (!period) {
            return res.status(404).json({
            success: false,
            message: 'period not found'
        });
        }
        let thumbnail_url= null;

        if(media) {
            const uploadMedia= await uploadToCloudinary(media)
            thumbnail_url= uploadMedia.secure_url  
        }

        const NewCelebrity = await Celebrities.create({
            period_id: id,
            name,
            bio,
            thumbnail_url
        });
        res.status(201).json({
            success: true,
            message: 'Celebrity added to period successfully',
            data: NewCelebrity
        });

    }catch(error) {
        console.error('Error creating Celebrities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create Celebrities',
            error: error.message
        });
    }
}
const updateCelebrity = async(req, res)=> {
    const { id }= req.params;
    const { name, bio, period_id }= req.body;

    const media= req.file;
    try{
        const Celebrity= await Celebrities.findByPk(id)
        if(!Celebrity) {
            return res.status(404).json({
            success: false,
            message: 'Celebritie not found'});
        }

        let thumbnail_url= Celebrities.thumbnail_url
        if(media) {
            const uploadMedia= await uploadToCloudinary(media)
            thumbnail_url=uploadMedia.secure_url
        }

        await Celebrity.update({
            name: name ?? Celebrity.name,
            bio: bio ?? Celebrity.bio,
            thumbnail_url: thumbnail_url ?? Celebrity.thumbnail_url,
            period_id: period_id ?? Celebrity.period_id
        });
        res.json({
            success: true,
            message: 'Celebrity updated successfully',
            data: Celebrity
        });

    }catch(error) {
        console.error('Error updating Celebrities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update Celebrities',
            error: error.message
        });
    }
}
const deleteCelebrity= async(req, res)=> {
    const { id }= req.params;

    try{
        const Celebrity= await Celebrities.findByPk(id)
        if(!Celebrity) {
            return res.status(404).json({
            success: false,
            message: 'Celebritie not found'});
        }
        await Celebrity.destroy()

        res.json({
            success: true,
            message: 'Celebrity deleted successfully'
        });

    }catch(error) {
        console.error('Error deleting Celebrities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete Celebrities',
            error: error.message
        });
    }
}

module.exports = {
    getCelebrity,
    createCelebrity,
    updateCelebrity,
    deleteCelebrity
}