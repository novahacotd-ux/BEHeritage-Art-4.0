const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

const authenticate = require('../middleware/authenticate'); // File xác thực
const authorize = require('../middleware/authorize');       // File phân quyền

// Public routes (Ai cũng xem được map)
router.get('/', siteController.getAllSites);
router.get('/:id', siteController.getSiteDetail);

// Private routes (Cần đăng nhập mới được tạo)
router.post('/', authenticate, authorize('ADMIN'), siteController.createSite);

module.exports = router;