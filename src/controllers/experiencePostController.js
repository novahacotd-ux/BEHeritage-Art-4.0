const { ExperiencePost, ExperienceComment, User } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const { detectMediaType, getResourceType } = require('./uploadController');
const { Op } = require('sequelize');

/**
 * Get all experience posts
 */
const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await ExperiencePost.findAndCountAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
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
 * Get post by ID
 */
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await ExperiencePost.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
        },
        {
          model: ExperienceComment,
          as: 'comments',
          attributes: ['id', 'content', 'like_count', 'created_at'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
            },
          ],
          order: [['created_at', 'DESC']],
          limit: 5, // Limit to 5 recent comments
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get posts by user
 */
const getPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { count, rows } = await ExperiencePost.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', ['email', 'username'], ['name', 'display_name'], ['avatar', 'avatar_url']],
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
 * Create new post
 */
const createPost = async (req, res, next) => {
  let uploaded = null;
  try {
    const { caption, type, cloudinary_url, cloudinary_public_id } = req.body;
    const userId = req.user.id;

    let mediaType = type || null;
    if (req.file) {
      mediaType = detectMediaType(req.file.mimetype);
      const resourceType = getResourceType(req.file.mimetype);
      
      uploaded = await uploadToCloudinary(req.file, {
        folder: 'HA4/experience-posts',
        resource_type: resourceType,
        transformation: [{ quality: 'auto:good' }],
      });
    }

    // Create post
    const post = await ExperiencePost.create({
      user_id: userId,
      caption: caption || null,
      type: mediaType,
      cloudinary_url: uploaded ? uploaded.secure_url : (cloudinary_url || null),
      cloudinary_public_id: uploaded ? uploaded.public_id : (cloudinary_public_id || null),
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    if (uploaded?.public_id) {
      try {
        const resourceType = getResourceType(uploaded.resource_type);
        await deleteFromCloudinary(uploaded.public_id, resourceType);
      } catch (cleanupError) {
        console.error('Failed to rollback Cloudinary upload:', cleanupError);
      }
    }
    next(error);
  }
};

/**
 * Update post
 */
const updatePost = async (req, res, next) => {
  let uploaded = null;
  try {
    const { id } = req.params;
    const { caption, type, cloudinary_url, cloudinary_public_id } = req.body;
    const userId = req.user.id;
    const userRole = req.user.roles?.[0]?.role_code;

    const post = await ExperiencePost.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author or admin
    if (post.user_id !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const oldPublicId = post.cloudinary_public_id;
    const oldType = post.type; // Store old type for resource type detection

    if (req.file) {
      const mediaType = detectMediaType(req.file.mimetype);
      const resourceType = getResourceType(req.file.mimetype);
      
      uploaded = await uploadToCloudinary(req.file, {
        folder: 'HA4/experience-posts',
        resource_type: resourceType,
        transformation: [{ quality: 'auto:good' }],
      });
    }

    // Update fields
    if (caption !== undefined) {
      post.caption = caption;
    }
    if (type !== undefined) {
      post.type = type;
    } else if (uploaded) {
      post.type = detectMediaType(req.file.mimetype);
    }

    const shouldUpdateImage = Boolean(uploaded) || cloudinary_url !== undefined || cloudinary_public_id !== undefined;
    if (shouldUpdateImage) {
      const newUrl = uploaded ? uploaded.secure_url : (cloudinary_url !== undefined ? cloudinary_url : post.cloudinary_url);
      const newPublicId = uploaded ? uploaded.public_id : (cloudinary_public_id !== undefined ? cloudinary_public_id : post.cloudinary_public_id);
      post.cloudinary_url = newUrl ?? null;
      post.cloudinary_public_id = newPublicId ?? null;
    }

    await post.save();

    if (shouldUpdateImage && oldPublicId && oldPublicId !== post.cloudinary_public_id) {
      try {
        const oldResourceType = oldType === 'video' ? 'video' : 'image';
        await deleteFromCloudinary(oldPublicId, oldResourceType);
      } catch (cleanupError) {
        console.error('Failed to delete old Cloudinary image:', cleanupError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    if (uploaded?.public_id) {
      try {
        const resourceType = getResourceType(uploaded.resource_type);
        await deleteFromCloudinary(uploaded.public_id, resourceType);
      } catch (cleanupError) {
        console.error('Failed to rollback Cloudinary upload:', cleanupError);
      }
    }
    next(error);
  }
};

/**
 * Delete post
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.roles?.[0]?.role_code;

    const post = await ExperiencePost.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author or admin
    if (post.user_id !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    const oldPublicId = post.cloudinary_public_id;
    const postType = post.type;

    await post.destroy();

    if (oldPublicId) {
      try {
        const resourceType = postType === 'video' ? 'video' : 'image';
        await deleteFromCloudinary(oldPublicId, resourceType);
      } catch (cleanupError) {
        console.error('Failed to delete Cloudinary image:', cleanupError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
};
