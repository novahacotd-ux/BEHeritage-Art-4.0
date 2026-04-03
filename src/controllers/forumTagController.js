const { Sequelize } = require("sequelize");
const { ForumTag, Tags, ForumPost } = require("../models");

const getTagpoppular= async(req, res, next)=> {
    try{
        const tags = await ForumTag.findAll({
        attributes: [
            [Sequelize.fn("COUNT", Sequelize.col("forum_tag.tag_id")), "usage_count"]
        ],
        include: [
            {
                model: Tags,
                as: 'tag',
                attributes: ["id", "name"]
            },
            {
                model: ForumPost,
                as: "post",
                attributes: [],
                where: {
                   status: "Active"
                }
        }
        ],
        group: ["forum_tag.tag_id", "tag.id"],
        order: [[Sequelize.literal("usage_count"), "DESC"]],
        limit: 8
        });
        return res.status(200).json(tags)

    }catch(err) {
        next(err)
    }
}
module.exports= { getTagpoppular }