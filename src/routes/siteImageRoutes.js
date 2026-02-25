const express = require('express');
const router = express.Router();
const siteImageController = require('../controllers/siteImageController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
    validateUploadImage,
    validateImageId,
    validateGalleryQuery
} = require('../utils/siteImageValidators');

// Public routes
router.get('/gallery', validateGalleryQuery, validate, siteImageController.getGalleryImages);

// Authenticated user routes
router.post('/', authenticate, validateUploadImage, validate, siteImageController.uploadSiteImage);
router.get('/my-images', authenticate, siteImageController.getUserImages);

// Admin only routes
router.get('/pending', authenticate, authorize('ADMIN'), siteImageController.getPendingImages);
router.put('/:id/approve', authenticate, authorize('ADMIN'), validateImageId, validate, siteImageController.approveImage);
router.put('/:id/reject', authenticate, authorize('ADMIN'), validateImageId, validate, siteImageController.rejectImage);

module.exports = router;
