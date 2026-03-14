const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const authenticate = require("../middleware/authenticate");
const optionalAuth = require("../middleware/optionalAuthenticate");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const authorize = require('../middleware/authorize');

// Media upload configuration
// Accepting fields 'images' and 'videos'
const forumUpload = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 2 },
]);

// Public routes (Get posts)
router.get("/posts" ,optionalAuth,forumController.getPosts);
router.get("/posts/:id", optionalAuth, forumController.getPostById);
router.get("/user/:userId" ,optionalAuth,forumController.getPostByUser);

// Protected routes
router.use(authenticate);
// router.get("/posts" , forumController.getPosts);


// Posts
router.post(
  "/posts",
  forumUpload,
  // Add validation middleware here if validators.js updated
  // createForumPostValidation, validate,
  forumController.createPost
);
// Posts
router.put(
  "/posts/:id",
  forumUpload,
  // Add validation middleware here if validators.js updated
  // createForumPostValidation, validate,
  forumController.UpdatePost
);
router.delete("/posts/:id", forumController.deletePost);
router.put("/posts/status/:id",
  authorize('ADMIN'), 
  forumController.updateStatusPost);

// Comments
router.post("/posts/:postId/comments", forumController.createComment);
router.delete("/comments/:commentId", forumController.deleteComment);

// Likes
router.post("/reactions/:targetId", forumController.toggleReaction);
// router.post("/dislike/:targetId", forumController.toggleDislike);

module.exports = router;
