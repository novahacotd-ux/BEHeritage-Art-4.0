require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { testConnection } = require('../config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Heritage Art API Docs',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    tryItOutEnabled: true
  }
}));

// API Routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start listening
    app.listen(PORT, () => {
      console.log(`
🚀 Server is running on port ${PORT}
📝 Environment: ${process.env.NODE_ENV || 'development'}
📚 API Documentation: http://localhost:${PORT}/api-docs
🔑 Authorize with JWT token in Swagger UI
🔗 API URL: http://localhost:${PORT}/api
🏥 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
