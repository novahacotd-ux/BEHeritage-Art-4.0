const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const newsRoutes = require('./newsRoutes');

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
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/news', newsRoutes);

module.exports = router;
