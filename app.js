require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      description: "A simple authentication server with only a collection in mongodb base storage system. Superadmin can register appuser and get token with username and password",
      version: '1.0.0',
    }
  },
  apis: ['./users/*.js'], // files containing annotations as above
};

// for logging
app.use(morgan('dev'))

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/api/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.PORT || 4000;
const server = app.listen(port, function () {
    console.log(`Server listening on port ${port}, \n path: http://localhost:${port}, \n api path: http://localhost:${port}/api/*`);
    // console.log(`Url: http://localhost:${port}`);
});