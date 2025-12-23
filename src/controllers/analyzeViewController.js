const { AnalyzeView, AnalyzeViewImage } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Get all analyze views (exclude deleted by default)
const getAllAnalyzeViews = async (req, res, next) => {
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
      // Exclude deleted analyze views by default
      whereClause.status = { [require('sequelize').Op.ne]: 'Deleted' };
    }

    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await AnalyzeView.findAndCountAll({
      where: whereClause,
      include: [{
        model: AnalyzeViewImage,
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

// Get single analyze view by ID
const getAnalyzeViewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid analyze view ID format'
      });
    }

    const analyzeView = await AnalyzeView.findByPk(id, {
      include: [{
        model: AnalyzeViewImage,
        as: 'images',
        attributes: ['id', 'image_url', 'created_date']
      }]
    });

    if (!analyzeView) {
      return res.status(404).json({
        success: false,
        message: 'Analyze view not found'
      });
    }

    res.status(200).json({
      success: true,
      data: analyzeView
    });
  } catch (error) {
    next(error);
  }
};

// Create new analyze view
const createAnalyzeView = async (req, res, next) => {
  try {
    const { summary, content, tag, status, thumbnail_url } = req.body;

    // Validation is handled by middleware
    if (!summary || summary.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Summary is required'
      });
    }

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

    const analyzeView = await AnalyzeView.create({
      summary: summary.trim(),
      content: content.trim(),
      tag: tag ? tag.trim() : null,
      thumbnail_url: thumbnail_url ? thumbnail_url.trim() : null,
      status: status || 'Draft'
    });

    res.status(201).json({
      success: true,
      message: 'Analyze view created successfully',
      data: analyzeView
    });
  } catch (error) {
    next(error);
  }
};

// Update analyze view
const updateAnalyzeView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { summary, content, tag, status, thumbnail_url } = req.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid analyze view ID format'
      });
    }

    // Check if at least one field is provided
    if (summary === undefined && content === undefined && tag === undefined && status === undefined && thumbnail_url === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (summary, content, tag, thumbnail_url, or status) must be provided'
      });
    }

    const analyzeView = await AnalyzeView.findByPk(id);

    if (!analyzeView) {
      return res.status(404).json({
        success: false,
        message: 'Analyze view not found'
      });
    }

    // Prevent updating deleted analyze views
    if (analyzeView.status === 'Deleted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update deleted analyze view'
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
    if (summary !== undefined) analyzeView.summary = summary.trim();
    if (content !== undefined) analyzeView.content = content.trim();
    if (tag !== undefined) analyzeView.tag = tag ? tag.trim() : null;
    if (thumbnail_url !== undefined) analyzeView.thumbnail_url = thumbnail_url ? thumbnail_url.trim() : null;
    if (status !== undefined) analyzeView.status = status;

    await analyzeView.save();

    res.status(200).json({
      success: true,
      message: 'Analyze view updated successfully',
      data: analyzeView
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete analyze view (change status to Deleted)
const deleteAnalyzeView = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid analyze view ID format'
      });
    }

    const analyzeView = await AnalyzeView.findByPk(id);

    if (!analyzeView) {
      return res.status(404).json({
        success: false,
        message: 'Analyze view not found'
      });
    }

    if (analyzeView.status === 'Deleted') {
      return res.status(400).json({
        success: false,
        message: 'Analyze view is already deleted'
      });
    }

    analyzeView.status = 'Deleted';
    await analyzeView.save();

    res.status(200).json({
      success: true,
      message: 'Analyze view deleted successfully (soft delete)',
      data: analyzeView
    });
  } catch (error) {
    next(error);
  }
};

// Update analyze view status
const updateAnalyzeViewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid analyze view ID format'
      });
    }

    // Validate status
    const validStatuses = ['Draft', 'Published', 'Archived', 'Deleted'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const analyzeView = await AnalyzeView.findByPk(id);

    if (!analyzeView) {
      return res.status(404).json({
        success: false,
        message: 'Analyze view not found'
      });
    }

    analyzeView.status = status;
    await analyzeView.save();

    res.status(200).json({
      success: true,
      message: 'Analyze view status updated successfully',
      data: analyzeView
    });
  } catch (error) {
    next(error);
  }
};

// Upload image/video to Cloudinary and associate with analyze view
const uploadAnalyzeViewMedia = async (req, res, next) => {
  try {
    const { analyzeViewId } = req.params;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(analyzeViewId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid analyze view ID format'
      });
    }

    // Check if analyze view exists
    const analyzeView = await AnalyzeView.findByPk(analyzeViewId);
    if (!analyzeView) {
      return res.status(404).json({
        success: false,
        message: 'Analyze view not found'
      });
    }

    // Prevent uploading to deleted analyze views
    if (analyzeView.status === 'Deleted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot upload media to deleted analyze view'
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Validate file size
    if (req.file.size > 50 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 50MB limit'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file);

    // Save image URL to database
    const analyzeViewImage = await AnalyzeViewImage.create({
      analyze_view_id: analyzeViewId,
      image_url: result.secure_url
    });

    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      data: {
        id: analyzeViewImage.id,
        image_url: analyzeViewImage.image_url
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete analyze view image
const deleteAnalyzeViewImage = async (req, res, next) => {
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

    const analyzeViewImage = await AnalyzeViewImage.findByPk(imageId);

    if (!analyzeViewImage) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    await analyzeViewImage.destroy();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAnalyzeViews,
  getAnalyzeViewById,
  createAnalyzeView,
  updateAnalyzeView,
  deleteAnalyzeView,
  updateAnalyzeViewStatus,
  uploadAnalyzeViewMedia,
  deleteAnalyzeViewImage
};
