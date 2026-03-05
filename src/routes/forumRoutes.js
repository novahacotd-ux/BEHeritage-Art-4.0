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

// Protected routes
router.use(authenticate);
router.get("/posts" ,forumController.getPosts);
router.get("/myposts/" ,forumController.getPostByUser);
router.get("/posts/:id", forumController.getPostById);

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

// Comments
router.post("/posts/:postId/comments", forumController.createComment);
router.delete("/comments/:commentId", forumController.deleteComment);

// Likes
router.post("/reactions/:targetId", forumController.toggleReaction);
// router.post("/dislike/:targetId", forumController.toggleDislike);

module.exports = router;
