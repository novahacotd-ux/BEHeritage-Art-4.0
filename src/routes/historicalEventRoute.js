const express = require('express');
const router = express.Router();
const historicalEventController = require('../controllers/historicalEventController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const upload = require("../middleware/upload");
const { periodValidation } = require('../utils/validators');
const validate = require('../middleware/validate');

/**
 * @route   GET /api/history-event/:id
 * @desc    Get history-event by id
 * @access  Public
 */
router.get('/:id', historicalEventController.getHistoryEvent);
/**
 * @route   POST /api/history-event/:id
 * @desc    Add a new history-event to a historical period
 * @access  Admin only routes
*/
router.post('/:id',
    authenticate,
    upload.array('images', 100), 
    validate, 
    periodValidation ,
    authorize('ADMIN'), 
    historicalEventController.createHistoryEvent
)

/**
 * @route   PUT /api/history-event/:id
 * @desc    Update a history-event information
 * @access  Admin only routes
*/
router.put('/:id',
    authenticate, 
    authorize('ADMIN'), 
    historicalEventController.updateHistoryEvent
)

/**
 * @route   DELETE /api/history-event/:id
 * @desc    Delete a history-event
 * @access  Admin only routes
*/
router.delete('/:id',
    authenticate, 
    authorize('ADMIN'), 
    historicalEventController.deleteHistoryEvent
)

module.exports = router;
