const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');
const { RequestHandler } = require('express');

const loggerTransports = [];

const isProduction = process.env.NODE_SERVER_ENV;

loggerTransports.push(
  new transports.Console({
    format: format.combine(format.colorize(), format.splat(), format.simple()),
    level: isProduction ? 'error' : 'info'
  })
);

const logger = createLogger({ transports: loggerTransports });
const expressFormat = isProduction ? 'combined' : 'dev';
const stream = {
  write(msg) {
    logger.info(msg);
  }
};

const expressLogger = morgan(expressFormat, { stream });

exports.expressLogger = expressLogger;
exports.logger = logger;
