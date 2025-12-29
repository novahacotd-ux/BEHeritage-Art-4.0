const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const siteRoutes = require('./siteRoutes');
const siteImageRoutes = require('./siteImageRoutes');
const regionRoutes = require('./regionRoutes');
const periodRoutes = require('./periodRoutes');
const aiRoutes = require('./aiRoutes');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/sites', siteRoutes);
router.use('/site-images', siteImageRoutes);
router.use('/regions', regionRoutes);
router.use('/periods', periodRoutes);
router.use('/ai', aiRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
