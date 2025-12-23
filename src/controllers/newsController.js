const { News, NewsImage } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Get all news (exclude deleted by default)
const getAllNews = async (req, res, next) => {
  try {
    const { status, includeDeleted, page = 1, limit = 10 } = req.query;
    
    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
      });
    }

    const whereClause = {};
    
    // Validate status if provided
    if (status) {
      const validStatuses = ['Draft', 'Published', 'Archived', 'Deleted'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      whereClause.status = status;
    } else if (!includeDeleted) {
      // Exclude deleted news by default
      whereClause.status = { [require('sequelize').Op.ne]: 'Deleted' };
    }

    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await News.findAndCountAll({
      where: whereClause,
      include: [{
        model: NewsImage,
        as: 'images',
        attributes: ['id', 'image_url', 'created_date']
      }],
      order: [['created_date', 'DESC']],
      limit: limitNum,
      offset: offset
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single news by ID
const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID format'
      });
    }

    const news = await News.findByPk(id, {
      include: [{
        model: NewsImage,
        as: 'images',
        attributes: ['id', 'image_url', 'created_date']
      }]
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// Create new news
const createNews = async (req, res, next) => {
  try {
    const { content, tag, status, thumbnail_url } = req.body;

    // Validation is handled by middleware, but double-check content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['Draft', 'Published', 'Archived', 'Deleted'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    const news = await News.create({
      content: content.trim(),
      tag: tag ? tag.trim() : null,
      thumbnail_url: thumbnail_url ? thumbnail_url.trim() : null,
      status: status || 'Draft'
    });

    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// Update news
const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, tag, status, thumbnail_url } = req.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID format'
      });
    }

    // Check if at least one field is provided
    if (content === undefined && tag === undefined && status === undefined && thumbnail_url === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (content, tag, thumbnail_url, or status) must be provided'
      });
    }

    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Prevent updating deleted news
    if (news.status === 'Deleted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update deleted news'
      });
    }

    // Validate status if provided
    if (status !== undefined) {
      const validStatuses = ['Draft', 'Published', 'Archived', 'Deleted'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Update fields
    if (content !== undefined) news.content = content.trim();
    if (tag !== undefined) news.tag = tag ? tag.trim() : null;
    if (thumbnail_url !== undefined) news.thumbnail_url = thumbnail_url ? thumbnail_url.trim() : null;
    if (status !== undefined) news.status = status;

    await news.save();

    res.status(200).json({
      success: true,
      message: 'News updated successfully',
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete news (change status to Deleted)
const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID format'
      });
    }

    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    if (news.status === 'Deleted') {
      return res.status(400).json({
        success: false,
        message: 'News is already deleted'
      });
    }

    news.status = 'Deleted';
    await news.save();

    res.status(200).json({
      success: true,
      message: 'News deleted successfully (soft delete)',
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// Update news status
const updateNewsStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID format'
      });
    }

    // Validate status (also validated by middleware)
    const validStatuses = ['Draft', 'Published', 'Archived', 'Deleted'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    news.status = status;
    await news.save();

    res.status(200).json({
      success: true,
      message: 'News status updated successfully',
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// Upload image/video to Cloudinary and associate with news
const uploadNewsMedia = async (req, res, next) => {
  try {
    const { newsId } = req.params;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(newsId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID format'
      });
    }

    // Check if news exists
    const news = await News.findByPk(newsId);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Prevent uploading to deleted news
    if (news.status === 'Deleted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot upload media to deleted news'
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Validate file size (already handled by multer, but double-check)
    if (req.file.size > 50 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 50MB limit'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file);

    // Save image URL to database
    const newsImage = await NewsImage.create({
      news_id: newsId,
      image_url: result.secure_url
    });

    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      data: {
        image_url: newsImage.image_url
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete news image
const deleteNewsImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(imageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image ID format'
      });
    }

    const newsImage = await NewsImage.findByPk(imageId);

    if (!newsImage) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    await newsImage.destroy();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  updateNewsStatus,
  uploadNewsMedia,
  deleteNewsImage
};
