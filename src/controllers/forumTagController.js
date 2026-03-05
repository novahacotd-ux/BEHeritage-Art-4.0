const { Sequelize } = require("sequelize");
const { ForumTag, Tags } = require("../models");

const getTagpoppular= async(req, res, next)=> {
    try{
        const tags = await ForumTag.findAll({
        attributes: [
            "tag_id",
            [Sequelize.fn("COUNT", Sequelize.col("forum_tag.tag_id")), "usage_count"]
        ],
        include: [
            {
                model: Tags,
                as: 'tag',
                attributes: ["id", "name"]
            }
        ],
        group: ["forum_tag.tag_id", "tag.id"],
        order: [[Sequelize.literal("usage_count"), "DESC"]],
        limit: 8
        });
        console.log(tags)
        return res.status(200).json(tags)

    }catch(err) {
        next(err)
    }
}
module.exports= { getTagpoppular }