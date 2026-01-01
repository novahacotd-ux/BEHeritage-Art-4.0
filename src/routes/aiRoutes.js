const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authenticate = require('../middleware/authenticate');

// Public: Ai cũng xem được danh sách tool và review
router.get('/tools', aiController.getAllTools);
router.get('/tools/:id', aiController.getToolDetail);

// Private: Phải đăng nhập mới được viết Review
router.post('/tools/:toolId/reviews', authenticate, aiController.createReview);

module.exports = router;