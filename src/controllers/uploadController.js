const multer = require('multer');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * Detect media type from MIME type
 * @param {string} mimetype - MIME type of the file
 * @returns {string|null} - 'image', 'video', or null
 */
const detectMediaType = (mimetype) => {
  if (mimetype && mimetype.startsWith('image/')) return 'image';
  if (mimetype && mimetype.startsWith('video/')) return 'video';
  return null;
};

/**
 * Get Cloudinary resource type based on MIME type
 * @param {string} mimetype - MIME type of the file
 * @returns {string} - 'image' or 'video'
 */
const getResourceType = (mimetype) => {
  return detectMediaType(mimetype) === 'video' ? 'video' : 'image';
};

const normalizeUploadType = (value) => {
  const raw = (value || '').toString().trim().toLowerCase();
  if (raw === 'avata') return 'avatar';
  if (raw === 'experience-post' || raw === 'post-media') return 'post';
  return raw;
};

const getUploadConfig = (uploadType, mediaType) => {
  const isVideo = mediaType === 'video';

  if (uploadType === 'avatar') {
    return {
      folder: 'HA4/avatars',
      resource_type: 'image',
      eager: [
        {
          width: 500,
          height: 500,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto:good',
          fetch_format: 'auto'
        }
      ]
    };
  }

  if (uploadType === 'location') {
    return {
      folder: 'HA4/locations',
      resource_type: 'image',
      eager: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good', fetch_format: 'auto' }
      ]
    };
  }

  if (uploadType === 'post') {
    return {
      folder: 'HA4/experience-posts',
      resource_type: isVideo ? 'video' : 'image',
      eager: isVideo
        ? [
            { width: 1280, height: 720, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
            { width: 640, height: 360, crop: 'limit', quality: 'auto:low', fetch_format: 'auto' }
          ]
        : [
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
            { width: 800, height: 600, crop: 'limit', quality: 'auto:eco', fetch_format: 'auto' }
          ]
    };
  }

  return null;
};

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 35 * 1024 * 1024 // 35MB max (videos)
  },
  fileFilter: (req, file, cb) => {
    const mediaType = detectMediaType(file.mimetype);
    if (!mediaType) {
      return cb(new Error('Chỉ chấp nhận file ảnh hoặc video'), false);
    }
    // Attach detected type to file object for use in handlers
    file.mediaType = mediaType;
    cb(null, true);
  }
});

/**
 * Unified upload for avatar, location, post
 */
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    const uploadType = normalizeUploadType(req.body.type || req.query.type);

    if (!uploadType || !['avatar', 'location', 'post'].includes(uploadType)) {
      return res.status(400).json({
        success: false,
        message: 'type không hợp lệ (avatar, location, post)'
      });
    }

    if (['avatar', 'post'].includes(uploadType) && req.files.length > 1) {
      return res.status(400).json({
        success: false,
        message: 'Chỉ cho phép 1 file'
      });
    }

    if (uploadType === 'location' && req.files.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Chỉ cho phép tối đa 10 file mỗi lần'
      });
    }

    const uploadResults = [];

    for (const file of req.files) {
      const mediaType = detectMediaType(file.mimetype);

      if (!mediaType) {
        return res.status(400).json({
          success: false,
          message: 'Chỉ chấp nhận file ảnh hoặc video'
        });
      }

      if (mediaType === 'image' && file.size > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'Ảnh vượt quá giới hạn 10MB'
        });
      }

      if (mediaType === 'video' && file.size > 35 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'Video vượt quá giới hạn 35MB'
        });
      }

      if (['avatar', 'location'].includes(uploadType) && mediaType !== 'image') {
        return res.status(400).json({
          success: false,
          message: 'Chỉ chấp nhận ảnh'
        });
      }

      if (uploadType === 'post' && !['image', 'video'].includes(mediaType)) {
        return res.status(400).json({
          success: false,
          message: 'Post chỉ chấp nhận ảnh hoặc video'
        });
      }

      const uploadOptions = getUploadConfig(uploadType, mediaType);
      if (!uploadOptions) {
        return res.status(400).json({
          success: false,
          message: 'Không thể cấu hình upload cho type này'
        });
      }

      const result = await uploadToCloudinary(file, {
        ...uploadOptions,
        eager_async: true,
        eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL || undefined
      });

      uploadResults.push({
        uploadType,
        mediaType,
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type
      });
    }

    res.status(200).json({
      success: true,
      message: 'Upload thành công',
      data: uploadResults
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete media from Cloudinary
 */
const deleteMedia = async (req, res, next) => {
  try {
    const { publicId, resourceType = 'image' } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const result = await deleteFromCloudinary(publicId, resourceType);

    res.status(200).json({
      success: true,
      message: 'Xóa file thành công',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  uploadMedia,
  deleteMedia,
  detectMediaType,
  getResourceType
};
