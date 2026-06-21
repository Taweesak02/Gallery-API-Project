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
    path.join(__dirname, '../docs/paths/auth.yaml'),
    path.join(__dirname, '../docs/paths/artist.yaml'),
    path.join(__dirname, '../docs/paths/gallery.yaml'),
    path.join(__dirname, '../docs/schemas/auth.yaml'),
    path.join(__dirname, '../docs/schemas/artist.yaml'),
    path.join(__dirname, '../docs/schemas/gallery.yaml'),
    path.join(__dirname, '../docs/responses/auth.yaml')
  ]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports  = {
    swaggerUi,
    swaggerSpec
}