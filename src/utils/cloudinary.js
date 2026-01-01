const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {Object} file - File object from multer (req.file)
 * @param {Object} options - Optional Cloudinary upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    // Default options
    const defaultOptions = {
      folder: process.env.CLOUDINARY_FOLDER,
      resource_type: "auto", // Automatically detect image/video
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "mp4",
        "mov",
        "avi",
      ],
      transformation: [
        {
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    };

    const uploadOptions = { ...defaultOptions, ...options };

    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to cloudinary
    const bufferStream = Readable.from(file.buffer);
    bufferStream.pipe(uploadStream);
  });
};

/**
 * Delete file from Cloudinary by public_id
 * @param {String} publicId - Public ID of the file in Cloudinary
 * @param {String} resourceType - Type of resource ('image' or 'video')
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get Cloudinary URL with transformations
 * @param {String} publicId - Public ID of the file
 * @param {Object} options - Transformation options
 * @returns {String} - Transformed URL
 */
const getCloudinaryUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, options);
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryUrl,
};
