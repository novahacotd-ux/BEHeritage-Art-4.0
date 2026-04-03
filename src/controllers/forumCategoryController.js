const { ForumCategory } = require("../models")

const GetForumCategory= async(req,res, next)=> {
    try{
        const category= await ForumCategory.findAll()
        res.status(200).json({
            success: true,
            data:category
        })
    }catch(error) {
        next(error);
    }
}
module.exports= {GetForumCategory}