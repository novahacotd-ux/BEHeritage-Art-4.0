const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Heritage Art API',
      version: '1.0.0',
      description: 'Backend API for Heritage Art platform with authentication and authorization',
      contact: {
        name: 'API Support',
        email: 'support@heritage-art.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.heritage-art.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            identity_number: { type: 'string' },
            date_of_birth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
            intro: { type: 'string' },
            status: { type: 'string', enum: ['Active', 'Inactive', 'Suspended'] },
            create_at: { type: 'string', format: 'date-time' }
          }
        },
        News: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            status: { type: 'string', enum: ['Draft', 'Published', 'Archived', 'Deleted'] },
            tag: { type: 'string' },
            thumbnail_url: { type: 'string', format: 'uri' },
            created_date: { type: 'string', format: 'date-time' },
            images: {
              type: 'array',
              items: { $ref: '#/components/schemas/NewsImage' }
            }
          }
        },
        NewsImage: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            news_id: { type: 'string', format: 'uuid' },
            image_url: { type: 'string', format: 'uri' },
            created_date: { type: 'string', format: 'date-time' }
          }
        },
        AnalyzeView: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            summary: { type: 'string', maxLength: 500 },
            content: { type: 'string' },
            status: { type: 'string', enum: ['Draft', 'Published', 'Archived', 'Deleted'] },
            tag: { type: 'string' },
            thumbnail_url: { type: 'string', format: 'uri' },
            created_date: { type: 'string', format: 'date-time' },
            images: {
              type: 'array',
              items: { $ref: '#/components/schemas/AnalyzeViewImage' }
            }
          }
        },
        AnalyzeViewImage: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            analyze_view_id: { type: 'string', format: 'uuid' },
            image_url: { type: 'string', format: 'uri' },
            created_date: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
