const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const {
  createNewsValidation,
  updateNewsValidation,
  updateNewsStatusValidation,
} = require("../utils/validators");

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Draft, Published, Archived, Deleted]
 *         description: Filter by status
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *         description: Include deleted news
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of news
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 */

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get news by ID
 *     tags: [News]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: News ID
 *     responses:
 *       200:
 *         description: News details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 */

// Public routes - Anyone can view news
router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);

// Protected routes - Require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Create new news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 10
 *                 example: "This is a news article about heritage art..."
 *               tag:
 *                 type: string
 *                 example: "Art History"
 *               thumbnail_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/thumbnail.jpg"
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Archived, Deleted]
 *                 default: Draft
 *     responses:
 *       201:
 *         description: News created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated news content..."
 *               tag:
 *                 type: string
 *                 example: "Updated Tag"
 *               thumbnail_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/new-thumbnail.jpg"
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Archived, Deleted]
 *     responses:
 *       200:
 *         description: News updated successfully
 *       404:
 *         description: News not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete news (soft delete)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       404:
 *         description: News not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/news/{id}/status:
 *   patch:
 *     summary: Update news status
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Archived, Deleted]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/news/{newsId}/media:
 *   post:
 *     summary: Upload media to news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image or video file (max 50MB)
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *       400:
 *         description: No file uploaded or invalid file
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/news/images/{imageId}:
 *   delete:
 *     summary: Delete news image
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 *       401:
 *         description: Unauthorized
 */

// Create news - Requires authentication
router.post(
  "/",
  authorize("ADMIN"),
  createNewsValidation,
  validate,
  newsController.createNews
);

// Update news - Requires authentication
router.put(
  "/:id",
  authorize("ADMIN"),
  updateNewsValidation,
  validate,
  newsController.updateNews
);

// Delete news (soft delete) - Requires authentication
router.delete("/:id", authorize("ADMIN"), newsController.deleteNews);

// Update news status - Requires authentication
router.patch(
  "/:id/status",
  authorize("ADMIN"),
  updateNewsStatusValidation,
  validate,
  newsController.updateNewsStatus
);

// Upload media (image/video) to news - Requires authentication
router.post(
  "/:newsId/media",
  authorize("ADMIN"),
  upload.single("file"),
  newsController.uploadNewsMedia
);

// Delete news image - Requires authentication
router.delete(
  "/images/:imageId",
  authorize("ADMIN"),
  newsController.deleteNewsImage
);

module.exports = router;
