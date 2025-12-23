const express = require('express');
const router = express.Router();
const analyzeViewController = require('../controllers/analyzeViewController');
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const {
  createAnalyzeViewValidation,
  updateAnalyzeViewValidation,
  updateAnalyzeViewStatusValidation
} = require('../utils/validators');

/**
 * @swagger
 * tags:
 *   name: AnalyzeView
 *   description: Analyze View management endpoints
 */

/**
 * @swagger
 * /api/analyze-views:
 *   get:
 *     summary: Get all analyze views
 *     tags: [AnalyzeView]
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
 *         description: Include deleted analyze views
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
 *         description: List of analyze views
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
 *                     $ref: '#/components/schemas/AnalyzeView'
 *                 pagination:
 *                   type: object
 */

/**
 * @swagger
 * /api/analyze-views/{id}:
 *   get:
 *     summary: Get analyze view by ID
 *     tags: [AnalyzeView]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Analyze view details
 *       404:
 *         description: Analyze view not found
 */

// Public routes - Anyone can view analyze views
router.get('/', analyzeViewController.getAllAnalyzeViews);
router.get('/:id', analyzeViewController.getAnalyzeViewById);

// Protected routes - Require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/analyze-views:
 *   post:
 *     summary: Create new analyze view
 *     tags: [AnalyzeView]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - summary
 *               - content
 *             properties:
 *               summary:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 example: "Analysis of Vietnamese traditional art"
 *               content:
 *                 type: string
 *                 minLength: 10
 *                 example: "Detailed analysis content..."
 *               tag:
 *                 type: string
 *                 example: "Art Analysis"
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
 *         description: Analyze view created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/analyze-views/{id}:
 *   put:
 *     summary: Update analyze view
 *     tags: [AnalyzeView]
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
 *               summary:
 *                 type: string
 *                 example: "Updated summary"
 *               content:
 *                 type: string
 *                 example: "Updated content..."
 *               tag:
 *                 type: string
 *                 example: "Updated Tag"
 *               thumbnail_url:
 *                 type: string
 *                 format: uri
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Archived, Deleted]
 *     responses:
 *       200:
 *         description: Analyze view updated successfully
 *       404:
 *         description: Analyze view not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/analyze-views/{id}:
 *   delete:
 *     summary: Delete analyze view (soft delete)
 *     tags: [AnalyzeView]
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
 *         description: Analyze view deleted successfully
 *       404:
 *         description: Analyze view not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/analyze-views/{id}/status:
 *   patch:
 *     summary: Update analyze view status
 *     tags: [AnalyzeView]
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
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/analyze-views/{analyzeViewId}/media:
 *   post:
 *     summary: Upload media to analyze view
 *     tags: [AnalyzeView]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: analyzeViewId
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
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/analyze-views/images/{imageId}:
 *   delete:
 *     summary: Delete analyze view image
 *     tags: [AnalyzeView]
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

// Create analyze view - Requires authentication
router.post('/', createAnalyzeViewValidation, validate, analyzeViewController.createAnalyzeView);

// Update analyze view - Requires authentication
router.put('/:id', updateAnalyzeViewValidation, validate, analyzeViewController.updateAnalyzeView);

// Delete analyze view (soft delete) - Requires authentication
router.delete('/:id', analyzeViewController.deleteAnalyzeView);

// Update analyze view status - Requires authentication
router.patch('/:id/status', updateAnalyzeViewStatusValidation, validate, analyzeViewController.updateAnalyzeViewStatus);

// Upload media (image/video) to analyze view - Requires authentication
router.post('/:analyzeViewId/media', upload.single('file'), analyzeViewController.uploadAnalyzeViewMedia);

// Delete analyze view image - Requires authentication
router.delete('/images/:imageId', analyzeViewController.deleteAnalyzeViewImage);

module.exports = router;
