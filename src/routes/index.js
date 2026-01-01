const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const roleRoutes = require("./roleRoutes");
const friendRoutes = require("./friendRoutes");
const messageRoutes = require("./messageRoutes");
const uploadRoutes = require("./uploadRoutes");
const newsRoutes = require("./newsRoutes");
const analyzeViewRoutes = require("./analyzeViewRoutes");
const eventRoutes = require("./eventRoutes");
const forumRoutes = require("./forumRoutes");

const siteRoutes = require("./siteRoutes");
const siteImageRoutes = require("./siteImageRoutes");
const regionRoutes = require("./regionRoutes");
const periodRoutes = require("./periodRoutes");
const aiRoutes = require("./aiRoutes");
const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use("/sites", siteRoutes);
router.use("/site-images", siteImageRoutes);
router.use("/regions", regionRoutes);
router.use("/periods", periodRoutes);
router.use("/ai", aiRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/friends", friendRoutes);
router.use("/messages", messageRoutes);
router.use("/upload", uploadRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/news", newsRoutes);
router.use("/analyze-views", analyzeViewRoutes);
router.use("/events", eventRoutes);
router.use("/forums", forumRoutes);

module.exports = router;
