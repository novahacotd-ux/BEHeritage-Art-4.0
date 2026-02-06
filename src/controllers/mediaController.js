const { MediaAsset, Location } = require('../models');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getResourceType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'video';
  if (mimetype.startsWith('application/') || mimetype.startsWith('text/')) return 'raw';
  return 'auto';
};

const getMediaType = (mimetype, cloudinaryResourceType) => {
  if (cloudinaryResourceType) {
    return cloudinaryResourceType === 'raw' ? 'file' : cloudinaryResourceType;
  }
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'file';
};

const uploadLocationMedia = async (req, res, next) => {
  try {
    const { location_id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided'
      });
    }

    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const existingMedia = await MediaAsset.findAll({
      where: { location_id },
      order: [['display_order', 'DESC']],
      limit: 1
    });

    let nextDisplayOrder = existingMedia.length > 0 
      ? (existingMedia[0].display_order || 0) + 1 
      : 1;

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const resourceType = getResourceType(file.mimetype);
        const isImage = resourceType === 'image';
        
        const uploadOptions = {
          folder: 'HA4/locations',
          resource_type: resourceType
        };

        if (isImage) {
          uploadOptions.transformation = [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto:good' }
          ];
        }

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          async (error, result) => {
            if (error) {
              reject(error);
            } else {
              try {
                const mediaType = getMediaType(file.mimetype, result.resource_type);
                const mediaAsset = await MediaAsset.create({
                  location_id,
                  type: mediaType,
                  cloudinary_url: result.secure_url,
                  cloudinary_public_id: result.public_id,
                  display_order: nextDisplayOrder
                });
                nextDisplayOrder++;
                resolve(mediaAsset);
              } catch (dbError) {
                reject(dbError);
              }
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const uploadedMedia = await Promise.all(uploadPromises);

    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      data: uploadedMedia
    });
  } catch (error) {
    next(error);
  }
};

const getLocationMedia = async (req, res, next) => {
  try {
    const { location_id } = req.params;

    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const mediaAssets = await MediaAsset.findAll({
      where: { location_id },
      order: [['display_order', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: mediaAssets
    });
  } catch (error) {
    next(error);
  }
};

const deleteLocationMedia = async (req, res, next) => {
  try {
    const { location_id } = req.params;
    const { media_ids } = req.body;

    if (!media_ids || !Array.isArray(media_ids) || media_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'media_ids array is required'
      });
    }

    const mediaAssets = await MediaAsset.findAll({
      where: {
        id: media_ids,
        location_id
      }
    });

    if (mediaAssets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No media found'
      });
    }

    const deletePromises = mediaAssets.map(async (mediaAsset) => {
      if (mediaAsset.cloudinary_public_id) {
        const resourceTypeMap = {
          'image': 'image',
          'video': 'video',
          'audio': 'video',
          'file': 'raw'
        };
        const resourceType = resourceTypeMap[mediaAsset.type] || 'auto';
        await cloudinary.uploader.destroy(mediaAsset.cloudinary_public_id, {
          resource_type: resourceType
        });
      }
      return mediaAsset.destroy();
    });

    await Promise.all(deletePromises);

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully',
      data: {
        deleted_count: mediaAssets.length
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadLocationMedia,
  getLocationMedia,
  deleteLocationMedia
};
