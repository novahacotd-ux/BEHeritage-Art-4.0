const { parse } = require("dotenv");
const {
  ForumPost,
  ForumPostImage,
  ForumPostVideo,
  ForumPostComment,
  User,
  ForumCategory,
  Tags,
  ForumTag,
  ForumReactions,
  Order,
} = require("../models");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");
const { Op , fn, col, Sequelize} = require("sequelize");

// --- Posts ---

const createPost = async (req, res, next) => {
  try {
    const { content,category_id, title, } = req.body;
    let tag= req.body.tag
    const userId = req.user.id;

    if (!tag) {
      tag = [];
    } else if (typeof tag === "string") {
      try {
        const parsed = JSON.parse(tag);
        tag = Array.isArray(parsed) ? parsed : [parsed];
      } catch (err) {
        // Nếu parse fail → coi như là 1 tag đơn
        tag = [tag];
      }
    }

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }
    const Tagid=[]

    for(const tagName of tag) {
      let tagRecord= await Tags.findOne({
        where:{ name: tagName}
      })
      if (!tagRecord) {
        tagRecord = await Tags.create({
          name: tagName
        })
      }
      Tagid.push(tagRecord.id)
    }

    const iscategory= await ForumCategory.findByPk(category_id);

    if (!iscategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const post = await ForumPost.create({
      created_by: userId,
      content,
      category_id,
      title,
      status: "Pending",
    });

    if(Tagid.length>0) {
      await Promise.all(
        Tagid.map(async(id)=> {
          await ForumTag.create( {
            tag_id: id,
            post_id: post.id,
        })
      })
      )
    }
    // Handle Media (Images and Videos)
    // Assuming req.files.images and req.files.videos if multiple fields
    // Or just check req.files array and filter by mimetype if generic 'media' field
    // Let's assume 'images' and 'videos' fields for simplicity based on previous patterns or standard multer fields
    if (req.files) {
      if (req.files.images) {
        await Promise.all(
          req.files.images.map(async (file) => {
            const result = await uploadToCloudinary(file, {
              resource_type: "image",
            });

            await ForumPostImage.create({
              post_id: post.id,
              image_url: result.secure_url,
              public_id: result.public_id
            });
          })
        );
      }

      if (req.files.videos) {
        await Promise.all(
          req.files.videos.map(async (file) => {
            const result = await uploadToCloudinary(file, {
              resource_type: "video",
            });
            
            await ForumPostVideo.create({
              post_id: post.id,
              video_url: result.secure_url,
              public_id: result.public_id
            });
          }) 
        );
      }
    }

    const createdPost = await ForumPost.findByPk(post.id, {
      include: [
        { model: ForumPostImage, as: "images" },
        { model: ForumPostVideo, as: "videos" },
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email", "avatar"],
        },
        {
          model: Tags,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        },
        {
          model: ForumCategory,
          as: 'post_category',
          attributes: ["category_id", "name"],
        }
      ],
    });

    res.status(201).json({ success: true, data: createdPost });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, tag, status, category_id, popular, myself, search  } = req.query;
    const offset = (page - 1) * limit;
    let userId = null
    if(req.user) {
      userId = req.user.id
    }
    console.log("USER:", req.user?.id);
    console.log("USER:", userId);
    const whereClause = {};

    // Filter by status: if empty -> all, else filter
    if (status) {
      whereClause.status = status;
    } else {
      // If NOT admin, maybe we should default to Active?
      // User said "empty -> get all events" context, applying similar logic here?
      // But typically deleted posts shouldn't be shown to public.
      // Let's assume Public/User sees Active, Admin sees all?
      // User request was specifically for getAllEvents. For posts, usually we hide deleted.
      // But adhering to "empty -> get all" logic requested for consistency if applied generally.
      // However, typical forum behavior: don't show deleted.
      // I'll filter 'Active' by default for safety, unless 'status' param passed.
      // Wait, "if status query parameter is empty -> get all events with all status" was the specific overrides.
      // I will follow that strictly if user asks, but for now safe default is Active.
      // Actually, let's allow 'all' if status is explicitly omitted, as per the Event pattern user liked.
    }
    let postIds = null;

    let order=[["created_date", "DESC"]]
    if (tag) {
      const postsWithTag = await ForumPost.findAll({
        attributes: ["id"],
        include: [
          {
            model: Tags,
            as: "tags",
            where: { name: tag },
            attributes: [],
            through: { attributes: [] },
            required: true,
          },
        ],
      });

      postIds = postsWithTag.map(p => p.id);
    }
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }
    if (postIds) {
      whereClause.id = postIds;
    }
    if (category_id) {
      whereClause.category_id = category_id;
    }
    if(popular) {
      order=[["likes", "DESC"]];
    }
    if(myself) {
      whereClause.created_by= userId
    }


    const { count, rows } = await ForumPost.findAndCountAll({
      where: whereClause,
      include: [
        { model: ForumPostImage, as: "images" },
        { model: ForumPostVideo, as: "videos" },
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar"],
        },
        {
          model: ForumPostComment,
          as: "comments",
          attributes: [],
          required: false
        },

        {
            model: ForumReactions,
            as: "like",
            attributes: ["reaction_type"],
            where: {
              user_id: userId
            },
            required: false
          },
        {
          model: Tags,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          required: false
        },
        {
          model: ForumCategory,
          as: 'post_category',
          attributes: ["category_id", "name"],
        }
      ],
      order: order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });
    const activeCount = await ForumPost.count({
      where: { 
        ...whereClause, 
        status: "Active" 
      },
    });

    const commentCounts = await ForumPostComment.findAll({
      where: { post_id: rows.map(p => p.id)},
      attributes: [
        "post_id",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "comment_count"]
      ],
      group: ["post_id"],
      raw: true,
    });

    const countMap = commentCounts.reduce((acc, c) => {
      acc[c.post_id] = parseInt(c.comment_count);
      return acc;
    }, {});

    const result = rows.map(post => {
      const data = post.toJSON();

      const reactions = data.like || [];

      const like = reactions.some(r => r.reaction_type === "LIKE");
      const dislike = reactions.some(r => r.reaction_type === "DISLIKE");

      delete data.like;

      return {
        ...data,
        like,
        dislike,
        comment_count: countMap[post.id] || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        active_count: activeCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let userId = null
    if(req.user) {
      userId = req.user.id
    }

    const post = await ForumPost.findByPk(id, {
      include: [
        { model: ForumPostImage, as: "images" },
        { model: ForumPostVideo, as: "videos" },
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar"],
        },
        {
          model: ForumCategory,
          as: 'post_category',
          attributes: ["category_id", "name"],
        },
        {
            model: ForumReactions,
            as: "like",
            attributes: ["reaction_type"],
            where: {
              user_id: userId
            },
            required: false
          },
         {
              model: Tags,
              as: 'tags',
              attributes: ['id', 'name'],
              through: { attributes: [] }
            },
        {
          model: ForumPostComment,
          as: "comments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "name", "avatar"],
            },
          ],
          // Flattening replies might be needed or handled recursively on client
        },
      ],
      order: [["created_date", "DESC"]]
    });
    const commentCount = await ForumPostComment.count({
      where: { post_id: id }
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    
    const data = post.toJSON();

    const reactions = data.like || [];

    const like = reactions.some(r => r.reaction_type === "LIKE")|| false;
    const dislike = reactions.some(r => r.reaction_type === "DISLIKE")|| false;

    delete data.like


    const result= {...data, comment_count: commentCount, like,  dislike}

    res.status(200).json({ success: true, data: result});
  } catch (error) {
    next(error);
  }
};

