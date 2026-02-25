const express = require('express');
const router = express.Router();
const periodController = require('../controllers/periodController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const upload = require("../middleware/upload");
const { periodValidation } = require('../utils/validators');
const validate = require('../middleware/validate');

// Public routes
router.get('/', periodController.getAllPeriods);
router.get('/:id', periodController.getPeriodByID);
router.get('/:id/detail', periodController.getPeriodDetail);

/**
 * @route   POST /api/periods/
 * @desc    Create a new history-periods
 * @access  Admin only routes
*/
router.post('/', 
    authenticate, 
    periodValidation,
    validate, 
    authorize('ADMIN'),
    upload.single('file'), 
    periodController.createPeriod );
/**
 * @route   POST /api/periods/
 * @desc    update a new history-periods
 * @access  Admin only routes
*/
router.put('/:id',
    authenticate, 
    authorize('ADMIN'),
    upload.single('file'), 
    periodController.updatePeriod );

/**
 * @route   POST /api/periods/
 * @desc    Delete a new history-periods
 * @access  Admin only routes
*/
router.delete('/:id', authenticate, authorize('ADMIN'), periodController.deletePeriod);

module.exports = router;
