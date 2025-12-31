const {
  ForumPost,
  ForumPostImage,
  ForumPostVideo,
  ForumPostComment,
  ForumLike,
  User,
} = require("../models");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { Op } = require("sequelize");

// --- Posts ---

const createPost = async (req, res, next) => {
  try {
    const { content, tag } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    const post = await ForumPost.create({
      created_by: userId,
      content,
      tag,
      status: "Active",
    });

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
          attributes: ["id", "name", "email", "avatar_url"],
        },
      ],
    });

    res.status(201).json({ success: true, data: createdPost });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, tag, status } = req.query;
    const offset = (page - 1) * limit;

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

    if (search) {
      whereClause.content = { [Op.like]: `%${search}%` };
    }
    if (tag) {
      whereClause.tag = tag;
    }

    const { count, rows } = await ForumPost.findAndCountAll({
      where: whereClause,
      include: [
        { model: ForumPostImage, as: "images" },
        { model: ForumPostVideo, as: "videos" },
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar_url"],
        },
        // Optimizing: maybe not include all comments, just count?
        // Or include first few? For now, standard list.
      ],
      order: [["created_date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true, // For correct count with includes
    });

    res.status(200).json({
      success: true,
      data: rows,
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

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await ForumPost.findByPk(id, {
      include: [
        { model: ForumPostImage, as: "images" },
        { model: ForumPostVideo, as: "videos" },
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar_url"],
        },
        {
          model: ForumPostComment,
          as: "comments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "name", "avatar_url"],
            },
          ],
          // Flattening replies might be needed or handled recursively on client
        },
      ],
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

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
        { model: User, as: "author", attributes: ["id", "name", "avatar_url"] },
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

const toggleLike = async (req, res, next) => {
  try {
    const { targetId } = req.params; // Post ID or Comment ID
    const { type } = req.body; // 'POST' or 'COMMENT'
    const userId = req.user.id;

    if (!["POST", "COMMENT"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    const existingLike = await ForumLike.findOne({
      where: {
        user_id: userId,
        target_id: targetId,
        target_type: type,
      },
    });

    let liked = false;
    let newCount = 0;

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      liked = false;
    } else {
      // Like
      await ForumLike.create({
        user_id: userId,
        target_id: targetId,
        target_type: type,
      });
      liked = true;
    }

    // Update count in target table
    if (type === "POST") {
      const post = await ForumPost.findByPk(targetId);
      if (post) {
        if (liked) await post.increment("likes");
        else await post.decrement("likes");
        await post.reload();
        newCount = post.likes;
      }
    } else {
      const comment = await ForumPostComment.findByPk(targetId);
      if (comment) {
        if (liked) await comment.increment("likes");
        else await comment.decrement("likes");
        await comment.reload();
        newCount = comment.likes;
      }
    }

    res.status(200).json({ success: true, liked, likes: newCount });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  createComment,
  deleteComment,
  toggleLike,
};