const getPostByUser = async (req, res, next) => {
  try {
    const { page = 1, limit = 10} = req.query;
    const offset = (page - 1) * limit;
    const { userId }  = req.params;

    const {rows, count} = await ForumPost.findAndCountAll({
      where: { 
        created_by: userId,
        status: "Active"
      },
    
      include: [
        { model: ForumPostImage, as: "images" },
        { model: ForumPostVideo, as: "videos" },
         {
          model: ForumReactions,
          as: 'like',
          attributes: ["reaction_type"],
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar"],
        },
        
        {
          model: Tags,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: ForumCategory,
          as: 'post_category',
          attributes: ["category_id", "name"],
        }
      ],
      distinct: true,
      order: [["created_date", "DESC"]]
    });

    const posts = await Promise.all(
      rows.map(async (post) => {
        const commentCount = await ForumPostComment.count({
          where: { post_id: post.id }
        });
        const data= post.toJSON()
        const reactions = data.like || [];

        const like = reactions.some(r => r.reaction_type === "LIKE")|| false;
        const dislike = reactions.some(r => r.reaction_type === "DISLIKE")|| false;

        delete data.like

        return {
          ...post.toJSON(),
          like,
          dislike,
          commentCount,

        };
      })
    );

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });

  } catch (error) {
    next(error);
  }
};

