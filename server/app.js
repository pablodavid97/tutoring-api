const express = require('express');
const hbs = require('express-handlebars')
const bodyParser = require('body-parser');
const { http, log } = require('winston');
const HttpStatusCode = require('http-status-codes');
const { logger, expressLogger } = require('./utils/logger');
const database = require('./models/connection-manager');
const path = require('path');
const usuarioController = require('./controllers/usuario.controller');

require('dotenv').config();
const hostname = '127.0.0.1'
const port = process.env.API_SERVER_PORT || 3000;
const environment = process.env.NODE_SERVER_ENV;
const app = express();

// SETTINGS
app.set('port', port)
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  extname: '.hbs',
}));

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

global.appRoot = path.resolve(__dirname);

console.log("App root: ", global.appRoot);

// Routes
app.use(require('./routes/index'))
app.use(require('./routes/authentication'))
app.use(require('./routes/mailer'))

// DB Connection
database.connect().then(
  app.listen(port, hostname, () => {
    logger.info(`Server listening at http://${hostname}:${port}/`);
  })
  ).catch((error) => {
    logger.error(`Error ${error.message}`)
})