const express = require('express');
const hbs = require('express-handlebars');
const { http, log } = require('winston');
const { logger, expressLogger } = require('./utils/logger');
const database = require('./models/connection-manager');
const path = require('path');
const schedule = require('node-schedule');
const reunionController = require('./controllers/reunion.controller');

require('dotenv').config();
const hostname = '127.0.0.1';
const port = process.env.API_SERVER_PORT || 3000;
const environment = process.env.NODE_SERVER_ENV;
const app = express();

// SETTINGS
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs'
  })
);

// MIDDLEWARES
app.use(expressLogger);
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

const errorHandler = (err, req, res, next) => {
  if (environment === 'dev') {
    logger.error(err.message);
    logger.error(err.stack || '');
  }
  res.status(err.status || http.HttpStatusCode.INTERNAL_SERVER_ERROR);
  res.json(err);
};
app.use(errorHandler);

global.srcDir = path.resolve(__dirname);
global.appRoot = path.resolve(__dirname, '../');

// SCHEDULER
var rule = new schedule.RecurrenceRule();
rule.hour = 0;
schedule.scheduleJob(rule, async () => {
  console.log('Setting daily meetings...');
  await reunionController.setDailyMeetings();
});

// public
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/meetings', require('./routes/meetings'));
app.use(require('./routes/mailer'));
app.use('/admin', require('./routes/admin'));

// DB CONNECTION
database
  .connect()
  .then(
    app.listen(port, hostname, () => {
      logger.info(`Server listening at http://${hostname}:${port}/`);
    })
  )
  .catch((error) => {
    logger.error(`Error ${error.message}`);
  });
