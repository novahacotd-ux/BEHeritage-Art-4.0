const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/', regionController.getAllRegions);
router.get('/:id', regionController.getRegionDetail);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), regionController.createRegion);
router.put('/:id', authenticate, authorize('ADMIN'), regionController.updateRegion);
router.delete('/:id', authenticate, authorize('ADMIN'), regionController.deleteRegion);

module.exports = router;
