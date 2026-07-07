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
    path.join(__dirname, '../docs/schemas/responses/base.yaml'),

    path.join(__dirname, '../docs/paths/authPath.yaml'),
    path.join(__dirname, '../docs/schemas/requests/auth.yaml'),
    path.join(__dirname, '../docs/schemas/responses/auth/success.yaml'),
    path.join(__dirname, '../docs/schemas/responses/auth/badrequest.yaml'),
    path.join(__dirname, '../docs/schemas/responses/auth/unauth.yaml'),
    path.join(__dirname, '../docs/schemas/responses/auth/notfound.yaml'),
    path.join(__dirname, '../docs/schemas/responses/auth/conflict.yaml'),
    path.join(__dirname, '../docs/schemas/responses/auth/forbidden.yaml'),
    path.join(__dirname, '../docs/schemas/responses/auth/error.yaml'),

    path.join(__dirname, '../docs/paths/artistPath.yaml'),
    path.join(__dirname, '../docs/schemas/requests/artist.yaml'),
    path.join(__dirname, '../docs/schemas/responses/artist/success.yaml'),
    path.join(__dirname, '../docs/schemas/responses/artist/badrequest.yaml'),
    path.join(__dirname, '../docs/schemas/responses/artist/unauth.yaml'),
    path.join(__dirname, '../docs/schemas/responses/artist/notfound.yaml'),
    path.join(__dirname, '../docs/schemas/responses/artist/conflict.yaml'),
    path.join(__dirname, '../docs/schemas/responses/artist/forbidden.yaml'),
    path.join(__dirname, '../docs/schemas/responses/artist/error.yaml'),
     
    path.join(__dirname, '../docs/paths/galleryPath.yaml'),
    path.join(__dirname, '../docs/schemas/requests/gallery.yaml'),
    path.join(__dirname, '../docs/schemas/responses/gallery/success.yaml'),
    path.join(__dirname, '../docs/schemas/responses/gallery/badrequest.yaml'),
    path.join(__dirname, '../docs/schemas/responses/gallery/unauth.yaml'),
    path.join(__dirname, '../docs/schemas/responses/gallery/notfound.yaml'),
    // path.join(__dirname, '../docs/schemas/responses/artist/conflict.yaml'),
    path.join(__dirname, '../docs/schemas/responses/gallery/forbidden.yaml'),
    path.join(__dirname, '../docs/schemas/responses/gallery/error.yaml'),
  ]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports  = {
    swaggerUi,
    swaggerSpec
}