const express = require('express');
const router = express.Router();
const { 
  getAllPosts, 
  getPostById, 
  getPostsByUser, 
  createPost, 
  updatePost, 
  reviewPostStatus,
  deletePost 
} = require('../controllers/experiencePostController');
const { upload } = require('../controllers/uploadController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Get all posts
router.get('/', getAllPosts);

// Get posts by user
router.get('/user/:userId', getPostsByUser);

// Get post by ID
router.get('/:id', getPostById);

// Create new post (with optional image/video upload)
router.post('/', authenticate, upload.single('image'), createPost);

// Update post (with optional image/video replacement)
router.put('/:id', authenticate, upload.single('image'), updatePost);

// Admin review post status (approved/rejected)
router.patch('/:id/review', authenticate, authorize('ADMIN'), reviewPostStatus);

// Delete post
router.delete('/:id', authenticate, deletePost);

module.exports = router;
