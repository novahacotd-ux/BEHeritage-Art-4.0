const express = require('express');
const router = express.Router();
const topicController = require('../controllers/StoreController/topicController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createTopicValidation, updateTopicValidation } = require('../utils/validators');

/**
 * @route   GET /api/topics
 * @desc    Get all topics (with pagination and search)
 * @access  Public
 */
router.get('/',
    topicController.getAllTopics
);

/**
 * @route   GET /api/topics/:id
 * @desc    Get topic by ID
 * @access  Public
 */
router.get('/:id',
    topicController.getTopicById
);

/**
 * @route   POST /api/topics
 * @desc    Create new topic
 * @access  Private (ADMIN only)
 */
router.post('/',
    authenticate,
    authorize('ADMIN'),
    createTopicValidation,
    validate,
    topicController.createTopic
);

/**
 * @route   PUT /api/topics/:id
 * @desc    Update topic
 * @access  Private (ADMIN only)
 */
router.put('/:id',
    authenticate,
    authorize('ADMIN'),
    updateTopicValidation,
    validate,
    topicController.updateTopic
);

/**
 * @route   DELETE /api/topics/:id
 * @desc    Delete topic
 * @access  Private (ADMIN only)
 */
router.delete('/:id',
    authenticate,
    authorize('ADMIN'),
    topicController.deleteTopic
);

module.exports = router;
