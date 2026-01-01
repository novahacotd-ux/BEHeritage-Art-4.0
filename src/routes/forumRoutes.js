const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");

// Media upload configuration
// Accepting fields 'images' and 'videos'
const forumUpload = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 2 },
]);

// Public routes (Get posts)
router.get("/posts", forumController.getPosts);
router.get("/posts/:id", forumController.getPostById);

// Protected routes
router.use(authenticate);

// Posts
router.post(
  "/posts",
  forumUpload,
  // Add validation middleware here if validators.js updated
  // createForumPostValidation, validate,
  forumController.createPost
);
router.delete("/posts/:id", forumController.deletePost);

// Comments
router.post("/posts/:postId/comments", forumController.createComment);
router.delete("/comments/:commentId", forumController.deleteComment);

// Likes
router.post("/like/:targetId", forumController.toggleLike);

module.exports = router;
