const { ExperienceComment, ExperiencePost, User } = require('../models');
// const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const { Op } = require('sequelize');

/**
 * Get all comments for a specific post
 */
const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Check if post exists
    const post = await ExperiencePost.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Get comments with pagination
    const { count, rows } = await ExperienceComment.findAndCountAll({
      where: { post_id: postId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
        },
        {
          model: ExperienceComment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
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

/**
 * Get comment by ID
 */
const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await ExperienceComment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
        },
        {
          model: ExperiencePost,
          as: 'post',
          attributes: ['id', 'caption', ],
        },
        {
          model: ExperienceComment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
            },
          ],
        },
        {
          model: ExperienceComment,
          as: 'parent',
          attributes: ['id', 'content', 'user_id'],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new comment
 */
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, parent_comment_id } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      });
    }

    // Check if post exists
    const post = await ExperiencePost.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // If parent_comment_id is provided, check if it exists
    if (parent_comment_id) {
      const parentComment = await ExperienceComment.findByPk(parent_comment_id);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found',
        });
      }
    }

    // Create comment
    const comment = await ExperienceComment.create({
      post_id: postId,
      user_id: userId,
      content: content.trim(),
      parent_comment_id: parent_comment_id || null,
    });

    // Fetch created comment with associations
    const createdComment = await ExperienceComment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: createdComment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update comment
 */
const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.roles?.[0]?.role_code;

    const comment = await ExperienceComment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is the author or admin
    if (comment.user_id !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
    }

    // Update fields
    if (content !== undefined && content.trim() !== '') {
      comment.content = content.trim();
    }

    await comment.save();

    // Fetch updated comment with associations
    const updatedComment = await ExperienceComment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete comment
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.roles?.[0]?.role_code;

    const comment = await ExperienceComment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is the author or admin
    if (comment.user_id !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }


    await comment.destroy();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Like/Unlike a comment
 */
const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await ExperienceComment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Toggle like (increment/decrement)
    // Note: This is a simple implementation. For production, you might want to track individual likes
    const action = req.body.action; // 'like' or 'unlike'

    if (action === 'like') {
      await comment.increment('like_count');
    } else if (action === 'unlike') {
      if (comment.like_count > 0) {
        await comment.decrement('like_count');
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "like" or "unlike"',
      });
    }

    await comment.reload();

    res.status(200).json({
      success: true,
      message: `Comment ${action}d successfully`,
      data: {
        like_count: comment.like_count,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get replies for a comment
 */
const getReplies = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await ExperienceComment.findAndCountAll({
      where: { parent_comment_id: id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
        },
      ],
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
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

module.exports = {
  getCommentsByPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
  getReplies,
};
