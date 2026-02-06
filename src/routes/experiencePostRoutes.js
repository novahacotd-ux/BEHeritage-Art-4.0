const express = require('express');
const router = express.Router();
const { 
  getAllPosts, 
  getPostById, 
  getPostsByLocation, 
  getPostsByUser, 
  createPost, 
  updatePost, 
  deletePost 
} = require('../controllers/experiencePostController');
const { upload } = require('../controllers/uploadController');
const authenticate = require('../middleware/authenticate');

// Get all posts
router.get('/', getAllPosts);

// Get post by ID
router.get('/:id', getPostById);



// Get posts by user
router.get('/user/:userId', getPostsByUser);

// Create new post (with optional image/video upload)
router.post('/', authenticate, upload.single('image'), createPost);

// Update post (with optional image/video replacement)
router.put('/:id', authenticate, upload.single('image'), updatePost);

// Delete post
router.delete('/:id', authenticate, deletePost);

module.exports = router;
