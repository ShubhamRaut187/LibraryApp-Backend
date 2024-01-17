const swaggerJSDoc = require('swagger-jsdoc');

// Define Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'API for user authentication',
    },
    servers: [
      {
        url: 'http://localhost:8000', // Update with your server URL
        description: 'Development server',
      },
      // Add additional server URLs as needed
    ],
  },
  apis: ['./Routes/AuthRoutes.js', './Routes/BookRoutes.js'], // Specify the path to your routes file
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
