const express = require('express');
const bodyParser = require('body-parser');
const { http, log } = require('winston');
const HttpStatusCode = require('http-status-codes');
const { logger, expressLogger } = require('./utils/logger');
const database = require('./models/connection-manager');

require('dotenv').config();
const hostname = '127.0.0.1'
const port = process.env.API_SERVER_PORT || 9000;
const environment = process.env.NODE_SERVER_ENV;
const app = express();

// SETTINGS
app.set('port', port)

// MIDDLEWARES
app.use(expressLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const errorHandler = (err, req, res, next) => {
  if (environment === 'dev') {
    logger.error(err.message);
    logger.error(err.stack || '');
  }
  res.status(err.status || http.HttpStatusCode.INTERNAL_SERVER_ERROR);
  res.json(err);
};

app.use(errorHandler);

// Routes
app.use(require('./routes/index'))

// DB Connection
database.connect().then(
  app.listen(port, hostname, () => {
    logger.info(`Server listening at http://${hostname}:${port}/`);
  })
  ).catch((error) => {
    logger.error(`Error ${error.message}`)
})