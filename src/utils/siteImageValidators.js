const { body, param, query } = require('express-validator');

// Validation for uploading site image
exports.validateUploadImage = [
    body('site_id')
        .notEmpty().withMessage('Site ID is required')
        .isInt({ min: 1 }).withMessage('Site ID must be a positive integer'),

    body('img_url')
        .notEmpty().withMessage('Image URL is required')
        .trim()
        .isLength({ min: 1, max: 500 }).withMessage('Image URL must be between 1 and 500 characters'),

    body('caption')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('Caption must be max 255 characters'),

    body('is_featured')
        .optional()
        .isBoolean().withMessage('is_featured must be a boolean'),

    body('media_type')
        .optional()
        .isIn(['image', 'video', 'vr3d']).withMessage('media_type must be one of: image, video, vr3d')
];

// Validation for image ID parameter
exports.validateImageId = [
    param('id')
        .notEmpty().withMessage('Image ID is required')
        .isInt({ min: 1 }).withMessage('Image ID must be a positive integer')
];

// Validation for gallery query parameters
exports.validateGalleryQuery = [
    query('site_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Site ID must be a positive integer'),

    query('region_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Region ID must be a positive integer'),

    query('period_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Period ID must be a positive integer'),

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

module.exports = exports;