const UpdatePost= async(req, res, next)=> {
  try {
    const {id}= req.params
    const {keepMediaIds=[], category_id, title, content}= req.body
    let tag= req.body.tag
    const userId = req.user.id;
    
    const post = await ForumPost.findByPk(id) 

    if (!tag) {
      tag = [];
    } else if (typeof tag === "string") {
      try {
        const parsed = JSON.parse(tag);
        tag = Array.isArray(parsed) ? parsed : [parsed];
      } catch (err) {
        tag = [tag];
      }
    }
    const tagIds = [];

    for (let rawName of tag) {
      const name = rawName.trim();

      // 1. tìm tag
      let tag = await Tags.findOne({ where: { name } });

      // 2. nếu chưa có thì tạo
      if (!tag) {
        tag = await Tags.create({ name });
      }

      tagIds.push(tag.id);
    }

    await ForumTag.destroy({
      where: { post_id: id }
    });
    for (let tagId of tagIds) {
      await ForumTag.create({
        post_id: id,
        tag_id: tagId
      });
    }
    
    if(!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.created_by!== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if(category_id) {
      const isCategory= await ForumCategory.findByPk(category_id)
      if(!isCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    await post.update({
      category_id: category_id,
      title: title ? title: post.title,
      content: content ? content : post.content
    })

    const  oldImages = await ForumPostImage.findAll({
      where: {post_id: id}
    })
    const  oldVideos = await ForumPostVideo.findAll({
    where: {post_id: id}
    })  

    const allMedia = [...oldImages, ...oldVideos];

    const mediaToDelete = allMedia.filter(
      m => !keepMediaIds.includes(m.id)
    );

    for (const img of mediaToDelete) {
       try {
         await deleteFromCloudinary(img.public_id);
       } catch (err) {
         console.log("Cloud delete error:", err.message);
       }
      await img.destroy();
    }
    if (req.files) {
        if (req.files.images) {
          await Promise.all(
            req.files.images.map(async (file) => {
              const result = await uploadToCloudinary(file, {
                resource_type: "image",
              });
              await ForumPostImage.create({
                post_id: post.id,
                image_url: result.secure_url,
                public_id: result.public_id
              });
            })
          );
        }

        if (req.files.videos) {
          await Promise.all(
            req.files.videos.map(async (file) => {
              const result = await uploadToCloudinary(file, {
                resource_type: "video",
              });
              await ForumPostVideo.create({
                post_id: post.id,
                video_url: result.secure_url,
                public_id: result.public_id
              });
            }) 
          );
        }
      }
    const updatePost = await ForumPost.findOne({
      where: {
        id: id,
        created_by: userId
      },
      include: [
        { model: ForumPostImage, as: "images" },
        { model: ForumPostVideo, as: "videos" },
         {
          model: ForumReactions,
          as: 'like',
          attributes: ["reaction_type"],
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar"],
        },
        
        {
          model: Tags,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: ForumCategory,
          as: 'post_category',
          attributes: ["category_id", "name"],
        }
      ],
      distinct: true
    });
   
    const data= updatePost.toJSON()
    const reactions = data.like || [];

    const like = reactions.some(r => r.reaction_type === "LIKE")|| false;
    const dislike = reactions.some(r => r.reaction_type === "DISLIKE")|| false;

    delete data.like



    return res.json({
      success: true,
      message: "Update images successfully",
      data: 
      {
        ...data,
        like,
        dislike,
      }
    });
  }catch(error) {
    next(error)
  }
}

const updateStatusPost= async(req, res, next)=> {
  try{
    const { id } = req.params;
    const userRole = req.user.roles?.[0]?.role_code;

    const post = await ForumPost.findByPk(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (userRole !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    post.status = "Active";
    await post.save();
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });

  }catch(error) {
    next(error);
  }
}

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.roles?.[0]?.role_code; // Simplified role check

    const post = await ForumPost.findByPk(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check ownership or Admin
    if (post.created_by !== userId && userRole !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Soft delete
    post.status = "Deleted";
    await post.save();

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// --- Comments ---

const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, parent_id } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    const comment = await ForumPostComment.create({
      post_id: postId,
      user_id: userId,
      parent_id: parent_id || null,
      content,
    });

    const createdComment = await ForumPostComment.findByPk(comment.id, {
      include: [
        { model: User, as: "author", attributes: ["id", "name", "avatar"] },
      ],
    });

    res.status(201).json({ success: true, data: createdComment });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.roles?.[0]?.role_code;

    const comment = await ForumPostComment.findByPk(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.user_id !== userId && userRole !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await comment.destroy(); // Hard delete or soft? User didn't specify for comments, but often soft.
    // For now hard delete to keep it simple as table didn't have status.
    // Migration didn't add status to comments.

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// --- Likes ---

const toggleReaction = async (req, res, next) => {
  try {
    const { targetId } = req.params; // Post ID or Comment ID
    const { targetType, reactionType } = req.body;  // 'POST' or 'COMMENT'
    const userId = req.user.id;

    if (!["POST", "COMMENT"].includes(targetType)) {
      return res.status(400).json({ success: false, message: "Invalid target type" });
    }

    if (!["LIKE", "DISLIKE"].includes(reactionType)) {
      return res.status(400).json({ success: false, message: "Invalid reaction type" });
    }

    let targetModel = targetType=== "POST" ? ForumPost: ForumPostComment
    
    const target= await targetModel.findByPk(targetId)

    if(!target) {
      return res.status(404).json({ success: false, message: "Target not found" });
    }

    const existingReaction = await ForumReactions.findOne({
      where: {
        user_id: userId,
        target_id: targetId,
        target_type: targetType,
        // reaction_type: reactionType
      },
    });

    let liked = false;
    let disliked =false

    console.log(existingReaction)
    if (!existingReaction) {
      await ForumReactions.create({
        user_id: userId,
        target_id: targetId,
        target_type: targetType,
        reaction_type: reactionType
      })

      liked = reactionType === "LIKE";
      disliked = reactionType === "DISLIKE";
    }
    else {
      if(existingReaction.reaction_type === reactionType) {
      await existingReaction.destroy()
      
    }else {
      await existingReaction.update(
        {
          reaction_type: reactionType
        }, 
    )
    
      liked = reactionType === "LIKE";
      disliked = reactionType === "DISLIKE";
    }}

    const like_Count= await ForumReactions.count({
       where: {
        target_id: targetId,
        target_type: targetType,
        reaction_type: "LIKE"
      }
    })
    const dislike_count= await ForumReactions.count({
       where: {
        target_id: targetId,
        target_type: targetType,
        reaction_type: "DISLIKE"
      }
    })
    await target.update({
      likes: like_Count,
      dislikes: dislike_count
    });
    return res.status(200).json({
      success: true,
      liked,
      disliked,
      likes: like_Count,
      dislikes: dislike_count
    });

  } catch (error) {
    next(error);
  }
};
module.exports = {
  createPost,
  updateStatusPost,
  getPosts,
  getPostById,
  deletePost,
  createComment,
  deleteComment,
  toggleReaction,
  getPostByUser,
  UpdatePost
  // toggleDislike
};