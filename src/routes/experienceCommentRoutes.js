const express = require('express');
const router = express.Router();
const experienceCommentController = require('../controllers/experienceCommentController');
const { upload } = require('../controllers/uploadController');
const authenticate = require('../middleware/authenticate');

/**
 * @route   GET /api/experience-comments/post/:postId
 * @desc    Get all comments for a specific post
 * @access  Public
 */
router.get('/post/:postId', experienceCommentController.getCommentsByPost);

/**
 * @route   GET /api/experience-comments/:id
 * @desc    Get comment by ID
 * @access  Public
 */
router.get('/:id', experienceCommentController.getCommentById);

/**
 * @route   GET /api/experience-comments/:id/replies
 * @desc    Get replies for a comment
 * @access  Public
 */
router.get('/:id/replies', experienceCommentController.getReplies);

// Protected routes - require authentication
router.use(authenticate);

/**
 * @route   POST /api/experience-comments/post/:postId
 * @desc    Create new comment on a post
 * @access  Private (authenticated users)
 */
router.post('/post/:postId', upload.single('image'), experienceCommentController.createComment);

/**
 * @route   PUT /api/experience-comments/:id
 * @desc    Update comment
 * @access  Private (author or admin)
 */
router.put('/:id', upload.single('image'), experienceCommentController.updateComment);

/**
 * @route   DELETE /api/experience-comments/:id
 * @desc    Delete comment
 * @access  Private (author or admin)
 */
router.delete('/:id', experienceCommentController.deleteComment);

/**
 * @route   POST /api/experience-comments/:id/like
 * @desc    Like/Unlike a comment
 * @access  Private (authenticated users)
 */
router.post('/:id/like', experienceCommentController.toggleLike);

module.exports = router;
