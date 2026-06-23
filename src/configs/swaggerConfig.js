const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const path = require('path')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gallery REST API Documentation',
      version: '1.0.0',
    },security: [
      {
        bearerAuth: []  // ← applies to every endpoint by default
      }
    ],
    servers:[
        {
            url:'http://localhost:3000'
        }
    ], 
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../docs/paths/authPath.yaml'),
    path.join(__dirname, '../docs/paths/artistPath.yaml'),
    path.join(__dirname, '../docs/paths/galleryPath.yaml'),
    path.join(__dirname, '../docs/schemas/auth/responseSchema.yaml'),
    path.join(__dirname, '../docs/schemas/auth/requestSchema.yaml'),
    path.join(__dirname, '../docs/schemas/artist/responseSchema.yaml'),
    path.join(__dirname, '../docs/schemas/artist/requestSchema.yaml'),
    path.join(__dirname, '../docs/schemas/gallery/responseSchema.yaml'),
    path.join(__dirname, '../docs/schemas/gallery/requestSchema.yaml'),
    path.join(__dirname, '../docs/responses/auth.yaml'),
    path.join(__dirname, '../docs/responses/artist.yaml'),
    path.join(__dirname, '../docs/responses/gallery.yaml'),
    path.join(__dirname, '../docs/responses/error.yaml'),
    path.join(__dirname, '../docs/responses/tokenCheck.yaml')
  ]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports  = {
    swaggerUi,
    swaggerSpec
}