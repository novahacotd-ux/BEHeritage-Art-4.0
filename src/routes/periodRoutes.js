const express = require('express');
const router = express.Router();
const periodController = require('../controllers/periodController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/', periodController.getAllPeriods);
router.get('/:id', periodController.getPeriodDetail);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), periodController.createPeriod);
router.put('/:id', authenticate, authorize('ADMIN'), periodController.updatePeriod);
router.delete('/:id', authenticate, authorize('ADMIN'), periodController.deletePeriod);

module.exports = router;
